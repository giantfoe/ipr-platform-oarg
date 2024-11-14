-- Drop existing policies
DROP POLICY IF EXISTS "Status history insertable by admins" ON status_history;
DROP POLICY IF EXISTS "Status history viewable by application owner and admins" ON status_history;

-- Create proper policies for status_history table
CREATE POLICY "Enable insert access for authenticated users"
ON status_history FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Enable read access for authenticated users"
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

-- Ensure RLS is enabled
ALTER TABLE status_history ENABLE ROW LEVEL SECURITY;

-- Grant proper permissions
GRANT SELECT, INSERT ON status_history TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_status_history_application_id 
  ON status_history(application_id);
CREATE INDEX IF NOT EXISTS idx_status_history_created_by 
  ON status_history(created_by); 