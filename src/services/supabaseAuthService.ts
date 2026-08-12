import { supabase } from './supabaseClient';
import { IAuthService } from '../types/services';

export class SupabaseAuthService implements IAuthService {
  private currentUser: any = null;

  async login(email: string, pass: string): Promise<{ success: boolean; user?: any; error?: string }> {
    if (!supabase) {
      return { success: false, error: 'Supabase Client chưa được khởi tạo.' };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass
    });

    if (error || !data.user) {
      return { success: false, error: error?.message || 'Tài khoản hoặc mật khẩu không chính xác.' };
    }

    this.currentUser = data.user;
    return { success: true, user: data.user };
  }

  async logout(): Promise<void> {
    if (supabase) {
      await supabase.auth.signOut();
    }
    this.currentUser = null;
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return Boolean(this.currentUser);
  }
}
