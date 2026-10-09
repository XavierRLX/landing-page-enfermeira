"""Servidor de prévia local com suporte a byte ranges para o vídeo de scroll."""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os
import re

SITE_DIRECTORY = Path(__file__).resolve().parent / "dist"
HOST = "127.0.0.1"
PORT = int(os.environ.get("PORT", "4173"))


class PreviewHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(SITE_DIRECTORY), **kwargs)

    def do_GET(self):
        file_path = Path(self.translate_path(self.path))
        range_header = self.headers.get("Range")

        if not range_header or not file_path.is_file():
            return super().do_GET()

        match = re.fullmatch(r"bytes=(\d+)-(\d*)", range_header)
        if not match:
            return super().do_GET()

        file_size = file_path.stat().st_size
        start = int(match.group(1))
        end = min(int(match.group(2)) if match.group(2) else file_size - 1, file_size - 1)

        if start >= file_size or end < start:
            self.send_response(416)
            self.send_header("Content-Range", f"bytes */{file_size}")
            self.end_headers()
            return

        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(str(file_path)))
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
        self.send_header("Content-Length", str(end - start + 1))
        self.end_headers()

        with file_path.open("rb") as file:
            file.seek(start)
            self.wfile.write(file.read(end - start + 1))


if __name__ == "__main__":
    print(f"Prévia: http://{HOST}:{PORT}", flush=True)
    ThreadingHTTPServer((HOST, PORT), PreviewHandler).serve_forever()
