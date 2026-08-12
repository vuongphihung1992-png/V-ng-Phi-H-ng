import React, { useState, useEffect } from 'react';
import { AdminTab } from '../../types';
import { dataService } from '../../services/dataService';
import {
  LayoutDashboard,
  Newspaper,
  Bell,
  ShieldAlert,
  Calendar,
  HelpCircle,
  Phone,
  Image as ImageIcon,
  Settings,
  LogOut,
  ArrowLeft,
  RefreshCw,
  Clock,
  TrendingUp,
  Building2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

import { NewsAdmin } from './NewsAdmin';
import { AnnouncementsAdmin } from './AnnouncementsAdmin';
import { ReportsAdmin } from './ReportsAdmin';
import { AppointmentsAdmin } from './AppointmentsAdmin';
import { FaqAdmin } from './FaqAdmin';
import { ContactAdmin } from './ContactAdmin';
import { BannersAdmin } from './BannersAdmin';
import { SettingsAdmin } from './SettingsAdmin';
import { HamletOfficersAdmin } from './HamletOfficersAdmin';

interface AdminDashboardProps {
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExitAdmin }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [stats, setStats] = useState({
    totalReports: 0,
    newReports: 0,
    pendingAppointments: 0,
    newsCount: 0,
    announcementsCount: 0,
    faqCount: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, [activeTab]);

  const loadDashboardStats = async () => {
    setLoadingStats(true);
    const [reports, appointments, news, announcements, faqs] = await Promise.all([
      dataService.getReports(),
      dataService.getAppointments(),
      dataService.getNews(true),
      dataService.getAnnouncements(true),
      dataService.getFaqs(true)
    ]);

    const newReps = reports.filter((r) => r.status === 'Đã tiếp nhận').length;
    const pendingAppts = appointments.filter((a) => a.status === 'Đã đăng ký').length;

    setStats({
      totalReports: reports.length,
      newReports: newReps,
      pendingAppointments: pendingAppts,
      newsCount: news.length,
      announcementsCount: announcements.length,
      faqCount: faqs.length
    });
    setLoadingStats(false);
  };

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: 'Tổng quan',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'reports',
      label: 'Phản ánh ANTT',
      icon: <ShieldAlert className="w-4 h-4" />,
      badge: stats.newReports > 0 ? stats.newReports : undefined
    },
    {
      id: 'appointments',
      label: 'Lịch làm việc',
      icon: <Calendar className="w-4 h-4" />,
      badge: stats.pendingAppointments > 0 ? stats.pendingAppointments : undefined
    },
    {
      id: 'news',
      label: 'Tin tức',
      icon: <Newspaper className="w-4 h-4" />
    },
    {
      id: 'announcements',
      label: 'Thông báo',
      icon: <Bell className="w-4 h-4" />
    },
    {
      id: 'faqs',
      label: 'FAQ / Thường gặp',
      icon: <HelpCircle className="w-4 h-4" />
    },
    {
      id: 'contact',
      label: 'Thông tin liên hệ',
      icon: <Phone className="w-4 h-4" />
    },
    {
      id: 'banners',
      label: 'Banner Hero',
      icon: <ImageIcon className="w-4 h-4" />
    },
    {
      id: 'settings',
      label: 'Cài đặt Website',
      icon: <Settings className="w-4 h-4" />
    },
    {
      id: 'officers',
      label: 'Cán bộ 12 Thôn',
      icon: <ShieldAlert className="w-4 h-4" />
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-16">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-red-950 via-red-900 to-amber-950 text-white shadow-md border-b border-amber-500/30">
        <div className="max-w-4xl mx-auto px-3 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onExitAdmin}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all flex items-center gap-1 text-xs font-bold shrink-0"
              title="Quay lại giao diện người dân"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden xs:inline">Thoát Quản trị</span>
            </button>

            <div>
              <h1 className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wide leading-tight flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-400" />
                HỆ THỐNG QUẢN TRỊ NỘI DUNG
              </h1>
              <p className="text-[10px] text-red-200/90 font-medium truncate">
                Công an xã Pơng Drang • Tỉnh Đắk Lắk
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={loadDashboardStats}
              title="Tải lại dữ liệu"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-200 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onExitAdmin}
              className="px-2.5 py-1.5 rounded-xl bg-amber-400 text-red-950 font-black text-xs hover:bg-amber-300 transition-all flex items-center gap-1 shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>

        {/* Scrollable Admin Nav Tabs */}
        <div className="max-w-4xl mx-auto px-2 overflow-x-auto no-scrollbar flex items-center gap-1 py-1.5 border-t border-red-900/60">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-amber-400 text-red-950 shadow-md scale-100'
                    : 'bg-red-950/60 text-red-100 hover:bg-red-900/80 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-red-600 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-4xl mx-auto px-3 py-4">
        {/* Module 1: Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            {/* KPI Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {/* Stat 1: Total Reports */}
              <div
                onClick={() => setActiveTab('reports')}
                className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-red-400 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-red-700 mb-1">
                  <ShieldAlert className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase text-slate-400">TỔNG SỐ</span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  {loadingStats ? '...' : stats.totalReports}
                </div>
                <div className="text-[11px] font-bold text-slate-600 mt-0.5">
                  Phản ánh ANTT
                </div>
              </div>

              {/* Stat 2: New Reports */}
              <div
                onClick={() => setActiveTab('reports')}
                className="p-3 bg-red-50/80 rounded-2xl border border-red-200/80 shadow-2xs hover:border-red-500 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-red-700 mb-1">
                  <AlertCircle className="w-5 h-5 animate-pulse" />
                  <span className="text-[10px] font-black uppercase text-red-700 bg-red-100 px-1.5 py-0.2 rounded">MỚI</span>
                </div>
                <div className="text-xl font-black text-red-900">
                  {loadingStats ? '...' : stats.newReports}
                </div>
                <div className="text-[11px] font-extrabold text-red-800 mt-0.5">
                  Phản ánh mới
                </div>
              </div>

              {/* Stat 3: Pending Appointments */}
              <div
                onClick={() => setActiveTab('appointments')}
                className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200/80 shadow-2xs hover:border-amber-500 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-amber-700 mb-1">
                  <Clock className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">CHỜ</span>
                </div>
                <div className="text-xl font-black text-amber-900">
                  {loadingStats ? '...' : stats.pendingAppointments}
                </div>
                <div className="text-[11px] font-extrabold text-amber-800 mt-0.5">
                  Lịch chờ xác nhận
                </div>
              </div>

              {/* Stat 4: News count */}
              <div
                onClick={() => setActiveTab('news')}
                className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-blue-400 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-blue-700 mb-1">
                  <Newspaper className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase text-slate-400">BÀI VIẾT</span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  {loadingStats ? '...' : stats.newsCount}
                </div>
                <div className="text-[11px] font-bold text-slate-600 mt-0.5">
                  Tin tức & Hoạt động
                </div>
              </div>

              {/* Stat 5: Announcements count */}
              <div
                onClick={() => setActiveTab('announcements')}
                className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-emerald-400 transition-all cursor-pointer group col-span-2 sm:col-span-1"
              >
                <div className="flex items-center justify-between text-emerald-700 mb-1">
                  <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase text-slate-400">VĂN BẢN</span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  {loadingStats ? '...' : stats.announcementsCount}
                </div>
                <div className="text-[11px] font-bold text-slate-600 mt-0.5">
                  Thông báo
                </div>
              </div>
            </div>

            {/* Quick Action Shortcuts */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
              <h3 className="text-xs font-black text-red-950 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-red-700" />
                LỐI TẮT XỬ LÝ NHANH QUẢN TRỊ
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <button
                  onClick={() => setActiveTab('reports')}
                  className="p-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-900 border border-red-200 font-bold flex flex-col items-center text-center gap-1.5 transition-all"
                >
                  <ShieldAlert className="w-6 h-6 text-red-700" />
                  <span>Xử lý Phản ánh ANTT ({stats.newReports} mới)</span>
                </button>

                <button
                  onClick={() => setActiveTab('appointments')}
                  className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold flex flex-col items-center text-center gap-1.5 transition-all"
                >
                  <Calendar className="w-6 h-6 text-amber-700" />
                  <span>Duyệt Lịch hẹn làm việc ({stats.pendingAppointments})</span>
                </button>

                <button
                  onClick={() => setActiveTab('news')}
                  className="p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-bold flex flex-col items-center text-center gap-1.5 transition-all"
                >
                  <Newspaper className="w-6 h-6 text-blue-700" />
                  <span>Thêm Tin tức mới</span>
                </button>

                <button
                  onClick={() => setActiveTab('announcements')}
                  className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold flex flex-col items-center text-center gap-1.5 transition-all"
                >
                  <Bell className="w-6 h-6 text-emerald-700" />
                  <span>Đăng Thông báo mới</span>
                </button>
              </div>
            </div>

            {/* Service & Database Abstraction Status */}
            <div className="p-3 bg-gradient-to-r from-red-900 to-amber-950 text-white rounded-2xl shadow-sm border border-amber-500/30 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                <div className="min-w-0">
                  <span className="font-bold text-amber-300 block">
                    DATABASE SERVICE ABSTRACTION LAYER ACTIVE
                  </span>
                  <span className="text-[11px] text-red-100/90 truncate block">
                    Dữ liệu được lưu trữ & đồng bộ qua Data Service Layer (Sẵn sàng kết nối Firebase / Supabase)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Module 2: Quản lý tin tức */}
        {activeTab === 'news' && <NewsAdmin />}

        {/* Module 3: Quản lý thông báo */}
        {activeTab === 'announcements' && <AnnouncementsAdmin />}

        {/* Module 4: Quản lý phản ánh */}
        {activeTab === 'reports' && <ReportsAdmin />}

        {/* Module 5: Quản lý lịch làm việc */}
        {activeTab === 'appointments' && <AppointmentsAdmin />}

        {/* Module 6: Quản lý FAQ */}
        {activeTab === 'faqs' && <FaqAdmin />}

        {/* Module 7: Quản lý thông tin liên hệ */}
        {activeTab === 'contact' && <ContactAdmin />}

        {/* Module 8: Quản lý banner */}
        {activeTab === 'banners' && <BannersAdmin />}

        {/* Module 9: Cài đặt website */}
        {activeTab === 'settings' && <SettingsAdmin />}

        {/* Module 10: Quản lý Cán bộ 12 Thôn */}
        {activeTab === 'officers' && <HamletOfficersAdmin />}
      </main>
    </div>
  );
};
