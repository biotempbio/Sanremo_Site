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
from email.utils import parseaddr
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


MAX_BODY = 12_000
LOCK = threading.Lock()


class TLSHTTPServer(ThreadingHTTPServer):
    """Perform TLS handshakes in worker threads so slow clients cannot block accept()."""

    def __init__(self, address, handler, context: ssl.SSLContext):
        self.tls_context = context
        super().__init__(address, handler)

    def process_request_thread(self, request, client_address):
        request.settimeout(4)
        try:
            secure_request = self.tls_context.wrap_socket(request, server_side=True)
        except (OSError, ssl.SSLError):
            request.close()
            return
        secure_request.settimeout(10)
        super().process_request_thread(secure_request, client_address)


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
        db.execute(
            "CREATE TABLE IF NOT EXISTS lead_copies ("
            "request_id TEXT NOT NULL, recipient TEXT NOT NULL, "
            "status TEXT NOT NULL DEFAULT 'pending', attempts INTEGER NOT NULL DEFAULT 0, "
            "next_attempt_at TEXT NOT NULL, sent_at TEXT, last_error TEXT, "
            "PRIMARY KEY (request_id, recipient))"
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


def store(db_path: str, data: dict, copy_recipients: tuple[str, ...] = ()) -> str:
    with LOCK, connect_db(db_path) as db:
        db.execute(
            "INSERT OR IGNORE INTO leads(request_id, received_at, payload, next_attempt_at) VALUES (?, ?, ?, ?)",
            (data["requestId"], utc_now(), json.dumps(data, ensure_ascii=False), utc_now()),
        )
        for recipient in copy_recipients:
            db.execute(
                "INSERT OR IGNORE INTO lead_copies(request_id, recipient, next_attempt_at) VALUES (?, ?, ?)",
                (data["requestId"], recipient, utc_now()),
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


def make_copy_message(data: dict, sender: str, recipient: str) -> EmailMessage:
    message = make_message(data, sender, recipient)
    message.replace_header("Subject", f"[sales@sanremomachines.ru] заявка {data['requestId']}")
    contact = str(data.get("fields", {}).get("contact", "")).strip()
    email = parseaddr(contact)[1]
    message["Reply-To"] = email if email and "@" in email else "sales@sanremomachines.ru"
    return message


def send_copies(db_path: str, smtp: dict, limit: int = 20) -> int:
    """Retry technical-sender copies independently of delivery to sales@."""
    with LOCK, connect_db(db_path) as db:
        rows = db.execute(
            "SELECT c.request_id, c.recipient, l.payload, c.attempts FROM lead_copies c "
            "JOIN leads l ON l.request_id=c.request_id "
            "WHERE c.status IN ('pending', 'sending') AND c.next_attempt_at<=? "
            "ORDER BY l.received_at LIMIT ?", (utc_now(), limit)
        ).fetchall()
    sent = 0
    for request_id, recipient, raw, attempts in rows:
        with LOCK, connect_db(db_path) as db:
            claimed = db.execute(
                "UPDATE lead_copies SET status='sending', next_attempt_at=? "
                "WHERE request_id=? AND recipient=? AND status IN ('pending', 'sending') AND next_attempt_at<=?",
                ((datetime.now(timezone.utc) + timedelta(seconds=90)).isoformat(), request_id, recipient, utc_now()),
            ).rowcount
        if not claimed:
            continue
        try:
            message = make_copy_message(json.loads(raw), smtp["user"], recipient)
            with smtplib.SMTP_SSL(smtp["host"], smtp["port"], timeout=12) as mail:
                mail.login(smtp["user"], smtp["password"])
                refused = mail.send_message(message)
                if refused:
                    raise smtplib.SMTPRecipientsRefused(refused)
            with LOCK, connect_db(db_path) as db:
                db.execute(
                    "UPDATE lead_copies SET status='sent', sent_at=?, attempts=attempts+1, last_error=NULL "
                    "WHERE request_id=? AND recipient=?", (utc_now(), request_id, recipient)
                )
            sent += 1
        except Exception as exc:
            with LOCK, connect_db(db_path) as db:
                db.execute(
                    "UPDATE lead_copies SET status='pending', attempts=attempts+1, next_attempt_at=?, last_error=? "
                    "WHERE request_id=? AND recipient=?",
                    ((datetime.now(timezone.utc) + timedelta(seconds=min(3600, 60 * 2 ** min(attempts, 6)))).isoformat(), type(exc).__name__, request_id, recipient),
                )
    return sent


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


def handler_factory(db_path: str, secret: str, smtp: dict, copy_smtp: dict | None = None):
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
            status = store(db_path, data, tuple(copy_smtp["recipients"]) if copy_smtp else ())
            if status != "sent":
                send_pending(db_path, smtp, limit=1)
            if copy_smtp:
                send_copies(db_path, copy_smtp, limit=2)
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
    copy_smtp = None
    if os.environ.get("COPY_SMTP_USER"):
        copy_smtp = {
            "host": os.environ["COPY_SMTP_HOST"],
            "port": int(os.environ.get("COPY_SMTP_PORT", "465")),
            "user": os.environ["COPY_SMTP_USER"],
            "password": os.environ["COPY_SMTP_PASSWORD"],
            "recipients": tuple(r.strip() for r in os.environ["COPY_RECIPIENTS"].split(",") if r.strip()),
        }

    def retry() -> None:
        while True:
            send_pending(db_path, smtp)
            if copy_smtp:
                send_copies(db_path, copy_smtp)
            time.sleep(60)

    threading.Thread(target=retry, daemon=True).start()
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.minimum_version = ssl.TLSVersion.TLSv1_2
    context.load_cert_chain(os.environ["RELAY_CERT_PATH"], os.environ["RELAY_KEY_PATH"])
    server = TLSHTTPServer(("0.0.0.0", int(os.environ.get("RELAY_PORT", "443"))), handler_factory(db_path, secret, smtp, copy_smtp), context)
    server.serve_forever()


if __name__ == "__main__":
    main()
