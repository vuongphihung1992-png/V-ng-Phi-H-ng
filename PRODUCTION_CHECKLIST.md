# PRODUCTION DEPLOYMENT CHECKLIST

- [ ] **1. Supabase Project Setup**
  - Project created on [Supabase Dashboard](https://supabase.com).
  - Executed all migration files (`supabase/migrations/001_extensions.sql` through `016_storage.sql`).
  - Executed seed file (`supabase/seed.sql`).

- [ ] **2. Auth & Roles Setup**
  - Created initial Admin user via Supabase Auth.
  - Linked User ID to `profiles` table with `SUPER_ADMIN` role ID.
  - Configured Auth email templates (for password resets).

- [ ] **3. Security & Row Level Security (RLS)**
  - Verified RLS is ENABLED on all 15 public tables.
  - Tested tracking functions (`track_report` & `track_appointment`) using anonymous role.
  - Confirmed `report-attachments` bucket is PRIVATE with Signed URL access for Staff.

- [ ] **4. Frontend Environment Variables**
  - Created `.env` file with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
  - Set `VITE_DEMO_MODE=false`.

- [ ] **5. Domain & HTTPS**
  - Configured official domain with SSL/TLS certificate.
  - Set CORS allowed origins in Supabase API settings.

- [ ] **6. Monitoring & Audit**
  - Tested `audit_logs` records upon login and status updates.
  - Scheduled automated Supabase daily database backups.
