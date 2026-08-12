import { supabase } from './supabaseClient';
import { SecurityReport } from '../types';
import { IReportService } from '../types/services';

export class SupabaseReportService implements IReportService {
  async getReports(): Promise<SecurityReport[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('security_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((d) => ({
      id: d.id,
      receiptCode: d.report_code,
      fullName: d.full_name,
      phone: d.phone,
      address: d.location_text || 'Địa bàn Xã Pơng Drang',
      type: d.category || 'An ninh trật tự',
      urgency: (d.severity === 'URGENT' ? 'Rất khẩn cấp' : d.severity === 'HIGH' ? 'Khẩn cấp' : 'Bình thường') as any,
      content: d.description,
      hasMedia: false,
      location: d.location_text || undefined,
      createdAt: d.created_at,
      status: (d.status === 'RESOLVED' ? 'Đã xử lý' : d.status === 'IN_REVIEW' || d.status === 'PROCESSING' ? 'Đang xác minh' : d.status === 'REJECTED' ? 'Từ chối' : 'Đã tiếp nhận') as any
    }));
  }

  async getReportByReceiptCode(code: string): Promise<SecurityReport | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('security_reports')
      .select('*')
      .eq('report_code', code.trim())
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      receiptCode: data.report_code,
      fullName: data.full_name,
      phone: data.phone,
      address: data.location_text || 'Địa bàn Xã Pơng Drang',
      type: data.category || 'An ninh trật tự',
      urgency: (data.severity === 'URGENT' ? 'Rất khẩn cấp' : data.severity === 'HIGH' ? 'Khẩn cấp' : 'Bình thường') as any,
      content: data.description,
      hasMedia: false,
      location: data.location_text || undefined,
      createdAt: data.created_at,
      status: (data.status === 'RESOLVED' ? 'Đã xử lý' : data.status === 'IN_REVIEW' || data.status === 'PROCESSING' ? 'Đang xác minh' : data.status === 'REJECTED' ? 'Từ chối' : 'Đã tiếp nhận') as any
    };
  }

  async addReport(report: Partial<SecurityReport>): Promise<SecurityReport> {
    if (!supabase) throw new Error('Supabase Client chưa được khởi tạo.');

    const { data, error } = await supabase
      .from('security_reports')
      .insert({
        full_name: report.fullName || 'Người dân',
        phone: report.phone || 'Chưa cung cấp',
        location_text: report.address || report.location || 'Xã Pơng Drang',
        description: report.content || '',
        category: report.type || 'SECURITY_ORDER',
        severity: report.urgency === 'Rất khẩn cấp' ? 'URGENT' : report.urgency === 'Khẩn cấp' ? 'HIGH' : 'NORMAL',
        consent: true
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || 'Không thể tạo phản ánh.');
    }

    return {
      id: data.id,
      receiptCode: data.report_code,
      fullName: data.full_name,
      phone: data.phone,
      address: data.location_text || '',
      type: data.category,
      urgency: report.urgency || 'Bình thường',
      content: data.description,
      hasMedia: false,
      createdAt: data.created_at,
      status: 'Đã tiếp nhận'
    };
  }

  async updateReportStatus(id: string, status: string, notes?: string): Promise<SecurityReport> {
    if (!supabase) throw new Error('Supabase Client chưa được khởi tạo.');

    const dbStatus = status === 'Đã xử lý' ? 'RESOLVED' : status === 'Đang xác minh' ? 'IN_REVIEW' : status === 'Từ chối' ? 'REJECTED' : 'RECEIVED';

    const { data, error } = await supabase
      .from('security_reports')
      .update({ status: dbStatus, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) throw new Error('Không thể cập nhật trạng thái phản ánh');

    if (notes) {
      await supabase.from('report_updates').insert({
        report_id: id,
        status: dbStatus,
        note: notes,
        public_message: `Cập nhật trạng thái: ${status}`
      });
    }

    return {
      id: data.id,
      receiptCode: data.report_code,
      fullName: data.full_name,
      phone: data.phone,
      address: data.location_text || '',
      type: data.category,
      urgency: 'Bình thường',
      content: data.description,
      hasMedia: false,
      createdAt: data.created_at,
      status: status as any,
      adminNotes: notes
    };
  }
}
