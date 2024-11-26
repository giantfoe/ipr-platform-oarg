-- Create RLS policies for ip_applications
CREATE POLICY "Enable read access for application owners and admins"
    ON ip_applications FOR SELECT
    USING (
        wallet_address = auth.jwt() ->> 'wallet_address'
        OR EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
            AND profiles.is_admin = true
        )
    );

CREATE POLICY "Enable write access for application owners"
    ON ip_applications FOR INSERT
    WITH CHECK (wallet_address = auth.jwt() ->> 'wallet_address');

CREATE POLICY "Enable update for owners and admins"
    ON ip_applications FOR UPDATE
    USING (
        wallet_address = auth.jwt() ->> 'wallet_address'
        OR EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
            AND profiles.is_admin = true
        )
    );

-- Create RLS policies for status_history
CREATE POLICY "Enable read access for related users and admins"
    ON status_history FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM ip_applications
            WHERE ip_applications.id = status_history.application_id
            AND (
                ip_applications.wallet_address = auth.jwt() ->> 'wallet_address'
                OR EXISTS (
                    SELECT 1 FROM profiles
                    WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
                    AND profiles.is_admin = true
                )
            )
        )
    );

CREATE POLICY "Enable insert for admins"
    ON status_history FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
            AND profiles.is_admin = true
        )
    );

-- Grant permissions
GRANT ALL ON ip_applications TO authenticated;
GRANT ALL ON status_history TO authenticated; 