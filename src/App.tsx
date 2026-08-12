import React, { useState, useEffect } from 'react';
import { TabType, ModalType, SecurityReport, Appointment, NewsItem, Announcement, FAQItem, HotlineNumber, ContactInfo, BannerItem } from './types';
import { dataService } from './services/dataService';
import { MOCK_PROCEDURES, MOCK_HOTLINES } from './data/mockData';

import { Header } from './components/Header';
import { Banner } from './components/Banner';
import { SearchBar } from './components/SearchBar';
import { QuickActions } from './components/QuickActions';
import { AnnouncementsSection } from './components/AnnouncementsSection';
import { NewsSection } from './components/NewsSection';
import { BottomNav } from './components/BottomNav';
import { Toast, ToastMessage } from './components/Toast';

// Modals & Admin
import { SecurityReportModal } from './components/SecurityReportModal';
import { AppointmentModal } from './components/AppointmentModal';
import { HotlineModal } from './components/HotlineModal';
import { FAQModal } from './components/FAQModal';
import { AboutModal } from './components/AboutModal';
import { SearchModal } from './components/SearchModal';
import { ProceduresModal } from './components/ProceduresModal';
import { HistoryModal } from './components/HistoryModal';
import { HamletOfficersModal } from './components/HamletOfficersModal';
import { AnnouncementsModal } from './components/AnnouncementsModal';

import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';

// PWA Utilities
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { AIChatbox } from './components/AIChatbox';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  
  // Admin Mode State
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Live Data from Data Service
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [announcementsList, setAnnouncementsList] = useState<Announcement[]>([]);
  const [faqList, setFaqList] = useState<FAQItem[]>([]);
  const [reports, setReports] = useState<SecurityReport[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [banners, setBanners] = useState<BannerItem[]>([]);

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    loadAllData();
  }, [isAdmin, activeModal]);

  const loadAllData = async () => {
    try {
      const [n, a, f, r, appts, c, b] = await Promise.all([
        dataService.getNews(false),
        dataService.getAnnouncements(false),
        dataService.getFaqs(false),
        dataService.getReports(),
        dataService.getAppointments(),
        dataService.getContactInfo(),
        dataService.getBanners()
      ]);
      setNewsList(n);
      setAnnouncementsList(a);
      setFaqList(f);
      setReports(r);
      setAppointments(appts);
      setContactInfo(c);
      setBanners(b);
    } catch (e) {
      console.error('Error loading data in App.tsx', e);
    }
  };

  const addToast = (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setActiveTab('home');
  };

  const handleTabChange = (tab: TabType) => {
    if (tab === 'admin') {
      setShowAdminLogin(true);
      return;
    }

    setActiveTab(tab);
    if (tab === 'home') {
      setActiveModal(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'notifications') {
      setActiveModal('announcements_list');
    } else if (tab === 'report') {
      setActiveModal('report');
    } else if (tab === 'contact') {
      setActiveModal('hotline');
    } else if (tab === 'menu') {
      setActiveModal('about');
    } else {
      setActiveModal(null);
    }
  };

  const handleCreateReport = async (newReportData: Omit<SecurityReport, 'id' | 'receiptCode' | 'createdAt' | 'status'>) => {
    const created = await dataService.addReport(newReportData);
    await loadAllData();
    handleCloseModal();
    addToast(
      'success',
      'Gửi phản ánh thành công!',
      `Mã hồ sơ của bạn: ${created.receiptCode}. Công an xã sẽ kiểm tra & xử lý theo quy định.`
    );
  };

  const handleCreateAppointment = async (newApptData: Omit<Appointment, 'id' | 'bookingCode' | 'createdAt' | 'status'>) => {
    const created = await dataService.addAppointment(newApptData);
    await loadAllData();
    handleCloseModal();
    addToast(
      'success',
      'Đăng ký lịch làm việc thành công!',
      `Mã đặt lịch: ${created.bookingCode}. Vui lòng có mặt đúng giờ hẹn tại Trụ sở.`
    );
  };

  // IF ADMIN MODE IS ACTIVE -> Render Admin Dashboard
  if (isAdmin) {
    return (
      <AdminDashboard
        onExitAdmin={() => {
          setIsAdmin(false);
          loadAllData();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-20 selection:bg-red-800 selection:text-white">
      {/* Offline Status Indicator */}
      <OfflineIndicator />

      {/* PWA "Add to Home Screen" Install Prompt */}
      <PWAInstallPrompt />

      {/* 1. Header Section */}
      <Header
        unreadCount={announcementsList.filter((a) => a.isNew).length}
        onOpenNotifications={() => setActiveModal('announcements_list')}
        onOpenMenu={() => setActiveModal('about')}
        onOpenAdmin={() => setShowAdminLogin(true)}
      />

      {/* Main Container */}
      <main className="max-w-md sm:max-w-2xl mx-auto space-y-2">
        {/* 2. Hero Banner */}
        <Banner
          onOpenHotline={() => setActiveModal('hotline')}
          onOpenReport={() => setActiveModal('report')}
        />

        {/* 2.5. Content Search Bar (Tin tức, Thông báo, Thủ tục) */}
        <SearchBar
          announcements={announcementsList}
          news={newsList}
          procedures={MOCK_PROCEDURES}
          faqs={faqList}
          onOpenModal={(type) => setActiveModal(type)}
        />

        {/* 3. Quick Actions */}
        <QuickActions
          onOpenModal={(type) => setActiveModal(type)}
          unreadAnnouncements={announcementsList.filter((a) => a.isNew).length}
          announcements={announcementsList}
        />

        {/* 4. Announcements / Bulletins */}
        <AnnouncementsSection
          announcements={announcementsList}
          onOpenAll={() => setActiveModal('announcements_list')}
        />

        {/* 5. News & Local Activities */}
        <NewsSection
          news={newsList}
          onOpenAll={() => setActiveModal('news_list')}
        />

        {/* Footer info bar with live editable contact details */}
        <footer className="px-4 py-6 text-center text-xs text-slate-500 border-t border-slate-200/80 mt-6 space-y-1">
          <p className="font-extrabold text-red-950 uppercase tracking-wide">
            {contactInfo?.unitName || 'CÔNG AN XÃ PƠNG DRANG'}
          </p>
          <p className="text-slate-600">
            Địa chỉ: {contactInfo?.address || 'Thôn 3, Xã Pơng Drang, Tỉnh Đắk Lắk'}
          </p>
          <p className="text-slate-500">
            Trực ban Công an xã: <span className="font-bold text-red-700">02623539777</span> • Trực ban Hình sự: <span className="font-bold text-red-700">02623608839</span>
          </p>
          <div className="pt-2">
            <button
              onClick={() => setShowAdminLogin(true)}
              className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-bold rounded-lg transition-colors inline-flex items-center gap-1"
            >
              🔒 Cổng Quản trị viên (Admin Portal)
            </button>
          </div>
          <p className="pt-2 text-[10px] text-slate-400">
            © 2026 Cổng thông tin điện tử Công an nhân dân Việt Nam. Phiên bản Smartphone Applet.
          </p>
        </footer>
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={handleTabChange}
        unreadAnnouncements={announcementsList.filter((a) => a.isNew).length}
      />

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onClose={removeToast} />

      {/* Floating Draggable AI Chatbox */}
      <AIChatbox
        onOpenReport={() => setActiveModal('report')}
        onOpenHotline={() => setActiveModal('hotline')}
        onOpenProcedures={() => setActiveModal('procedures')}
      />

      {/* Admin Passcode Modal */}
      {showAdminLogin && (
        <AdminLoginModal
          onClose={() => setShowAdminLogin(false)}
          onLoginSuccess={() => {
            setShowAdminLogin(false);
            setIsAdmin(true);
          }}
        />
      )}

      {/* Render Active Public Modals */}
      {activeModal === 'report' && (
        <SecurityReportModal
          onClose={handleCloseModal}
          onSubmit={handleCreateReport}
        />
      )}

      {activeModal === 'appointment' && (
        <AppointmentModal
          onClose={handleCloseModal}
          onSubmit={handleCreateAppointment}
        />
      )}

      {activeModal === 'hotline' && (
        <HotlineModal
          isOpen={true}
          hotlines={MOCK_HOTLINES}
          onClose={handleCloseModal}
        />
      )}

      {activeModal === 'faq' && (
        <FAQModal
          faqs={faqList}
          onClose={handleCloseModal}
        />
      )}

      {activeModal === 'about' && (
        <AboutModal
          isOpen={true}
          onClose={handleCloseModal}
        />
      )}

      {activeModal === 'search' && (
        <SearchModal
          procedures={MOCK_PROCEDURES}
          announcements={announcementsList}
          news={newsList}
          onClose={handleCloseModal}
        />
      )}

      {activeModal === 'procedures' && (
        <ProceduresModal
          isOpen={true}
          procedures={MOCK_PROCEDURES}
          onClose={handleCloseModal}
          onOpenAppointment={() => setActiveModal('appointment')}
        />
      )}

      {activeModal === 'history' && (
        <HistoryModal
          reports={reports}
          appointments={appointments}
          onClose={handleCloseModal}
        />
      )}

      {activeModal === 'announcements_list' && (
        <AnnouncementsModal
          isOpen={true}
          announcements={announcementsList}
          onClose={handleCloseModal}
          onOpenReport={() => setActiveModal('report')}
          onOpenAppointment={() => setActiveModal('appointment')}
          onOpenHotline={() => setActiveModal('hotline')}
        />
      )}

      {activeModal === 'news_list' && (
        <SearchModal
          procedures={MOCK_PROCEDURES}
          announcements={announcementsList}
          news={newsList}
          initialCategory="Tin tức"
          onClose={handleCloseModal}
        />
      )}

      {activeModal === 'messages' && (
        <HotlineModal
          isOpen={true}
          hotlines={MOCK_HOTLINES}
          onClose={handleCloseModal}
        />
      )}

      {activeModal === 'map' && (
        <AboutModal
          isOpen={true}
          onClose={handleCloseModal}
        />
      )}

      {activeModal === 'officers' && (
        <HamletOfficersModal
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
