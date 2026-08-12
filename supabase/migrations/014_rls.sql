-- Migration 014: Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper Function to check role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
DECLARE
    u_role TEXT;
BEGIN
    SELECT r.name INTO u_role
    FROM public.profiles p
    JOIN public.roles r ON p.role_id = r.id
    WHERE p.id = auth.uid() AND p.is_active = true;
    
    RETURN COALESCE(u_role, 'PUBLIC');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    cur_role TEXT;
BEGIN
    cur_role := public.get_current_user_role();
    IF cur_role = 'SUPER_ADMIN' THEN
        RETURN true;
    ELSIF required_role = 'ADMIN' AND cur_role IN ('ADMIN', 'SUPER_ADMIN') THEN
        RETURN true;
    ELSIF required_role = 'EDITOR' AND cur_role IN ('EDITOR', 'ADMIN', 'SUPER_ADMIN') THEN
        RETURN true;
    ELSIF required_role = 'STAFF' AND cur_role IN ('STAFF', 'ADMIN', 'SUPER_ADMIN') THEN
        RETURN true;
    ELSIF required_role = cur_role THEN
        RETURN true;
    END IF;
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 1. Roles
CREATE POLICY "Public can view roles" ON public.roles FOR SELECT USING (true);

-- 2. Profiles
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (id = auth.uid() OR public.has_role('ADMIN'));
CREATE POLICY "Admins update profiles" ON public.profiles FOR UPDATE USING (public.has_role('ADMIN'));

-- 3. News Categories
CREATE POLICY "Public view news categories" ON public.news_categories FOR SELECT USING (true);
CREATE POLICY "Editors manage news categories" ON public.news_categories FOR ALL USING (public.has_role('EDITOR'));

-- 4. News
CREATE POLICY "Public view published news" ON public.news FOR SELECT USING (status = 'PUBLISHED' AND deleted_at IS NULL);
CREATE POLICY "Staff/Editors view all news" ON public.news FOR SELECT USING (public.has_role('EDITOR') OR public.has_role('STAFF'));
CREATE POLICY "Editors manage news" ON public.news FOR ALL USING (public.has_role('EDITOR'));

-- 5. Announcements
CREATE POLICY "Public view published announcements" ON public.announcements FOR SELECT USING (status = 'PUBLISHED' AND deleted_at IS NULL);
CREATE POLICY "Staff/Editors view all announcements" ON public.announcements FOR SELECT USING (public.has_role('EDITOR') OR public.has_role('STAFF'));
CREATE POLICY "Editors manage announcements" ON public.announcements FOR ALL USING (public.has_role('EDITOR'));

-- 6. Security Reports
CREATE POLICY "Public insert security reports" ON public.security_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff view assigned or all reports" ON public.security_reports FOR SELECT USING (public.has_role('STAFF'));
CREATE POLICY "Staff update assigned reports" ON public.security_reports FOR UPDATE USING (public.has_role('STAFF'));

-- 7. Report Attachments
CREATE POLICY "Public insert report attachments" ON public.report_attachments FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff view report attachments" ON public.report_attachments FOR SELECT USING (public.has_role('STAFF'));

-- 8. Report Updates
CREATE POLICY "Staff view report updates" ON public.report_updates FOR SELECT USING (public.has_role('STAFF'));
CREATE POLICY "Staff create report updates" ON public.report_updates FOR INSERT WITH CHECK (public.has_role('STAFF'));

-- 9. Appointments
CREATE POLICY "Public insert appointments" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff view appointments" ON public.appointments FOR SELECT USING (public.has_role('STAFF'));
CREATE POLICY "Staff update appointments" ON public.appointments FOR UPDATE USING (public.has_role('STAFF'));

-- 10. Feedback
CREATE POLICY "Public insert feedback" ON public.feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff view feedback" ON public.feedback FOR SELECT USING (public.has_role('STAFF'));

-- 11. FAQs
CREATE POLICY "Public view published faqs" ON public.faqs FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Editors manage faqs" ON public.faqs FOR ALL USING (public.has_role('EDITOR'));

-- 12. Banners
CREATE POLICY "Public view active banners" ON public.banners FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Editors manage banners" ON public.banners FOR ALL USING (public.has_role('EDITOR'));

-- 13. Site Settings
CREATE POLICY "Public view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage site settings" ON public.site_settings FOR ALL USING (public.has_role('ADMIN'));

-- 14. Notifications
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System/Staff create notifications" ON public.notifications FOR INSERT WITH CHECK (public.has_role('STAFF'));

-- 15. Audit Logs
CREATE POLICY "Admins view audit logs" ON public.audit_logs FOR SELECT USING (public.has_role('ADMIN'));
CREATE POLICY "Staff insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (public.has_role('STAFF'));
