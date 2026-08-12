import React from 'react';
import { Home, Bell, ShieldAlert, PhoneCall, Menu } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  unreadAnnouncements?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  unreadAnnouncements = 0,
}) => {
  const tabs = [
    {
      id: 'home' as TabType,
      label: 'Trang chủ',
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'notifications' as TabType,
      label: 'Thông báo',
      icon: <Bell className="w-5 h-5" />,
      badge: unreadAnnouncements > 0 ? unreadAnnouncements : undefined,
    },
    {
      id: 'report' as TabType,
      label: 'Phản ánh',
      icon: <ShieldAlert className="w-5 h-5" />,
      highlight: true,
    },
    {
      id: 'contact' as TabType,
      label: 'Liên hệ',
      icon: <PhoneCall className="w-5 h-5" />,
    },
    {
      id: 'menu' as TabType,
      label: 'Khác',
      icon: <Menu className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-md pb-safe">
      <div className="max-w-md sm:max-w-2xl mx-auto px-3 py-1.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          if (tab.highlight) {
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className="flex flex-col items-center justify-center relative -top-3 group focus:outline-none shrink-0"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-red-800 to-red-950 text-amber-300 shadow-md flex items-center justify-center border-2 border-amber-400 group-active:scale-95 transition-transform">
                  <ShieldAlert className="w-6 h-6 text-amber-300" />
                </div>
                <span className="text-[10px] font-extrabold text-red-950 mt-0.5">
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2 min-w-[56px] min-h-[44px] rounded-xl transition-all active:scale-95 ${
                isActive ? 'text-red-900 font-extrabold' : 'text-slate-500 font-medium hover:text-slate-800'
              }`}
            >
              {tab.badge && (
                <span className="absolute top-0.5 right-2 w-4 h-4 rounded-full bg-red-700 text-white text-[9px] font-extrabold flex items-center justify-center border border-white">
                  {tab.badge}
                </span>
              )}
              {tab.icon}
              <span className="text-[11px] leading-tight mt-1">{tab.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-800 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

