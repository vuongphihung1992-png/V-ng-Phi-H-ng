-- ============================================================
-- SUPABASE DATABASE SCHEMA
-- CÔNG AN XÃ PƠNG DRANG – ĐẮK LẮK
-- ============================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'STAFF', 'VIEWER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    email TEXT UNIQUE,
    avatar_url TEXT,
    role user_role DEFAULT 'STAFF'::user_role,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. NEWS CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.news_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. NEWS TABLE
CREATE TABLE IF NOT EXISTS public.news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'An ninh trật tự',
    category_id UUID REFERENCES public.news_categories(id) ON DELETE SET NULL,
    cover_image_url TEXT,
    status TEXT DEFAULT 'PUBLISHED', -- DRAFT, PUBLISHED, ARCHIVED
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'Cảnh báo',
    priority TEXT DEFAULT 'NORMAL', -- NORMAL, HIGH, URGENT
    important BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'PUBLISHED',
    published_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SECURITY REPORTS TABLE (PHẢN ÁNH ANTT)
CREATE TABLE IF NOT EXISTS public.security_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    receipt_code TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT,
    type TEXT NOT NULL, -- An ninh trật tự, Trộm cắp, Gây rối, Lừa đảo, Khác
    urgency TEXT DEFAULT 'Bình thường', -- Bình thường, Cần xử lý, Khẩn cấp
    content TEXT NOT NULL,
    location_text TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status TEXT DEFAULT 'Đã tiếp nhận', -- Đã tiếp nhận, Đang xác minh, Đang xử lý, Đã hoàn thành, Từ chối
    admin_notes TEXT,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 8. REPORT ATTACHMENTS TABLE
CREATE TABLE IF NOT EXISTS public.report_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES public.security_reports(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name TEXT,
    file_type TEXT,
    file_size BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. REPORT UPDATES TABLE (LỊCH SỬ XỬ LÝ)
CREATE TABLE IF NOT EXISTS public.report_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES public.security_reports(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    note TEXT,
    public_message TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. APPOINTMENTS TABLE (ĐẶT LỊCH LÀM VIỆC)
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    citizen_id TEXT,
    service_type TEXT NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TEXT NOT NULL,
    note TEXT,
    status TEXT DEFAULT 'Chờ xác nhận', -- Chờ xác nhận, Đã xác nhận, Đã hoàn thành, Hủy lịch
    admin_notes TEXT,
    confirmed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. FEEDBACK TABLE (GÓP Ý - PHẢN ÁNH THỦ TỤC)
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT,
    phone TEXT,
    category TEXT DEFAULT 'Góp ý chung',
    content TEXT NOT NULL,
    status TEXT DEFAULT 'Chờ xem',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. FAQS TABLE
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT DEFAULT 'Chung',
    sort_order INTEGER DEFAULT 0,
    status TEXT DEFAULT 'PUBLISHED',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. BANNERS TABLE
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT,
    sort_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    metadata JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUTO RECEIPT & BOOKING CODE GENERATOR FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION generate_report_receipt_code()
RETURNS TRIGGER AS $$
DECLARE
    seq_num INT;
    new_code TEXT;
BEGIN
    seq_num := (SELECT COUNT(*) + 1 FROM public.security_reports WHERE created_at >= date_trunc('year', CURRENT_DATE));
    new_code := 'PDR-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(seq_num::TEXT, 6, '0');
    NEW.receipt_code := new_code;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_generate_report_code
BEFORE INSERT ON public.security_reports
FOR EACH ROW
WHEN (NEW.receipt_code IS NULL OR NEW.receipt_code = '')
EXECUTE FUNCTION generate_report_receipt_code();

CREATE OR REPLACE FUNCTION generate_appointment_booking_code()
RETURNS TRIGGER AS $$
DECLARE
    seq_num INT;
    new_code TEXT;
BEGIN
    seq_num := (SELECT COUNT(*) + 1 FROM public.appointments WHERE created_at >= date_trunc('year', CURRENT_DATE));
    new_code := 'APPT-PDR-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(seq_num::TEXT, 6, '0');
    NEW.booking_code := new_code;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_generate_appointment_code
BEFORE INSERT ON public.appointments
FOR EACH ROW
WHEN (NEW.booking_code IS NULL OR NEW.booking_code = '')
EXECUTE FUNCTION generate_appointment_booking_code();

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Public READ for published content
CREATE POLICY "Public Read News" ON public.news FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Public Read Announcements" ON public.announcements FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Public Read FAQs" ON public.faqs FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Public Read Banners" ON public.banners FOR SELECT USING (active = true);

-- Public INSERT for submissions
CREATE POLICY "Public Create Security Reports" ON public.security_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Create Appointments" ON public.appointments FOR INSERT WITH CHECK (true);

-- Staff/Admin Full Access via Auth Profile Role
CREATE POLICY "Admin All Access News" ON public.news FOR ALL USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR'))
);
CREATE POLICY "Admin All Access Reports" ON public.security_reports FOR ALL USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('SUPER_ADMIN', 'ADMIN', 'STAFF'))
);
CREATE POLICY "Admin All Access Appointments" ON public.appointments FOR ALL USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('SUPER_ADMIN', 'ADMIN', 'STAFF'))
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_news_status ON public.news(status);
CREATE INDEX IF NOT EXISTS idx_reports_code ON public.security_reports(receipt_code);
CREATE INDEX IF NOT EXISTS idx_appointments_code ON public.appointments(booking_code);
CREATE INDEX IF NOT EXISTS idx_reports_created ON public.security_reports(created_at DESC);
