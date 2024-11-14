-- Drop existing policies
DROP POLICY IF EXISTS "Allow viewing published resources" ON educational_resources;
DROP POLICY IF EXISTS "Allow admins to view all resources" ON educational_resources;
DROP POLICY IF EXISTS "Allow admins to insert resources" ON educational_resources;
DROP POLICY IF EXISTS "Allow admins to update resources" ON educational_resources;
DROP POLICY IF EXISTS "Allow admins to delete resources" ON educational_resources;

-- Create a single admin policy for all operations
CREATE POLICY "admin_full_access" ON educational_resources
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

-- Create public read policy for published resources
CREATE POLICY "public_read_published" ON educational_resources
FOR SELECT
USING (published = true);

-- Grant necessary permissions
GRANT ALL ON educational_resources TO authenticated; 