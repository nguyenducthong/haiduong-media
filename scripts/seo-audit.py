"""Bounded, same-origin SEO audit. Python standard library only."""
import argparse
from collections import deque, defaultdict
from datetime import datetime, timezone
from html import escape
from html.parser import HTMLParser
import json
from pathlib import Path
import time
from urllib.parse import urljoin, urlsplit, urlunsplit
from urllib.request import Request, build_opener, HTTPRedirectHandler, ProxyHandler
from urllib.error import HTTPError, URLError
from urllib.robotparser import RobotFileParser
import xml.etree.ElementTree as ET

AGENT = 'HaiduongSEO/1.0'
LIMIT = 2_000_000


def normalize(url):
    p = urlsplit(url)
    return urlunsplit((p.scheme.lower(), p.netloc.lower(), p.path or '/', '', ''))


def origin(url):
    p = urlsplit(url)
    return p.scheme, p.netloc


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = ''
        self.description = ''
        self.canonicals = []
        self.robots = ''
        self.links = []
        self.h1 = 0
        self.missing_alt = 0
        self.lang = ''
        self.in_title = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'title':
            self.in_title = True
        if tag == 'html':
            self.lang = a.get('lang', '')
        if tag == 'h1':
            self.h1 += 1
        if tag == 'img' and 'alt' not in a:
            self.missing_alt += 1
        if tag == 'a' and a.get('href'):
            self.links.append(a['href'])
        if tag == 'link' and 'canonical' in a.get('rel', '').lower().split():
            self.canonicals.append(a.get('href', ''))
        if tag == 'meta':
            name = a.get('name', '').lower()
            if name == 'description':
                self.description = a.get('content', '')
            if name in ('robots', 'googlebot'):
                self.robots += ' ' + a.get('content', '').lower()

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data


def analyze(url, page, headers=None):
    issues = []
    def add(level, message):
        issues.append({'priority': level, 'message': message})
    if not page.title.strip():
        add('P1', 'Thiếu tiêu đề: viết tiêu đề riêng mô tả đúng nội dung trang.')
    if not page.description.strip():
        add('P2', 'Thiếu mô tả tìm kiếm: bổ sung tóm tắt hữu ích cho người đọc.')
    if page.h1 != 1:
        add('P2', f'Có {page.h1} H1: kiểm tra tiêu đề chính và cấu trúc nội dung.')
    if not page.lang:
        add('P2', 'Thiếu ngôn ngữ trang HTML.')
    if not page.canonicals:
        add('P2', 'Thiếu canonical: xác định URL chuẩn cho trang.')
    elif len(page.canonicals) > 1:
        add('P1', 'Có nhiều canonical: chỉ giữ một URL chuẩn nhất quán.')
    elif not page.canonicals[0] or normalize(urljoin(url, page.canonicals[0])) != normalize(url):
        add('P2', 'Canonical khác URL đang quét: kiểm tra đây có phải trang trùng lặp có chủ đích.')
    if page.missing_alt:
        add('P2', f'{page.missing_alt} ảnh thiếu thuộc tính alt; mô tả ảnh có ý nghĩa, dùng alt rỗng cho ảnh trang trí.')
    robots = page.robots + ' ' + (headers or {}).get('X-Robots-Tag', '').lower()
    directives = robots.replace(',', ' ').split()
    if 'noindex' in directives or 'none' in directives:
        add('P1', 'Trang có chỉ thị không lập chỉ mục: xác nhận có chủ đích trước khi sửa.')
    return issues


class SameOriginRedirect(HTTPRedirectHandler):
    def __init__(self, base):
        self.base = base

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if origin(newurl) != origin(self.base):
            raise URLError('Redirect ra ngoài origin; hãy dùng URL đích làm --url.')
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def crawl(base, max_pages=100, delay=0.2):
    handlers = [SameOriginRedirect(base)]
    if urlsplit(base).hostname in ('127.0.0.1', 'localhost', '::1'):
        handlers.append(ProxyHandler({}))
    opener = build_opener(*handlers)
    def fetch(url):
        time.sleep(delay)
        try:
            with opener.open(Request(url, headers={'User-Agent': AGENT}), timeout=15) as r:
                raw = r.read(LIMIT + 1)
                if len(raw) > LIMIT:
                    raise ValueError('Nội dung vượt giới hạn 2 MB.')
                return r.status, r.geturl(), r.headers, raw.decode(r.headers.get_content_charset() or 'utf-8', errors='replace')
        except HTTPError as e:
            return e.code, url, e.headers, ''

    root = urljoin(base, '/')
    notes = []
    robot = RobotFileParser()
    try:
        status, _, _, body = fetch(urljoin(root, 'robots.txt'))
        if status == 200:
            robot.parse(body.splitlines())
        elif status == 404:
            robot.parse([])
            notes.append('Chưa có robots.txt (không tự ngăn lập chỉ mục).')
        else:
            raise ValueError(f'robots.txt trả HTTP {status}')
    except (OSError, ValueError) as e:
        return {'base': base, 'pages': [], 'notes': [f'Không thể đọc robots.txt; dừng quét: {e}'], 'limited': True}

    def allowed(url):
        p = urlsplit(url)
        return origin(url) == origin(base) and not p.path.startswith(('/admin', '/api/', '/signin', '/signout')) and robot.can_fetch(AGENT, url)

    queue = deque([normalize(base)])
    try:
        status, _, _, xml = fetch(urljoin(root, 'sitemap.xml'))
        if status == 200:
            tree = ET.fromstring(xml)
            if tree.tag.split('}')[-1] == 'sitemapindex':
                notes.append('Sitemap dạng index: lần quét này khám phá trang qua liên kết nội bộ, chưa đọc sitemap con.')
            else:
                for loc in tree.iter():
                    if loc.tag.split('}')[-1] == 'loc' and loc.text:
                        u = normalize(urljoin(root, loc.text.strip()))
                        if allowed(u) and len(queue) < max_pages * 10:
                            queue.append(u)
        else:
            notes.append(f'sitemap.xml trả HTTP {status}; kiểm tra sitemap.')
    except (OSError, ValueError, ET.ParseError) as e:
        notes.append(f'Không đọc được sitemap: {e}')

    seen, rows = set(), []
    while queue and len(rows) < max_pages:
        url = queue.popleft()
        if url in seen:
            continue
        seen.add(url)
        if not allowed(url):
            notes.append(f'Bỏ qua URL bị robots.txt hoặc phạm vi quét chặn: {url}')
            continue
        row = {'url': url, 'title': '', 'description': '', 'links': [], 'issues': []}
        try:
            status, final, headers, body = fetch(url)
            row['status'] = status
            if status >= 400:
                row['issues'].append({'priority': 'P1', 'message': f'HTTP {status}: khôi phục trang hoặc cập nhật liên kết trỏ tới.'})
            elif 'text/html' in headers.get('Content-Type', ''):
                page = Page()
                page.feed(body)
                row.update(title=page.title.strip(), description=page.description.strip())
                row['issues'] = analyze(final, page, headers)
                for href in page.links:
                    p = urlsplit(urljoin(final, href))
                    if p.scheme not in ('http', 'https') or p.query:
                        continue
                    u = normalize(p.geturl())
                    if allowed(u) and not Path(p.path).suffix.lower() in ('.png', '.jpg', '.jpeg', '.svg', '.pdf', '.zip', '.mp4', '.webp', '.ico', '.css', '.js'):
                        row['links'].append(u)
                        if u not in seen and len(queue) < max_pages * 10:
                            queue.append(u)
            else:
                row['issues'].append({'priority': 'P2', 'message': 'URL không trả HTML; chưa phân tích nội dung.'})
        except (OSError, ValueError) as e:
            row['status'] = 0
            row['issues'].append({'priority': 'P1', 'message': f'Không tải được trang: {e}'})
        rows.append(row)

    for field, label in [('title', 'tiêu đề'), ('description', 'mô tả')]:
        groups = defaultdict(list)
        for row in rows:
            if row[field]:
                groups[row[field].casefold()].append(row)
        for group in groups.values():
            if len(group) > 1:
                for row in group:
                    row['issues'].append({'priority': 'P2', 'message': f'Trùng {label} với {len(group)-1} URL khác trong mẫu quét.'})
    broken = {r['url'] for r in rows if r['status'] >= 400}
    for row in rows:
        for link in sorted(set(row['links']) & broken):
            row['issues'].append({'priority': 'P1', 'message': f'Liên kết nội bộ lỗi: {link}'})
    return {'base': base, 'createdAt': datetime.now(timezone.utc).isoformat(), 'pages': rows, 'notes': notes, 'limited': bool(queue)}


def write_report(report, output):
    output.mkdir(parents=True, exist_ok=True)
    (output / 'seo-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    e = lambda value: escape(str(value), quote=True)
    rows = sorted(report['pages'], key=lambda r: (-sum(i['priority'] == 'P1' for i in r['issues']), -len(r['issues'])))
    cards = ''.join(f'<article><h2><a href="{e(r["url"])}">{e(r["url"])}</a></h2><p>HTTP {r.get("status", 0)} · {e(r["title"])}</p><ul>' + ''.join(f'<li><b>{e(i["priority"])}</b> {e(i["message"])}</li>' for i in r['issues']) + '</ul></article>' for r in rows)
    notes = ''.join(f'<li>{e(n)}</li>' for n in report['notes'])
    html = f'''<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Báo cáo SEO</title><style>body{{font:16px/1.6 system-ui;background:#f1f5f9;color:#17243b;margin:auto;padding:24px;max-width:1100px}}article{{background:white;border-radius:12px;padding:20px;margin:16px 0;overflow-wrap:anywhere}}h2{{font-size:17px}}a{{color:#1657a5}}b{{color:#b42318}}li{{margin:8px 0}}</style><h1>Báo cáo SEO</h1><p>{e(report['base'])} · {len(rows)} URL đã kiểm tra · {sum(len(r['issues']) for r in rows)} phát hiện</p><p>P1: ưu tiên kiểm tra; P2: cải thiện nội dung/kỹ thuật. Đây là kiểm tra HTML, không phải điểm xếp hạng Google. Chưa đo Core Web Vitals, backlink hay thứ hạng từ khóa.</p><p>{'Quét chưa đầy đủ: xem giới hạn và ghi chú.' if report['limited'] else 'Đã hết hàng đợi trong phạm vi cho phép; không đảm bảo tìm được mọi trang.'}</p><ul>{notes}</ul>{cards}</html>'''
    (output / 'seo-report.html').write_text(html, encoding='utf-8')


def main():
    parser = argparse.ArgumentParser(description='Quét SEO và xuất báo cáo HTML/JSON tiếng Việt.')
    parser.add_argument('--url', required=True)
    parser.add_argument('--max-pages', type=int, default=100)
    parser.add_argument('--delay', type=float, default=0.2)
    parser.add_argument('--output', default='seo-reports')
    args = parser.parse_args()
    if urlsplit(args.url).scheme not in ('http', 'https') or not urlsplit(args.url).hostname or urlsplit(args.url).username or not 1 <= args.max_pages <= 1000 or args.delay < 0:
        parser.error('URL HTTP(S) hợp lệ, không chứa tài khoản; max-pages 1–1000; delay >= 0.')
    report = crawl(normalize(args.url), args.max_pages, args.delay)
    write_report(report, Path(args.output))
    print(f"Da quet {len(report['pages'])} URL. Bao cao: {Path(args.output).resolve() / 'seo-report.html'}")
    return 0 if report['pages'] else 2


if __name__ == '__main__':
    raise SystemExit(main())
