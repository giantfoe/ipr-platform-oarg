-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read published resources" ON written_resources;
DROP POLICY IF EXISTS "Admins can do anything" ON written_resources;
DROP POLICY IF EXISTS "admin_full_access" ON written_resources;
DROP POLICY IF EXISTS "public_read_published" ON written_resources;

-- Enable RLS
ALTER TABLE written_resources ENABLE ROW LEVEL SECURITY;

-- Create admin policy with proper JWT handling
CREATE POLICY "admin_full_access" ON written_resources
AS PERMISSIVE
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
        AND profiles.is_admin = true
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
        AND profiles.is_admin = true
    )
);

-- Create public read policy
CREATE POLICY "public_read_published" ON written_resources
FOR SELECT
USING (published = true);

-- Grant necessary permissions
GRANT ALL ON written_resources TO authenticated;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_written_resources_admin_lookup 
ON written_resources(created_by); 