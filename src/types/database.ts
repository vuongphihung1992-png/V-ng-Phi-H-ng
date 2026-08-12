export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      roles: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          email: string | null
          avatar_url: string | null
          role_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          email?: string | null
          avatar_url?: string | null
          role_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          email?: string | null
          avatar_url?: string | null
          role_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      news_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          created_at?: string
        }
      }
      news: {
        Row: {
          id: string
          title: string
          slug: string
          summary: string | null
          content: string | null
          category_id: string | null
          cover_image_url: string | null
          status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
          author_id: string | null
          published_at: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          summary?: string | null
          content?: string | null
          category_id?: string | null
          cover_image_url?: string | null
          status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
          author_id?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          summary?: string | null
          content?: string | null
          category_id?: string | null
          cover_image_url?: string | null
          status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
          author_id?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      announcements: {
        Row: {
          id: string
          title: string
          content: string | null
          priority: 'NORMAL' | 'IMPORTANT' | 'URGENT'
          status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
          published_at: string | null
          expires_at: string | null
          created_by: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          title: string
          content?: string | null
          priority?: 'NORMAL' | 'IMPORTANT' | 'URGENT'
          status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
          published_at?: string | null
          expires_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          content?: string | null
          priority?: 'NORMAL' | 'IMPORTANT' | 'URGENT'
          status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
          published_at?: string | null
          expires_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      security_reports: {
        Row: {
          id: string
          report_code: string
          full_name: string
          phone: string
          location_text: string | null
          latitude: number | null
          longitude: number | null
          description: string
          category: string
          severity: string
          status: string
          consent: boolean
          assigned_to: string | null
          created_at: string
          updated_at: string
          resolved_at: string | null
          deleted_at: string | null
        }
        Insert: {
          id?: string
          report_code?: string
          full_name: string
          phone: string
          location_text?: string | null
          latitude?: number | null
          longitude?: number | null
          description: string
          category: string
          severity: string
          status?: string
          consent?: boolean
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
          deleted_at?: string | null
        }
        Update: {
          id?: string
          report_code?: string
          full_name?: string
          phone?: string
          location_text?: string | null
          latitude?: number | null
          longitude?: number | null
          description?: string
          category?: string
          severity?: string
          status?: string
          consent?: boolean
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
          deleted_at?: string | null
        }
      }
      report_attachments: {
        Row: {
          id: string
          report_id: string
          file_path: string
          file_name: string | null
          file_type: string | null
          file_size: number | null
          created_at: string
        }
        Insert: {
          id?: string
          report_id: string
          file_path: string
          file_name?: string | null
          file_type?: string | null
          file_size?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          report_id?: string
          file_path?: string
          file_name?: string | null
          file_type?: string | null
          file_size?: number | null
          created_at?: string
        }
      }
      report_updates: {
        Row: {
          id: string
          report_id: string
          status: string | null
          note: string | null
          public_message: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          report_id: string
          status?: string | null
          note?: string | null
          public_message?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          report_id?: string
          status?: string | null
          note?: string | null
          public_message?: string | null
          created_by?: string | null
          created_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          appointment_code: string
          full_name: string
          phone: string
          subject: string
          appointment_date: string
          appointment_time: string
          note: string | null
          status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'REJECTED'
          confirmed_by: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          appointment_code?: string
          full_name: string
          phone: string
          subject: string
          appointment_date: string
          appointment_time: string
          note?: string | null
          status?: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'REJECTED'
          confirmed_by?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          appointment_code?: string
          full_name?: string
          phone?: string
          subject?: string
          appointment_date?: string
          appointment_time?: string
          note?: string | null
          status?: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'REJECTED'
          confirmed_by?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      feedback: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          category: string | null
          content: string
          status: 'NEW' | 'IN_REVIEW' | 'RESOLVED' | 'ARCHIVED'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name?: string | null
          phone?: string | null
          category?: string | null
          content: string
          status?: 'NEW' | 'IN_REVIEW' | 'RESOLVED' | 'ARCHIVED'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          category?: string | null
          content?: string
          status?: 'NEW' | 'IN_REVIEW' | 'RESOLVED' | 'ARCHIVED'
          created_at?: string
          updated_at?: string
        }
      }
      faqs: {
        Row: {
          id: string
          question: string
          answer: string
          category: string | null
          sort_order: number
          status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question: string
          answer: string
          category?: string | null
          sort_order?: number
          status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question?: string
          answer?: string
          category?: string | null
          sort_order?: number
          status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
          created_at?: string
          updated_at?: string
        }
      }
      banners: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          image_url: string
          link_url: string | null
          sort_order: number
          status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
          start_date: string | null
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          subtitle?: string | null
          image_url: string
          link_url?: string | null
          sort_order?: number
          status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string | null
          image_url?: string
          link_url?: string | null
          sort_order?: number
          status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      site_settings: {
        Row: {
          id: string
          key: string
          value: Json
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          updated_by?: string | null
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string | null
          reference_type: string | null
          reference_id: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: string | null
          reference_type?: string | null
          reference_id?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string | null
          reference_type?: string | null
          reference_id?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
    }
  }
}
