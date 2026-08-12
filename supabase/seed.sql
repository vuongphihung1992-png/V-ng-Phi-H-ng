-- ============================================================
-- SUPABASE SEED DATA
-- CÔNG AN XÃ PƠNG DRANG – ĐẮK LẮK
-- ============================================================

-- News Categories
INSERT INTO public.news_categories (name, slug) VALUES
('An ninh trật tự', 'an-ninh-trat-tu'),
('Phòng chống lừa đảo', 'phong-chong-lua-dao'),
('Tuyên truyền pháp luật', 'tuyen-truyen-phap-luat'),
('Hoạt động phong trào', 'hoat-dong-phong-trao')
ON CONFLICT (name) DO NOTHING;

-- Initial FAQs
INSERT INTO public.faqs (question, answer, category, sort_order) VALUES
('Thời gian tiếp công dân giải quyết thủ tục hành chính?', 'Công an xã Pơng Drang tiếp công dân từ thứ 2 đến thứ 6 hàng tuần (Sáng 07h30 - 11h30, Chiều 13h30 - 17h00). Thứ 7 làm việc buổi sáng từ 08h00 - 11h00. Tổ Trực ban Cảnh sát phòng chống tội phạm trực 24/24h.', 'Thủ tục hành chính', 1),
('Cách phản ánh tin báo an ninh trật tự khẩn cấp?', 'Người dân có thể phản ánh trực tiếp qua Cổng thông tin này tại mục "Phản ánh ANTT", hoặc gọi đường dây nóng trực ban: 0262 3876 113 để cán bộ phản ứng nhanh.', 'An ninh trật tự', 2),
('Thủ tục đăng ký tạm trú, khai báo tạm vắng thực hiện ở đâu?', 'Người dân thực hiện đăng ký qua Cổng Dịch vụ công Quốc gia hoặc đến trực tiếp Bộ phận Một cửa Công an xã Pơng Drang để được hướng dẫn.', 'Cư trú & VNeID', 3)
ON CONFLICT DO NOTHING;

-- Initial Banners
INSERT INTO public.banners (title, subtitle, image_url, active, sort_order) VALUES
('CÔNG AN XÃ PƠNG DRANG', '"Vì nước quên thân, vì dân phục vụ"', 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1000&q=80', true, 1)
ON CONFLICT DO NOTHING;
