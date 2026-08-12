-- Migration 006: Security Reports, Attachments & Updates
CREATE SEQUENCE IF NOT EXISTS report_seq START 1;

CREATE OR REPLACE FUNCTION generate_report_code()
RETURNS TRIGGER AS $$
DECLARE
    current_year TEXT;
    seq_num TEXT;
BEGIN
    current_year := TO_CHAR(CURRENT_DATE, 'YYYY');
    seq_num := LPAD(NEXTVAL('report_seq')::TEXT, 6, '0');
    NEW.report_code := 'PDR-' || current_year || '-' || seq_num;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS public.security_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_code TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    location_text TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('SECURITY_ORDER', 'THEFT', 'PUBLIC_DISTURBANCE', 'TRAFFIC', 'FIRE_SAFETY', 'SOCIAL_ISSUES', 'OTHER')),
    severity TEXT NOT NULL DEFAULT 'NORMAL' CHECK (severity IN ('NORMAL', 'HIGH', 'URGENT')),
    status TEXT NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'RECEIVED', 'IN_REVIEW', 'PROCESSING', 'RESOLVED', 'REJECTED', 'CANCELLED')),
    consent BOOLEAN NOT NULL DEFAULT false,
    assigned_to UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    resolved_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

DROP TRIGGER IF EXISTS trg_set_report_code ON public.security_reports;
CREATE TRIGGER trg_set_report_code
    BEFORE INSERT ON public.security_reports
    FOR EACH ROW
    WHEN (NEW.report_code IS NULL OR NEW.report_code = '')
    EXECUTE FUNCTION generate_report_code();

DROP TRIGGER IF EXISTS trg_security_reports_updated_at ON public.security_reports;
CREATE TRIGGER trg_security_reports_updated_at
    BEFORE UPDATE ON public.security_reports
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Attachments
CREATE TABLE IF NOT EXISTS public.report_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES public.security_reports(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    file_name TEXT,
    file_type TEXT,
    file_size BIGINT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Updates / Processing Log
CREATE TABLE IF NOT EXISTS public.report_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES public.security_reports(id) ON DELETE CASCADE,
    status TEXT,
    note TEXT, -- Internal staff note (never shown to public)
    public_message TEXT, -- Public message visible via tracking
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now()
);
