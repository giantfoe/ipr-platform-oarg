-- First, drop existing policies
DROP POLICY IF EXISTS "status_history_admin_access" ON status_history;
DROP POLICY IF EXISTS "status_history_user_read" ON status_history;
DROP POLICY IF EXISTS "Enable read access for owners and admins" ON status_history;
DROP POLICY IF EXISTS "Enable admin write access" ON status_history;

-- Enable RLS
ALTER TABLE status_history ENABLE ROW LEVEL SECURITY;

-- Create a single, permissive policy for admins
CREATE POLICY "admin_full_access_status_history" ON status_history
AS PERMISSIVE
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
        AND profiles.is_admin = true
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
        AND profiles.is_admin = true
    )
);

-- Create read policy for application owners
CREATE POLICY "user_view_own_status_history" ON status_history
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM ip_applications
        WHERE ip_applications.id = status_history.application_id
        AND ip_applications.wallet_address = auth.jwt() ->> 'wallet_address'
    )
);

-- Grant necessary permissions
GRANT ALL ON status_history TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_status_history_app_id ON status_history(application_id);
CREATE INDEX IF NOT EXISTS idx_status_history_created_by ON status_history(created_by);