-- Drop all existing policies
DROP POLICY IF EXISTS "Anyone can read published resources" ON written_resources;
DROP POLICY IF EXISTS "Admins can do anything" ON written_resources;
DROP POLICY IF EXISTS "admin_full_access" ON written_resources;
DROP POLICY IF EXISTS "public_read_published" ON written_resources;

-- Enable RLS
ALTER TABLE written_resources ENABLE ROW LEVEL SECURITY;

-- Create a simple admin policy without JWT handling
CREATE POLICY "admin_access_policy" ON written_resources
FOR ALL 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.wallet_address = auth.uid()
        AND profiles.is_admin = true
    )
);

-- Create public read policy
CREATE POLICY "public_read_policy" ON written_resources
FOR SELECT
USING (published = true);

-- Grant necessary permissions
GRANT ALL ON written_resources TO authenticated;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_written_resources_published ON written_resources(published);
CREATE INDEX IF NOT EXISTS idx_written_resources_created_by ON written_resources(created_by); 