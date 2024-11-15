-- First, drop all existing policies and triggers
DROP TRIGGER IF EXISTS check_admin_before_modify ON educational_resources;
DROP FUNCTION IF EXISTS enforce_admin_check();
DROP FUNCTION IF EXISTS check_is_admin();
DROP POLICY IF EXISTS "admin_full_access" ON educational_resources;
DROP POLICY IF EXISTS "public_read_published" ON educational_resources;

-- Enable RLS
ALTER TABLE educational_resources ENABLE ROW LEVEL SECURITY;

-- Create a single, permissive policy for admins
CREATE POLICY "admin_full_access" ON educational_resources
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
        AND profiles.is_admin = true
    )
);

-- Create public read policy
CREATE POLICY "public_read_published" ON educational_resources
FOR SELECT
USING (published = true);

-- Grant necessary permissions
GRANT ALL ON educational_resources TO authenticated;

-- Create function to check admin status
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
        AND profiles.is_admin = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION is_admin TO authenticated; 