-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON ip_applications;
DROP POLICY IF EXISTS "Enable insert access for all users" ON ip_applications;
DROP POLICY IF EXISTS "Enable update for users based on wallet_address" ON ip_applications;
DROP POLICY IF EXISTS "Admins can update all applications" ON ip_applications;

-- Enable RLS
ALTER TABLE ip_applications ENABLE ROW LEVEL SECURITY;

-- Create admin policies
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

-- Create user policies
CREATE POLICY "user_read_own_applications" ON ip_applications
FOR SELECT
USING (
    wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
);

CREATE POLICY "user_create_applications" ON ip_applications
FOR INSERT
WITH CHECK (
    wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
);

CREATE POLICY "user_update_own_applications" ON ip_applications
FOR UPDATE
USING (
    wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
);

-- Grant necessary permissions
GRANT ALL ON ip_applications TO authenticated; 