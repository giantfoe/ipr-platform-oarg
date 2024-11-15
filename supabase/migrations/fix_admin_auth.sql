-- Drop existing policies
DROP POLICY IF EXISTS "admin_full_access" ON educational_resources;
DROP POLICY IF EXISTS "public_read_published" ON educational_resources;

-- Create new, more permissive admin policy
CREATE POLICY "admin_full_access" ON educational_resources
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