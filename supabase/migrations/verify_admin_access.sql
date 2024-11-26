-- First, verify the admin user exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM profiles 
        WHERE wallet_address = '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr'
    ) THEN
        INSERT INTO profiles (
            wallet_address,
            is_admin,
            full_name
        ) VALUES (
            '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr',
            true,
            'Admin User'
        );
    ELSE
        UPDATE profiles 
        SET is_admin = true 
        WHERE wallet_address = '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr';
    END IF;
END
$$;

-- Verify RLS is enabled
ALTER TABLE ip_applications_new ENABLE ROW LEVEL SECURITY;

-- Recreate the policies with simpler conditions
DROP POLICY IF EXISTS "admin_full_access" ON ip_applications_new;
CREATE POLICY "admin_full_access" ON ip_applications_new
AS PERMISSIVE
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
        AND profiles.is_admin = true
    )
);

-- Grant necessary permissions
GRANT ALL ON ip_applications_new TO authenticated;
GRANT ALL ON profiles TO authenticated;

-- Verify the counts (run these separately to check)
SELECT COUNT(*) FROM ip_applications_new;
SELECT COUNT(*) FROM profiles WHERE is_admin = true; 