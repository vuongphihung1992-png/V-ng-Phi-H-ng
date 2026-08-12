import React from 'react';
import { X, Shield, MapPin, Calendar, Globe, Building2, UserCheck, ExternalLink, Navigation, Phone } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const addressQuery = 'Cong+An+Xa+Pong+Drang,+Krong+Buk,+Dak+Lak';
  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Công an xã Pơng Drang, Krông Búk, Đắk Lắk')}`;
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('Công an xã Pơng Drang, Krông Búk, Đắk Lắk')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-red-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 via-red-800 to-red-950 p-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400 text-red-950">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-amber-300 uppercase tracking-tight">
                TRỤ SỞ CÔNG AN XÃ PƠNG DRANG
              </h3>
              <p className="text-[11px] text-red-100">Thông tin đơn vị & Bản đồ vị trí Google Maps</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-red-200 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-700">
          {/* Section 1: Google Maps Embed Card */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase flex items-center gap-2">
                <MapPin className="w-4.5 h-4.5 text-red-700 shrink-0" />
                1. BẢN ĐỒ VỊ TRÍ TRỤ SỞ GOOGLE MAPS
              </h4>
              <span className="text-[10px] bg-red-100 text-red-800 font-extrabold px-2 py-0.5 rounded-md border border-red-200">
                Bản đồ trực tuyến
              </span>
            </div>

            {/* Embedded Google Maps Container */}
            <div className="rounded-2xl overflow-hidden border border-red-200 shadow-sm bg-slate-100">
              <div className="p-2.5 bg-gradient-to-r from-red-900 to-red-950 text-white flex items-center justify-between gap-2 text-xs">
                <span className="font-extrabold text-amber-300 flex items-center gap-1.5 truncate">
                  <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  Vị trí: Công an xã Pơng Drang
                </span>
                <a
                  href={googleMapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] bg-amber-400 text-red-950 px-2.5 py-1 rounded-lg font-black hover:bg-amber-300 transition-all flex items-center gap-1 shrink-0 shadow-2xs"
                >
                  <span>Mở Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Interactive Google Map iframe */}
              <div className="w-full h-64 sm:h-80 relative bg-slate-200">
                <iframe
                  title="Bản đồ vị trí Công an xã Pơng Drang"
                  src={`https://maps.google.com/maps?q=${addressQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Navigation Action Footer */}
              <div className="p-3 bg-amber-50/90 border-t border-amber-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-amber-950 font-bold">
                  <Navigation className="w-4 h-4 text-red-700 shrink-0" />
                  <span>Định vị vị trí & Chỉ đường tự động tới trụ sở</span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={googleMapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial py-1.5 px-3 bg-red-700 hover:bg-red-800 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5 text-amber-300" />
                    <span>CHỈ ĐƯỜNG NGAY</span>
                  </a>
                  <a
                    href={googleMapsSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial py-1.5 px-3 bg-amber-400 hover:bg-amber-300 text-red-950 text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>MỞ TRONG APP MAPS</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Overview */}
          <div className="p-3.5 bg-red-50/60 border border-red-200 rounded-2xl space-y-2">
            <h4 className="font-extrabold text-red-950 text-xs sm:text-sm uppercase flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-700" />
              2. GIỚI THIỆU CHUNG
            </h4>
            <p className="leading-relaxed text-slate-700">
              Công an xã Pơng Drang là đơn vị Công an chính quy thuộc Công an tỉnh Đắk Lắk. Lực lượng Công an xã có trách nhiệm tham mưu cho Cấp ủy, Chính quyền địa phương và trực tiếp thực hiện công tác quản lý nhà nước về an ninh, trật tự, an toàn xã hội trên địa bàn xã Pơng Drang.
            </p>
          </div>

          {/* Section 3: Functions & Tasks */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-600" />
              3. CHỨC NĂNG & NHIỆM VỤ TRỌNG TÂM
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 pl-1 leading-relaxed">
              <li>Nắm tình hình an ninh trật tự, phòng ngừa và đấu tranh chống tội phạm, tệ nạn xã hội.</li>
              <li>Quản lý cư trú, cấp Căn cước công dân và tài khoản Định danh điện tử (VNeID).</li>
              <li>Tuyên truyền, phổ biến giáo dục pháp luật và xây dựng phong trào Toàn dân bảo vệ an ninh Tổ quốc.</li>
              <li>Thực hiện công tác phòng cháy, chữa cháy và cứu nạn, cứu hộ tại địa bàn cơ sở.</li>
            </ul>
          </div>

          {/* Section 4: Reception Schedule */}
          <div className="p-3.5 bg-amber-50/80 border border-amber-300 rounded-2xl space-y-2">
            <h4 className="font-extrabold text-amber-950 text-xs sm:text-sm uppercase flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-700" />
              4. LỊCH TIẾP CÔNG DÂN TẠI TRỤ SỞ
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-amber-900">
              <div className="p-2 bg-white/80 rounded-xl border border-amber-200">
                <strong className="block font-bold">Thứ 2 đến Thứ 6:</strong>
                <span>Sáng: 07h30 - 11h30 | Chiều: 13h30 - 17h00</span>
              </div>
              <div className="p-2 bg-white/80 rounded-xl border border-amber-200">
                <strong className="block font-bold">Thứ 7:</strong>
                <span>Tiếp nhận & trả kết quả thủ tục HC buổi sáng (08h00 - 11h00)</span>
              </div>
            </div>
          </div>

          {/* Section 5: Contact Info */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-700" />
              5. THÔNG TIN LIÊN HỆ ĐIỆN THOẠI TRỰC BAN
            </h4>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-700">
              <p className="flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                <span><strong>Địa chỉ trụ sở:</strong> Thôn 3, Xã Pơng Drang, Tỉnh Đắk Lắk</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <a
                  href="tel:02623539777"
                  className="p-2.5 rounded-xl bg-white border border-red-200 flex items-center justify-between hover:bg-red-50 transition-all"
                >
                  <div>
                    <span className="block text-[11px] font-bold text-slate-500">Trực ban Công an xã</span>
                    <span className="text-xs sm:text-sm font-black text-red-900">02623539777</span>
                  </div>
                  <span className="px-2 py-1 bg-red-700 text-white text-[10px] font-extrabold rounded-lg">GỌI</span>
                </a>
                <a
                  href="tel:02623608839"
                  className="p-2.5 rounded-xl bg-white border border-red-200 flex items-center justify-between hover:bg-red-50 transition-all"
                >
                  <div>
                    <span className="block text-[11px] font-bold text-slate-500">Trực ban Hình sự</span>
                    <span className="text-xs sm:text-sm font-black text-red-900">02623608839</span>
                  </div>
                  <span className="px-2 py-1 bg-red-700 text-white text-[10px] font-extrabold rounded-lg">GỌI</span>
                </a>
              </div>
            </div>
          </div>

          {/* Section 6: Official Channels & PWA Info */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
            <h4 className="font-extrabold text-blue-950 text-xs uppercase flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-700" />
              6. ỨNG DỤNG DI ĐỘNG PWA (PROGRESSIVE WEB APP)
            </h4>
            <p className="text-xs text-blue-900 leading-relaxed">
              Ứng dụng "Công an Pơng Drang" hỗ trợ đầy đủ chuẩn <strong>PWA</strong>. Quý dân có thể cài đặt trực tiếp lên Màn hình chính (Home Screen) trên điện thoại iOS (iPhone) và Android mà không cần tải từ cửa hàng ứng dụng.
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px] font-bold text-blue-950">
              <span className="px-2 py-1 bg-white rounded-lg border border-blue-200">📱 iOS & Android Ready</span>
              <span className="px-2 py-1 bg-white rounded-lg border border-blue-200">⚡ Hoạt động mượt mà & Offline</span>
              <span className="px-2 py-1 bg-white rounded-lg border border-blue-200">🔒 An toàn bảo mật</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
          <p className="text-[10px] text-slate-500 font-medium">Phiên bản PWA v1.0 • Công an xã Pơng Drang</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl active:scale-95 transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

