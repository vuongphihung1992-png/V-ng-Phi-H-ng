import { supabase } from './supabaseClient';

export class AuditService {
  static async logAction(
    action: 'LOGIN' | 'LOGOUT' | 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'ASSIGN' | 'STATUS_CHANGE' | 'EXPORT',
    entityType: string,
    entityId?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    if (!supabase) return;

    try {
      const { data: userData } = await supabase.auth.getUser();
      await supabase.from('audit_logs').insert({
        user_id: userData.user?.id || null,
        action,
        entity_type: entityType,
        entity_id: entityId || null,
        metadata: metadata || {}
      });
    } catch (err) {
      console.warn('Audit logging error:', err);
    }
  }
}
