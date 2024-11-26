-- First, create the status_history table with proper foreign key
CREATE TABLE IF NOT EXISTS public.status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES public.ip_applications(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    created_by TEXT REFERENCES public.profiles(wallet_address),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_status_history_application_id ON status_history(application_id);
CREATE INDEX IF NOT EXISTS idx_status_history_created_by ON status_history(created_by);

-- Enable RLS
ALTER TABLE status_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for application owners and admins"
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

-- Grant permissions
GRANT ALL ON status_history TO authenticated; 