-- Drop existing policies
DROP POLICY IF EXISTS "Everyone can view published resources" ON educational_resources;
DROP POLICY IF EXISTS "Admins can do everything" ON educational_resources;

-- Enable RLS
ALTER TABLE educational_resources ENABLE ROW LEVEL SECURITY;

-- Create more specific policies
-- 1. Allow anyone to view published resources
CREATE POLICY "Allow viewing published resources"
    ON educational_resources FOR SELECT
    USING (published = true);

-- 2. Allow admins to view all resources (published or not)
CREATE POLICY "Allow admins to view all resources"
    ON educational_resources FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
            AND profiles.is_admin = true
        )
    );

-- 3. Allow admins to insert resources
CREATE POLICY "Allow admins to insert resources"
    ON educational_resources FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
            AND profiles.is_admin = true
        )
    );

-- 4. Allow admins to update resources
CREATE POLICY "Allow admins to update resources"
    ON educational_resources FOR UPDATE
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

-- 5. Allow admins to delete resources
CREATE POLICY "Allow admins to delete resources"
    ON educational_resources FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
            AND profiles.is_admin = true
        )
    );

-- Grant necessary permissions
GRANT ALL ON educational_resources TO authenticated; 