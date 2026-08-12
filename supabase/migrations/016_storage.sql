-- Migration 016: Storage Setup & Bucket RLS Policies

-- Create Buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('public-assets', 'public-assets', true),
    ('news-images', 'news-images', true),
    ('report-attachments', 'report-attachments', false), -- PRIVATE BUCKET FOR SECURITY REPORTS
    ('avatars', 'avatars', false)
ON CONFLICT (id) DO NOTHING;

-- Public assets policies
CREATE POLICY "Public Read Assets" ON storage.objects FOR SELECT USING (bucket_id IN ('public-assets', 'news-images'));
CREATE POLICY "Editors Upload News Images" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'news-images' AND public.has_role('EDITOR')
);

-- Report Attachments storage policies (Private)
CREATE POLICY "Public Upload Report Attachments" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'report-attachments'
);

CREATE POLICY "Staff Read Report Attachments" ON storage.objects FOR SELECT USING (
    bucket_id = 'report-attachments' AND public.has_role('STAFF')
);
