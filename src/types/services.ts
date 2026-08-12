import {
  NewsItem,
  Announcement,
  SecurityReport,
  Appointment,
  FAQItem,
  ContactInfo,
  BannerItem,
  SiteSettings
} from '../types';

export interface IAuthService {
  login(email: string, pass: string): Promise<{ success: boolean; user?: any; error?: string }>;
  logout(): Promise<void>;
  getCurrentUser(): any;
  isAuthenticated(): boolean;
}

export interface INewsService {
  getNews(includeDrafts?: boolean): Promise<NewsItem[]>;
  getNewsById(id: string): Promise<NewsItem | null>;
  saveNews(news: Partial<NewsItem>): Promise<NewsItem>;
  deleteNews(id: string): Promise<boolean>;
}

export interface IAnnouncementService {
  getAnnouncements(includeDrafts?: boolean): Promise<Announcement[]>;
  saveAnnouncement(announcement: Partial<Announcement>): Promise<Announcement>;
  deleteAnnouncement(id: string): Promise<boolean>;
}

export interface IReportService {
  getReports(): Promise<SecurityReport[]>;
  getReportByReceiptCode(code: string): Promise<SecurityReport | null>;
  addReport(report: Partial<SecurityReport>): Promise<SecurityReport>;
  updateReportStatus(id: string, status: string, notes?: string): Promise<SecurityReport>;
}

export interface IAppointmentService {
  getAppointments(): Promise<Appointment[]>;
  getAppointmentByBookingCode(code: string): Promise<Appointment | null>;
  addAppointment(appointment: Partial<Appointment>): Promise<Appointment>;
  updateAppointmentStatus(id: string, status: string, notes?: string): Promise<Appointment>;
}

export interface IStorageService {
  uploadFile(file: File, bucketName?: string): Promise<string>;
}

export interface IConfigService {
  getContactInfo(): Promise<ContactInfo>;
  updateContactInfo(info: ContactInfo): Promise<ContactInfo>;
  getSiteSettings(): Promise<SiteSettings>;
  updateSiteSettings(settings: SiteSettings): Promise<SiteSettings>;
  getBanners(): Promise<BannerItem[]>;
  saveBanner(banner: Partial<BannerItem>): Promise<BannerItem>;
}
