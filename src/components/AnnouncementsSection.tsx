import React, { useState } from 'react';
import { Bell, ChevronRight, Calendar, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { Announcement } from '../types';

interface AnnouncementsSectionProps {
  announcements: Announcement[];
  onOpenAll: () => void;
}

export const AnnouncementsSection: React.FC<AnnouncementsSectionProps> = ({
  announcements,
  onOpenAll,
}) => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  return (
    <section className="max-w-md sm:max-w-2xl mx-auto px-3.5 py-2.5">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-red-100/90 text-red-800 shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-red-950 uppercase tracking-tight flex items-center gap-1.5">
              THÔNG BÁO CHÍNH THỨC
            </h3>
            <p className="text-[11px] text-slate-500 font-bold">
              Chỉ đạo, thông tin tiếp dân & cảnh báo an ninh
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAll}
          className="text-xs font-bold text-red-800 hover:text-red-950 flex items-center gap-0.5 group active:scale-95"
        >
          <span>Xem tất cả</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* List items */}
      <div className="space-y-2.5">
        {announcements.slice(0, 3).map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedAnnouncement(item)}
            className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-red-300 hover:shadow-xs transition-all cursor-pointer group active:scale-[0.99]"
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-lg bg-red-50 text-red-900 border border-red-200/80 text-[10px] font-extrabold">
                  {item.category}
                </span>

                {item.isNew && (
                  <span className="px-2 py-0.5 rounded-lg bg-amber-400 text-red-950 text-[10px] font-extrabold">
                    MỚI
                  </span>
                )}

                {item.important && (
                  <span className="px-2 py-0.5 rounded-lg bg-red-700 text-white text-[10px] font-extrabold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Quan trọng
                  </span>
                )}
              </div>

              <span className="text-[11px] text-slate-500 font-bold flex items-center gap-1 shrink-0">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {item.date}
              </span>
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-red-900 transition-colors line-clamp-2 leading-snug">
              {item.title}
            </h4>

            <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{item.summary}</p>

            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Công an xã Pơng Drang</span>
              <span className="text-red-800 font-bold group-hover:underline flex items-center gap-0.5">
                Xem chi tiết <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detail */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden max-h-[85vh] flex flex-col border border-slate-200">
            {/* Header */}
            <div className="bg-red-950 p-4 text-white flex items-center justify-between border-b border-amber-500/30">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-300" />
                <h3 className="font-extrabold text-sm sm:text-base text-amber-300">Nội dung thông báo</h3>
              </div>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="p-1.5 rounded-xl text-red-200 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-lg bg-red-50 text-red-900 font-extrabold text-xs border border-red-200">
                  {selectedAnnouncement.category}
                </span>
                <span className="text-xs text-slate-600 font-bold">
                  Ngày đăng: {selectedAnnouncement.date}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                {selectedAnnouncement.title}
              </h2>

              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-950 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Thông báo chính thức ban hành bởi Công an xã Pơng Drang</span>
              </div>

              <div className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed space-y-2 font-normal">
                {selectedAnnouncement.content}
              </div>
            </div>

            {/* Footer */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="px-5 py-2.5 bg-red-900 hover:bg-red-950 text-white text-xs font-bold rounded-xl active:scale-95 transition-all shadow-xs"
              >
                Đóng thông báo
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

