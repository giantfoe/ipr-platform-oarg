-- Add trigger for status changes
CREATE OR REPLACE FUNCTION handle_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into status_history when status changes
    IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO status_history (
            application_id,
            status,
            created_by,
            notes
        ) VALUES (
            NEW.id,
            NEW.status,
            current_setting('request.jwt.claims')::json->>'wallet_address',
            'Status changed from ' || OLD.status || ' to ' || NEW.status
        );
    END IF;
    
    -- Update the updated_at timestamp
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create or replace the trigger
DROP TRIGGER IF EXISTS on_status_change ON ip_applications;
CREATE TRIGGER on_status_change
    BEFORE UPDATE ON ip_applications
    FOR EACH ROW
    EXECUTE FUNCTION handle_status_change();

-- Update RLS policies for status updates
DROP POLICY IF EXISTS "Enable status updates for admins" ON ip_applications;
CREATE POLICY "Enable status updates for admins"
    ON ip_applications
    FOR UPDATE
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

-- Enable realtime subscriptions for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE ip_applications;
ALTER PUBLICATION supabase_realtime ADD TABLE status_history;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applications_status ON ip_applications(status);
CREATE INDEX IF NOT EXISTS idx_status_history_application ON status_history(application_id);
CREATE INDEX IF NOT EXISTS idx_status_history_created ON status_history(created_at);

-- Update status_history table to ensure proper relations
ALTER TABLE status_history
    ADD COLUMN IF NOT EXISTS created_by text REFERENCES profiles(wallet_address),
    ADD COLUMN IF NOT EXISTS notes text,
    ALTER COLUMN created_at SET DEFAULT now();

-- Grant necessary permissions
GRANT SELECT, INSERT ON status_history TO authenticated;
GRANT SELECT, UPDATE ON ip_applications TO authenticated;

-- Enable RLS on status_history
ALTER TABLE status_history ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for status_history
CREATE POLICY "Status history viewable by application owner and admins"
    ON status_history FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM ip_applications
            WHERE ip_applications.id = status_history.application_id
            AND (
                ip_applications.wallet_address = auth.jwt() ->> 'wallet_address'
                OR
                EXISTS (
                    SELECT 1 FROM profiles
                    WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
                    AND profiles.is_admin = true
                )
            )
        )
    );

CREATE POLICY "Status history insertable by admins"
    ON status_history FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
            AND profiles.is_admin = true
        )
    ); 