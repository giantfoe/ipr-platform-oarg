-- First, drop existing policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new, simplified policies
CREATE POLICY "Enable read access for users"
  ON profiles FOR SELECT
  USING (true);  -- Everyone can read profiles

CREATE POLICY "Enable insert for users"
  ON profiles FOR INSERT
  WITH CHECK (true);  -- Anyone can create a profile

CREATE POLICY "Enable update for users"
  ON profiles FOR UPDATE
  USING (
    wallet_address = auth.jwt() ->> 'wallet_address'
    OR 
    is_admin = true
  );

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_wallet_admin 
  ON profiles(wallet_address, is_admin);

-- Update the admin audit log policies
CREATE POLICY "Admin audit log viewable by admins"
  ON admin_audit_log FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
    AND profiles.is_admin = true
  ));

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY; 