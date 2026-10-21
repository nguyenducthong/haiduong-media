# Công cụ kiểm tra SEO

## Cấu hình tên miền SEO

Tên miền dùng chung nằm trong `lib/site-url.ts`, ưu tiên `NEXT_PUBLIC_SITE_URL`, sau đó `SITE_URL`, mặc định `https://thuonghieuhangdauvn.com`.

Khi đổi domain, đặt một biến duy nhất trong môi trường build/triển khai (local có thể đặt trong `.env`):

```dotenv
NEXT_PUBLIC_SITE_URL=https://domain-moi.com
```

Chỉ nhập origin, không thêm đường dẫn, query hoặc fragment. Nếu đã đặt cả hai biến, cập nhật hoặc bỏ biến cũ để tránh giá trị ưu tiên ghi đè. Build và triển khai lại sau khi đổi biến. Metadata base, canonical, sitemap, robots và URL Organization/WebSite trong JSON-LD dùng chung cấu hình này. Mỗi trang khai báo đường dẫn canonical riêng; bài chi tiết dùng slug. Trang chủ không còn áp canonical xuống các trang con.

Việc đổi cấu hình SEO không tự cấu hình DNS, chuyển hướng 301 từ domain cũ, chuyển URL ảnh đã lưu trong nội dung hay đổi thông tin thương hiệu/email. Khi chuyển website thật cần xử lý những phần đó riêng, xác minh domain mới và gửi sitemap mới trong Search Console.

Yêu cầu Python 3.10 trở lên, không cần cài thư viện. Mở terminal tại thư mục project.

```powershell
python scripts/seo-audit.py --url https://thuonghieuhangdauvn.com --max-pages 100
```

Hoặc kiểm tra bản local đang chạy:

```powershell
python scripts/seo-audit.py --url http://127.0.0.1:5173 --max-pages 30
```

Mở `seo-reports/seo-report.html` để xem báo cáo tiếng Việt; dữ liệu máy đọc ở `seo-report.json`. Đổi nơi xuất bằng `--output`, điều chỉnh khoảng nghỉ giữa yêu cầu bằng `--delay 0.5`. Chạy lại sau mỗi đợt sửa và lưu từng lần vào thư mục khác nhau để so sánh.

Công cụ kiểm tra HTTP lỗi, tiêu đề/mô tả thiếu hoặc trùng, canonical thiếu hoặc khác URL, H1, ngôn ngữ, ảnh thiếu alt, noindex và liên kết nội bộ tới URL lỗi đã quét. Báo cáo sắp xếp trang có P1 trước. Canonical khác URL và noindex có thể là chủ đích, cần xem nội dung trước khi sửa.

Quét giới hạn trong cùng origin, tôn trọng robots.txt, bỏ qua quản trị/API/đăng nhập, tham số truy vấn và tài nguyên phổ biến. Khám phá từ trang đầu, sitemap.xml dạng urlset và liên kết HTML; chưa đọc sitemap index con. Không đăng nhập, không thực thi JavaScript, không kiểm tra liên kết ngoài; lỗi liên kết chỉ được kết luận khi URL đích đã được tải. Redirect sang origin khác bị chặn: chạy lại với đúng tên miền đích, bao gồm www nếu có. Tối đa 1000 trang, 2 MB mỗi phản hồi, timeout 15 giây. Mã thoát 2 khi không quét được trang nào.

Đây là công cụ chẩn đoán; không tự sửa nội dung, gửi lập chỉ mục hay đo thứ hạng, backlink hoặc Core Web Vitals. Không có điểm số được gắn nhãn là điểm Google. Website riêng tư cần được công khai theo quyết định của chủ sở hữu trước khi công cụ tìm kiếm truy cập được.

Ưu tiên xử lý HTTP lỗi, noindex ngoài ý muốn và canonical sai; sau đó viết nội dung có ích, tiêu đề riêng và liên kết nội bộ phù hợp. Kết nối Google Search Console để theo dõi lượt hiển thị, click và trạng thái lập chỉ mục thực tế.

Tài liệu tham chiếu: [Canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [tiêu đề](https://developers.google.com/search/docs/appearance/title-link), [sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

Kiểm tra công cụ:

```powershell
python -m unittest discover -s scripts -p test_seo_audit.py
```
