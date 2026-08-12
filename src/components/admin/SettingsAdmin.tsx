import React, { useState, useEffect } from 'react';
import { SiteSettings } from '../../types';
import { dataService } from '../../services/dataService';
import { analyticsService } from '../../services/analyticsService';
import {
  Settings,
  AlertTriangle,
  Shield,
  Save,
  CheckCircle2,
  Sliders,
  Bell,
  CalendarCheck,
  Power,
  BarChart3,
  Activity,
  Users,
  FileText,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export const SettingsAdmin: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [analyticsSummary, setAnalyticsSummary] = useState({
    totalVisits: 0,
    totalReports: 0,
    totalAppointments: 0,
    totalAiQueries: 0,
    totalProcedureLookups: 0,
    totalEventsCount: 0
  });

  useEffect(() => {
    loadSettings();
    loadAnalytics();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const data = await dataService.getSiteSettings();
    setSettings(data);
    setLoading(false);
  };

  const loadAnalytics = () => {
    const summary = analyticsService.getAnalyticsSummary();
    setAnalyticsSummary(summary);
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

    // Sync with Analytics Service
    if (settings.gaMeasurementId) {
      analyticsService.setMeasurementId(settings.gaMeasurementId);
    }

    setSaving(false);
    showToast('Đã lưu cấu hình hệ thống & Mã theo dõi Google Analytics!');
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

      {/* GOOGLE ANALYTICS QUICK STATS OVERVIEW */}
      <div className="p-4 bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 text-white rounded-2xl shadow-md border border-amber-400/40 space-y-3">
        <div className="flex items-center justify-between border-b border-red-800/80 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-400 text-red-950 font-black shadow-xs">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wide">
                THỐNG KÊ LƯỢT TRUY CẬP & TIỆN ÍCH CÔNG DÂN
              </h3>
              <p className="text-[11px] text-red-200/90 font-medium">
                Dữ liệu đo lường thực tế nhu cầu người dân xã Pơng Drang
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase border border-emerald-400/40 flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-400 animate-pulse" /> GA4 Active
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
            <Users className="w-4 h-4 text-amber-300 mx-auto mb-1" />
            <span className="text-[10px] text-slate-300 font-bold block">Lượt truy cập</span>
            <span className="text-base font-black text-amber-300">{analyticsSummary.totalVisits}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
            <Shield className="w-4 h-4 text-red-400 mx-auto mb-1" />
            <span className="text-[10px] text-slate-300 font-bold block">Gửi Phản ánh ANTT</span>
            <span className="text-base font-black text-red-300">{analyticsSummary.totalReports}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
            <CalendarCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <span className="text-[10px] text-slate-300 font-bold block">Đặt lịch hẹn làm việc</span>
            <span className="text-base font-black text-emerald-300">{analyticsSummary.totalAppointments}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
            <Sparkles className="w-4 h-4 text-sky-400 mx-auto mb-1" />
            <span className="text-[10px] text-slate-300 font-bold block">Hỏi đáp Trợ lý AI</span>
            <span className="text-base font-black text-sky-300">{analyticsSummary.totalAiQueries}</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
          <Settings className="w-5 h-5 text-red-800" />
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase">
              CÀI ĐẶT CẤU HÌNH HỆ THỐNG
            </h3>
            <p className="text-[11px] text-slate-500">
              Cấu hình các tính năng chung, mã Google Analytics và trạng thái hoạt động của cổng thông tin
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

          {/* GOOGLE ANALYTICS MEASUREMENT ID INPUT */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-red-800" />
                MÃ THEO DÕI GOOGLE ANALYTICS (GA4 MEASUREMENT ID)
              </label>
              <span className="text-[10px] text-slate-400 font-bold">Ví dụ: G-PONGDRANG2026</span>
            </div>
            <input
              type="text"
              value={settings.gaMeasurementId || ''}
              onChange={(e) => setSettings({ ...settings, gaMeasurementId: e.target.value })}
              placeholder="G-XXXXXXXXXX"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 font-mono font-bold text-red-950 uppercase"
            />
            <p className="text-[11px] text-slate-500 font-medium">
              Mã theo dõi này giúp Ban Biên tập Công an xã theo dõi chi tiết lượt người dân truy cập, tra cứu thủ tục hành chính và nhu cầu sử dụng dịch vụ công trực tuyến.
            </p>
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
                  <BarChart3 className="w-4 h-4 text-sky-600" />
                  <div>
                    <span className="font-bold text-slate-800 block">Theo dõi Thống kê Google Analytics</span>
                    <span className="text-[10px] text-slate-500">Kích hoạt gửi dữ liệu tương tác người dân về bảng thống kê</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableAnalytics !== false}
                  onChange={(e) => setSettings({ ...settings, enableAnalytics: e.target.checked })}
                  className="w-4 h-4 text-red-700 rounded focus:ring-red-600"
                />
              </label>

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
