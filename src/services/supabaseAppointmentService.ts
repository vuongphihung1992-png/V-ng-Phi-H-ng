import { supabase } from './supabaseClient';
import { Appointment } from '../types';
import { IAppointmentService } from '../types/services';

export class SupabaseAppointmentService implements IAppointmentService {
  async getAppointments(): Promise<Appointment[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((d) => ({
      id: d.id,
      bookingCode: d.appointment_code,
      fullName: d.full_name,
      phone: d.phone,
      purpose: d.subject || 'Giải quyết TTHC',
      date: d.appointment_date,
      timeSlot: d.appointment_time,
      notes: d.note || undefined,
      createdAt: d.created_at,
      status: (d.status === 'CONFIRMED' ? 'Đã xác nhận' : d.status === 'COMPLETED' ? 'Đã hoàn thành' : d.status === 'CANCELLED' || d.status === 'REJECTED' ? 'Đã hủy' : 'Đã đăng ký') as any
    }));
  }

  async getAppointmentByBookingCode(code: string): Promise<Appointment | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('appointment_code', code.trim())
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      bookingCode: data.appointment_code,
      fullName: data.full_name,
      phone: data.phone,
      purpose: data.subject || 'Giải quyết TTHC',
      date: data.appointment_date,
      timeSlot: data.appointment_time,
      notes: data.note || undefined,
      createdAt: data.created_at,
      status: (data.status === 'CONFIRMED' ? 'Đã xác nhận' : data.status === 'COMPLETED' ? 'Đã hoàn thành' : data.status === 'CANCELLED' || data.status === 'REJECTED' ? 'Đã hủy' : 'Đã đăng ký') as any
    };
  }

  async addAppointment(appointment: Partial<Appointment>): Promise<Appointment> {
    if (!supabase) throw new Error('Supabase Client chưa được khởi tạo.');

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        full_name: appointment.fullName || 'Người dân',
        phone: appointment.phone || 'Chưa cung cấp',
        subject: appointment.purpose || 'Đăng ký làm việc',
        appointment_date: appointment.date || new Date().toISOString().split('T')[0],
        appointment_time: appointment.timeSlot || '08:00',
        note: appointment.notes
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || 'Không thể đặt lịch hẹn.');
    }

    return {
      id: data.id,
      bookingCode: data.appointment_code,
      fullName: data.full_name,
      phone: data.phone,
      purpose: data.subject,
      date: data.appointment_date,
      timeSlot: data.appointment_time,
      notes: data.note || undefined,
      createdAt: data.created_at,
      status: 'Đã đăng ký'
    };
  }

  async updateAppointmentStatus(id: string, status: string, notes?: string): Promise<Appointment> {
    if (!supabase) throw new Error('Supabase Client chưa được khởi tạo.');

    const dbStatus = status === 'Đã xác nhận' ? 'CONFIRMED' : status === 'Đã hoàn thành' ? 'COMPLETED' : status === 'Đã hủy' ? 'CANCELLED' : 'PENDING';

    const { data, error } = await supabase
      .from('appointments')
      .update({ status: dbStatus, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) throw new Error('Không thể cập nhật trạng thái lịch hẹn');

    return {
      id: data.id,
      bookingCode: data.appointment_code,
      fullName: data.full_name,
      phone: data.phone,
      purpose: data.subject,
      date: data.appointment_date,
      timeSlot: data.appointment_time,
      notes: data.note || undefined,
      createdAt: data.created_at,
      status: status as any,
      adminNotes: notes
    };
  }
}
