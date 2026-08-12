import React from 'react';
import { ShieldAlert, PhoneCall, ChevronRight, Radio, Siren, Phone } from 'lucide-react';

interface BannerProps {
  onOpenHotline: () => void;
  onOpenReport: () => void;
}

export const Banner: React.FC<BannerProps> = ({ onOpenHotline, onOpenReport }) => {
  return (
    <div className="max-w-md sm:max-w-2xl mx-auto px-3.5 pt-3 space-y-2.5">
      {/* MAIN HERO BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-red-900 via-red-950 to-red-950 text-white shadow-xs border border-amber-500/30 p-4 sm:p-5">
        {/* Subtle gold accent header line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />

        <div className="flex flex-col justify-between gap-3">
          {/* Top Tag Badges */}
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-900/90 text-amber-300 border border-amber-400/30 text-[11px] font-bold">
              <Radio className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Xã Pơng Drang • Tỉnh Đắk Lắk</span>
            </div>

            <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-200 bg-emerald-950/90 px-2.5 py-1 rounded-lg border border-emerald-500/40 font-bold shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Trực ban 24/7</span>
            </div>
          </div>

          {/* Central Headline & Motto */}
          <div className="my-1">
            <h2 className="text-base sm:text-lg font-extrabold text-amber-300 tracking-tight uppercase leading-snug">
              CỔNG THÔNG TIN ĐIỆN TỬ CÔNG AN XÃ PƠNG DRANG
            </h2>
            <p className="text-xs sm:text-sm text-red-100/90 font-medium italic mt-0.5">
              "Vì nước quên thân, vì dân phục vụ"
            </p>
          </div>

          {/* HOTLINE BANNER - 3 BUTTONS ON 1 HORIZONTAL ROW */}
          <div className="pt-2 border-t border-amber-500/20 space-y-2">
            <div className="text-[11px] font-extrabold uppercase text-amber-300 tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Siren className="w-3.5 h-3.5 text-amber-400" />
                ĐƯỜNG DÂY NÓNG TRỰC BAN KHẨN CẤP
              </span>
              <button
                onClick={onOpenHotline}
                className="text-[10px] text-amber-200 hover:text-white underline font-bold"
              >
                Xem tất cả
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {/* Ô 1: Trực ban Công an xã */}
              <a
                href="tel:02623539777"
                className="p-2 sm:p-2.5 rounded-xl bg-red-900/90 hover:bg-red-800 border border-amber-400/40 text-amber-200 transition-all group flex flex-col justify-between gap-1 shadow-2xs active:scale-98 min-h-[62px]"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] sm:text-[11px] font-bold text-amber-200/90 uppercase truncate">
                    Trực ban Xã
                  </span>
                  <PhoneCall className="w-3 h-3 text-amber-400 shrink-0" />
                </div>
                <div className="text-[10px] sm:text-xs font-black text-amber-300 tracking-tight flex items-center gap-0.5">
                  <Phone className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="truncate">02623539777</span>
                </div>
              </a>

              {/* Ô 2: Trực ban hình sự */}
              <a
                href="tel:02623608839"
                className="p-2 sm:p-2.5 rounded-xl bg-red-900/90 hover:bg-red-800 border border-amber-400/40 text-amber-200 transition-all group flex flex-col justify-between gap-1 shadow-2xs active:scale-98 min-h-[62px]"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] sm:text-[11px] font-bold text-amber-200/90 uppercase truncate">
                    Trực ban Hình sự
                  </span>
                  <Siren className="w-3 h-3 text-amber-400 shrink-0" />
                </div>
                <div className="text-[10px] sm:text-xs font-black text-amber-300 tracking-tight flex items-center gap-0.5">
                  <Phone className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="truncate">02623608839</span>
                </div>
              </a>

              {/* Ô 3: Phản ánh ANTT */}
              <button
                onClick={onOpenReport}
                className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 hover:from-amber-200 hover:to-amber-300 text-red-950 font-black transition-all group flex flex-col justify-between gap-1 shadow-2xs active:scale-98 min-h-[62px] text-left"
              >
                <div className="flex items-center justify-between gap-1 w-full">
                  <span className="text-[10px] sm:text-[11px] font-black uppercase truncate text-red-950">
                    Phản ánh ANTT
                  </span>
                  <ShieldAlert className="w-3.5 h-3.5 text-red-900 shrink-0" />
                </div>
                <div className="text-[10px] sm:text-[11px] font-extrabold text-red-950 flex items-center justify-between w-full">
                  <span>Gửi tin ngay</span>
                  <ChevronRight className="w-3.5 h-3.5 text-red-950 shrink-0" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
