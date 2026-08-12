import { SITE_CONFIG } from '../config/siteConfig';
import { ENV } from '../config/env';
import { SupabaseReportService } from './supabaseReportService';
import { SupabaseNewsService } from './supabaseNewsService';
import { SupabaseAppointmentService } from './supabaseAppointmentService';
import {
  NewsItem,
  Announcement,
  SecurityReport,
  Appointment,
  FAQItem,
  ContactInfo,
  BannerItem,
  SiteSettings,
  Procedure,
  HamletOfficer
} from '../types';

const supabaseReportService = new SupabaseReportService();
const supabaseNewsService = new SupabaseNewsService();
const supabaseAppointmentService = new SupabaseAppointmentService();
import {
  MOCK_ANNOUNCEMENTS,
  MOCK_NEWS,
  MOCK_PROCEDURES,
  MOCK_FAQS,
  MOCK_HAMLET_OFFICERS,
  HAMLETS
} from '../data/mockData';

// Storage Keys
const KEYS = {
  NEWS: 'cad_news',
  ANNOUNCEMENTS: 'cad_announcements',
  REPORTS: 'cad_reports',
  APPOINTMENTS: 'cad_appointments',
  FAQS: 'cad_faqs',
  CONTACT: 'cad_contact',
  BANNERS: 'cad_banners',
  SETTINGS: 'cad_settings',
  OFFICERS: 'cad_hamlet_officers'
};

// Initial Contact Info based on SITE_CONFIG
const INITIAL_CONTACT: ContactInfo = {
  unitName: SITE_CONFIG.organizationName,
  unitSubtitle: SITE_CONFIG.province,
  address: SITE_CONFIG.address,
  districtProvince: SITE_CONFIG.province,
  hotlinePhone: SITE_CONFIG.hotline,
  dutyPhone: SITE_CONFIG.dutyPhone,
  email: SITE_CONFIG.email,
  googleMapsUrl: SITE_CONFIG.mapUrl,
  workingHours: SITE_CONFIG.workingHours,
  facebookPage: SITE_CONFIG.facebookUrl,
  zaloOa: SITE_CONFIG.zaloUrl
};

// Initial Banners
const INITIAL_BANNERS: BannerItem[] = [
  {
    id: 'banner-1',
    title: 'ỨNG DỤNG CÔNG AN XÃ PƠNG DRANG',
    subtitle: '"Vì nước quên thân, vì dân phục vụ"',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1000&q=80',
    active: true,
    tagText: 'Tỉnh Đắk Lắk',
    actionText: 'Phản ánh ngay'
  }
];

// Initial Site Settings
const INITIAL_SETTINGS: SiteSettings = {
  siteTitle: 'Cổng Dịch Vụ Công & An Ninh Trật Tự Xã Pơng Drang',
  unitName: 'Công an xã Pơng Drang',
  emergencyAlert: 'Khuyến cáo người dân cảnh giác với các cuộc gọi xưng danh Công an yêu cầu chuyển tiền hoặc cài app lạ.',
  enableAlertBanner: true,
  allowPublicReports: true,
  allowOnlineAppointments: true,
  maintenanceMode: false
};

// Initial Mock Reports for Demo Admin View
const INITIAL_REPORTS: SecurityReport[] = [
  {
    id: 'rep-1',
    receiptCode: 'PA-842109',
    fullName: 'Nguyen Van A',
    phone: '0905123456',
    address: 'Thôn 2, Xã Pơng Drang',
    type: 'Cảnh báo lừa đảo qua mạng',
    urgency: 'Bình thường',
    content: 'Có số điện thoại lạ gọi báo tài khoản VNeID bị khóa và bảo cập nhật link lạ.',
    hasMedia: false,
    createdAt: new Date(Date.now() - 3600000 * 5).toLocaleString('vi-VN'),
    status: 'Đã tiếp nhận',
    adminNotes: ''
  },
  {
    id: 'rep-2',
    receiptCode: 'PA-913042',
    fullName: 'Trần Thị B',
    phone: '0914987654',
    address: 'Thôn 5, Xã Pơng Drang',
    type: 'Tình hình An ninh trật tự',
    urgency: 'Khẩn cấp',
    content: 'Nghi vấn nhóm đối tượng lạ mặt di chuyển bất thường khu vực nương rẫy cà phê.',
    hasMedia: true,
    createdAt: new Date(Date.now() - 3600000 * 24).toLocaleString('vi-VN'),
    status: 'Đang xác minh',
    adminNotes: 'Cán bộ trực ban đã chuyển tổ tuần tra khu vực.'
  }
];

// Initial Mock Appointments for Demo Admin View
const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'appt-1',
    bookingCode: 'DL-501239',
    fullName: 'Lê Văn C',
    phone: '0935111222',
    purpose: 'Cấp/Đổi Căn cước & VNeID Mức 2',
    date: '2026-08-12',
    timeSlot: '08:30 - 09:30 (Sáng)',
    notes: 'Xin cấp lại VNeID mức 2 do đổi điện thoại mới.',
    createdAt: new Date(Date.now() - 3600000 * 3).toLocaleString('vi-VN'),
    status: 'Đã xác nhận',
    adminNotes: 'Đã sắp xếp bàn số 1.'
  }
];

// LocalStorage Helper
function getStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error('Error reading localStorage key', key, e);
    return fallback;
  }
}

function setStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error writing localStorage key', key, e);
  }
}

/**
 * Service Abstraction Layer
 * All methods are asynchronous to easily allow swapping LocalStorage implementation
 * with Firestore, Supabase or REST API backend in production without code refactoring.
 */
export const dataService = {
  // --- NEWS ---
  async getNews(includeHidden = false): Promise<NewsItem[]> {
    const list = getStorage<NewsItem[]>(KEYS.NEWS, MOCK_NEWS);
    if (!includeHidden) {
      return list.filter((item) => !item.hidden);
    }
    return list;
  },

  async addNews(item: Omit<NewsItem, 'id'>): Promise<NewsItem> {
    const list = await this.getNews(true);
    const newItem: NewsItem = {
      ...item,
      id: `news-${Date.now()}`
    };
    const updated = [newItem, ...list];
    setStorage(KEYS.NEWS, updated);
    return newItem;
  },

  async updateNews(id: string, data: Partial<NewsItem>): Promise<NewsItem> {
    const list = await this.getNews(true);
    const index = list.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Bài viết không tồn tại');
    list[index] = { ...list[index], ...data };
    setStorage(KEYS.NEWS, list);
    return list[index];
  },

  async deleteNews(id: string): Promise<boolean> {
    const list = await this.getNews(true);
    const updated = list.filter((i) => i.id !== id);
    setStorage(KEYS.NEWS, updated);
    return true;
  },

  // --- ANNOUNCEMENTS ---
  async getAnnouncements(includeHidden = false): Promise<Announcement[]> {
    const list = getStorage<Announcement[]>(KEYS.ANNOUNCEMENTS, MOCK_ANNOUNCEMENTS);
    if (!includeHidden) {
      return list.filter((item) => !item.hidden);
    }
    return list;
  },

  async addAnnouncement(item: Omit<Announcement, 'id'>): Promise<Announcement> {
    const list = await this.getAnnouncements(true);
    const newItem: Announcement = {
      ...item,
      id: `ann-${Date.now()}`
    };
    const updated = [newItem, ...list];
    setStorage(KEYS.ANNOUNCEMENTS, updated);
    return newItem;
  },

  async updateAnnouncement(id: string, data: Partial<Announcement>): Promise<Announcement> {
    const list = await this.getAnnouncements(true);
    const index = list.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Thông báo không tồn tại');
    list[index] = { ...list[index], ...data };
    setStorage(KEYS.ANNOUNCEMENTS, list);
    return list[index];
  },

  async deleteAnnouncement(id: string): Promise<boolean> {
    const list = await this.getAnnouncements(true);
    const updated = list.filter((i) => i.id !== id);
    setStorage(KEYS.ANNOUNCEMENTS, updated);
    return true;
  },

  // --- REPORTS ---
  async getReports(): Promise<SecurityReport[]> {
    return getStorage<SecurityReport[]>(KEYS.REPORTS, INITIAL_REPORTS);
  },

  async addReport(report: Omit<SecurityReport, 'id' | 'receiptCode' | 'createdAt' | 'status'>): Promise<SecurityReport> {
    const list = await this.getReports();
    const year = new Date().getFullYear();
    const randomSeq = Math.floor(100000 + Math.random() * 900000);
    const code = `PDR-${year}-${randomSeq}`;
    const newReport: SecurityReport = {
      ...report,
      id: `rep-${Date.now()}`,
      receiptCode: code,
      createdAt: new Date().toLocaleString('vi-VN'),
      status: 'Đã tiếp nhận'
    };
    const updated = [newReport, ...list];
    setStorage(KEYS.REPORTS, updated);
    return newReport;
  },

  async updateReportStatus(id: string, status: SecurityReport['status'], adminNotes?: string): Promise<SecurityReport> {
    const list = await this.getReports();
    const index = list.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Phản ánh không tồn tại');
    list[index] = {
      ...list[index],
      status,
      ...(adminNotes !== undefined ? { adminNotes } : {})
    };
    setStorage(KEYS.REPORTS, list);
    return list[index];
  },

  async deleteReport(id: string): Promise<boolean> {
    const list = await this.getReports();
    const updated = list.filter((r) => r.id !== id);
    setStorage(KEYS.REPORTS, updated);
    return true;
  },

  // --- APPOINTMENTS ---
  async getAppointments(): Promise<Appointment[]> {
    return getStorage<Appointment[]>(KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  },

  async addAppointment(appt: Omit<Appointment, 'id' | 'bookingCode' | 'createdAt' | 'status'>): Promise<Appointment> {
    const list = await this.getAppointments();
    const year = new Date().getFullYear();
    const randomSeq = Math.floor(100000 + Math.random() * 900000);
    const code = `APPT-PDR-${year}-${randomSeq}`;
    const newAppt: Appointment = {
      ...appt,
      id: `appt-${Date.now()}`,
      bookingCode: code,
      createdAt: new Date().toLocaleString('vi-VN'),
      status: 'Đã đăng ký'
    };
    const updated = [newAppt, ...list];
    setStorage(KEYS.APPOINTMENTS, updated);
    return newAppt;
  },

  async updateAppointmentStatus(id: string, status: Appointment['status'], adminNotes?: string): Promise<Appointment> {
    const list = await this.getAppointments();
    const index = list.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Lịch làm việc không tồn tại');
    list[index] = {
      ...list[index],
      status,
      ...(adminNotes !== undefined ? { adminNotes } : {})
    };
    setStorage(KEYS.APPOINTMENTS, list);
    return list[index];
  },

  async deleteAppointment(id: string): Promise<boolean> {
    const list = await this.getAppointments();
    const updated = list.filter((a) => a.id !== id);
    setStorage(KEYS.APPOINTMENTS, updated);
    return true;
  },

  // --- FAQS ---
  async getFaqs(includeHidden = false): Promise<FAQItem[]> {
    const list = getStorage<FAQItem[]>(KEYS.FAQS, MOCK_FAQS);
    if (!includeHidden) {
      return list.filter((item) => !item.hidden);
    }
    return list;
  },

  async addFaq(item: Omit<FAQItem, 'id'>): Promise<FAQItem> {
    const list = await this.getFaqs(true);
    const newItem: FAQItem = {
      ...item,
      id: `faq-${Date.now()}`
    };
    const updated = [...list, newItem];
    setStorage(KEYS.FAQS, updated);
    return newItem;
  },

  async updateFaq(id: string, data: Partial<FAQItem>): Promise<FAQItem> {
    const list = await this.getFaqs(true);
    const index = list.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('FAQ không tồn tại');
    list[index] = { ...list[index], ...data };
    setStorage(KEYS.FAQS, list);
    return list[index];
  },

  async deleteFaq(id: string): Promise<boolean> {
    const list = await this.getFaqs(true);
    const updated = list.filter((i) => i.id !== id);
    setStorage(KEYS.FAQS, updated);
    return true;
  },

  // --- CONTACT INFO ---
  async getContactInfo(): Promise<ContactInfo> {
    return getStorage<ContactInfo>(KEYS.CONTACT, INITIAL_CONTACT);
  },

  async updateContactInfo(data: Partial<ContactInfo>): Promise<ContactInfo> {
    const current = await this.getContactInfo();
    const updated = { ...current, ...data };
    setStorage(KEYS.CONTACT, updated);
    return updated;
  },

  // --- BANNERS ---
  async getBanners(): Promise<BannerItem[]> {
    return getStorage<BannerItem[]>(KEYS.BANNERS, INITIAL_BANNERS);
  },

  async addBanner(item: Omit<BannerItem, 'id'>): Promise<BannerItem> {
    const list = await this.getBanners();
    const newItem: BannerItem = {
      ...item,
      id: `banner-${Date.now()}`
    };
    const updated = [newItem, ...list];
    setStorage(KEYS.BANNERS, updated);
    return newItem;
  },

  async updateBanner(id: string, data: Partial<BannerItem>): Promise<BannerItem> {
    const list = await this.getBanners();
    const index = list.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('Banner không tồn tại');
    list[index] = { ...list[index], ...data };
    setStorage(KEYS.BANNERS, list);
    return list[index];
  },

  async deleteBanner(id: string): Promise<boolean> {
    const list = await this.getBanners();
    const updated = list.filter((b) => b.id !== id);
    setStorage(KEYS.BANNERS, updated);
    return true;
  },

  // --- SITE SETTINGS ---
  async getSiteSettings(): Promise<SiteSettings> {
    return getStorage<SiteSettings>(KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  async updateSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.getSiteSettings();
    const updated = { ...current, ...data };
    setStorage(KEYS.SETTINGS, updated);
    return updated;
  },

  // --- HAMLET OFFICERS (CÁN BỘ QUẢN LÝ 12 THÔN) ---
  async getHamletOfficers(): Promise<HamletOfficer[]> {
    const data = getStorage<HamletOfficer[]>(KEYS.OFFICERS, MOCK_HAMLET_OFFICERS);
    return data.map((officer) => {
      const hObj = HAMLETS.find((h) => h.id === officer.hamletId);
      const hName = hObj ? hObj.name : officer.hamletName;
      if (officer.hamletId === '9' && officer.hamletName === 'Thôn 9') {
        return {
          ...officer,
          hamletName: 'Thôn Ea Nur',
          position: officer.position ? officer.position.replace(/Thôn 9/g, 'Thôn Ea Nur') : 'Cảnh sát khu vực Thôn Ea Nur',
          notes: officer.notes ? officer.notes.replace(/Thôn 9/g, 'Thôn Ea Nur') : ''
        };
      }
      if (officer.hamletId === '10' && officer.hamletName === 'Thôn 10') {
        return {
          ...officer,
          hamletName: 'Thôn Ea Tút',
          position: officer.position ? officer.position.replace(/Thôn 10/g, 'Thôn Ea Tút') : 'Cán bộ phụ trách địa bàn Thôn Ea Tút',
          notes: officer.notes ? officer.notes.replace(/Thôn 10/g, 'Thôn Ea Tút') : ''
        };
      }
      if (officer.hamletId === '11' && officer.hamletName === 'Thôn 11') {
        return {
          ...officer,
          hamletName: 'Thôn Cư Blang',
          position: officer.position ? officer.position.replace(/Thôn 11/g, 'Thôn Cư Blang') : 'Cảnh sát khu vực Thôn Cư Blang',
          notes: officer.notes ? officer.notes.replace(/Thôn 11/g, 'Thôn Cư Blang') : ''
        };
      }
      if (officer.hamletId === '12' && officer.hamletName === 'Thôn 12') {
        return {
          ...officer,
          hamletName: 'Thôn Tâng Mai',
          position: officer.position ? officer.position.replace(/Thôn 12/g, 'Thôn Tâng Mai') : 'Cán bộ phụ trách địa bàn Thôn Tâng Mai',
          notes: officer.notes ? officer.notes.replace(/Thôn 12/g, 'Thôn Tâng Mai') : ''
        };
      }
      return {
        ...officer,
        hamletName: hName
      };
    });
  },

  async saveHamletOfficer(officer: Partial<HamletOfficer>): Promise<HamletOfficer> {
    const list = await this.getHamletOfficers();
    const hObj = HAMLETS.find((h) => h.id === officer.hamletId);
    const resolvedName = hObj ? hObj.name : (officer.hamletName || `Thôn ${officer.hamletId || '1'}`);

    if (officer.id) {
      const index = list.findIndex((o) => o.id === officer.id);
      if (index !== -1) {
        list[index] = {
          ...list[index],
          ...officer,
          hamletName: resolvedName
        } as HamletOfficer;
        setStorage(KEYS.OFFICERS, list);
        return list[index];
      }
    }
    const newOfficer: HamletOfficer = {
      id: `off-${Date.now()}`,
      hamletId: officer.hamletId || '1',
      hamletName: resolvedName,
      fullName: officer.fullName || 'Cán bộ Công an xã',
      rank: officer.rank || 'Đại úy CAND',
      position: officer.position || 'Cảnh sát khu vực',
      phone: officer.phone || '0262 3876 113',
      avatarUrl: officer.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      notes: officer.notes || ''
    };
    const updated = [newOfficer, ...list];
    setStorage(KEYS.OFFICERS, updated);
    return newOfficer;
  },

  async deleteHamletOfficer(id: string): Promise<boolean> {
    const list = await this.getHamletOfficers();
    const updated = list.filter((o) => o.id !== id);
    setStorage(KEYS.OFFICERS, updated);
    return true;
  }
};
