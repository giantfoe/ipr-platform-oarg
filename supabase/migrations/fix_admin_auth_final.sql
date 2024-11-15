-- First, drop all existing policies
DROP POLICY IF EXISTS "admin_full_access" ON educational_resources;
DROP POLICY IF EXISTS "public_read_published" ON educational_resources;
DROP POLICY IF EXISTS "Everyone can view published resources" ON educational_resources;
DROP POLICY IF EXISTS "Admins can do everything" ON educational_resources;

-- Enable RLS
ALTER TABLE educational_resources ENABLE ROW LEVEL SECURITY;

-- Create a single policy for admin access (more permissive)
CREATE POLICY "admin_full_access" ON educational_resources AS PERMISSIVE
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
        AND profiles.is_admin = true
    )
)
WITH CHECK (
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

-- Verify admin status function
CREATE OR REPLACE FUNCTION is_admin(wallet_address text)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.wallet_address = $1
        AND profiles.is_admin = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION is_admin TO authenticated; 