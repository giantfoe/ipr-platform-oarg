-- First ensure the status_history table exists with correct structure
CREATE TABLE IF NOT EXISTS public.status_history (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id uuid REFERENCES ip_applications(id) ON DELETE CASCADE,
    status text NOT NULL,
    notes text,
    created_by text REFERENCES profiles(wallet_address),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE status_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for owners and admins" ON status_history;

-- Create new policy for admin access
CREATE POLICY "Enable admin access to status history"
ON status_history
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
        AND profiles.is_admin = true
    )
);

-- Create trigger function to automatically create status history
CREATE OR REPLACE FUNCTION create_status_history()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO status_history (
            application_id,
            status,
            created_by,
            notes
        ) VALUES (
            NEW.id,
            NEW.status,
            current_setting('request.jwt.claims', true)::json->>'wallet_address',
            'Status changed from ' || OLD.status || ' to ' || NEW.status
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS status_change_trigger ON ip_applications;
CREATE TRIGGER status_change_trigger
    AFTER UPDATE OF status ON ip_applications
    FOR EACH ROW
    EXECUTE FUNCTION create_status_history();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_status_history_created_at 
    ON status_history(created_at DESC);

-- Grant necessary permissions
GRANT SELECT ON status_history TO authenticated; 