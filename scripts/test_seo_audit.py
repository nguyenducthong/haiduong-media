import importlib.util
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import tempfile
import threading
import unittest

spec = importlib.util.spec_from_file_location('seo', Path(__file__).with_name('seo-audit.py'))
seo = importlib.util.module_from_spec(spec)
spec.loader.exec_module(seo)


class Fixture(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def do_GET(self):
        bodies = {
            '/robots.txt': 'User-agent: *\nDisallow: /private',
            '/sitemap.xml': '<urlset><url><loc>/other</loc></url></urlset>',
            '/': '<html lang="vi"><title>Trùng</title><meta name="description" content="Mô tả"><link rel="canonical" href="/"><h1>Trang</h1><a href="/broken">Lỗi</a><a href="/private">Riêng</a><img src="x">',
            '/other': '<html><title>Trùng</title><link rel="canonical" href="/"><h1>A</h1><h1>B</h1>',
        }
        self.send_response(200 if self.path in bodies else 404)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(bodies.get(self.path, '').encode())


class AuditTests(unittest.TestCase):
    def test_crawl_and_report(self):
        server = ThreadingHTTPServer(('127.0.0.1', 0), Fixture)
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            report = seo.crawl(f'http://127.0.0.1:{server.server_port}/', 10, 0)
            self.assertEqual(len(report['pages']), 3)
            home = report['pages'][0]
            messages = ' '.join(i['message'] for i in home['issues'])
            self.assertIn('Trùng tiêu đề', messages)
            self.assertIn('Liên kết nội bộ lỗi', messages)
            self.assertIn('thiếu thuộc tính alt', messages)
            other = next(r for r in report['pages'] if r['url'].endswith('/other'))
            self.assertTrue(any('Canonical khác' in i['message'] for i in other['issues']))
            self.assertFalse(any(r['url'].endswith('/private') for r in report['pages']))
            with tempfile.TemporaryDirectory() as folder:
                home['title'] = '<script>alert(1)</script>'
                seo.write_report(report, Path(folder))
                html = (Path(folder) / 'seo-report.html').read_text(encoding='utf-8')
                self.assertNotIn('<script>', html)
                self.assertIn('&lt;script&gt;', html)
        finally:
            server.shutdown()
            server.server_close()

    def test_empty_alt_is_allowed_and_headers_noindex(self):
        page = seo.Page()
        page.feed('<html lang="vi"><title>A</title><meta name="description" content="B"><h1>A</h1><link rel="canonical" href="/a"><img alt="" src="a">')
        self.assertEqual(seo.analyze('https://example.com/a', page), [])
        self.assertEqual(seo.analyze('https://example.com/a', page, {'X-Robots-Tag': 'noindex'})[0]['priority'], 'P1')


if __name__ == '__main__':
    unittest.main()
