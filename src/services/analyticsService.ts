/**
 * Google Analytics (GA4) Tracking Service
 * Công an xã Pơng Drang - Thống kê lượt truy cập & nhu cầu sử dụng tiện ích của người dân
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const DEFAULT_GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-PONGDRANG2026';
const GA_STORAGE_KEY = 'pongdrang_ga_measurement_id';
const LOCAL_STATS_KEY = 'pongdrang_local_analytics_events';

export interface AnalyticsEvent {
  id: string;
  action: string;
  category: string;
  label?: string;
  timestamp: string;
}

class AnalyticsService {
  private isInitialized = false;
  private currentMeasurementId = DEFAULT_GA_ID;

  constructor() {
    const savedId = localStorage.getItem(GA_STORAGE_KEY);
    if (savedId) {
      this.currentMeasurementId = savedId;
    }
  }

  public getMeasurementId(): string {
    return this.currentMeasurementId;
  }

  public setMeasurementId(id: string): void {
    if (id && id.trim()) {
      this.currentMeasurementId = id.trim();
      localStorage.setItem(GA_STORAGE_KEY, this.currentMeasurementId);
      if (this.isInitialized) {
        this.reinitGA();
      }
    }
  }

  public initGA(customId?: string): void {
    if (customId && customId.trim()) {
      this.currentMeasurementId = customId.trim();
    }

    const measurementId = this.currentMeasurementId;

    if (!measurementId) return;

    // Ensure dataLayer array
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = window.gtag || gtag;

    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
      send_page_view: true
    });

    // Check if script already injected
    const scriptId = 'google-analytics-gtag';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
    }

    this.isInitialized = true;
    this.trackEvent('app_launch', 'App', 'Công an xã Pơng Drang App Initialized');
  }

  private reinitGA(): void {
    const script = document.getElementById('google-analytics-gtag');
    if (script) {
      script.remove();
    }
    this.isInitialized = false;
    this.initGA();
  }

  public trackPageView(pageTitle: string, pagePath: string): void {
    this.saveLocalEvent('page_view', 'Navigation', pageTitle);

    if (window.gtag && this.currentMeasurementId) {
      window.gtag('event', 'page_view', {
        page_title: pageTitle,
        page_path: pagePath,
        send_to: this.currentMeasurementId
      });
    }
  }

  public trackEvent(action: string, category: string, label?: string, value?: number): void {
    this.saveLocalEvent(action, category, label);

    if (window.gtag && this.currentMeasurementId) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
        send_to: this.currentMeasurementId
      });
    }
  }

  private saveLocalEvent(action: string, category: string, label?: string): void {
    try {
      const raw = localStorage.getItem(LOCAL_STATS_KEY);
      const events: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];
      const newEvt: AnalyticsEvent = {
        id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        action,
        category,
        label,
        timestamp: new Date().toISOString()
      };
      const updated = [newEvt, ...events].slice(0, 200);
      localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(updated));
    } catch (e) {
      // Ignore
    }
  }

  public getLocalEvents(): AnalyticsEvent[] {
    try {
      const raw = localStorage.getItem(LOCAL_STATS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  public getAnalyticsSummary() {
    const events = this.getLocalEvents();
    const totalVisits = events.filter((e) => e.action === 'page_view' || e.action === 'app_launch').length;
    const totalReports = events.filter((e) => e.action === 'submit_report' || e.category === 'SecurityReport').length;
    const totalAppointments = events.filter((e) => e.action === 'book_appointment' || e.category === 'Appointment').length;
    const totalAiQueries = events.filter((e) => e.action === 'ai_chat_query' || e.category === 'AIChat').length;
    const totalProcedureLookups = events.filter((e) => e.action === 'view_procedure' || e.category === 'Procedure').length;

    return {
      totalVisits: Math.max(totalVisits, 1),
      totalReports,
      totalAppointments,
      totalAiQueries,
      totalProcedureLookups,
      totalEventsCount: events.length
    };
  }
}

export const analyticsService = new AnalyticsService();
