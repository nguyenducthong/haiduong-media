# QUY TẮC PHÁT TRIỂN & KIỂM THỬ DỰ ÁN HẢI DƯƠNG MEDIA

## 1. NGUYÊN TẮC KIỂM THỬ HỒI QUY (REGRESSION-FREE)
- **Bảo toàn luồng cũ:** Mọi chức năng mới hoặc chỉnh sửa tuyệt đối KHÔNG được làm ảnh hưởng, hỏng hóc hay thay đổi hành vi ngoài ý muốn của các chức năng, luồng logic cũ đã hoạt động ổn định.
- **Kiểm tra trước khi báo cáo:** Trước khi thông báo hoàn tất cho người dùng, PHẢI kiểm tra lại:
  - Các trang liên quan, các nút thao tác chính.
  - API endpoint, trạng thái dữ liệu (Database / Fallback).
  - Khả năng build TypeScript (`npm run build` hoặc `npx tsc --noEmit`) không được có lỗi mới.

## 2. NGUYÊN TẮC ĐÁP ỨNG GIAO DIỆN (RESPONSIVE FIRST)
- **Kiểm thử trên Mobile là bắt buộc:** Sau khi hoàn thành logic chức năng, BẮT BUỘC phải kiểm tra hiển thị responsive trên các kích thước:
  - Mobile nhỏ: `360px` - `414px` (iPhone, Android phổ thông).
  - Tablet: `768px` - `1024px` (iPad, tablet).
  - Desktop: `1200px+`.
- **Chống tràn ngang & chồng đè layout:** Tuyệt đối không để xảy ra tình trạng vỡ layout, tràn ngang thanh cuộn hoặc chữ đè lên chữ trên màn hình điện thoại:
  - Grid chia cột cố định (vd: `2fr 1fr`, `300px 1fr`) phải có media query chuyển thành `1fr` trên Mobile.
  - Bảng biểu (Table) phải luôn được bọc trong container `overflow-x: auto` hoặc có thanh cuộn ngang riêng.
  - Thanh công cụ dài phải hỗ trợ cuộn ngang (`overflow-x: auto; flex-wrap: nowrap` hoặc `flex-wrap: wrap` hợp lý).
  - Nút bấm, danh sách hành động trên Mobile phải tự động xếp dòng (`flex-direction: column` hoặc dàn đều `width: 100%`) để ngón tay dễ chạm bấm.
  - Sidebar trên Mobile phải chuyển sang dạng Drawer trượt (Off-canvas) có nút mở ☰ và lớp phủ Backdrop, không được cố định chiều rộng ép nát Workspace.

## 3. NGUYÊN TẮC TEST LIVE THỰC TẾ TRÊN TRÌNH DUYỆT (BROWSER LIVE TESTING & NO HYDRATION ERROR)
- **Bắt buộc mở Live test trực tiếp trên trình duyệt:** Tuyệt đối không được chỉ kiểm tra `npm run build` rồi báo xong! PHẢI mở trang trực tiếp trên trình duyệt (hoặc dùng headless browser test qua Chrome/Edge CDP) để kiểm tra thực tế:
  - Bắt toàn bộ Console Error, Console Warn, Runtime Exception ở phía Client.
  - Tuyệt đối KHÔNG ĐƯỢC có lỗi đỏ, popup **"UNHANDLED SCRIPT ERROR"** hay **"Hydration Mismatch"** (`Invalid HTML tag nesting`, khác biệt DOM Server/Client).
- **Kiểm tra tính hợp lệ của HTML (Valid HTML Nesting):**
  - Không bao giờ để thẻ `<p>` bao bọc các thẻ block (`<h3>`, `<h2>`, `<div>`, `<ul>`, `<table>`).
  - Dữ liệu nhập vào hoặc từ nguồn bên ngoài (Word, WordPress crawler) phải luôn được lọc sạch qua `balanceHtmlTags` để loại bỏ các thẻ structural (`<section>`, `</section>`, `<article>`, `</article>`) và bỏ các thẻ đóng thừa `</div>` mồ côi trước khi chèn vào trang.
- **Kiểm tra trực quan (Visual Inspection):** Đảm bảo không có hiện tượng chữ đè lên chữ (overlap/overlay), thứ tự hiển thị các khối nội dung từ trên xuống dưới mạch lạc.
