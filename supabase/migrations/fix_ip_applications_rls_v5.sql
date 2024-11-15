-- Drop existing policies
DROP POLICY IF EXISTS "enable_all_access" ON ip_applications;
DROP POLICY IF EXISTS "admin_full_access" ON ip_applications;
DROP POLICY IF EXISTS "user_read_own" ON ip_applications;
DROP POLICY IF EXISTS "user_create" ON ip_applications;
DROP POLICY IF EXISTS "user_update_own" ON ip_applications;

-- Enable RLS
ALTER TABLE ip_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for users and admins
CREATE POLICY "user_applications_policy" ON ip_applications
FOR ALL
TO authenticated
USING (
    -- Users can access their own applications
    wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
    OR 
    -- Admins can access all applications
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
        AND profiles.is_admin = true
    )
)
WITH CHECK (
    -- Users can only create/update their own applications
    wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
    OR 
    -- Admins can create/update any application
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
        AND profiles.is_admin = true
    )
);

-- Grant necessary permissions
GRANT ALL ON ip_applications TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ip_applications_wallet_address ON ip_applications(wallet_address);
CREATE INDEX IF NOT EXISTS idx_ip_applications_status ON ip_applications(status); 