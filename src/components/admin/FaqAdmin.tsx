import React, { useState, useEffect } from 'react';
import { FAQItem } from '../../types';
import { dataService } from '../../services/dataService';
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  CheckCircle2,
  X
} from 'lucide-react';

export const FaqAdmin: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<Partial<FAQItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    setLoading(true);
    const data = await dataService.getFaqs(true);
    setFaqs(data);
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleOpenAdd = () => {
    setEditingItem({
      question: '',
      answer: '',
      category: 'Thủ tục',
      hidden: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: FAQItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleToggleHide = async (item: FAQItem) => {
    await dataService.updateFaq(item.id, { hidden: !item.hidden });
    await loadFaqs();
    showToast(`Đã ${item.hidden ? 'hiện' : 'ẩn'} câu hỏi FAQ`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
      await dataService.deleteFaq(id);
      await loadFaqs();
      showToast('Đã xóa câu hỏi FAQ');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.question || !editingItem?.answer) {
      alert('Vui lòng điền đủ Câu hỏi và Câu trả lời!');
      return;
    }

    if (editingItem.id) {
      await dataService.updateFaq(editingItem.id, editingItem);
      showToast('Cập nhật câu hỏi FAQ thành công!');
    } else {
      await dataService.addFaq(editingItem as Omit<FAQItem, 'id'>);
      showToast('Thêm câu hỏi FAQ mới thành công!');
    }

    setIsModalOpen(false);
    setEditingItem(null);
    await loadFaqs();
  };

  const filtered = faqs.filter((item) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            placeholder="Tìm câu hỏi FAQ..."
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
          <span>Thêm câu hỏi FAQ</span>
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs font-medium">Đang tải FAQ...</div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 p-6">
          <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold">Chưa có câu hỏi FAQ nào</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 bg-white rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                item.hidden ? 'opacity-60 border-slate-200 bg-slate-50' : 'border-slate-200/90 shadow-2xs'
              }`}
            >
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-indigo-900 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  {item.hidden && (
                    <span className="text-[10px] text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full font-bold">
                      Đang ẩn
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-900">
                  Q: {item.question}
                </h4>
                <p className="text-[11px] text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  A: {item.answer}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0 w-full sm:w-auto justify-end">
                <button
                  onClick={() => handleToggleHide(item)}
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
                <HelpCircle className="w-4 h-4 text-amber-300" />
                {editingItem.id ? 'Sửa câu hỏi FAQ' : 'Thêm câu hỏi FAQ mới'}
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
                <label className="block font-bold text-slate-700 mb-1">Danh mục FAQ</label>
                <select
                  value={editingItem.category || 'Thủ tục'}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 font-medium"
                >
                  <option value="An ninh">An ninh</option>
                  <option value="Thủ tục">Thủ tục</option>
                  <option value="Lịch làm việc">Lịch làm việc</option>
                  <option value="Chung">Chung</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Câu hỏi *</label>
                <input
                  type="text"
                  required
                  value={editingItem.question || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, question: e.target.value })}
                  placeholder="Nhập câu hỏi thường gặp..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Câu trả lời chi tiết *</label>
                <textarea
                  rows={5}
                  required
                  value={editingItem.answer || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, answer: e.target.value })}
                  placeholder="Nhập câu trả lời chi tiết cho công dân..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="hideFaq"
                  checked={editingItem.hidden || false}
                  onChange={(e) => setEditingItem({ ...editingItem, hidden: e.target.checked })}
                  className="w-4 h-4 text-red-700 rounded focus:ring-red-600"
                />
                <label htmlFor="hideFaq" className="font-bold text-slate-700 cursor-pointer">
                  Ẩn khỏi ứng dụng
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
                  Lưu FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
