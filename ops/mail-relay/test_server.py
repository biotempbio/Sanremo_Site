import hashlib
import hmac
import json
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
from http.server import ThreadingHTTPServer
from pathlib import Path
from unittest.mock import patch

from server import connect_db, handler_factory, send_pending, store, valid_payload, verify_signature


SAMPLE = {
    "requestId": "SRM-20261111-TEST",
    "createdAt": "2026-11-11T16:00:00Z",
    "form": "contacts",
    "page": "https://staging.sanremomachines.ru/contacts/",
    "fields": {"name": "ТЕХ-ПРОВЕРКА", "contact": "test@example.invalid"},
    "consent": {"accepted": True, "at": "2026-11-11T16:00:00Z", "policyVersion": "2026-11-11"},
}


class FakeSMTP:
    messages = []

    def __init__(self, host, port, timeout):
        self.host, self.port, self.timeout = host, port, timeout

    def __enter__(self):
        return self

    def __exit__(self, *_):
        pass

    def login(self, user, password):
        assert user == "sender@example.ru"
        assert password == "secret"

    def send_message(self, message):
        self.messages.append(message)


class RelayTests(unittest.TestCase):
    def test_signature_and_required_consent(self):
        body = json.dumps(SAMPLE).encode()
        digest = hmac.new(b"test-secret", body, hashlib.sha256).hexdigest()
        self.assertTrue(verify_signature(body, digest, "test-secret"))
        self.assertFalse(verify_signature(body, digest, "other-secret"))
        self.assertTrue(valid_payload(SAMPLE))
        self.assertFalse(valid_payload({**SAMPLE, "consent": {"accepted": False}}))

    def test_durable_queue_and_email(self):
        FakeSMTP.messages.clear()
        with tempfile.TemporaryDirectory() as directory:
            db_path = str(Path(directory) / "leads.db")
            self.assertEqual(store(db_path, SAMPLE), "pending")
            self.assertEqual(store(db_path, SAMPLE), "pending")
            with connect_db(db_path) as db:
                self.assertEqual(db.execute("SELECT COUNT(*) FROM leads").fetchone()[0], 1)
            smtp = {"host": "smtp.example.ru", "port": 465, "user": "sender@example.ru", "password": "secret", "recipient": "info@sanremomachines.ru"}
            with patch("server.smtplib.SMTP_SSL", FakeSMTP):
                self.assertEqual(send_pending(db_path, smtp), 1)
                self.assertEqual(send_pending(db_path, smtp), 0)
            self.assertEqual(len(FakeSMTP.messages), 1)
            self.assertIn("Версия политики: 2026-11-11", FakeSMTP.messages[0].get_content())
            with connect_db(db_path) as db:
                self.assertEqual(db.execute("SELECT status FROM leads").fetchone()[0], "sent")

    def test_failed_smtp_keeps_lead_for_retry(self):
        with tempfile.TemporaryDirectory() as directory:
            db_path = str(Path(directory) / "leads.db")
            store(db_path, SAMPLE)
            smtp = {"host": "smtp.example.ru", "port": 465, "user": "sender@example.ru", "password": "secret", "recipient": "info@sanremomachines.ru"}
            with patch("server.smtplib.SMTP_SSL", side_effect=TimeoutError("mail unavailable")):
                self.assertEqual(send_pending(db_path, smtp), 0)
            with connect_db(db_path) as db:
                row = db.execute("SELECT status, attempts, last_error FROM leads").fetchone()
                self.assertEqual(row, ("pending", 1, "TimeoutError"))

    def test_post_rejects_unsigned_and_accepts_signed(self):
        FakeSMTP.messages.clear()
        with tempfile.TemporaryDirectory() as directory:
            db_path = str(Path(directory) / "leads.db")
            smtp = {"host": "smtp.example.ru", "port": 465, "user": "sender@example.ru", "password": "secret", "recipient": "info@sanremomachines.ru"}
            server = ThreadingHTTPServer(("127.0.0.1", 0), handler_factory(db_path, "test-secret", smtp))
            thread = threading.Thread(target=server.serve_forever, daemon=True)
            thread.start()
            try:
                body = json.dumps(SAMPLE).encode()
                url = f"http://127.0.0.1:{server.server_port}/v1/sanremo-leads"
                with self.assertRaises(urllib.error.HTTPError) as denied:
                    urllib.request.urlopen(urllib.request.Request(url, data=body, method="POST"), timeout=2)
                self.assertEqual(denied.exception.code, 403)
                denied.exception.close()
                digest = hmac.new(b"test-secret", body, hashlib.sha256).hexdigest()
                request = urllib.request.Request(url, data=body, headers={"X-Lead-Signature": digest}, method="POST")
                with patch("server.smtplib.SMTP_SSL", FakeSMTP):
                    with urllib.request.urlopen(request, timeout=2) as response:
                        result = json.load(response)
                self.assertEqual(result["delivery"], "sent")
                self.assertEqual(len(FakeSMTP.messages), 1)
            finally:
                server.shutdown()
                server.server_close()
                thread.join(timeout=2)


if __name__ == "__main__":
    unittest.main()
