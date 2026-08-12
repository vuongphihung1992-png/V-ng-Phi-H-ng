import React from 'react';
import { Bell, Menu, Shield } from 'lucide-react';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenMenu: () => void;
  onOpenAdmin: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  onOpenMenu,
  onOpenAdmin,
  unreadCount = 2,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-red-950 text-white shadow-sm border-b border-amber-500/30">
      <div className="max-w-md sm:max-w-2xl mx-auto px-3.5 py-2.5 flex items-center justify-between gap-2">
        {/* Left: Logo Badge & Unit Name */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-b from-amber-300 to-amber-500 p-0.5 shadow-sm shrink-0 border border-amber-200">
            <div className="w-full h-full rounded-[10px] bg-red-900 flex items-center justify-center text-amber-300 font-extrabold">
              <Shield className="w-5 h-5 text-amber-300 fill-amber-400/30" />
            </div>
          </div>

          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-extrabold text-amber-300 uppercase tracking-wide truncate leading-tight">
              CÔNG AN XÃ PƠNG DRANG
            </h1>
            <p className="text-[10px] sm:text-xs text-red-200/90 font-medium truncate">
              Cổng thông tin & Dịch vụ hành chính công
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Admin Portal Shortcut */}
          <button
            onClick={onOpenAdmin}
            title="Cổng Quản trị viên"
            className="px-2.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 transition-all text-red-950 border border-amber-300 flex items-center gap-1 text-[11px] font-extrabold shadow-xs shrink-0"
          >
            <Shield className="w-3.5 h-3.5 text-red-950" />
            <span className="hidden xs:inline">Quản trị</span>
          </button>

          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            title="Thông báo"
            className="relative p-2.5 rounded-xl bg-red-900/60 hover:bg-red-900 active:scale-95 transition-all text-amber-200 border border-amber-500/20 flex items-center justify-center shrink-0 min-w-[40px] min-h-[40px]"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-red-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-red-950 shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Menu */}
          <button
            onClick={onOpenMenu}
            title="Menu chức năng"
            className="p-2.5 rounded-xl bg-red-900/60 hover:bg-red-900 active:scale-95 transition-all text-amber-200 border border-amber-500/20 flex items-center justify-center shrink-0 min-w-[40px] min-h-[40px]"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};


