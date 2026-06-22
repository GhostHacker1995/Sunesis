#!/usr/bin/env python3
"""Local preview server that serves extensionless clean URLs.

Maps /about-us -> about-us.html and /services/mobile-care -> services/mobile-care.html
so local preview matches Vercel/Netlify cleanUrls behavior. Run: python serve.py
"""
import http.server
import os

PORT = 8000
ROOT = os.path.dirname(os.path.abspath(__file__))


class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        local = super().translate_path(path.split("?", 1)[0].split("#", 1)[0])
        if os.path.isdir(local):
            index = os.path.join(local, "index.html")
            if os.path.isfile(index):
                return index
        if not os.path.splitext(local)[1] and os.path.isfile(local + ".html"):
            return local + ".html"
        return local


os.chdir(ROOT)
with http.server.ThreadingHTTPServer(("", PORT), CleanURLHandler) as httpd:
    print(f"Serving {ROOT} at http://localhost:{PORT}")
    httpd.serve_forever()
