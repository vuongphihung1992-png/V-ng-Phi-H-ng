# HƯỚNG DẪN THIẾT LẬP SUPABASE BACKEND (CÔNG AN XÃ PƠNG DRANG)

Hệ thống được thiết kế theo chuẩn bảo mật cấp cơ quan hành chính với đầy đủ 16 file SQL Migrations, RLS Policies và Storage Policies.

---

## 🚀 QUY TRÌNH THIẾT LẬP CHI TIẾT (STEP-BY-STEP)

### STEP 1: Khởi tạo Project trên Supabase
1. Đăng nhập [https://supabase.com](https://supabase.com) và chọn **New Project**.
2. Đặt tên dự án: `cong-an-xa-pong-drang` và tạo mật khẩu CSDL an toàn.

### STEP 2: Chạy Migrations SQL
Mở mục **SQL Editor** trên Supabase Dashboard và thực thi lần lượt các file trong thư mục `supabase/migrations/`:
1. `001_extensions.sql` (Kích hoạt uuid-ossp & pgcrypto)
2. `002_roles.sql` (Tạo bảng vai trò cán bộ)
3. `003_profiles.sql` (Tạo hồ sơ người dùng liên kết Auth)
4. `004_news.sql` (Bảng danh mục và tin tức)
5. `005_announcements.sql` (Bảng thông báo)
6. `006_security_reports.sql` (Bảng phản ánh ANTT, đính kèm, cập nhật)
7. `007_appointments.sql` (Bảng đặt lịch làm việc)
8. `008_feedback.sql` (Bảng góp ý)
9. `009_faq.sql` (Bảng hỏi đáp FAQ)
10. `010_banners.sql` (Bảng banner tuyên truyền)
11. `011_settings.sql` (Bảng cấu hình hệ thống)
12. `012_notifications.sql` (Bảng thông báo in-app)
13. `013_audit_logs.sql` (Bảng nhật ký hệ thống)
14. `014_rls.sql` (Chính sách bảo mật Row Level Security)
15. `015_functions.sql` (Hàm tra cứu bảo mật RPC)
16. `016_storage.sql` (Cấu hình Buckets & Quyền lưu trữ)

### STEP 3: Nạp Dữ Liệu Mẫu (Seed Data)
Mở file `supabase/seed.sql`, sao chép toàn bộ nội dung và thực thi trong **SQL Editor**.

### STEP 4: Khởi Tạo Tài Khoản Admin Đăng Nhập
1. Truy cập **Authentication** -> **Users** -> **Add User** -> **Create User**.
2. Nhập Email và Password cho cán bộ quản trị.
3. Chép mã `User UUID` vừa tạo.
4. Mở SQL Editor và thực thi lệnh gán quyền `SUPER_ADMIN`:
```sql
INSERT INTO public.profiles (id, full_name, email, role_id, is_active)
VALUES (
    'MÃ_UUID_CỦA_USER',
    'Cán bộ Trực ban / Admin',
    'admin@cong-an-pongdrang.gov.vn',
    (SELECT id FROM public.roles WHERE name = 'SUPER_ADMIN'),
    true
);
```

### STEP 5: Khai Báo Biến Môi Trường Web
Tạo file `.env` tại thư mục gốc dự án:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_DEMO_MODE=false
```
