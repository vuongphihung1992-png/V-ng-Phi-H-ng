-- Migration 002: Roles
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed Default System Roles
INSERT INTO public.roles (name, description) VALUES
('SUPER_ADMIN', 'Toàn quyền quản trị hệ thống Công an Xã'),
('ADMIN', 'Quản trị viên quản lý nội dung, phản ánh, lịch hẹn và cán bộ'),
('EDITOR', 'Biên tập viên quản lý tin tức, thông báo, FAQ, banner'),
('STAFF', 'Cán bộ trực ban xử lý phản ánh ANTT và tiếp công dân'),
('VIEWER', 'Quyền xem chỉ số tổng hợp nội bộ')
ON CONFLICT (name) DO NOTHING;
