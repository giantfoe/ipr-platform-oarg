-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own applications" ON ip_applications_new;
DROP POLICY IF EXISTS "Users can create their own applications" ON ip_applications_new;
DROP POLICY IF EXISTS "Users can update their draft applications" ON ip_applications_new;
DROP POLICY IF EXISTS "admin_access_policy" ON ip_applications_new;

-- Create new policies with proper admin access
CREATE POLICY "admin_full_access" ON ip_applications_new
FOR ALL 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
        AND profiles.is_admin = true
    )
);

CREATE POLICY "user_read_own" ON ip_applications_new
FOR SELECT
TO authenticated
USING (
    wallet_address = auth.jwt() ->> 'wallet_address'
    OR EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
        AND profiles.is_admin = true
    )
);

CREATE POLICY "user_create_own" ON ip_applications_new
FOR INSERT
TO authenticated
WITH CHECK (
    wallet_address = auth.jwt() ->> 'wallet_address'
);

CREATE POLICY "user_update_own" ON ip_applications_new
FOR UPDATE
TO authenticated
USING (
    wallet_address = auth.jwt() ->> 'wallet_address'
    OR EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
        AND profiles.is_admin = true
    )
);

-- Verify admin user exists
INSERT INTO profiles (wallet_address, is_admin, full_name)
VALUES (
    '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr',
    true,
    'Admin User'
)
ON CONFLICT (wallet_address) 
DO UPDATE SET is_admin = true; 