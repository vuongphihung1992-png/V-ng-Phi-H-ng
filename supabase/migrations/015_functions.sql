-- Migration 015: Database RPC Functions

-- Secure Public Report Tracking Function
CREATE OR REPLACE FUNCTION public.track_report(p_code TEXT, p_phone TEXT)
RETURNS TABLE (
    report_code TEXT,
    category TEXT,
    severity TEXT,
    status TEXT,
    created_at TIMESTAMPTZ,
    public_updates JSON
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sr.report_code,
        sr.category,
        sr.severity,
        sr.status,
        sr.created_at,
        COALESCE(
            (
                SELECT json_agg(
                    json_build_object(
                        'created_at', ru.created_at,
                        'status', ru.status,
                        'public_message', ru.public_message
                    ) ORDER BY ru.created_at DESC
                )
                FROM public.report_updates ru
                WHERE ru.report_id = sr.id AND ru.public_message IS NOT NULL AND ru.public_message <> ''
            ),
            '[]'::json
        ) AS public_updates
    FROM public.security_reports sr
    WHERE UPPER(TRIM(sr.report_code)) = UPPER(TRIM(p_code))
      AND TRIM(sr.phone) = TRIM(p_phone)
      AND sr.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Secure Public Appointment Tracking Function
CREATE OR REPLACE FUNCTION public.track_appointment(p_code TEXT, p_phone TEXT)
RETURNS TABLE (
    appointment_code TEXT,
    subject TEXT,
    appointment_date DATE,
    appointment_time TEXT,
    status TEXT,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.appointment_code,
        a.subject,
        a.appointment_date,
        a.appointment_time,
        a.status,
        a.created_at
    FROM public.appointments a
    WHERE UPPER(TRIM(a.appointment_code)) = UPPER(TRIM(p_code))
      AND TRIM(a.phone) = TRIM(p_phone)
      AND a.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
