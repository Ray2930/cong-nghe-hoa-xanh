# CÔNG NGHỆ HÓA XANH – Website giới thiệu sản phẩm

## Chạy thử
    npm install
    npm start            # mở http://localhost:3000

- Trang quản trị: /admin  (lần đầu: tài khoản `admin` / mật khẩu `ChangeMe@2026` → ĐỔI NGAY trong tab "Tài khoản").
- Đặt mật khẩu ban đầu riêng:  ADMIN_PASSWORD="mat-khau-cua-ban" npm start
- Khi chạy thật, đặt PUBLIC_URL để mã QR trỏ đúng tên miền:
      PUBLIC_URL=https://ten-mien.vn PORT=3000 npm start

## Link & QR
Mỗi sản phẩm có link riêng: /san-pham/<slug>  (ví dụ /san-pham/nuoc-giat, /san-pham/nuoc-rua-tay-huong-lavender).
Vào /admin → Sản phẩm → "Sửa / QR" để tải mã QR (PNG/SVG). Hệ thống không cho tạo 2 sản phẩm trùng link.

## Dữ liệu
data/db.json (sản phẩm, bài viết, cài đặt) và public/uploads/ (ảnh tải lên) – hãy sao lưu 2 nơi này.
Ảnh Hero / Giới thiệu / Cẩm nang đang là link ảnh tạo bằng Higgsfield – nên tải về rồi tải lại qua trang Admin để lưu cố định.
