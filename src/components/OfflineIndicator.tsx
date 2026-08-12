import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, Phone } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline && !showReconnected) return null;

  return (
    <div className="fixed top-14 left-0 right-0 z-30 px-3 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        {isOffline ? (
          <div className="bg-amber-50 border border-amber-300 text-amber-900 px-3 py-2 rounded-xl shadow-lg flex items-center justify-between text-xs animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-700 shrink-0 animate-pulse" />
              <div>
                <span className="font-bold">Chế độ Ngoại tuyến (Offline):</span>
                <span className="text-amber-800 ml-1">Đang xem dữ liệu đã lưu.</span>
              </div>
            </div>
            <a
              href="tel:02623876113"
              className="bg-red-800 hover:bg-red-900 text-amber-200 font-bold px-2 py-1 rounded-lg flex items-center gap-1 text-[11px] shrink-0"
            >
              <Phone className="w-3 h-3" />
              <span>Gọi 0262.3876.113</span>
            </a>
          </div>
        ) : (
          <div className="bg-emerald-700 text-white px-3 py-2 rounded-xl shadow-lg flex items-center gap-2 text-xs animate-in slide-in-from-top duration-200">
            <Wifi className="w-4 h-4 text-emerald-200 shrink-0" />
            <span className="font-bold">Đã khôi phục kết nối mạng Internet.</span>
          </div>
        )}
      </div>
    </div>
  );
};
