-- Drop all existing policies
DROP POLICY IF EXISTS "Everyone can view published resources" ON educational_resources;
DROP POLICY IF EXISTS "Admins can do everything" ON educational_resources;
DROP POLICY IF EXISTS "Allow viewing published resources" ON educational_resources;
DROP POLICY IF EXISTS "Allow admins to view all resources" ON educational_resources;
DROP POLICY IF EXISTS "Allow admins to insert resources" ON educational_resources;
DROP POLICY IF EXISTS "Allow admins to update resources" ON educational_resources;
DROP POLICY IF EXISTS "Allow admins to delete resources" ON educational_resources;

-- Enable RLS
ALTER TABLE educational_resources ENABLE ROW LEVEL SECURITY;

-- Create simplified policies
-- 1. Allow public read access to published resources
CREATE POLICY "public_read_published"
    ON educational_resources FOR SELECT
    USING (published = true);

-- 2. Allow admin full access
CREATE POLICY "admin_full_access"
    ON educational_resources
    AS PERMISSIVE
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

-- Grant necessary permissions
GRANT ALL ON educational_resources TO authenticated; 