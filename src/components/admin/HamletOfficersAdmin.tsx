import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ShieldCheck, MapPin, Search, Save, X, Phone, UserCheck, RefreshCw } from 'lucide-react';
import { HamletOfficer } from '../../types';
import { dataService } from '../../services/dataService';
import { HAMLETS } from '../../data/mockData';

export const HamletOfficersAdmin: React.FC = () => {
  const [officers, setOfficers] = useState<HamletOfficer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFilterHamlet, setSelectedFilterHamlet] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form State
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingOfficer, setEditingOfficer] = useState<HamletOfficer | null>(null);
  const [formData, setFormData] = useState<Partial<HamletOfficer>>({
    hamletId: '1',
    hamletName: 'Thôn 1',
    fullName: '',
    rank: 'Đại úy CAND',
    position: 'Cảnh sát khu vực',
    phone: '',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    notes: ''
  });
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadOfficers();
  }, []);

  const loadOfficers = async () => {
    setLoading(true);
    try {
      const data = await dataService.getHamletOfficers();
      setOfficers(data);
    } catch (e) {
      console.error('Error loading officers in admin', e);
    } finally {
      setLoading(false);
    }
  };

  const hamlets = HAMLETS;

  const handleOpenAddForm = () => {
    setEditingOfficer(null);
    const targetId = selectedFilterHamlet !== 'all' ? selectedFilterHamlet : '1';
    const hObj = HAMLETS.find((h) => h.id === targetId);
    setFormData({
      hamletId: targetId,
      hamletName: hObj ? hObj.name : `Thôn ${targetId}`,
      fullName: '',
      rank: 'Đại úy CAND',
      position: 'Cảnh sát khu vực',
      phone: '',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      notes: ''
    });
    setShowForm(true);
  };

  const handleOpenEditForm = (officer: HamletOfficer) => {
    setEditingOfficer(officer);
    setFormData({ ...officer });
    setShowForm(true);
  };

  const handleHamletChangeInForm = (id: string) => {
    const hObj = HAMLETS.find((h) => h.id === id);
    setFormData((prev) => ({
      ...prev,
      hamletId: id,
      hamletName: hObj ? hObj.name : `Thôn ${id}`
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      setMessage({ type: 'error', text: 'Vui lòng nhập đầy đủ Họ tên và Số điện thoại cán bộ!' });
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      await dataService.saveHamletOfficer({
        ...formData,
        id: editingOfficer?.id
      });
      setMessage({
        type: 'success',
        text: editingOfficer ? 'Đã cập nhật thông tin cán bộ!' : 'Đã thêm cán bộ quản lý thôn mới!'
      });
      setShowForm(false);
      await loadOfficers();
    } catch (err) {
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi lưu thông tin.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa thông tin cán bộ "${name}"?`)) return;

    try {
      await dataService.deleteHamletOfficer(id);
      setMessage({ type: 'success', text: `Đã xóa cán bộ "${name}".` });
      await loadOfficers();
    } catch (e) {
      setMessage({ type: 'error', text: 'Không thể xóa dữ liệu cán bộ.' });
    }
  };

  const filteredOfficers = officers.filter((o) => {
    const matchesHamlet = selectedFilterHamlet === 'all' || o.hamletId === selectedFilterHamlet;
    const matchesSearch =
      searchQuery.trim() === '' ||
      o.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery) ||
      o.rank.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.position.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesHamlet && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-sm font-black text-red-950 uppercase tracking-wide flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-700" />
            QUẢN LÝ CÁN BỘ PHỤ TRÁCH 12 THÔN
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cập nhật hình thẻ, họ tên, cấp bậc, chức vụ và số điện thoại cán bộ trực thuộc 12 Thôn Xã Pơng Drang.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadOfficers}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
            title="Tải lại dữ liệu"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenAddForm}
            className="px-3.5 py-2 bg-red-800 hover:bg-red-900 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Cán bộ Thôn</span>
          </button>
        </div>
      </div>

      {/* Alert Notification */}
      {message && (
        <div
          className={`p-3 rounded-xl text-xs font-bold flex items-center justify-between ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-red-50 text-red-900 border border-red-200'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Filter bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Hamlet Filter */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">
              LỌC THEO THÔN (12 THÔN):
            </label>
            <select
              value={selectedFilterHamlet}
              onChange={(e) => setSelectedFilterHamlet(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="all">Tất cả 12 Thôn</option>
              {hamlets.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Query */}
          <div className="sm:col-span-2">
            <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">
              TÌM KIẾM TÊN HOẶC SỐ ĐIỆN THOẠI:
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Nhập tên cán bộ, cấp bậc, số điện thoại..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Officers List Table / Cards */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs font-medium animate-pulse">
          Đang tải dữ liệu cán bộ địa bàn...
        </div>
      ) : filteredOfficers.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200">
          <p className="text-xs font-bold text-slate-600">Chưa có dữ liệu cán bộ cho lựa chọn này</p>
          <button
            onClick={handleOpenAddForm}
            className="mt-3 px-3 py-1.5 bg-red-800 text-white font-bold text-xs rounded-xl inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Thêm cán bộ mới
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredOfficers.map((o) => (
            <div
              key={o.id}
              className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-2xs hover:border-amber-400 transition-all flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3 min-w-0">
                <img
                  src={o.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={o.fullName}
                  className="w-14 h-18 object-cover rounded-xl border border-red-900/30 shrink-0 bg-slate-100"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                      {o.hamletName}
                    </span>
                    <span className="text-[10px] font-bold bg-red-50 text-red-800 px-1.5 py-0.5 rounded border border-red-200">
                      {o.rank}
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-slate-900 mt-1 truncate">
                    {o.fullName}
                  </h4>

                  <p className="text-[11px] font-bold text-red-900 mt-0.5 truncate">
                    {o.position}
                  </p>

                  <p className="text-xs font-bold text-slate-700 mt-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-red-700" />
                    <span>{o.phone}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-1.5 shrink-0">
                <button
                  onClick={() => handleOpenEditForm(o)}
                  className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors"
                  title="Sửa thông tin"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(o.id, o.fullName)}
                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl transition-colors"
                  title="Xóa cán bộ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-red-950 to-amber-950 text-white p-4 flex items-center justify-between border-b border-amber-500/30">
              <h3 className="text-xs sm:text-sm font-black uppercase text-amber-200 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-400" />
                {editingOfficer ? 'CẬP NHẬT CÁN BỘ QUẢN LÝ THÔN' : 'THÊM CÁN BỘ QUẢN LÝ THÔN MỚI'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 text-xs">
              {/* Select Hamlet */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  ĐỊA BÀN QUẢN LÝ (THÔN): <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.hamletId}
                  onChange={(e) => handleHamletChangeInForm(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  {hamlets.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Full Name & Rank */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    HỌ VÀ TÊN CÁN BỘ: <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn An"
                    value={formData.fullName || ''}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    CẤP BẬC MAND:
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Đại úy CAND, Thiếu tá CAND..."
                    value={formData.rank || ''}
                    onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              {/* Position & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    CHỨC VỤ / PHỤ TRÁCH: <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Cảnh sát khu vực Thôn 1"
                    value={formData.position || ''}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    SỐ ĐIỆN THOẠI TRỰC BÀN: <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 0988.123.456"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              {/* Avatar URL */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  ĐƯỜNG DẪN HÌNH THẺ CÁN BỘ (AVATAR URL):
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.avatarUrl || ''}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Nhập URL ảnh thẻ chân dung cán bộ.
                </p>
              </div>

              {/* Notes */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  GHI CHÚ / PHỤ TRÁCH ĐỊA BÀN NỔI BẬT:
                </label>
                <textarea
                  rows={2}
                  placeholder="VD: Phụ trách Tổ dân phố 1, 2 và khu vực Chợ Pơng Drang"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              {/* Form Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-red-800 hover:bg-red-900 text-white font-bold rounded-xl shadow-xs transition-all flex items-center gap-1"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Đang lưu...' : 'Lưu thông tin'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
