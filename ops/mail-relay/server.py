"""Isolated Russian-hosted mail relay for Sanremo leads.

The public site never calls this service. BIO Lead Hub sends signed HTTPS
requests; the relay persists them before attempting SMTP delivery.
"""

from __future__ import annotations

import hashlib
import hmac
import json
import os
import smtplib
import sqlite3
import ssl
import threading
import time
from contextlib import contextmanager
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


MAX_BODY = 12_000
LOCK = threading.Lock()


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


@contextmanager
def connect_db(path: str):
    db = sqlite3.connect(path, timeout=10)
    try:
        db.execute("PRAGMA journal_mode=WAL")
        db.execute(
            "CREATE TABLE IF NOT EXISTS leads ("
            "request_id TEXT PRIMARY KEY, received_at TEXT NOT NULL, "
            "payload TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', "
            "attempts INTEGER NOT NULL DEFAULT 0, next_attempt_at TEXT NOT NULL, "
            "sent_at TEXT, last_error TEXT)"
        )
        db.commit()
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def valid_payload(data: object) -> bool:
    if not isinstance(data, dict):
        return False
    if not isinstance(data.get("requestId"), str) or not data["requestId"].startswith("SRM-"):
        return False
    if data.get("form") not in ("contacts", "service"):
        return False
    if not isinstance(data.get("fields"), dict):
        return False
    consent = data.get("consent")
    return bool(
        isinstance(consent, dict)
        and consent.get("accepted") is True
        and isinstance(consent.get("at"), str)
        and consent.get("policyVersion") == "2026-11-11"
    )


def verify_signature(body: bytes, given: str, secret: str) -> bool:
    if not secret or len(given) != 64:
        return False
    expected = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, given)


def store(db_path: str, data: dict) -> str:
    with LOCK, connect_db(db_path) as db:
        db.execute(
            "INSERT OR IGNORE INTO leads(request_id, received_at, payload, next_attempt_at) VALUES (?, ?, ?, ?)",
            (data["requestId"], utc_now(), json.dumps(data, ensure_ascii=False), utc_now()),
        )
        status = db.execute("SELECT status FROM leads WHERE request_id=?", (data["requestId"],)).fetchone()[0]
    return status


def make_message(data: dict, sender: str, recipient: str) -> EmailMessage:
    message = EmailMessage()
    message["From"] = sender
    message["To"] = recipient
    message["Subject"] = f"[Sanremo] заявка {data['requestId']}"
    fields = data["fields"]
    lines = [
        "Заявка с сайта Sanremo",
        f"Номер: {data['requestId']}",
        f"Получена: {data.get('createdAt', '')}",
        f"Форма: {data['form']}",
        f"Страница: {data.get('page', '')}",
        f"Согласие: да, {data['consent']['at']}",
        f"Версия политики: {data['consent']['policyVersion']}",
        "",
    ]
    lines.extend(f"{name}: {value}" for name, value in fields.items() if value)
    message.set_content("\n".join(lines))
    return message


def send_pending(db_path: str, smtp: dict, limit: int = 20) -> int:
    with LOCK, connect_db(db_path) as db:
        rows = db.execute(
            "SELECT request_id, payload, attempts FROM leads "
            "WHERE status IN ('pending', 'sending') AND next_attempt_at<=? "
            "ORDER BY received_at LIMIT ?", (utc_now(), limit)
        ).fetchall()
    sent = 0
    for request_id, raw, attempts in rows:
        with LOCK, connect_db(db_path) as db:
            claimed = db.execute(
                "UPDATE leads SET status='sending', next_attempt_at=? "
                "WHERE request_id=? AND status IN ('pending', 'sending') AND next_attempt_at<=?",
                ((datetime.now(timezone.utc) + timedelta(seconds=90)).isoformat(), request_id, utc_now()),
            ).rowcount
        if not claimed:
            continue
        try:
            data = json.loads(raw)
            message = make_message(data, smtp["user"], smtp["recipient"])
            with smtplib.SMTP_SSL(smtp["host"], smtp["port"], timeout=12) as mail:
                mail.login(smtp["user"], smtp["password"])
                mail.send_message(message)
            with LOCK, connect_db(db_path) as db:
                db.execute(
                    "UPDATE leads SET status='sent', sent_at=?, attempts=attempts+1, last_error=NULL "
                    "WHERE request_id=?", (utc_now(), request_id)
                )
            sent += 1
        except Exception as exc:  # A failed mail remains in the durable retry queue.
            with LOCK, connect_db(db_path) as db:
                db.execute(
                    "UPDATE leads SET status='pending', attempts=attempts+1, next_attempt_at=?, last_error=? WHERE request_id=?",
                    ((datetime.now(timezone.utc) + timedelta(seconds=min(3600, 60 * 2 ** min(attempts, 6)))).isoformat(), type(exc).__name__, request_id),
                )
    return sent


def handler_factory(db_path: str, secret: str, smtp: dict):
    class Handler(BaseHTTPRequestHandler):
        def log_message(self, fmt: str, *args: object) -> None:
            # Never log request paths or PII.
            print("mail-relay request", self.command, self.path.split("?")[0], flush=True)

        def reply(self, code: int, body: dict) -> None:
            encoded = json.dumps(body).encode()
            self.send_response(code)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Length", str(len(encoded)))
            self.end_headers()
            self.wfile.write(encoded)

        def do_GET(self) -> None:
            if self.path == "/health":
                self.reply(200, {"ok": True})
            else:
                self.reply(404, {"ok": False})

        def do_POST(self) -> None:
            if self.path != "/v1/sanremo-leads":
                return self.reply(404, {"ok": False})
            try:
                length = int(self.headers.get("Content-Length", "0"))
            except ValueError:
                return self.reply(400, {"ok": False})
            if length < 1 or length > MAX_BODY:
                return self.reply(413, {"ok": False})
            body = self.rfile.read(length)
            if not verify_signature(body, self.headers.get("X-Lead-Signature", ""), secret):
                return self.reply(403, {"ok": False})
            try:
                data = json.loads(body)
            except (ValueError, UnicodeDecodeError):
                return self.reply(400, {"ok": False})
            if not valid_payload(data):
                return self.reply(400, {"ok": False})
            status = store(db_path, data)
            if status != "sent":
                send_pending(db_path, smtp, limit=1)
            with LOCK, connect_db(db_path) as db:
                status = db.execute("SELECT status FROM leads WHERE request_id=?", (data["requestId"],)).fetchone()[0]
            self.reply(200, {"ok": True, "requestId": data["requestId"], "delivery": status})

    return Handler


def main() -> None:
    db_path = os.environ["RELAY_DB_PATH"]
    Path(db_path).parent.mkdir(parents=True, exist_ok=True)
    secret = os.environ["RELAY_SHARED_SECRET"]
    smtp = {
        "host": os.environ["SMTP_HOST"],
        "port": int(os.environ.get("SMTP_PORT", "465")),
        "user": os.environ["SMTP_USER"],
        "password": os.environ["SMTP_PASSWORD"],
        "recipient": os.environ["LEAD_RECIPIENT"],
    }

    def retry() -> None:
        while True:
            send_pending(db_path, smtp)
            time.sleep(60)

    threading.Thread(target=retry, daemon=True).start()
    server = ThreadingHTTPServer(("0.0.0.0", int(os.environ.get("RELAY_PORT", "443"))), handler_factory(db_path, secret, smtp))
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.minimum_version = ssl.TLSVersion.TLSv1_2
    context.load_cert_chain(os.environ["RELAY_CERT_PATH"], os.environ["RELAY_KEY_PATH"])
    server.socket = context.wrap_socket(server.socket, server_side=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
