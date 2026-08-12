export type TabType = 'home' | 'notifications' | 'report' | 'contact' | 'menu' | 'admin';

export type ModalType = 
  | null 
  | 'report' 
  | 'appointment' 
  | 'hotline' 
  | 'faq' 
  | 'about' 
  | 'search' 
  | 'procedures' 
  | 'news_list' 
  | 'announcements_list' 
  | 'history'
  | 'messages'
  | 'map'
  | 'officers'
  | 'admin_login';

export type AdminTab = 
  | 'dashboard' 
  | 'news' 
  | 'announcements' 
  | 'reports' 
  | 'appointments' 
  | 'faqs' 
  | 'contact' 
  | 'banners' 
  | 'settings'
  | 'officers';

export interface Announcement {
  id: string;
  title: string;
  category: 'An ninh' | 'Hành chính' | 'Tiếp công dân' | 'Cảnh báo' | 'Chung';
  date: string;
  summary: string;
  content: string;
  isNew?: boolean;
  important?: boolean;
  hidden?: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  category: 'Hoạt động' | 'Tuyên truyền' | 'Cảnh báo tội phạm' | 'Thủ tục HC';
  date: string;
  summary: string;
  content: string;
  imageUrl: string;
  readTime?: string;
  author?: string;
  hidden?: boolean;
}

export interface Procedure {
  id: string;
  code: string;
  title: string;
  category: 'Cư trú' | 'CCCD/Định danh' | 'PCCC' | 'AN TTTT' | 'Khác';
  processingTime: string;
  fee: string;
  requirements: string[];
  steps: string[];
  formName?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'An ninh' | 'Thủ tục' | 'Lịch làm việc' | 'Chung';
  hidden?: boolean;
}

export interface SecurityReport {
  id: string;
  receiptCode: string;
  fullName: string;
  phone: string;
  address: string;
  type: string;
  urgency: 'Bình thường' | 'Khẩn cấp' | 'Rất khẩn cấp';
  content: string;
  hasMedia: boolean;
  location?: string;
  createdAt: string;
  status: 'Đã tiếp nhận' | 'Đang xác minh' | 'Đã xử lý' | 'Từ chối';
  adminNotes?: string;
}

export interface Appointment {
  id: string;
  bookingCode: string;
  fullName: string;
  phone: string;
  purpose: string;
  date: string;
  timeSlot: string;
  notes?: string;
  createdAt: string;
  status: 'Đã đăng ký' | 'Đã xác nhận' | 'Đã hoàn thành' | 'Đã hủy';
  adminNotes?: string;
}

export interface HotlineNumber {
  id: string;
  title: string;
  number: string;
  description: string;
  isEmergency?: boolean;
}

export interface ContactInfo {
  unitName: string;
  unitSubtitle: string;
  address: string;
  districtProvince: string;
  hotlinePhone: string;
  dutyPhone: string;
  email: string;
  googleMapsUrl: string;
  workingHours: string;
  facebookPage?: string;
  zaloOa?: string;
}

export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  active: boolean;
  tagText?: string;
  actionText?: string;
}

export interface SiteSettings {
  siteTitle: string;
  unitName: string;
  emergencyAlert: string;
  enableAlertBanner: boolean;
  allowPublicReports: boolean;
  allowOnlineAppointments: boolean;
  maintenanceMode: boolean;
  gaMeasurementId?: string;
  enableAnalytics?: boolean;
}

export interface HamletOfficer {
  id: string;
  hamletId: string; // '1' -> '12'
  hamletName: string; // 'Thôn 1' -> 'Thôn 12'
  fullName: string;
  rank: string; // 'Đại úy', 'Thiếu tá', 'Trung úy', etc.
  position: string; // 'Cảnh sát khu vực', 'Cán bộ phụ trách địa bàn', etc.
  phone: string;
  avatarUrl: string;
  notes?: string;
}

