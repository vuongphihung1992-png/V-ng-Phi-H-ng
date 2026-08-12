import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share, PlusSquare, CheckCircle2, Shield } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // Check if app is already running in PWA standalone mode
    const isAppStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    setIsStandalone(isAppStandalone);

    if (isAppStandalone) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // Listen for BeforeInstallPromptEvent on Android/Chrome/Edge/Desktop
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Auto show install banner if not dismissed before
      const hasDismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (!hasDismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setInstalledSuccess(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      setTimeout(() => setInstalledSuccess(false), 4000);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Show prompt for iOS if not standalone and not dismissed
    if (isIOSDevice && !isAppStandalone) {
      const hasDismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (!hasDismissed) {
        setShowPrompt(true);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the PWA install prompt');
      setInstalledSuccess(true);
      setTimeout(() => setInstalledSuccess(false), 4000);
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSInstructions(false);
    localStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (isStandalone) return null;

  return (
    <>
      {/* Toast notification on successful installation */}
      {installedSuccess && (
        <div className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto bg-emerald-800 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-600 animate-bounce">
          <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-300" />
          <div className="text-xs">
            <p className="font-bold text-sm">Đã cài đặt ứng dụng thành công!</p>
            <p className="text-emerald-100">"Công an Pơng Drang" đã có mặt trên màn hình chính của bạn.</p>
          </div>
        </div>
      )}

      {/* Floating PWA Banner */}
      {showPrompt && !installedSuccess && (
        <div className="fixed bottom-20 left-3 right-3 z-40 max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-red-900/20 p-4 transition-all animate-in slide-in-from-bottom duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-800 to-red-950 p-0.5 shadow-md flex items-center justify-center border border-amber-400/50">
                <Shield className="w-7 h-7 text-amber-300 fill-amber-400/20" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-900 text-[10px] font-black tracking-wider uppercase">PWA Official</span>
                <h4 className="font-extrabold text-sm text-slate-900 truncate">Công an Pơng Drang</h4>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                Thêm ứng dụng vào Màn hình chính để sử dụng mượt mà, thông báo nhanh & làm việc offline.
              </p>
            </div>

            <button
              onClick={handleDismiss}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
              title="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-950 active:scale-95 text-amber-300 font-bold text-xs py-2 px-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all border border-amber-400/30"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Cài đặt ứng dụng</span>
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Để sau
            </button>
          </div>
        </div>
      )}

      {/* iOS Instructions Modal */}
      {showIOSInstructions && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-red-900/20 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div className="flex items-center gap-2 text-red-900">
                <Smartphone className="w-5 h-5 text-red-800" />
                <h3 className="font-extrabold text-base text-slate-900">Hướng dẫn cài đặt trên iOS</h3>
              </div>
              <button
                onClick={() => setShowIOSInstructions(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Trình duyệt Safari trên iPhone/iPad yêu cầu cài đặt thủ công theo 2 bước đơn giản sau:
            </p>

            <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-800 text-amber-300 font-extrabold text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="text-xs text-slate-800">
                  <p className="font-bold flex items-center gap-1.5">
                    Nhấn biểu tượng Chia sẻ <Share className="w-3.5 h-3.5 text-blue-600 inline" />
                  </p>
                  <p className="text-slate-500 text-[11px]">Nằm ở thanh công cụ phía dưới cùng của màn hình Safari.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-slate-200/80">
                <div className="w-6 h-6 rounded-full bg-red-800 text-amber-300 font-extrabold text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="text-xs text-slate-800">
                  <p className="font-bold flex items-center gap-1.5">
                    Chọn "Thêm vào Màn hình chính" <PlusSquare className="w-3.5 h-3.5 text-slate-700 inline" />
                  </p>
                  <p className="text-slate-500 text-[11px]">Cuộn xuống danh sách menu tùy chọn và nhấn "Thêm" (Add).</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSInstructions(false)}
              className="w-full py-2.5 bg-red-800 hover:bg-red-900 text-white font-bold text-xs rounded-xl shadow-md transition-all text-center"
            >
              Đã hiểu, tôi sẽ làm theo
            </button>
          </div>
        </div>
      )}
    </>
  );
};
