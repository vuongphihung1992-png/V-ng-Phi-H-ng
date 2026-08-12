import React from 'react';
import {
  Newspaper,
  Info,
  MessageSquare,
  Calendar,
  Phone,
  ShieldAlert,
  FileText,
  Edit3,
  HelpCircle,
  Search,
  Bell,
  MapPin,
  Megaphone,
  ChevronRight,
  UserCheck,
  ExternalLink,
  Globe,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Announcement, ModalType } from '../types';

interface QuickActionsProps {
  onOpenModal: (type: ModalType) => void;
  unreadAnnouncements?: number;
  announcements?: Announcement[];
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onOpenModal,
  unreadAnnouncements = 2,
  announcements = [],
}) => {
  const latestAnnouncement = announcements.length > 0 ? announcements[0] : null;

  // Top Quick Highlight Actions
  const topQuickActions = [
    {
      id: 'news',
      title: 'Tin tức - Hoạt động',
      icon: <Newspaper className="w-5 sm:w-6 h-5 sm:h-6 text-red-800" />,
      modalType: 'news_list' as ModalType,
      bgColor: 'bg-red-50/80 hover:bg-red-100/90 border-red-200/80 text-red-950',
    },
    {
      id: 'officers',
      title: 'Cán bộ quản lý địa bàn',
      icon: <UserCheck className="w-5 sm:w-6 h-5 sm:h-6 text-emerald-800" />,
      modalType: 'officers' as ModalType,
      bgColor: 'bg-emerald-50/90 hover:bg-emerald-100 border-emerald-300/80 text-emerald-950 font-bold',
      badge: '12 Thôn'
    },
    {
      id: 'about',
      title: 'Giới thiệu đơn vị',
      icon: <Info className="w-5 sm:w-6 h-5 sm:h-6 text-amber-700" />,
      modalType: 'about' as ModalType,
      bgColor: 'bg-amber-50/80 hover:bg-amber-100/90 border-amber-200/80 text-amber-950',
    },
    {
      id: 'messages',
      title: 'Hỗ trợ & Liên hệ',
      icon: <MessageSquare className="w-5 sm:w-6 h-5 sm:h-6 text-blue-700" />,
      modalType: 'messages' as ModalType,
      bgColor: 'bg-blue-50/80 hover:bg-blue-100/90 border-blue-200/80 text-blue-950',
    },
  ];

  // Group 1: Tương tác & Khẩn cấp
  const group1 = [
    {
      id: 'appointment',
      title: 'Đặt lịch làm việc',
      desc: 'Tiếp công dân trực tiếp',
      icon: <Calendar className="w-6 h-6 text-emerald-700" />,
      modalType: 'appointment' as ModalType,
      color: 'bg-emerald-50/80 hover:bg-emerald-100 border-emerald-200 text-emerald-950',
    },
    {
      id: 'hotline',
      title: 'Đường dây nóng',
      desc: 'Khẩn cấp 24/7',
      icon: <Phone className="w-6 h-6 text-red-700" />,
      modalType: 'hotline' as ModalType,
      color: 'bg-red-50/80 hover:bg-red-100 border-red-200 text-red-950',
      badge: '24/7',
    },
    {
      id: 'security_report',
      title: 'Phản ánh ANTT',
      desc: 'Tố giác tội phạm',
      icon: <ShieldAlert className="w-6 h-6 text-amber-700" />,
      modalType: 'report' as ModalType,
      color: 'bg-amber-50/80 hover:bg-amber-100 border-amber-300 text-amber-950',
      badge: 'Gấp',
    },
  ];

  // Group 2: Thủ tục & Góp ý
  const group2 = [
    {
      id: 'procedures',
      title: 'Thủ tục hành chính',
      desc: 'Cư trú, CCCD, PCCC',
      icon: <FileText className="w-6 h-6 text-indigo-700" />,
      modalType: 'procedures' as ModalType,
      color: 'bg-indigo-50/80 hover:bg-indigo-100 border-indigo-200 text-indigo-950',
    },
    {
      id: 'feedback',
      title: 'Góp ý - Phản ánh',
      desc: 'Góp ý Dịch vụ công',
      icon: <Edit3 className="w-6 h-6 text-teal-700" />,
      modalType: 'report' as ModalType,
      color: 'bg-teal-50/80 hover:bg-teal-100 border-teal-200 text-teal-950',
    },
    {
      id: 'faq',
      title: 'Hỏi đáp pháp luật',
      desc: 'Tư vấn pháp lý',
      icon: <HelpCircle className="w-6 h-6 text-sky-700" />,
      modalType: 'faq' as ModalType,
      color: 'bg-sky-50/80 hover:bg-sky-100 border-sky-200 text-sky-950',
    },
  ];

  // Group 3: Tra cứu & Thông tin
  const group3 = [
    {
      id: 'search',
      title: 'Tra cứu thông tin',
      desc: 'Tra cứu tiến độ',
      icon: <Search className="w-6 h-6 text-purple-700" />,
      modalType: 'search' as ModalType,
      color: 'bg-purple-50/80 hover:bg-purple-100 border-purple-200 text-purple-950',
    },
    {
      id: 'announcements',
      title: 'Thông báo chính thức',
      desc: 'Cảnh báo ANTT',
      icon: <Bell className="w-6 h-6 text-rose-700" />,
      modalType: 'announcements_list' as ModalType,
      color: 'bg-rose-50/80 hover:bg-rose-100 border-rose-200 text-rose-950',
      badge: unreadAnnouncements > 0 ? `${unreadAnnouncements}` : undefined,
    },
    {
      id: 'map_address',
      title: 'Trụ sở Công an xã',
      desc: 'Bản đồ Google Maps',
      icon: <MapPin className="w-6 h-6 text-amber-800" />,
      modalType: 'map' as ModalType,
      color: 'bg-amber-50/80 hover:bg-amber-100 border-amber-200 text-amber-950',
    },
  ];

  // External Portal Shortcuts
  const externalPortals = [
    {
      name: 'Dịch vụ công Bộ Công an',
      url: 'https://dichvucong.bocongan.gov.vn',
      tag: 'BCA',
    },
    {
      name: 'Cổng DVC Quốc gia',
      url: 'https://dichvucong.gov.vn',
      tag: 'Chính phủ',
    },
    {
      name: 'Định danh VNeID',
      url: 'https://vneid.gov.vn',
      tag: 'VNeID',
    },
  ];

  return (
    <div className="max-w-md sm:max-w-2xl mx-auto px-3.5 py-2.5 space-y-3.5">
      {/* 1. TOP HIGHLIGHT ACTIONS */}
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
          {topQuickActions.map((item) => (
            <button
              key={item.id}
              onClick={() => onOpenModal(item.modalType)}
              className={`relative flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border shadow-2xs transition-all active:scale-95 group min-h-[96px] ${item.bgColor}`}
            >
              {item.badge && (
                <span className="absolute -top-1.5 -right-1 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-700 text-white shadow-2xs">
                  {item.badge}
                </span>
              )}
              <div className="p-2 rounded-xl bg-white shadow-2xs group-hover:scale-105 transition-transform">
                {item.icon}
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-900 mt-2 text-center leading-tight line-clamp-2">
                {item.title}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 2. ANNOUNCEMENT HIGHLIGHT BANNER */}
      <section>
        <div 
          onClick={() => onOpenModal('announcements_list')}
          className="p-3 bg-red-950 text-white rounded-2xl shadow-xs border border-amber-500/30 flex items-center justify-between gap-3 cursor-pointer hover:bg-red-900 transition-all active:scale-[0.99] group"
          title="Bấm để mở Trang Thông báo đầy đủ Công an xã Pơng Drang"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 bg-amber-400 text-red-950 rounded-xl font-bold shrink-0 group-hover:scale-105 transition-transform">
              <Megaphone className="w-4 h-4 text-red-950 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase text-amber-300 bg-red-900/80 px-1.5 py-0.5 rounded border border-amber-400/30">
                  THÔNG BÁO MỚI
                </span>
                <span className="text-[11px] text-red-200 font-medium truncate">
                  {latestAnnouncement ? latestAnnouncement.category : 'Cảnh báo an ninh trật tự'}
                </span>
              </div>
              <p className="text-xs font-bold text-amber-100 truncate mt-0.5">
                {latestAnnouncement ? latestAnnouncement.title : 'Khuyến cáo người dân cảnh giác phòng chống lừa đảo qua mạng'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-amber-300 shrink-0 group-hover:translate-x-1 transition-transform" />
        </div>
      </section>

      {/* 3. CATEGORY GRID - DANH MỤC DỊCH VỤ & TIỆN ÍCH */}
      <section className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between px-1 border-b border-slate-100 pb-2">
          <h3 className="text-xs font-extrabold text-red-950 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            DANH MỤC DỊCH VỤ & TIỆN ÍCH
          </h3>
          <span className="text-[11px] text-red-800 bg-red-50 px-2 py-0.5 rounded-full font-black border border-red-200">
            9 tiện ích chính
          </span>
        </div>

        {/* GROUP 1 */}
        <div className="grid grid-cols-3 gap-2">
          {group1.map((card) => (
            <button
              key={card.id}
              onClick={() => onOpenModal(card.modalType)}
              className={`relative flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border transition-all active:scale-95 group min-h-[100px] ${card.color}`}
            >
              {card.badge && (
                <span className="absolute -top-1.5 -right-1 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-red-700 text-white shadow-2xs">
                  {card.badge}
                </span>
              )}
              <div className="p-2 rounded-xl bg-white shadow-2xs group-hover:scale-105 transition-transform">
                {card.icon}
              </div>
              <span className="text-xs font-extrabold mt-1.5 text-center leading-tight line-clamp-1">
                {card.title}
              </span>
              <span className="text-[9px] text-slate-500 font-medium text-center line-clamp-1 mt-0.5">
                {card.desc}
              </span>
            </button>
          ))}
        </div>

        <div className="border-t border-slate-100" />

        {/* GROUP 2 */}
        <div className="grid grid-cols-3 gap-2">
          {group2.map((card) => (
            <button
              key={card.id}
              onClick={() => onOpenModal(card.modalType)}
              className={`relative flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border transition-all active:scale-95 group min-h-[100px] ${card.color}`}
            >
              <div className="p-2 rounded-xl bg-white shadow-2xs group-hover:scale-105 transition-transform">
                {card.icon}
              </div>
              <span className="text-xs font-extrabold mt-1.5 text-center leading-tight line-clamp-1">
                {card.title}
              </span>
              <span className="text-[9px] text-slate-500 font-medium text-center line-clamp-1 mt-0.5">
                {card.desc}
              </span>
            </button>
          ))}
        </div>

        <div className="border-t border-slate-100" />

        {/* GROUP 3 */}
        <div className="grid grid-cols-3 gap-2">
          {group3.map((card) => (
            <button
              key={card.id}
              onClick={() => onOpenModal(card.modalType)}
              className={`relative flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border transition-all active:scale-95 group min-h-[100px] ${card.color}`}
            >
              {card.badge && (
                <span className="absolute -top-1.5 -right-1 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-rose-700 text-white shadow-2xs">
                  {card.badge}
                </span>
              )}
              <div className="p-2 rounded-xl bg-white shadow-2xs group-hover:scale-105 transition-transform">
                {card.icon}
              </div>
              <span className="text-xs font-extrabold mt-1.5 text-center leading-tight line-clamp-1">
                {card.title}
              </span>
              <span className="text-[9px] text-slate-500 font-medium text-center line-clamp-1 mt-0.5">
                {card.desc}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. EXTERNAL GOVERNMENT DVC PORTAL LINKS */}
      <section className="p-3 bg-gradient-to-r from-red-950 via-red-900 to-red-950 text-white rounded-2xl border border-amber-500/40 shadow-xs space-y-2">
        <div className="flex items-center justify-between border-b border-red-800/80 pb-1.5">
          <div className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-amber-300 shrink-0 animate-pulse" />
            <span className="text-[11px] font-black text-amber-300 uppercase tracking-wide">
              CỔNG DỊCH VỤ CÔNG BỘ CÔNG AN & QUỐC GIA
            </span>
          </div>
          <span className="text-[9px] bg-amber-400 text-red-950 font-black px-1.5 py-0.5 rounded">
            Chính thức
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {externalPortals.map((portal) => (
            <a
              key={portal.url}
              href={portal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white/10 hover:bg-amber-400/20 border border-white/15 text-center transition-all group flex flex-col items-center justify-center gap-0.5 active:scale-95"
            >
              <span className="text-[9px] font-black text-amber-300 bg-red-900/90 px-1 rounded border border-amber-400/30">
                {portal.tag}
              </span>
              <span className="text-[10px] font-bold text-slate-100 group-hover:text-amber-200 line-clamp-1 mt-0.5">
                {portal.name}
              </span>
              <ExternalLink className="w-3 h-3 text-amber-400 opacity-80 group-hover:opacity-100 mt-0.5" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};
