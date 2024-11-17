-- Drop existing policies
DROP POLICY IF EXISTS "Applications are viewable by owner and admins" ON ip_applications;
DROP POLICY IF EXISTS "Users can create their own applications" ON ip_applications;
DROP POLICY IF EXISTS "Admins can update any application" ON ip_applications;

-- Create comprehensive policies
CREATE POLICY "admin_full_access" ON ip_applications
FOR ALL 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
        AND profiles.is_admin = true
    )
);

CREATE POLICY "user_read_own" ON ip_applications
FOR SELECT
TO authenticated
USING (wallet_address = auth.jwt() ->> 'wallet_address');

CREATE POLICY "user_create_own" ON ip_applications
FOR INSERT
TO authenticated
WITH CHECK (wallet_address = auth.jwt() ->> 'wallet_address');

-- Status History policies
DROP POLICY IF EXISTS "Enable read access for owners and admins" ON status_history;
DROP POLICY IF EXISTS "Enable admin write access" ON status_history;

CREATE POLICY "status_history_admin_access" ON status_history
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
        AND profiles.is_admin = true
    )
);

CREATE POLICY "status_history_user_read" ON status_history
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM ip_applications
        WHERE ip_applications.id = status_history.application_id
        AND ip_applications.wallet_address = auth.jwt() ->> 'wallet_address'
    )
);

-- Grant necessary permissions
GRANT ALL ON status_history TO authenticated;
GRANT ALL ON ip_applications TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_status_history_application_id ON status_history(application_id);
CREATE INDEX IF NOT EXISTS idx_status_history_created_by ON status_history(created_by); 