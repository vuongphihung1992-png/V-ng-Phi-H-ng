import React, { useState, useEffect } from 'react';
import { Announcement } from '../../types';
import { dataService } from '../../services/dataService';
import {
  Bell,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  CheckCircle2,
  X,
  AlertTriangle,
  Calendar,
  Sparkles
} from 'lucide-react';

export const AnnouncementsAdmin: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<Partial<Announcement> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    setLoading(true);
    const data = await dataService.getAnnouncements(true);
    setAnnouncements(data);
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleOpenAdd = () => {
    setEditingItem({
      title: '',
      category: 'Thông báo',
      date: new Date().toLocaleDateString('vi-VN'),
      summary: '',
      content: '',
      isNew: true,
      important: false,
      hidden: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Announcement) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleToggleHide = async (item: Announcement) => {
    await dataService.updateAnnouncement(item.id, { hidden: !item.hidden });
    await loadAnnouncements();
    showToast(`Đã ${item.hidden ? 'hiện' : 'ẩn'} thông báo`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
      await dataService.deleteAnnouncement(id);
      await loadAnnouncements();
      showToast('Đã xóa thông báo');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title || !editingItem?.content) {
      alert('Vui lòng nhập đầy đủ Tiêu đề và Nội dung!');
      return;
    }

    if (editingItem.id) {
      await dataService.updateAnnouncement(editingItem.id, editingItem);
      showToast('Cập nhật thông báo thành công!');
    } else {
      await dataService.addAnnouncement(editingItem as Omit<Announcement, 'id'>);
      showToast('Thêm thông báo mới thành công!');
    }

    setIsModalOpen(false);
    setEditingItem(null);
    await loadAnnouncements();
  };

  const filtered = announcements.filter((item) =>
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
            placeholder="Tìm kiếm thông báo..."
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
          <span>Tạo thông báo mới</span>
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs font-medium">Đang tải dữ liệu...</div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 p-6">
          <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold">Chưa có thông báo nào</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`p-3 bg-white rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                item.hidden ? 'opacity-60 border-slate-200 bg-slate-50' : 'border-slate-200/90 shadow-2xs'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                    <Calendar className="w-3 h-3" />
                    {item.date}
                  </span>
                  {item.important && (
                    <span className="text-[10px] text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Quan trọng
                    </span>
                  )}
                  {item.isNew && (
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Mới
                    </span>
                  )}
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

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0 w-full sm:w-auto justify-end">
                <button
                  onClick={() => handleToggleHide(item)}
                  title={item.hidden ? 'Hiện thông báo' : 'Ẩn thông báo'}
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
                <Bell className="w-4 h-4 text-amber-300" />
                {editingItem.id ? 'Chỉnh sửa thông báo' : 'Thêm thông báo mới'}
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
                <label className="block font-bold text-slate-700 mb-1">Tiêu đề thông báo *</label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="Nhập tiêu đề thông báo..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Danh mục</label>
                  <select
                    value={editingItem.category || 'An ninh'}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 font-medium"
                  >
                    <option value="An ninh">An ninh</option>
                    <option value="Hành chính">Hành chính</option>
                    <option value="Tiếp công dân">Tiếp công dân</option>
                    <option value="Cảnh báo">Cảnh báo</option>
                    <option value="Chung">Chung</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngày thông báo</label>
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
                <label className="block font-bold text-slate-700 mb-1">Tóm tắt ngắn</label>
                <textarea
                  rows={2}
                  value={editingItem.summary || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, summary: e.target.value })}
                  placeholder="Mô tả tóm tắt..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nội dung văn bản thông báo *</label>
                <textarea
                  rows={6}
                  required
                  value={editingItem.content || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                  placeholder="Nội dung chi tiết thông báo..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center gap-4 pt-1 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingItem.important || false}
                    onChange={(e) => setEditingItem({ ...editingItem, important: e.target.checked })}
                    className="w-4 h-4 text-red-700 rounded focus:ring-red-600"
                  />
                  <span>Đánh dấu QUAN TRỌNG</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingItem.isNew || false}
                    onChange={(e) => setEditingItem({ ...editingItem, isNew: e.target.checked })}
                    className="w-4 h-4 text-emerald-700 rounded focus:ring-emerald-600"
                  />
                  <span>Hiển thị nhãn "MỚI"</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingItem.hidden || false}
                    onChange={(e) => setEditingItem({ ...editingItem, hidden: e.target.checked })}
                    className="w-4 h-4 text-slate-700 rounded focus:ring-slate-600"
                  />
                  <span>Ẩn khỏi ứng dụng</span>
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
                  Lưu thông báo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
