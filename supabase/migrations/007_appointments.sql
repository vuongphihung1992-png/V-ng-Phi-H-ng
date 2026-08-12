-- Migration 007: Appointments
CREATE SEQUENCE IF NOT EXISTS appt_seq START 1;

CREATE OR REPLACE FUNCTION generate_appointment_code()
RETURNS TRIGGER AS $$
DECLARE
    current_year TEXT;
    seq_num TEXT;
BEGIN
    current_year := TO_CHAR(CURRENT_DATE, 'YYYY');
    seq_num := LPAD(NEXTVAL('appt_seq')::TEXT, 6, '0');
    NEW.appointment_code := 'APPT-PDR-' || current_year || '-' || seq_num;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_code TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    subject TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    note TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED')),
    confirmed_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

DROP TRIGGER IF EXISTS trg_set_appt_code ON public.appointments;
CREATE TRIGGER trg_set_appt_code
    BEFORE INSERT ON public.appointments
    FOR EACH ROW
    WHEN (NEW.appointment_code IS NULL OR NEW.appointment_code = '')
    EXECUTE FUNCTION generate_appointment_code();

DROP TRIGGER IF EXISTS trg_appointments_updated_at ON public.appointments;
CREATE TRIGGER trg_appointments_updated_at
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Slot Conflict Prevention Function
CREATE OR REPLACE FUNCTION check_appointment_slot()
RETURNS TRIGGER AS $$
DECLARE
    existing_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO existing_count
    FROM public.appointments
    WHERE appointment_date = NEW.appointment_date
      AND appointment_time = NEW.appointment_time
      AND status IN ('CONFIRMED')
      AND id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID);

    IF existing_count >= 1 THEN
        RAISE EXCEPTION 'Khung giờ này đã được đăng ký và xác nhận. Vui lòng chọn khung giờ khác.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_appointment_slot ON public.appointments;
CREATE TRIGGER trg_check_appointment_slot
    BEFORE INSERT OR UPDATE ON public.appointments
    FOR EACH ROW
    WHEN (NEW.status = 'CONFIRMED')
    EXECUTE FUNCTION check_appointment_slot();
