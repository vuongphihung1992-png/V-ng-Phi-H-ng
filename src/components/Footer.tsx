import React from 'react';
import {
  Building2,
  Phone,
  Clock,
  MapPin,
  Calendar,
  ShieldAlert,
  FileText,
  UserCheck,
  HelpCircle,
  ExternalLink,
  Lock,
  ChevronRight,
  Sparkles,
  Search,
  Bell,
  Globe
} from 'lucide-react';
import { ModalType } from '../types';

interface FooterProps {
  unitName?: string;
  address?: string;
  phone?: string;
  onOpenModal: (type: ModalType) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  unitName = 'CÔNG AN XÃ PƠNG DRANG',
  address = 'Thôn 3, Xã Pơng Drang, Huyện Krông Búk, Tỉnh Đắk Lắk',
  phone = '02623539777',
  onOpenModal,
  onOpenAdmin,
}) => {
  const externalPortals = [
    {
      title: 'Cổng Dịch vụ công Bộ Công an',
      url: 'https://dichvucong.bocongan.gov.vn',
      desc: 'Nộp hồ sơ cư trú, CCCD, PCCC, Đăng ký xe trực tuyến',
    },
    {
      title: 'Cổng Dịch vụ công Quốc gia',
      url: 'https://dichvucong.gov.vn',
      desc: 'Tích hợp thủ tục hành chính liên thông toàn quốc',
    },
    {
      title: 'Định danh điện tử VNeID',
      url: 'https://vneid.gov.vn',
      desc: 'Tài khoản định danh điện tử công dân Việt Nam',
    },
    {
      title: 'Cổng TTĐT Tỉnh Đắk Lắk',
      url: 'https://daklak.gov.vn',
      desc: 'Thông tin chính thống UBND Tỉnh Đắk Lắk',
    },
  ];

  return (
    <footer className="mt-8 bg-gradient-to-b from-slate-900 via-red-950 to-slate-950 text-white border-t-2 border-amber-500/40 shadow-2xl">
      <div className="max-w-md sm:max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        {/* 1. BRAND & UNIT INFO */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-amber-300 to-amber-500 p-0.5 shadow-md shrink-0 border border-amber-200">
              <div className="w-full h-full rounded-[14px] bg-red-900 flex items-center justify-center text-amber-300">
                <Building2 className="w-6 h-6 text-amber-300" />
              </div>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-amber-300 uppercase tracking-tight leading-snug">
                {unitName}
              </h3>
              <p className="text-[11px] text-red-200/90 font-medium">
                CÔNG AN HUYỆN KRÔNG BÚK - CÔNG AN TỈNH ĐẮK LẮK
              </p>
            </div>
          </div>

          {/* Quick Call Emergency Button */}
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-red-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all shrink-0"
          >
            <Phone className="w-4 h-4 text-red-950" />
            <span>GỌI TRỰC BAN: {phone}</span>
          </a>
        </div>

        {/* 2. OPERATING HOURS & ADDRESS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-300 font-extrabold text-[11px] uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>ĐỊA CHỈ TRỤ SỞ CÔNG AN XÃ</span>
            </div>
            <p className="text-slate-200 font-medium leading-relaxed">
              {address}
            </p>
            <button
              onClick={() => onOpenModal('map')}
              className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-400 hover:text-amber-300 underline mt-1"
            >
              <span>Xem vị trí & Chỉ đường Google Maps</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-300 font-extrabold text-[11px] uppercase tracking-wider">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>GIỜ TIẾP CÔNG DÂN LÀM VIỆC</span>
            </div>
            <p className="text-slate-200 text-[11px] leading-relaxed">
              <span className="font-bold text-amber-200">Thứ 2 - Thứ 6:</span> 07h30 - 11h30 | 13h30 - 17h00<br />
              <span className="font-bold text-amber-200">Thứ 7:</span> 07h30 - 11h30 (Tiếp nhận Cư trú & CCCD)<br />
              <span className="font-bold text-red-300">Trực ban khẩn cấp:</span> Túc trực 24/24h liên tục
            </p>
          </div>
        </div>

        {/* 3. QUICK LINKS GRID TO APP UTILITIES */}
        <div className="space-y-2.5">
          <h4 className="text-[11px] font-extrabold uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            LIÊN KẾT NHANH DỊCH VỤ & TIỆN ÍCH CÔNG DÂN
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <button
              onClick={() => onOpenModal('appointment')}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all active:scale-95 group flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-slate-200 text-[11px]">Đặt lịch làm việc</span>
            </button>

            <button
              onClick={() => onOpenModal('report')}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all active:scale-95 group flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-slate-200 text-[11px]">Phản ánh ANTT</span>
            </button>

            <button
              onClick={() => onOpenModal('procedures')}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all active:scale-95 group flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-indigo-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-slate-200 text-[11px]">Thủ tục hành chính</span>
            </button>

            <button
              onClick={() => onOpenModal('officers')}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all active:scale-95 group flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-sky-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-slate-200 text-[11px]">Cán bộ 12 Thôn</span>
            </button>

            <button
              onClick={() => onOpenModal('hotline')}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all active:scale-95 group flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-red-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-slate-200 text-[11px]">Đường dây nóng 24/7</span>
            </button>

            <button
              onClick={() => onOpenModal('faq')}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all active:scale-95 group flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-teal-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-slate-200 text-[11px]">Hỏi đáp Pháp luật</span>
            </button>

            <button
              onClick={() => onOpenModal('search')}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all active:scale-95 group flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-purple-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-slate-200 text-[11px]">Tra cứu Hồ sơ</span>
            </button>

            <button
              onClick={() => onOpenModal('announcements_list')}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all active:scale-95 group flex items-center gap-2"
            >
              <Bell className="w-4 h-4 text-rose-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-slate-200 text-[11px]">Thông báo chính thức</span>
            </button>
          </div>
        </div>

        {/* 4. EXTERNAL GOVERNMENT DVC PORTALS */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-amber-400/20 space-y-2.5">
          <h4 className="text-[11px] font-extrabold uppercase text-amber-300 tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              CỔNG DỊCH VỤ CÔNG TRỰC TUYẾN CHÍNH PHỦ & BỘ CÔNG AN
            </span>
            <span className="text-[9px] bg-red-900 text-amber-200 px-1.5 py-0.5 rounded border border-amber-400/30 font-bold">
              Chính thức
            </span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {externalPortals.map((portal) => (
              <a
                key={portal.url}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-amber-400/10 border border-white/10 hover:border-amber-400/40 text-left transition-all group flex items-center justify-between gap-2"
              >
                <div>
                  <h5 className="font-bold text-amber-200 text-xs group-hover:text-amber-300 flex items-center gap-1">
                    <span>{portal.title}</span>
                  </h5>
                  <p className="text-[10px] text-slate-300 truncate">{portal.desc}</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </a>
            ))}
          </div>
        </div>

        {/* 5. ADMIN PORTAL ACCESS BUTTON & COPYRIGHT */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <button
            onClick={onOpenAdmin}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-900 to-red-950 hover:from-red-800 hover:to-red-900 text-amber-300 font-extrabold text-xs border border-amber-400/40 shadow-sm flex items-center gap-2 transition-all active:scale-95"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>CỔNG QUẢN TRỊ VIÊN CÔNG AN XÃ (ADMIN)</span>
          </button>

          <div className="text-center sm:text-right text-[10px] text-slate-400 space-y-0.5">
            <p>© 2026 Cổng thông tin điện tử Công an nhân dân Việt Nam.</p>
            <p className="text-slate-500 font-mono">Phiên bản Công an xã Pơng Drang Smartphone Applet</p>
          </div>
        </div>

      </div>
    </footer>
  );
};
