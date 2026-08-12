import React, { useState, useEffect } from 'react';
import { SiteSettings } from '../../types';
import { dataService } from '../../services/dataService';
import {
  Settings,
  AlertTriangle,
  Shield,
  Save,
  CheckCircle2,
  Sliders,
  Bell,
  CalendarCheck,
  Power
} from 'lucide-react';

export const SettingsAdmin: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const data = await dataService.getSiteSettings();
    setSettings(data);
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    await dataService.updateSiteSettings(settings);
    setSaving(false);
    showToast('Đã lưu cấu hình cài đặt hệ thống!');
  };

  if (loading || !settings) {
    return <div className="py-12 text-center text-slate-400 text-xs font-medium">Đang tải cài đặt hệ thống...</div>;
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Toast */}
      {toastMessage && (
        <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
          <Settings className="w-5 h-5 text-red-800" />
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase">
              CÀI ĐẶT CẤU HÌNH HỆ THỐNG
            </h3>
            <p className="text-[11px] text-slate-500">
              Cấu hình các tính năng chung, thông báo cảnh báo khẩn cấp và trạng thái hoạt động của cổng thông tin
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Tiêu đề chính Cổng Dịch Vụ Công
            </label>
            <input
              type="text"
              required
              value={settings.siteTitle || ''}
              onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
              placeholder="Cổng Dịch Vụ Công..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5 text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Nội dung Cảnh báo Khẩn cấp / Chạy chữ nổi bật
            </label>
            <textarea
              rows={3}
              value={settings.emergencyAlert || ''}
              onChange={(e) => setSettings({ ...settings, emergencyAlert: e.target.value })}
              placeholder="Nhập thông điệp cảnh báo khẩn cấp chạy đầu trang..."
              className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-amber-50/40 focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-semibold text-amber-950"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-red-700" />
              BẬT / TẮT CÁC CHỨC NĂNG CỦA ỨNG DỤNG
            </h4>

            <div className="space-y-2.5">
              <label className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 cursor-pointer hover:border-slate-300">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="font-bold text-slate-800 block">Thanh Cảnh báo Khẩn cấp đầu trang</span>
                    <span className="text-[10px] text-slate-500">Hiển thị khung thông báo đỏ nổi bật trên trang chủ</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableAlertBanner || false}
                  onChange={(e) => setSettings({ ...settings, enableAlertBanner: e.target.checked })}
                  className="w-4 h-4 text-red-700 rounded focus:ring-red-600"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 cursor-pointer hover:border-slate-300">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-red-600" />
                  <div>
                    <span className="font-bold text-slate-800 block">Tiếp nhận Phản ánh ANTT từ công dân</span>
                    <span className="text-[10px] text-slate-500">Cho phép người dân gửi tin báo an ninh trật tự trực tuyến</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allowPublicReports || false}
                  onChange={(e) => setSettings({ ...settings, allowPublicReports: e.target.checked })}
                  className="w-4 h-4 text-red-700 rounded focus:ring-red-600"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 cursor-pointer hover:border-slate-300">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="font-bold text-slate-800 block">Đăng ký Đặt lịch hẹn làm việc trực tuyến</span>
                    <span className="text-[10px] text-slate-500">Cho phép người dân đăng ký lịch làm việc thủ tục hành chính</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allowOnlineAppointments || false}
                  onChange={(e) => setSettings({ ...settings, allowOnlineAppointments: e.target.checked })}
                  className="w-4 h-4 text-red-700 rounded focus:ring-red-600"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 cursor-pointer hover:border-slate-300">
                <div className="flex items-center gap-2">
                  <Power className="w-4 h-4 text-rose-600" />
                  <div>
                    <span className="font-bold text-slate-800 block">Chế độ Bảo trì Hệ thống</span>
                    <span className="text-[10px] text-slate-500">Tạm thời dừng các tính năng tương tác trực tuyến</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode || false}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="w-4 h-4 text-rose-700 rounded focus:ring-rose-600"
                />
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-red-800 hover:bg-red-900 active:scale-95 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Đang lưu...' : 'Lưu cấu hình hệ thống'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
