import React, { useState, useEffect } from 'react';
import { SecurityReport } from '../../types';
import { dataService } from '../../services/dataService';
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  Clock,
  User,
  Phone,
  MapPin,
  AlertTriangle,
  FileText,
  X,
  Trash2,
  MessageSquare
} from 'lucide-react';

export const ReportsAdmin: React.FC = () => {
  const [reports, setReports] = useState<SecurityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeReport, setActiveReport] = useState<SecurityReport | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    const data = await dataService.getReports();
    setReports(data);
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleUpdateStatus = async (
    id: string,
    newStatus: SecurityReport['status']
  ) => {
    await dataService.updateReportStatus(id, newStatus, adminNotes);
    await loadReports();
    if (activeReport && activeReport.id === id) {
      setActiveReport({ ...activeReport, status: newStatus, adminNotes });
    }
    showToast(`Đã cập nhật trạng thái phản ánh thành: ${newStatus}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phản ánh này?')) {
      await dataService.deleteReport(id);
      await loadReports();
      if (activeReport?.id === id) setActiveReport(null);
      showToast('Đã xóa hồ sơ phản ánh');
    }
  };

  const filteredReports = reports.filter((item) => {
    const matchesSearch =
      item.receiptCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());

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

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Tìm theo Mã hồ sơ, Họ tên, SĐT, loại tin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600/30 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 overflow-x-auto pb-1 sm:pb-0">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-600/30 bg-slate-50"
          >
            <option value="all">Tất cả trạng thái ({reports.length})</option>
            <option value="Đã tiếp nhận">Đã tiếp nhận</option>
            <option value="Đang xác minh">Đang xác minh</option>
            <option value="Đã xử lý">Đã xử lý</option>
            <option value="Từ chối">Từ chối</option>
          </select>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs font-medium">Đang tải phản ánh...</div>
      ) : filteredReports.length === 0 ? (
        <div className="py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 p-6">
          <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold">Chưa có thông tin phản ánh nào khớp với bộ lọc</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredReports.map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-amber-400/50 transition-all flex flex-col sm:flex-row items-start justify-between gap-3"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-black text-red-900 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-lg">
                    {item.receiptCode}
                  </span>

                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      item.urgency === 'Rất khẩn cấp'
                        ? 'bg-red-600 text-white animate-pulse'
                        : item.urgency === 'Khẩn cấp'
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.urgency}
                  </span>

                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      item.status === 'Đã xử lý'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : item.status === 'Đang xác minh'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : item.status === 'Từ chối'
                        ? 'bg-slate-100 text-slate-500 border-slate-200'
                        : 'bg-blue-50 text-blue-800 border-blue-200'
                    }`}
                  >
                    {item.status}
                  </span>

                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium ml-auto">
                    <Clock className="w-3 h-3" />
                    {item.createdAt}
                  </span>
                </div>

                <div className="pt-1">
                  <p className="text-xs font-black text-slate-900">
                    {item.type}
                  </p>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 bg-slate-50 p-2 rounded-xl border border-slate-100 italic">
                    "{item.content}"
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
                  {item.address && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {item.address}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0 w-full sm:w-auto justify-end">
                <button
                  onClick={() => {
                    setActiveReport(item);
                    setAdminNotes(item.adminNotes || '');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-red-800 hover:bg-red-900 text-white font-bold text-xs shadow-2xs transition-all flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Xử lý phản ánh</span>
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  title="Xóa hồ sơ"
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-700 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAIL & STATUS UPDATE MODAL */}
      {activeReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 my-8 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-red-900 to-red-950 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-300 bg-red-950 px-2 py-0.5 rounded border border-amber-400/30">
                  CHI TIẾT PHẢN ÁNH
                </span>
                <h3 className="text-sm font-black text-amber-200 mt-0.5">
                  Mã hồ sơ: {activeReport.receiptCode}
                </h3>
              </div>
              <button
                onClick={() => setActiveReport(null)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4 text-xs">
              {/* Citizen Information */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium">
                  <span>Thời gian gửi: {activeReport.createdAt}</span>
                  <span className="font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Mức độ: {activeReport.urgency}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 font-semibold text-slate-800">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Người gửi:</span>
                    {activeReport.fullName}
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Số điện thoại:</span>
                    <a href={`tel:${activeReport.phone}`} className="text-red-700 underline font-bold">
                      {activeReport.phone}
                    </a>
                  </div>
                </div>
                {activeReport.address && (
                  <div className="pt-1">
                    <span className="text-slate-400 text-[10px] block">Địa chỉ xảy ra vụ việc:</span>
                    <span className="font-medium text-slate-700">{activeReport.address}</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div>
                <label className="block font-black text-slate-900 mb-1">
                  Loại thông tin: <span className="text-red-700">{activeReport.type}</span>
                </label>
                <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200 text-slate-800 leading-relaxed font-medium">
                  {activeReport.content}
                </div>
              </div>

              {/* Admin Note / Action Input */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="block font-bold text-slate-800 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-red-700" />
                  Ghi chú chỉ đạo / Kết quả xử lý của Cán bộ:
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Nhập ghi chú phản hồi nội bộ hoặc lý do xử lý..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 text-xs"
                />
              </div>

              {/* Change Status Buttons */}
              <div className="space-y-2 pt-1">
                <span className="block font-bold text-slate-700 text-[11px]">
                  Cập nhật trạng thái xử lý:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(activeReport.id, 'Đã tiếp nhận')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                      activeReport.status === 'Đã tiếp nhận'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                    }`}
                  >
                    Đã tiếp nhận
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(activeReport.id, 'Đang xác minh')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                      activeReport.status === 'Đang xác minh'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    Đang xác minh
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(activeReport.id, 'Đã xử lý')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                      activeReport.status === 'Đã xử lý'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    Đã xử lý
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(activeReport.id, 'Từ chối')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                      activeReport.status === 'Từ chối'
                        ? 'bg-slate-700 text-white border-slate-700 shadow-xs'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    Từ chối
                  </button>
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  type="button"
                  onClick={() => setActiveReport(null)}
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
