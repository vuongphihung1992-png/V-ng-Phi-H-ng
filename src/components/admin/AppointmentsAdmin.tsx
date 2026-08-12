import React, { useState, useEffect } from 'react';
import { Appointment } from '../../types';
import { dataService } from '../../services/dataService';
import {
  Calendar,
  Search,
  CheckCircle2,
  Clock,
  User,
  Phone,
  FileText,
  X,
  Trash2,
  Check,
  XCircle,
  MessageSquare
} from 'lucide-react';

export const AppointmentsAdmin: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeAppt, setActiveAppt] = useState<Appointment | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    const data = await dataService.getAppointments();
    setAppointments(data);
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleUpdateStatus = async (
    id: string,
    newStatus: Appointment['status']
  ) => {
    await dataService.updateAppointmentStatus(id, newStatus, adminNotes);
    await loadAppointments();
    if (activeAppt && activeAppt.id === id) {
      setActiveAppt({ ...activeAppt, status: newStatus, adminNotes });
    }
    showToast(`Đã cập nhật lịch hẹn thành: ${newStatus}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch đăng ký này?')) {
      await dataService.deleteAppointment(id);
      await loadAppointments();
      if (activeAppt?.id === id) setActiveAppt(null);
      showToast('Đã xóa lịch đăng ký');
    }
  };

  const filtered = appointments.filter((item) => {
    const matchesSearch =
      item.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm) ||
      item.purpose.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === 'all' || item.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toastMessage && (
        <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Search & Status Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Tìm theo Mã đăng ký, Họ tên, SĐT, mục đích..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600/30 font-medium"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-600/30 bg-slate-50 shrink-0"
        >
          <option value="all">Tất cả lịch hẹn ({appointments.length})</option>
          <option value="Đã đăng ký">Đã đăng ký (Mới)</option>
          <option value="Đã xác nhận">Đã xác nhận</option>
          <option value="Đã hoàn thành">Đã hoàn thành</option>
          <option value="Đã hủy">Đã hủy</option>
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs font-medium">Đang tải lịch hẹn...</div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 p-6">
          <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold">Chưa có lịch hẹn đăng ký nào</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-emerald-400/50 transition-all flex flex-col sm:flex-row items-start justify-between gap-3"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-black text-emerald-950 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg">
                    {item.bookingCode}
                  </span>

                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      item.status === 'Đã hoàn thành'
                        ? 'bg-slate-100 text-slate-700 border-slate-200'
                        : item.status === 'Đã xác nhận'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : item.status === 'Đã hủy'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
                    }`}
                  >
                    {item.status}
                  </span>

                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium ml-auto">
                    <Clock className="w-3 h-3" />
                    Đăng ký: {item.createdAt}
                  </span>
                </div>

                <div className="pt-1">
                  <p className="text-xs font-black text-slate-900">
                    Mục đích: {item.purpose}
                  </p>
                  <p className="text-[11px] text-emerald-900 font-bold mt-0.5 flex items-center gap-2">
                    <span>📅 Ngày hẹn: <strong>{item.date}</strong></span>
                    <span>⏰ Khung giờ: <strong>{item.timeSlot}</strong></span>
                  </p>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1 flex-wrap">
                  <span className="flex items-center gap-1 font-bold text-slate-800">
                    <User className="w-3 h-3 text-red-700" />
                    {item.fullName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-red-700" />
                    {item.phone}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0 w-full sm:w-auto justify-end">
                <button
                  onClick={() => {
                    setActiveAppt(item);
                    setAdminNotes(item.adminNotes || '');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-2xs transition-all flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Xác nhận / Chi tiết</span>
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  title="Xóa lịch hẹn"
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-700 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAIL MODAL */}
      {activeAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 my-8 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-emerald-900 to-emerald-950 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-400/30">
                  CHI TIẾT ĐẶT LỊCH HẸN
                </span>
                <h3 className="text-sm font-black text-emerald-100 mt-0.5">
                  Mã đăng ký: {activeAppt.bookingCode}
                </h3>
              </div>
              <button
                onClick={() => setActiveAppt(null)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4 text-xs">
              <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-200 space-y-1.5">
                <div className="grid grid-cols-2 gap-2 text-slate-800 font-semibold">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Họ và tên công dân:</span>
                    {activeAppt.fullName}
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Số điện thoại liên hệ:</span>
                    <a href={`tel:${activeAppt.phone}`} className="text-red-700 underline font-bold">
                      {activeAppt.phone}
                    </a>
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-200/60 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Ngày đăng ký hẹn:</span>
                    <span className="font-bold text-emerald-950">{activeAppt.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Khung giờ làm việc:</span>
                    <span className="font-bold text-emerald-950">{activeAppt.timeSlot}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-900 mb-1">
                  Nội dung thủ tục / Mục đích làm việc:
                </label>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 font-medium">
                  {activeAppt.purpose}
                  {activeAppt.notes && (
                    <p className="mt-1.5 text-slate-500 italic text-[11px] border-t border-slate-200/60 pt-1.5">
                      Ghi chú thêm: "{activeAppt.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Admin Notes */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="block font-bold text-slate-800 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-700" />
                  Ghi chú sắp xếp / Phản hồi cho công dân:
                </label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Ví dụ: Vui lòng mang theo CCCD bản gốc & Sổ hộ khẩu cũ nếu có..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 text-xs"
                />
              </div>

              {/* Status change actions */}
              <div className="space-y-2 pt-1">
                <span className="block font-bold text-slate-700 text-[11px]">
                  Cập nhật trạng thái lịch hẹn:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(activeAppt.id, 'Đã đăng ký')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                      activeAppt.status === 'Đã đăng ký'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    Chờ xử lý
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(activeAppt.id, 'Đã xác nhận')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                      activeAppt.status === 'Đã xác nhận'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    Xác nhận hẹn
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(activeAppt.id, 'Đã hoàn thành')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                      activeAppt.status === 'Đã hoàn thành'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                    }`}
                  >
                    Hoàn thành
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(activeAppt.id, 'Đã hủy')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                      activeAppt.status === 'Đã hủy'
                        ? 'bg-rose-700 text-white border-rose-700 shadow-xs'
                        : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    Hủy lịch
                  </button>
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  type="button"
                  onClick={() => setActiveAppt(null)}
                  className="px-5 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
