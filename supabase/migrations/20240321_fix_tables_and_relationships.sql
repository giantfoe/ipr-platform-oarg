-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.status_history CASCADE;
DROP TABLE IF EXISTS public.ip_applications CASCADE;
DROP TABLE IF EXISTS public.ip_applications_new CASCADE;

-- Create the applications table
CREATE TABLE public.ip_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    application_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    applicant_name TEXT,
    company_name TEXT,
    wallet_address TEXT REFERENCES public.profiles(wallet_address) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create the status history table
CREATE TABLE public.status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES public.ip_applications(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    created_by TEXT REFERENCES public.profiles(wallet_address),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ip_applications_wallet_address ON ip_applications(wallet_address);
CREATE INDEX IF NOT EXISTS idx_status_history_application_id ON status_history(application_id);
CREATE INDEX IF NOT EXISTS idx_status_history_created_by ON status_history(created_by);

-- Enable RLS
ALTER TABLE public.ip_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for ip_applications
CREATE POLICY "Enable read access for application owners and admins"
    ON ip_applications FOR SELECT
    USING (
        wallet_address = auth.jwt() ->> 'wallet_address'
        OR EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
            AND profiles.is_admin = true
        )
    );

CREATE POLICY "Enable write access for application owners"
    ON ip_applications FOR INSERT
    WITH CHECK (wallet_address = auth.jwt() ->> 'wallet_address');

CREATE POLICY "Enable update for owners and admins"
    ON ip_applications FOR UPDATE
    USING (
        wallet_address = auth.jwt() ->> 'wallet_address'
        OR EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
            AND profiles.is_admin = true
        )
    );

-- Create RLS policies for status_history
CREATE POLICY "Enable read access for related users and admins"
    ON status_history FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM ip_applications
            WHERE ip_applications.id = status_history.application_id
            AND (
                ip_applications.wallet_address = auth.jwt() ->> 'wallet_address'
                OR EXISTS (
                    SELECT 1 FROM profiles
                    WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
                    AND profiles.is_admin = true
                )
            )
        )
    );

CREATE POLICY "Enable insert for admins"
    ON status_history FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
            AND profiles.is_admin = true
        )
    );

-- Grant permissions
GRANT ALL ON ip_applications TO authenticated;
GRANT ALL ON status_history TO authenticated; 