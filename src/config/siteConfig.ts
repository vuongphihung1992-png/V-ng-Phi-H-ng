// Centralized Configuration for Công an xã Pơng Drang - Đắk Lắk
// All official unit data can be configured here without touching UI code.

export interface SiteConfig {
  siteName: string;
  organizationName: string;
  province: string;
  district: string;
  tagline: string;
  address: string;
  phone: string;
  hotline: string;
  dutyPhone: string;
  email: string;
  mapUrl: string;
  logoUrl?: string;
  bannerUrl?: string;
  workingHours: string;
  officialWebsite: string;
  facebookUrl: string;
  zaloUrl: string;
  isDemoMode: boolean;
  version: string;
}

export const SITE_CONFIG: SiteConfig = {
  siteName: 'Công an xã Pơng Drang',
  organizationName: 'CÔNG AN XÃ PƠNG DRANG',
  province: 'Tỉnh Đắk Lắk',
  district: 'Xã Pơng Drang',
  tagline: 'Gần dân - Vì Nhân dân phục vụ',
  address: 'Thôn 3, Xã Pơng Drang, Tỉnh Đắk Lắk',
  phone: '02623539777',
  hotline: '02623539777',
  dutyPhone: '02623608839',
  email: 'conganxapongdrang@daklak.gov.vn',
  mapUrl: 'https://maps.google.com/?q=Cong+An+Xa+Pong+Drang',
  workingHours: 'Thứ 2 - Thứ 6: 07h30 - 17h00 | Trực ban An ninh 24/7',
  officialWebsite: 'https://congan.daklak.gov.vn',
  facebookUrl: 'https://facebook.com/conganxapongdrang',
  zaloUrl: 'https://zalo.me/conganxapongdrang',
  isDemoMode: import.meta.env.VITE_DEMO_MODE !== 'false' && !import.meta.env.VITE_SUPABASE_URL,
  version: '2.5.0-PWA'
};
