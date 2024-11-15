-- First, drop all existing policies
DROP POLICY IF EXISTS "admin_full_access" ON educational_resources;
DROP POLICY IF EXISTS "public_read_published" ON educational_resources;
DROP POLICY IF EXISTS "Everyone can view published resources" ON educational_resources;
DROP POLICY IF EXISTS "Admins can do everything" ON educational_resources;

-- Enable RLS
ALTER TABLE educational_resources ENABLE ROW LEVEL SECURITY;

-- Create a single, simplified admin policy
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

-- Create admin check function
CREATE OR REPLACE FUNCTION check_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
        AND profiles.is_admin = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to enforce admin check
CREATE OR REPLACE FUNCTION enforce_admin_check()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT check_is_admin() THEN
        RAISE EXCEPTION 'Only admins can modify resources';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER check_admin_before_modify
    BEFORE INSERT OR UPDATE OR DELETE ON educational_resources
    FOR EACH ROW
    EXECUTE FUNCTION enforce_admin_check(); 