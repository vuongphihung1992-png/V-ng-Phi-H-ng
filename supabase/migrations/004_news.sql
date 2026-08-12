-- Migration 004: News & Categories
CREATE TABLE IF NOT EXISTS public.news_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT,
    content TEXT,
    category_id UUID REFERENCES public.news_categories(id),
    cover_image_url TEXT,
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    author_id UUID REFERENCES public.profiles(id),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

DROP TRIGGER IF EXISTS trg_news_updated_at ON public.news;
CREATE TRIGGER trg_news_updated_at
    BEFORE UPDATE ON public.news
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed Default Categories
INSERT INTO public.news_categories (name, slug, description) VALUES
('Tin tức', 'tin-tuc', 'Tin tức hoạt động chung của Công an xã Pơng Drang'),
('Thông báo', 'thong-bao', 'Thông báo chỉ đạo, lịch làm việc chính thức'),
('Hoạt động', 'hoat-dong', 'Hoạt động phong trào, gắn kết Nhân dân'),
('An ninh trật tự', 'an-ninh-trat-tu', 'Tin tức tình hình an ninh trật tự địa bàn'),
('Phòng chống tội phạm', 'phong-chong-toi-pham', 'Cảnh báo chiêu trò lừa đảo, tội phạm'),
('Phổ biến pháp luật', 'pho-bien-phap-luat', 'Tuyên truyền luật căn cước, VNeID, cư trú')
ON CONFLICT (slug) DO NOTHING;
