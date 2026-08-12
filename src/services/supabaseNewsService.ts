import { supabase } from './supabaseClient';
import { NewsItem, Announcement, FAQItem, BannerItem } from '../types';
import { INewsService, IAnnouncementService } from '../types/services';

export class SupabaseNewsService implements INewsService {
  async getNews(includeDrafts?: boolean): Promise<NewsItem[]> {
    if (!supabase) return [];

    let query = supabase.from('news').select('*').order('published_at', { ascending: false });
    if (!includeDrafts) {
      query = query.eq('status', 'PUBLISHED');
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((n) => ({
      id: n.id,
      title: n.title,
      summary: n.summary || '',
      content: n.content || '',
      category: 'Hoạt động',
      date: new Date(n.published_at || n.created_at).toLocaleDateString('vi-VN'),
      imageUrl: n.cover_image_url || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
      author: 'Công an xã Pơng Drang'
    }));
  }

  async getNewsById(id: string): Promise<NewsItem | null> {
    if (!supabase) return null;

    const { data, error } = await supabase.from('news').select('*').eq('id', id).single();
    if (error || !data) return null;

    return {
      id: data.id,
      title: data.title,
      summary: data.summary || '',
      content: data.content || '',
      category: 'Hoạt động',
      date: new Date(data.published_at || data.created_at).toLocaleDateString('vi-VN'),
      imageUrl: data.cover_image_url || '',
      author: 'Công an xã Pơng Drang'
    };
  }

  async saveNews(news: Partial<NewsItem>): Promise<NewsItem> {
    if (!supabase) throw new Error('Supabase Client chưa được khởi tạo.');

    const payload = {
      title: news.title || 'Tin tức mới',
      slug: (news.title || 'news').toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      summary: news.summary || '',
      content: news.content || '',
      cover_image_url: news.imageUrl || '',
      status: 'PUBLISHED'
    };

    if (news.id) {
      const { data, error } = await supabase.from('news').update(payload).eq('id', news.id).select().single();
      if (error || !data) throw new Error('Lỗi cập nhật tin tức');
      return {
        id: data.id,
        title: data.title,
        summary: data.summary || '',
        content: data.content || '',
        category: 'Hoạt động',
        date: new Date(data.published_at || data.created_at).toLocaleDateString('vi-VN'),
        imageUrl: data.cover_image_url || ''
      };
    } else {
      const { data, error } = await supabase.from('news').insert(payload).select().single();
      if (error || !data) throw new Error('Lỗi tạo tin tức');
      return {
        id: data.id,
        title: data.title,
        summary: data.summary || '',
        content: data.content || '',
        category: 'Hoạt động',
        date: new Date(data.published_at || data.created_at).toLocaleDateString('vi-VN'),
        imageUrl: data.cover_image_url || ''
      };
    }
  }

  async deleteNews(id: string): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from('news').delete().eq('id', id);
    return !error;
  }
}

export class SupabaseAnnouncementService implements IAnnouncementService {
  async getAnnouncements(includeDrafts?: boolean): Promise<Announcement[]> {
    if (!supabase) return [];

    let query = supabase.from('announcements').select('*').order('published_at', { ascending: false });
    if (!includeDrafts) {
      query = query.eq('status', 'PUBLISHED');
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((a) => ({
      id: a.id,
      title: a.title,
      summary: a.content || '',
      content: a.content || '',
      date: new Date(a.published_at || a.created_at).toLocaleDateString('vi-VN'),
      category: 'An ninh',
      important: a.priority === 'URGENT' || a.priority === 'IMPORTANT'
    }));
  }

  async saveAnnouncement(announcement: Partial<Announcement>): Promise<Announcement> {
    if (!supabase) throw new Error('Supabase Client chưa được khởi tạo.');

    const payload = {
      title: announcement.title || 'Thông báo mới',
      content: announcement.content || announcement.summary || '',
      priority: announcement.important ? 'URGENT' : 'NORMAL',
      status: 'PUBLISHED'
    };

    if (announcement.id) {
      const { data, error } = await supabase.from('announcements').update(payload).eq('id', announcement.id).select().single();
      if (error || !data) throw new Error('Lỗi cập nhật thông báo');
      return {
        id: data.id,
        title: data.title,
        summary: data.content || '',
        content: data.content || '',
        date: new Date(data.published_at || data.created_at).toLocaleDateString('vi-VN'),
        category: 'An ninh',
        important: data.priority === 'URGENT'
      };
    } else {
      const { data, error } = await supabase.from('announcements').insert(payload).select().single();
      if (error || !data) throw new Error('Lỗi tạo thông báo');
      return {
        id: data.id,
        title: data.title,
        summary: data.content || '',
        content: data.content || '',
        date: new Date(data.published_at || data.created_at).toLocaleDateString('vi-VN'),
        category: 'An ninh',
        important: data.priority === 'URGENT'
      };
    }
  }

  async deleteAnnouncement(id: string): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    return !error;
  }
}
