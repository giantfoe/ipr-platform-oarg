-- First, drop all existing policies and triggers
DROP TRIGGER IF EXISTS check_admin_before_modify ON educational_resources;
DROP FUNCTION IF EXISTS enforce_admin_check();
DROP FUNCTION IF EXISTS check_is_admin();
DROP FUNCTION IF EXISTS is_admin();
DROP FUNCTION IF EXISTS check_admin_access(text);
DROP POLICY IF EXISTS "admin_full_access" ON educational_resources;
DROP POLICY IF EXISTS "public_read_published" ON educational_resources;

-- Enable RLS
ALTER TABLE educational_resources ENABLE ROW LEVEL SECURITY;

-- Create a permissive policy for admins
CREATE POLICY "admin_full_access" ON educational_resources
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

-- Create public read policy
CREATE POLICY "public_read_published" ON educational_resources
FOR SELECT
USING (published = true);

-- Grant necessary permissions
GRANT ALL ON educational_resources TO authenticated;

-- Create admin check function
CREATE OR REPLACE FUNCTION check_admin_status()
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
        AND profiles.is_admin = true
    );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION check_admin_status TO authenticated; 