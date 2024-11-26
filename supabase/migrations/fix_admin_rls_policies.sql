-- First, verify admin status in profiles
SELECT * FROM profiles WHERE wallet_address = '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr';

-- Drop existing policies
DROP POLICY IF EXISTS "admin_full_access" ON ip_applications_new;
DROP POLICY IF EXISTS "user_read_own" ON ip_applications_new;
DROP POLICY IF EXISTS "user_create_own" ON ip_applications_new;
DROP POLICY IF EXISTS "user_update_own" ON ip_applications_new;

-- Create a simple, permissive policy for admins
CREATE POLICY "admin_access_policy" ON ip_applications_new
AS PERMISSIVE
FOR ALL
TO authenticated
USING (
    (SELECT is_admin FROM profiles WHERE wallet_address = auth.jwt() ->> 'wallet_address')
    OR wallet_address = auth.jwt() ->> 'wallet_address'
);

-- Enable RLS
ALTER TABLE ip_applications_new ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON ip_applications_new TO authenticated;
GRANT ALL ON profiles TO authenticated;

-- Insert or update admin user
INSERT INTO profiles (
    wallet_address,
    is_admin,
    full_name,
    created_at,
    updated_at
) VALUES (
    '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr',
    true,
    'Admin User',
    NOW(),
    NOW()
)
ON CONFLICT (wallet_address) 
DO UPDATE SET 
    is_admin = true,
    updated_at = NOW();

-- Verify data exists
SELECT COUNT(*) FROM ip_applications_new;

-- Verify admin can access data
SELECT 
    id,
    application_type,
    status,
    title,
    applicant_name,
    created_at
FROM ip_applications_new
WHERE 
    (SELECT is_admin FROM profiles WHERE wallet_address = '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr')
ORDER BY created_at DESC; 