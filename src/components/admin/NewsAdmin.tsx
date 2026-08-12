import React, { useState, useEffect } from 'react';
import { NewsItem } from '../../types';
import { dataService } from '../../services/dataService';
import {
  Newspaper,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  CheckCircle2,
  X,
  Image as ImageIcon,
  Calendar,
  User,
  Clock
} from 'lucide-react';

export const NewsAdmin: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<Partial<NewsItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    const data = await dataService.getNews(true);
    setNews(data);
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleOpenAdd = () => {
    setEditingItem({
      title: '',
      category: 'Hoạt động',
      date: new Date().toLocaleDateString('vi-VN'),
      summary: '',
      content: '',
      imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
      readTime: '3 phút đọc',
      author: 'Công an xã Pơng Drang',
      hidden: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: NewsItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleToggleHide = async (item: NewsItem) => {
    await dataService.updateNews(item.id, { hidden: !item.hidden });
    await loadNews();
    showToast(`Đã ${item.hidden ? 'hiện' : 'ẩn'} bài viết`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tin tức này?')) {
      await dataService.deleteNews(id);
      await loadNews();
      showToast('Đã xóa tin tức');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title || !editingItem?.content) {
      alert('Vui lòng nhập đầy đủ Tiêu đề và Nội dung bài viết!');
      return;
    }

    if (editingItem.id) {
      await dataService.updateNews(editingItem.id, editingItem);
      showToast('Cập nhật bài viết thành công!');
    } else {
      await dataService.addNews(editingItem as Omit<NewsItem, 'id'>);
      showToast('Thêm bài viết mới thành công!');
    }

    setIsModalOpen(false);
    setEditingItem(null);
    await loadNews();
  };

  const filteredNews = news.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toastMessage && (
        <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Tìm tin tức theo tiêu đề, danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600/30 font-medium"
          />
        </div>
        <button
          onClick={handleOpenAdd}
          className="py-2 px-4 rounded-xl bg-red-800 hover:bg-red-900 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm tin tức mới</span>
        </button>
      </div>

      {/* News Table / List */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs font-medium">Đang tải dữ liệu...</div>
      ) : filteredNews.length === 0 ? (
        <div className="py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 p-6">
          <Newspaper className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold">Chưa có bài viết tin tức nào</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredNews.map((item) => (
            <div
              key={item.id}
              className={`p-3 bg-white rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                item.hidden ? 'opacity-60 border-slate-200 bg-slate-50' : 'border-slate-200/90 shadow-2xs'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[10px] font-black uppercase text-red-800 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                    {item.hidden && (
                      <span className="text-[10px] text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full font-bold">
                        Đang ẩn
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {item.summary}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0 w-full sm:w-auto justify-end">
                <button
                  onClick={() => handleToggleHide(item)}
                  title={item.hidden ? 'Hiện bài viết' : 'Ẩn bài viết'}
                  className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                    item.hidden
                      ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {item.hidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span className="text-[10px]">{item.hidden ? 'Hiện' : 'Ẩn'}</span>
                </button>

                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-all flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold">Sửa</span>
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-all flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold">Xóa</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 my-8 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-red-900 to-red-950 text-white flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wide flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-amber-300" />
                {editingItem.id ? 'Chỉnh sửa tin tức' : 'Thêm bài viết tin tức'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiêu đề bài viết *</label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="Nhập tiêu đề tin tức..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Danh mục</label>
                  <select
                    value={editingItem.category || 'Hoạt động'}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 font-medium"
                  >
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Tuyên truyền">Tuyên truyền</option>
                    <option value="Cảnh báo tội phạm">Cảnh báo tội phạm</option>
                    <option value="Thủ tục HC">Thủ tục HC</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngày đăng</label>
                  <input
                    type="text"
                    value={editingItem.date || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                    placeholder="DD/MM/YYYY"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Link Ảnh minh họa (URL)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingItem.imageUrl || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tóm tắt ngắn</label>
                <textarea
                  rows={2}
                  value={editingItem.summary || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, summary: e.target.value })}
                  placeholder="Mô tả ngắn gọn nội dung bài viết..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nội dung chi tiết *</label>
                <textarea
                  rows={6}
                  required
                  value={editingItem.content || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                  placeholder="Nhập chi tiết bài viết..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="hideNews"
                  checked={editingItem.hidden || false}
                  onChange={(e) => setEditingItem({ ...editingItem, hidden: e.target.checked })}
                  className="w-4 h-4 text-red-700 rounded focus:ring-red-600"
                />
                <label htmlFor="hideNews" className="font-bold text-slate-700 cursor-pointer">
                  Ẩn bài viết khỏi ứng dụng người dân
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-800 text-white font-bold hover:bg-red-900 shadow-md"
                >
                  Lưu bài viết
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
