import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  UploadCloud,
  MapPin,
  Check,
  Copy,
  AlertCircle,
  FileCheck,
  Smartphone,
  User,
} from 'lucide-react';
import { SecurityReport } from '../types';

interface SecurityReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportSubmitted: (report: SecurityReport) => void;
}

export const SecurityReportModal: React.FC<SecurityReportModalProps> = ({
  isOpen,
  onClose,
  onReportSubmitted,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState('An ninh trật tự');
  const [urgency, setUrgency] = useState<'Bình thường' | 'Khẩn cấp' | 'Rất khẩn cấp'>('Bình thường');
  const [content, setContent] = useState('');
  const [agree, setAgree] = useState(false);
  const [hasMedia, setHasMedia] = useState(false);
  const [location, setLocation] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const [createdReceiptCode, setCreatedReceiptCode] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const categories = [
    'An ninh trật tự',
    'Trộm cắp',
    'Gây rối',
    'An toàn giao thông',
    'Phòng cháy chữa cháy',
    'Tệ nạn xã hội',
    'Vấn đề khác',
  ];

  const handleLocateMe = () => {
    setIsLocating(true);
    setTimeout(() => {
      setLocation('Tọa độ GPS: 12.8762° N, 108.2145° E (Gần Chợ Pơng Drang, Tỉnh Đắk Lắk)');
      setIsLocating(false);
    }, 800);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Vui lòng nhập họ và tên';
    if (!phone.trim() || !/^[0-9]{9,11}$/.test(phone.replace(/\s/g, ''))) {
      errs.phone = 'Vui lòng nhập số điện thoại hợp lệ (9-11 chữ số)';
    }
    if (!address.trim()) errs.address = 'Vui lòng chọn hoặc nhập thôn/khu vực';
    if (!content.trim() || content.length < 10) {
      errs.content = 'Vui lòng mô tả rõ nội dung phản ánh (ít nhất 10 ký tự)';
    }
    if (!agree) errs.agree = 'Bạn cần đồng ý điều khoản cung cấp thông tin';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Generate receipt code like PD-2026-XXXXXX
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const code = `PD-2026-${randomNum}`;

    const newReport: SecurityReport = {
      id: `rep-${Date.now()}`,
      receiptCode: code,
      fullName,
      phone,
      address,
      type,
      urgency,
      content,
      hasMedia,
      location,
      createdAt: new Date().toLocaleString('vi-VN'),
      status: 'Đã tiếp nhận',
    };

    onReportSubmitted(newReport);
    setCreatedReceiptCode(code);
  };

  const handleCopyCode = () => {
    if (createdReceiptCode) {
      navigator.clipboard.writeText(createdReceiptCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleResetAndClose = () => {
    setFullName('');
    setPhone('');
    setAddress('');
    setType('An ninh trật tự');
    setUrgency('Bình thường');
    setContent('');
    setAgree(false);
    setHasMedia(false);
    setLocation('');
    setCreatedReceiptCode(null);
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-red-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 via-red-800 to-red-950 p-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400 text-red-950">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-amber-300 uppercase tracking-tight">
                PHẢN ÁNH AN NINH TRẬT TỰ
              </h3>
              <p className="text-[11px] text-red-100">Tiếp nhận tin báo từ người dân xã Pơng Drang</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-red-200 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {createdReceiptCode ? (
            /* Success Receipt Screen */
            <div className="py-4 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <FileCheck className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-lg font-black text-slate-900">GỬI PHẢN ÁNH THÀNH CÔNG!</h4>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  Cảm ơn bà con đã gửi thông tin. Mã phản ánh của bà con đã được hệ thống ghi nhận.
                </p>
              </div>

              {/* Receipt Code Display */}
              <div className="p-3.5 bg-amber-50 border-2 border-dashed border-amber-400 rounded-2xl max-w-xs mx-auto">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                  MÃ TIẾP NHẬN PHẢN ÁNH
                </span>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-xl font-black text-red-900 tracking-wider">
                    {createdReceiptCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="p-1.5 rounded-lg bg-amber-200 text-amber-900 hover:bg-amber-300 transition-colors"
                    title="Sao chép mã"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Disclaimer Warning */}
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-left text-xs text-red-900 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">LƯU Ý THÔNG TIN DEMO:</strong>
                  <span>
                    Đây là mã minh họa trong phiên bản demo. Thông tin không được gửi thật đến cơ quan công an nhà nước.
                  </span>
                </div>
              </div>

              <button
                onClick={handleResetAndClose}
                className="w-full py-3 bg-red-800 hover:bg-red-900 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md active:scale-98 transition-all"
              >
                HOÀN TẤT & ĐÓNG
              </button>
            </div>
          ) : (
            /* Input Form */
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Demo banner */}
              <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-[11px] text-amber-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Thử nghiệm hệ thống phản ánh số xã Pơng Drang (Dữ liệu thử nghiệm)</span>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Họ và tên <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn An"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
                  />
                </div>
                {errors.fullName && <p className="text-[10px] text-red-600 font-semibold mt-1">{errors.fullName}</p>}
              </div>

              {/* Phone & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Số điện thoại <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0912xxxxxx"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
                    />
                  </div>
                  {errors.phone && <p className="text-[10px] text-red-600 font-semibold mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Thôn / Khu vực <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
                  >
                    <option value="">-- Chọn thôn / khu vực --</option>
                    <option value="Thôn 1 - Xã Pơng Drang">Thôn 1</option>
                    <option value="Thôn 2 - Xã Pơng Drang">Thôn 2</option>
                    <option value="Thôn 3 - Xã Pơng Drang">Thôn 3</option>
                    <option value="Thôn 4 - Xã Pơng Drang">Thôn 4</option>
                    <option value="Thôn 5 - Xã Pơng Drang">Thôn 5</option>
                    <option value="Thôn 6 - Xã Pơng Drang">Thôn 6</option>
                    <option value="Thôn 7 - Xã Pơng Drang">Thôn 7</option>
                    <option value="Khu vực Chợ Pơng Drang">Khu vực Chợ Pơng Drang</option>
                    <option value="Tuyến Quốc lộ 14 qua xã">Tuyến Quốc lộ 14</option>
                  </select>
                  {errors.address && <p className="text-[10px] text-red-600 font-semibold mt-1">{errors.address}</p>}
                </div>
              </div>

              {/* Type & Urgency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Loại phản ánh</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Mức độ khẩn cấp</label>
                  <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                    {(['Bình thường', 'Khẩn cấp', 'Rất khẩn cấp'] as const).map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setUrgency(u)}
                        className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                          urgency === u
                            ? u === 'Rất khẩn cấp'
                              ? 'bg-red-700 text-white shadow-xs'
                              : u === 'Khẩn cấp'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content Description */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Nội dung phản ánh chi tiết <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Mô tả sự việc, địa điểm cụ thể, thời gian phát hiện, đối tượng liên quan..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
                />
                {errors.content && <p className="text-[10px] text-red-600 font-semibold mt-1">{errors.content}</p>}
              </div>

              {/* Attach Media Mock */}
              <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center">
                <div className="flex items-center justify-center gap-2">
                  <UploadCloud className="w-5 h-5 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-700">Đính kèm ảnh hoặc video</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Tối đa 5 file (Ảnh JPG, PNG, Video MP4)</p>

                <button
                  type="button"
                  onClick={() => setHasMedia(!hasMedia)}
                  className={`mt-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    hasMedia
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {hasMedia ? '✓ Đã chọn 1 ảnh đính kèm (Giả lập)' : '+ Chọn tệp tin minh họa'}
                </button>
              </div>

              {/* GPS Location Button */}
              <div>
                <button
                  type="button"
                  onClick={handleLocateMe}
                  disabled={isLocating}
                  className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span>{isLocating ? 'Đang định vị GPS...' : 'Lấy vị trí hiện tại qua GPS (Tùy chọn)'}</span>
                </button>
                {location && (
                  <p className="text-[10px] text-emerald-700 font-medium mt-1 text-center bg-emerald-50 py-1 rounded border border-emerald-200">
                    {location}
                  </p>
                )}
              </div>

              {/* Agreement Checkbox */}
              <div>
                <label className="flex items-start gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-red-700 rounded border-slate-300 focus:ring-red-600"
                  />
                  <span className="text-[11px] text-slate-600 font-medium leading-snug">
                    Tôi đồng ý cung cấp thông tin chính xác để cơ quan Công an tiếp nhận và xử lý.
                  </span>
                </label>
                {errors.agree && <p className="text-[10px] text-red-600 font-semibold mt-1">{errors.agree}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-950 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-4 h-4 text-amber-300" />
                <span>GỬI PHẢN ÁNH</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
