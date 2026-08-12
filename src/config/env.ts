// Environment Configuration & Validation
import { SITE_CONFIG } from './siteConfig';

export interface EnvConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  isDemoMode: boolean;
  isProductionBackend: boolean;
}

const url = import.meta.env.VITE_SUPABASE_URL || '';
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const demoEnv = import.meta.env.VITE_DEMO_MODE;

// If VITE_DEMO_MODE is explicitly set to 'false' AND credentials exist, use Supabase Production
const isDemoMode = demoEnv === 'true' || !url || !anonKey;

export const ENV: EnvConfig = {
  supabaseUrl: url,
  supabaseAnonKey: anonKey,
  isDemoMode,
  isProductionBackend: !isDemoMode && Boolean(url && anonKey)
};

export const validateEnv = (): { valid: boolean; message?: string } => {
  if (!ENV.isDemoMode && (!ENV.supabaseUrl || !ENV.supabaseAnonKey)) {
    return {
      valid: false,
      message: 'Thiếu VITE_SUPABASE_URL hoặc VITE_SUPABASE_ANON_KEY trong file .env. Hệ thống sẽ tự chuyển sang DEMO_MODE.'
    };
  }
  return { valid: true };
};
