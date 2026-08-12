import React, { useState, useEffect } from 'react';
import { BannerItem } from '../../types';
import { dataService } from '../../services/dataService';
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Eye,
  EyeOff
} from 'lucide-react';

export const BannersAdmin: React.FC = () => {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<BannerItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    setLoading(true);
    const data = await dataService.getBanners();
    setBanners(data);
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleOpenAdd = () => {
    setEditingItem({
      title: 'ỨNG DỤNG CÔNG AN XÃ PƠNG DRANG',
      subtitle: '"Vì nước quên thân, vì dân phục vụ"',
      imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1000&q=80',
      active: true,
      tagText: 'Tỉnh Đắk Lắk',
      actionText: 'Phản ánh ngay'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: BannerItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (item: BannerItem) => {
    await dataService.updateBanner(item.id, { active: !item.active });
    await loadBanners();
    showToast(`Đã ${item.active ? 'tắt' : 'bật'} banner`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa banner này?')) {
      await dataService.deleteBanner(id);
      await loadBanners();
      showToast('Đã xóa banner');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title || !editingItem?.imageUrl) {
      alert('Vui lòng nhập Tiêu đề và Link ảnh cho Banner!');
      return;
    }

    if (editingItem.id) {
      await dataService.updateBanner(editingItem.id, editingItem);
      showToast('Cập nhật Banner thành công!');
    } else {
      await dataService.addBanner(editingItem as Omit<BannerItem, 'id'>);
      showToast('Thêm Banner mới thành công!');
    }

    setIsModalOpen(false);
    setEditingItem(null);
    await loadBanners();
  };

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toastMessage && (
        <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h3 className="text-xs font-black text-slate-900 uppercase">QUẢN LÝ BANNER HERO</h3>
          <p className="text-[11px] text-slate-500">Quản lý hình ảnh và khẩu hiệu hiển thị ở đầu trang chủ</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="py-2 px-4 rounded-xl bg-red-800 hover:bg-red-900 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Banner mới</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs font-medium">Đang tải Banner...</div>
      ) : banners.length === 0 ? (
        <div className="py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 p-6">
          <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold">Chưa có Banner nào được tạo</p>
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map((item) => (
            <div
              key={item.id}
              className={`p-3 bg-white rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                !item.active ? 'opacity-60 border-slate-200 bg-slate-50' : 'border-slate-200/90 shadow-2xs'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-24 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {item.tagText && (
                      <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        {item.tagText}
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.active
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {item.active ? 'KÍCH HOẠT' : 'ĐANG TẮT'}
                    </span>
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 italic line-clamp-1">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0 w-full sm:w-auto justify-end">
                <button
                  onClick={() => handleToggleActive(item)}
                  className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                    item.active
                      ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  {item.active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span className="text-[10px]">{item.active ? 'Tắt' : 'Bật'}</span>
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
                <ImageIcon className="w-4 h-4 text-amber-300" />
                {editingItem.id ? 'Sửa Banner' : 'Thêm Banner mới'}
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
                <label className="block font-bold text-slate-700 mb-1">Tiêu đề chính trên Banner *</label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="ỨNG DỤNG CÔNG AN XÃ..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 font-extrabold uppercase"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Khẩu hiệu / Subtitle</label>
                <input
                  type="text"
                  value={editingItem.subtitle || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, subtitle: e.target.value })}
                  placeholder='"Vì nước quên thân, vì dân phục vụ"'
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 italic"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Link Ảnh nền Banner (URL) *</label>
                <input
                  type="text"
                  required
                  value={editingItem.imageUrl || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nhãn địa phương</label>
                  <input
                    type="text"
                    value={editingItem.tagText || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, tagText: e.target.value })}
                    placeholder="Tỉnh Đắk Lắk"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tên nút bấm nhanh</label>
                  <input
                    type="text"
                    value={editingItem.actionText || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, actionText: e.target.value })}
                    placeholder="Phản ánh ngay"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeBanner"
                  checked={editingItem.active || false}
                  onChange={(e) => setEditingItem({ ...editingItem, active: e.target.checked })}
                  className="w-4 h-4 text-red-700 rounded focus:ring-red-600"
                />
                <label htmlFor="activeBanner" className="font-bold text-slate-700 cursor-pointer">
                  Kích hoạt hiển thị Banner này trên trang chủ
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
                  Lưu Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
