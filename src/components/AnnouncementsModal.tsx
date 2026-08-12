import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  Search, 
  AlertTriangle, 
  Calendar, 
  ShieldCheck, 
  ChevronRight, 
  Phone, 
  Filter, 
  CheckCircle2, 
  Megaphone,
  Share2,
  Bookmark,
  FileText,
  UserCheck
} from 'lucide-react';
import { Announcement } from '../types';

interface AnnouncementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcements: Announcement[];
  onOpenReport?: () => void;
  onOpenAppointment?: () => void;
  onOpenHotline?: () => void;
}

export const AnnouncementsModal: React.FC<AnnouncementsModalProps> = ({
  isOpen,
  onClose,
  announcements = [],
  onOpenReport,
  onOpenAppointment,
  onOpenHotline
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter out hidden announcements for public view
  const activeAnnouncements = announcements.filter((a) => !a.hidden);

  // Categories list
  const categories = ['Tất cả', 'Cảnh báo', 'Tiếp công dân', 'Hành chính', 'An ninh'];

  // Filter by category and search query
  const filteredAnnouncements = activeAnnouncements.filter((item) => {
    const matchesCategory =
      selectedCategory === 'Tất cả' ||
      item.category?.toLowerCase() === selectedCategory.toLowerCase();

    const queryLower = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !queryLower ||
      item.title.toLowerCase().includes(queryLower) ||
      item.summary.toLowerCase().includes(queryLower) ||
      item.content.toLowerCase().includes(queryLower);

    return matchesCategory && matchesQuery;
  });

  // Get top important/newest announcement for the top banner highlight
  const featuredAnnouncement = activeAnnouncements.find((a) => a.important || a.isNew) || activeAnnouncements[0];

  const handleToggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-50 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border-2 border-red-900/80">
        
        {/* OFFICIAL POLICE HEADER */}
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-red-950 p-4 sm:p-5 text-white flex items-center justify-between shrink-0 border-b-2 border-amber-400/80 shadow-md">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-2xl bg-gradient-to-b from-amber-300 to-amber-500 text-red-950 shadow-md shrink-0 border border-amber-200">
              <Megaphone className="w-6 h-6 text-red-950" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-md bg-amber-400 text-red-950 text-[10px] font-black uppercase tracking-wider shadow-2xs">
                  Trang Chính Thức
                </span>
                <span className="text-[11px] text-amber-200 font-bold hidden xs:inline">
                  Công an xã Pơng Drang
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-amber-300 uppercase tracking-tight truncate leading-tight mt-0.5">
                THÔNG BÁO CỦA CÔNG AN XÃ PƠNG DRANG
              </h2>
              <p className="text-[11px] sm:text-xs text-red-100/90 font-medium truncate">
                Cập nhật chỉ đạo, lịch làm việc, thông tin cư trú & cảnh báo ANTT 24/7
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-red-200 hover:text-white hover:bg-white/10 active:scale-95 transition-all shrink-0 ml-2"
            title="Đóng trang thông báo"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* MODAL BODY CONTAINER */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4">
          
          {/* FEATURED / HIGHLIGHT BANNER BOX AT TOP */}
          {featuredAnnouncement && (
            <div className="bg-gradient-to-r from-red-900 via-red-950 to-red-900 rounded-2xl p-4 text-white shadow-md border-2 border-amber-400/70 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-400 text-red-950 text-[10px] font-black uppercase flex items-center gap-1 shadow-2xs">
                    <AlertTriangle className="w-3 h-3 text-red-950" />
                    THÔNG BÁO MỚI NỔI BẬT
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-red-800/80 text-amber-200 text-[10px] font-bold border border-amber-400/30">
                    {featuredAnnouncement.category}
                  </span>
                </div>
                <span className="text-[11px] text-amber-200/90 font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  {featuredAnnouncement.date}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-extrabold text-amber-300 leading-snug mb-1.5">
                {featuredAnnouncement.title}
              </h3>

              <p className="text-xs text-red-100 font-normal line-clamp-2 leading-relaxed">
                {featuredAnnouncement.summary}
              </p>

              <div className="mt-3 pt-2.5 border-t border-red-800/80 flex items-center justify-between gap-2 text-xs">
                <span className="text-[11px] text-amber-200 font-medium">
                  Ban Chỉ huy Công an xã Pơng Drang
                </span>
                <button
                  onClick={() => handleToggleExpand(featuredAnnouncement.id)}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-red-950 text-xs font-black rounded-xl active:scale-95 transition-all shadow-xs flex items-center gap-1"
                >
                  <span>{expandedId === featuredAnnouncement.id ? 'Thu gọn nội dung' : 'Đọc đầy đủ nội dung'}</span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expandedId === featuredAnnouncement.id ? 'rotate-90' : ''}`} />
                </button>
              </div>

              {/* Full Content Inline Dropdown for Featured Announcement */}
              {expandedId === featuredAnnouncement.id && (
                <div className="mt-3 p-3.5 bg-red-950/90 rounded-xl border border-amber-400/40 text-xs text-amber-50 space-y-2.5 animate-in fade-in duration-150">
                  <div className="p-2 bg-amber-500/20 rounded-lg text-amber-200 text-[11px] font-bold flex items-center gap-1.5 border border-amber-400/30">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Nội dung chính thức do Admin Công an xã Pơng Drang ban hành:</span>
                  </div>
                  <div className="whitespace-pre-line leading-relaxed font-normal text-slate-100">
                    {featuredAnnouncement.content}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SEARCH & CATEGORY FILTER BAR */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs space-y-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm nội dung thông báo (Cư trú, VNeID, lừa đảo, lịch làm việc...)..."
                className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-xs">
              <span className="text-[11px] font-extrabold text-slate-400 shrink-0 flex items-center gap-1 mr-0.5">
                <Filter className="w-3.5 h-3.5 text-red-800" />
                Danh mục:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all active:scale-95 border ${
                    selectedCategory === cat
                      ? 'bg-red-900 text-amber-300 border-red-950 shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* ANNOUNCEMENT LISTING COUNT & LABEL */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-red-950 uppercase tracking-tight flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-red-800" />
              TẤT CẢ THÔNG BÁO ({filteredAnnouncements.length})
            </span>
            <span className="text-[11px] text-slate-500 font-bold">
              Đăng tải bởi Ban Biên Tập Công An Xã
            </span>
          </div>

          {/* LIST OF ANNOUNCEMENT CARDS */}
          {filteredAnnouncements.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-slate-300 space-y-2">
              <Bell className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-600">
                Chưa tìm thấy thông báo nào phù hợp với từ khóa "{searchQuery}".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Tất cả');
                }}
                className="px-4 py-2 bg-red-800 text-amber-300 font-extrabold text-xs rounded-xl hover:bg-red-900 transition-all"
              >
                Xóa bộ lọc & Xem lại tất cả
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAnnouncements.map((item) => {
                const isExpanded = expandedId === item.id;

                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl border transition-all shadow-2xs overflow-hidden ${
                      item.important
                        ? 'border-red-300/90 shadow-xs'
                        : 'border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    {/* CARD HEADER */}
                    <div className="p-4 sm:p-4.5 space-y-2">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-lg bg-red-100 text-red-900 border border-red-200 text-[10px] font-black uppercase">
                            {item.category || 'Thông báo'}
                          </span>

                          {item.isNew && (
                            <span className="px-2 py-0.5 rounded-lg bg-amber-400 text-red-950 text-[10px] font-black uppercase">
                              MỚI
                            </span>
                          )}

                          {item.important && (
                            <span className="px-2 py-0.5 rounded-lg bg-red-700 text-white text-[10px] font-black uppercase flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-300" />
                              QUAN TRỌNG
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] text-slate-500 font-bold flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Ngày đăng: {item.date}
                        </span>
                      </div>

                      {/* TITLE */}
                      <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                        {item.title}
                      </h4>

                      {/* SUMMARY */}
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {item.summary}
                      </p>

                      {/* READ FULL CONTENT EXPANDABLE BLOCK */}
                      {isExpanded ? (
                        <div className="mt-3 pt-3 border-t border-slate-200 space-y-3 animate-in fade-in duration-150">
                          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 text-xs font-semibold flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                            <span>Nội dung văn bản thông báo đầy đủ ban hành bởi Công an xã Pơng Drang:</span>
                          </div>

                          {/* Full Text */}
                          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed space-y-2 font-normal">
                            {item.content || item.summary}
                          </div>

                          {/* Publisher Stamp */}
                          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-medium">
                            <span>Đơn vị ban hành: <strong>Công an xã Pơng Drang, Huyện Krông Búk, Tỉnh Đắk Lắk</strong></span>
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Đã xác thực
                            </span>
                          </div>
                        </div>
                      ) : null}

                      {/* ACTION BAR AT BOTTOM OF CARD */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-400 font-medium">
                          Mã TB: #{item.id}
                        </span>

                        <button
                          onClick={() => handleToggleExpand(item.id)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-900 font-bold text-xs rounded-xl transition-all active:scale-95 flex items-center gap-1 border border-red-200/80"
                        >
                          <span>{isExpanded ? 'Thu gọn' : 'Xem nội dung đầy đủ'}</span>
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* DIRECT ACTION HOTLINES BANNER AT BOTTOM OF MODAL */}
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-300/80 rounded-2xl p-3.5 text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-amber-400 text-red-950 font-black shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs sm:text-sm font-black text-red-950 uppercase">
                  CẦN HỖ TRỢ TRỰC TRUYỀN HOẶC PHẢN ÁNH ANTT?
                </h5>
                <p className="text-[11px] text-amber-900 font-medium">
                  Trực ban Công an xã Pơng Drang tiếp nhận thông tin khẩn cấp 24/24h.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
              <a
                href="tel:02623539777"
                className="flex-1 sm:flex-initial px-3.5 py-2 bg-red-900 hover:bg-red-950 text-amber-300 font-black text-xs rounded-xl text-center active:scale-95 transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>02623539777</span>
              </a>

              {onOpenReport && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenReport();
                  }}
                  className="flex-1 sm:flex-initial px-3.5 py-2 bg-amber-300 hover:bg-amber-400 text-red-950 font-extrabold text-xs rounded-xl text-center active:scale-95 transition-all shadow-xs"
                >
                  Gửi phản ánh
                </button>
              )}
            </div>
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            Cổng thông tin chính thức Công an xã Pơng Drang - Tỉnh Đắk Lắk
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl active:scale-95 transition-all shadow-xs ml-auto"
          >
            Đóng cửa sổ
          </button>
        </div>

      </div>
    </div>
  );
};
