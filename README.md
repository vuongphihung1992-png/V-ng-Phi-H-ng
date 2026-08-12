# HỆ THỐNG CỔNG THÔNG TIN & TƯƠNG TÁC SỐ CÔNG AN XÃ PƠNG DRANG – ĐẮK LẮK

Cổng thông tin điện tử và ứng dụng tương tác dịch vụ công trực tuyến dành cho người dân xã Pơng Drang, tỉnh Đắk Lắk.

**Tên hiển thị:** CÔNG AN XÃ PƠNG DRANG – ĐẮK LẮK  
**Slogan:** *Gần dân - Vì Nhân dân phục vụ*

---

## 🌟 TÍNH NĂNG CHÍNH

### 1. Dành cho Người dân:
- 📰 **Tin tức & Tuyên truyền:** Theo dõi thông tin an ninh trật tự, phòng chống tội phạm, phổ biến pháp luật.
- 📢 **Thông báo chính thức:** Nhận thông báo chỉ đạo, lịch tiếp dân khẩn cấp, cảnh báo chiêu trò lừa đảo.
- 🛡️ **Gửi Phản ánh ANTT:** Nộp báo cáo tình hình an ninh trật tự, kèm hình ảnh, vị trí định vị Geolocation và mã tra cứu tự động (`PDR-2026-XXXXXX`).
- 📅 **Đặt lịch làm việc:** Đăng ký lịch tiếp công dân trực tuyến (`APPT-PDR-2026-XXXXXX`) để giải quyết thủ tục Căn cước, VNeID, cư trú.
- 🔎 **Tra cứu trạng thái:** Theo dõi tiến độ xử lý phản ánh & lịch hẹn theo mã hồ sơ công khai.
- ❓ **Hỏi đáp FAQ & Liên hệ:** Tra cứu quy trình thủ tục hành chính, số điện thoại đường dây nóng trực ban 24/7 và vị trí bản đồ.

### 2. Dành cho Cán bộ / Quản trị viên (Admin Portal):
- 🔐 **Đăng nhập phân quyền (RBAC):** Quản lý quyền truy cập cấp bậc (`SUPER_ADMIN`, `ADMIN`, `EDITOR`, `STAFF`, `VIEWER`).
- 📊 **Dashboard Thống kê:** Theo dõi chỉ số tổng phản ánh, hồ sơ đang xử lý, lịch hẹn chờ duyệt và tin tức ban hành.
- 📝 **Quản lý Nội dung (CMS):** Tạo, chỉnh sửa, đăng duyệt tin tức, thông báo, câu hỏi FAQ và banner.
- ⚙️ **Cấu hình Hệ thống:** Cập nhật linh hoạt thông tin đơn vị, hotline, địa chỉ, lịch làm việc tập trung qua file `src/config/siteConfig.ts` hoặc giao diện quản trị.

---

## 🛠️ HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN (LOCAL DEVELOPMENT)

### 1. Yêu cầu hệ thống:
- **Node.js**: v18.0.0 trở lên
- **npm**: v9.0.0 trở lên

### 2. Các bước khởi chạy:
```bash
# 1. Clone repository hoặc giải nén mã nguồn
cd cong-an-xapongdrang

# 2. Cài đặt các gói phụ thuộc
npm install

# 3. Khởi chạy máy chủ phát triển (Development Server)
npm run dev
```
Ứng dụng sẽ chạy tại địa chỉ: `http://localhost:3000`

---

## 🗄️ HƯỚNG DẪN CẤU HÌNH BACKEND SUPABASE

Mặc định ứng dụng tự động chạy ở **CHẾ ĐỘ DEMO** (DEMO MODE) với dữ liệu lưu trữ phía client nếu chưa khai báo thông số Supabase. Để kết nối cơ sở dữ liệu đám mây Supabase chính thức:

### Bước 1: Tạo dự án Supabase
1. Truy cập [https://supabase.com](https://supabase.com) và khởi tạo dự án mới.
2. Mở mục **SQL Editor** trong bảng điều khiển Supabase.

### Bước 2: Chạy File Schema & Seed Data
1. Sao chép toàn bộ nội dung file `supabase/schema.sql` và dán vào SQL Editor trên Supabase, sau đó nhấn **Run** để khởi tạo bảng, hàm tự sinh mã `PDR-` / `APPT-`, chỉ mục performance và chính sách bảo mật Row Level Security (RLS).
2. Tùy chọn: Chạy tiếp nội dung file `supabase/seed.sql` để nạp danh mục và câu hỏi FAQ ban đầu.

### Bước 3: Khai báo Biến Môi Trường (`.env`)
Tạo file `.env` tại thư mục gốc dự án dựa theo `.env.example`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_DEMO_MODE=false
```

---

## 🔄 PHƯƠNG ÁN CHUYỂN ĐỔI CHUYỂN SANG FIREBASE (FIREBASE ALTERNATIVE MAPPING)

Hệ thống được thiết kế theo kiến trúc tách biệt (Service Abstraction Layer). Để chuyển đổi backend từ Supabase sang Firebase khi cần:

| Thành phần Supabase | Thành phần tương đương Firebase |
| :--- | :--- |
| **Supabase Auth** | Firebase Authentication |
| **Supabase PostgreSQL** | Cloud Firestore |
| **Supabase Storage** | Firebase Storage |
| **Row Level Security (RLS)** | Firestore Security Rules |
| **Realtime Subscriptions** | Firestore `onSnapshot()` listeners |

*Lưu ý: Không bao giờ nhúng `service_role_key` hoặc Firebase Admin SDK Credentials vào mã nguồn Frontend.*

---

## 📱 KHẢ NĂNG PWA & MOBILE FIRST

- Tương thích hoàn hảo mọi thiết bị di động (iPhone, Samsung, iPad, PC).
- Tích hợp Progressive Web App (PWA) cho phép người dân cài đặt biểu tượng "Công an Pơng Drang" ra màn hình chính (Home Screen) để truy cập nhanh không cần qua trình duyệt.

---

## 🛡️ BẢO MẬT & QUY TẮC THÔNG TIN CHÍNH THỨC

- **Bảo vệ Dữ liệu:** Mọi dữ liệu phản ánh của người dân được mã hóa tra cứu, không hiển thị công khai thông tin cá nhân nhạy cảm (SĐT, Họ tên) ra ngoài.
- **Minh bạch Dữ liệu:** Tất cả thông tin liên hệ, hotline, lịch trực tiếp tục được cập nhật theo thông cáo chính thức ban hành của Công an xã Pơng Drang.
