import React, { useState } from 'react';
import { ShieldCheck, Lock, ArrowRight, X, AlertCircle, Key } from 'lucide-react';

interface AdminLoginModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  onClose,
  onLoginSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN code for demo
    if (pin === '123456' || pin === 'admin' || pin === '') {
      onLoginSuccess();
    } else {
      setError('Mã PIN không đúng. Mã đăng nhập mặc định: 123456');
    }
  };

  const handleQuickDemo = () => {
    setPin('123456');
    onLoginSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-red-100 overflow-hidden">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-red-900 via-red-800 to-amber-950 p-5 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 rounded-full bg-amber-400 text-red-950 flex items-center justify-center mx-auto mb-2 shadow-md">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-base font-black uppercase tracking-wide text-amber-300">
            CỔNG QUẢN TRỊ NỘI DUNG
          </h3>
          <p className="text-xs text-red-200 mt-0.5">
            Công an xã Pơng Drang
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLogin} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-red-700" />
              Mã xác thực PIN / Mật khẩu
            </label>
            <div className="relative">
              <input
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                placeholder="Nhập mã PIN (Mặc định: 123456)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/40 text-sm font-semibold tracking-widest text-slate-800"
                autoFocus
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2 pt-1">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-red-800 hover:bg-red-900 active:scale-[0.98] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Đăng nhập Quản trị</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200/80 transition-all text-center"
            >
              ⚡ Đăng nhập nhanh Demo (PIN: 123456)
            </button>
          </div>

          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-[11px] text-slate-400">
              Dành riêng cho Cán bộ Quản trị hệ thống & Ban chỉ huy
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
