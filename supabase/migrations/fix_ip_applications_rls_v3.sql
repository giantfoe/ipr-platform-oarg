-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON ip_applications;
DROP POLICY IF EXISTS "Enable insert access for all users" ON ip_applications;
DROP POLICY IF EXISTS "Enable update for users based on wallet_address" ON ip_applications;
DROP POLICY IF EXISTS "Admins can update all applications" ON ip_applications;
DROP POLICY IF EXISTS "admin_full_access" ON ip_applications;
DROP POLICY IF EXISTS "user_read_own_applications" ON ip_applications;
DROP POLICY IF EXISTS "user_create_applications" ON ip_applications;
DROP POLICY IF EXISTS "user_update_own_applications" ON ip_applications;
DROP POLICY IF EXISTS "user_read_own" ON ip_applications;
DROP POLICY IF EXISTS "user_create" ON ip_applications;
DROP POLICY IF EXISTS "user_update_own" ON ip_applications;

-- Enable RLS
ALTER TABLE ip_applications ENABLE ROW LEVEL SECURITY;

-- Create simplified policies
-- Admin full access
CREATE POLICY "admin_full_access" ON ip_applications
FOR ALL 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
        AND profiles.is_admin = true
    )
);

-- User can read own applications
CREATE POLICY "user_read_own" ON ip_applications
FOR SELECT
TO authenticated
USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- User can create own applications
CREATE POLICY "user_create" ON ip_applications
FOR INSERT
TO authenticated
WITH CHECK (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- User can update own applications
CREATE POLICY "user_update_own" ON ip_applications
FOR UPDATE
TO authenticated
USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Grant necessary permissions
GRANT ALL ON ip_applications TO authenticated;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_ip_applications_wallet_address ON ip_applications(wallet_address); 