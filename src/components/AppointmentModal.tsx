import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Smartphone,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';
import { Appointment } from '../types';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppointmentBooked: (appt: Appointment) => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onAppointmentBooked,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState('Đăng ký cư trú / Tạm trú');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('08:00 - 09:00');
  const [notes, setNotes] = useState('');

  const [bookingCode, setBookingCode] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const timeSlots = [
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
  ];

  const purposes = [
    'Đăng ký cư trú / Tạm trú',
    'Kích hoạt Định danh điện tử VNeID Mức 2',
    'Cấp giấy xác nhận thông tin cư trú (Mẫu CT07)',
    'Nộp hồ sơ An toàn PCCC',
    'Trao đổi / Phản ánh trực tiếp với Ban chỉ huy',
    'Nội dung công tác khác',
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Vui lòng nhập họ và tên';
    if (!phone.trim() || !/^[0-9]{9,11}$/.test(phone.replace(/\s/g, ''))) {
      errs.phone = 'Vui lòng nhập số điện thoại hợp lệ';
    }
    if (!date) errs.date = 'Vui lòng chọn ngày muốn làm việc';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const code = `DL-2026-${randomNum}`;

    const newAppt: Appointment = {
      id: `appt-${Date.now()}`,
      bookingCode: code,
      fullName,
      phone,
      purpose,
      date,
      timeSlot,
      notes,
      createdAt: new Date().toLocaleString('vi-VN'),
      status: 'Đã đăng ký',
    };

    onAppointmentBooked(newAppt);
    setBookingCode(code);
  };

  const handleCopyCode = () => {
    if (bookingCode) {
      navigator.clipboard.writeText(bookingCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleResetAndClose = () => {
    setFullName('');
    setPhone('');
    setPurpose('Đăng ký cư trú / Tạm trú');
    setDate('');
    setTimeSlot('08:00 - 09:00');
    setNotes('');
    setBookingCode(null);
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-emerald-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 p-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400 text-emerald-950">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-amber-300 uppercase tracking-tight">
                ĐẶT LỊCH LÀM VIỆC TẠI TRỤ SỞ
              </h3>
              <p className="text-[11px] text-emerald-100">Đăng ký hẹn giờ tiếp công dân Công an xã Pơng Drang</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {bookingCode ? (
            /* Success Screen */
            <div className="py-4 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-lg font-black text-slate-900">ĐĂNG KÝ ĐẶT LỊCH THÀNH CÔNG!</h4>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  Hệ thống đã tiếp nhận lịch hẹn của ông/bà <strong>{fullName}</strong> vào ngày{' '}
                  <span className="text-emerald-700 font-bold">{date}</span> (khung giờ {timeSlot}).
                </p>
              </div>

              {/* Code display */}
              <div className="p-3.5 bg-amber-50 border-2 border-dashed border-amber-400 rounded-2xl max-w-xs mx-auto">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                  MÃ ĐẶT LỊCH HẸN
                </span>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-xl font-black text-emerald-900 tracking-wider">
                    {bookingCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="p-1.5 rounded-lg bg-amber-200 text-amber-900 hover:bg-amber-300 transition-colors"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Required Warning Disclaimer */}
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-left text-xs text-amber-900 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">CẢNH BÁO PHIÊN BẢN DEMO:</strong>
                  <span>
                    Chức năng đặt lịch trong phiên bản demo. Lịch chính thức chỉ có giá trị khi được cơ quan tiếp nhận xác nhận.
                  </span>
                </div>
              </div>

              <button
                onClick={handleResetAndClose}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md active:scale-98 transition-all"
              >
                HOÀN TẤT & ĐÓNG
              </button>
            </div>
          ) : (
            /* Input Form */
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Mandatory Disclaimer Box */}
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                <span className="leading-tight">
                  Chức năng đặt lịch trong phiên bản demo. Lịch chính thức chỉ có giá trị khi được cơ quan tiếp nhận xác nhận.
                </span>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Họ và tên người đăng ký <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ví dụ: Tran Van B"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-emerald-600 outline-none transition-all"
                  />
                </div>
                {errors.fullName && <p className="text-[10px] text-red-600 font-semibold mt-1">{errors.fullName}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Số điện thoại liên hệ <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0987xxxxxx"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-emerald-600 outline-none transition-all"
                  />
                </div>
                {errors.phone && <p className="text-[10px] text-red-600 font-semibold mt-1">{errors.phone}</p>}
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Nội dung cần làm việc</label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-emerald-600 outline-none transition-all"
                  >
                    {purposes.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Ngày muốn hẹn <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-emerald-600 outline-none transition-all"
                  />
                  {errors.date && <p className="text-[10px] text-red-600 font-semibold mt-1">{errors.date}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Khung giờ tiếp nhận</label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-emerald-600 outline-none transition-all"
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Ghi chú thêm (Tùy chọn)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ghi chú thêm nếu có (ví dụ: cần tư vấn trường hợp nhập khẩu từ nơi khác)..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-emerald-600 outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-900 hover:to-emerald-950 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-amber-300" />
                <span>XÁC NHẬN ĐẶT LỊCH HẸN</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
