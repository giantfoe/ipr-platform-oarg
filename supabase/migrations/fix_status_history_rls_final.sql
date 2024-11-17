-- Drop all existing policies
DROP POLICY IF EXISTS "admin_full_access_status_history" ON status_history;
DROP POLICY IF EXISTS "user_view_own_status_history" ON status_history;
DROP POLICY IF EXISTS "status_history_admin_access" ON status_history;
DROP POLICY IF EXISTS "status_history_user_read" ON status_history;

-- Enable RLS
ALTER TABLE status_history ENABLE ROW LEVEL SECURITY;

-- Grant basic permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON status_history TO authenticated;
GRANT ALL ON status_history TO service_role;

-- Create a simple policy for admin access
CREATE POLICY "admin_access_policy" ON status_history
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
        AND profiles.is_admin = true
    )
);

-- Create a read-only policy for users to view their own application's history
CREATE POLICY "user_read_policy" ON status_history
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM ip_applications
        WHERE ip_applications.id = status_history.application_id
        AND ip_applications.wallet_address = auth.jwt() ->> 'wallet_address'
    )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_status_history_app_id ON status_history(application_id);
CREATE INDEX IF NOT EXISTS idx_status_history_created_by ON status_history(created_by); 