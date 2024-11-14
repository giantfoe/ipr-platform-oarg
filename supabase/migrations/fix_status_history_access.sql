-- First, drop existing policies
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON status_history;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON status_history;

-- Enable RLS
ALTER TABLE status_history ENABLE ROW LEVEL SECURITY;

-- Create policy for admin writes
CREATE POLICY "Enable admin write access"
ON status_history FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
    AND profiles.is_admin = true
  )
);

-- Create policy for admin updates
CREATE POLICY "Enable admin update access"
ON status_history FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
    AND profiles.is_admin = true
  )
);

-- Create policy for user and admin reads
CREATE POLICY "Enable read access for owners and admins"
ON status_history FOR SELECT
USING (
  -- Allow if user owns the application
  EXISTS (
    SELECT 1 FROM ip_applications
    WHERE ip_applications.id = status_history.application_id
    AND ip_applications.wallet_address = auth.jwt() ->> 'wallet_address'
  )
  OR
  -- Allow if user is admin
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
    AND profiles.is_admin = true
  )
);

-- Grant necessary permissions
GRANT SELECT ON status_history TO authenticated;
GRANT INSERT, UPDATE ON status_history TO authenticated;

-- Ensure proper references
ALTER TABLE status_history
  DROP CONSTRAINT IF EXISTS status_history_application_id_fkey,
  ADD CONSTRAINT status_history_application_id_fkey 
    FOREIGN KEY (application_id) 
    REFERENCES ip_applications(id) 
    ON DELETE CASCADE;

ALTER TABLE status_history
  DROP CONSTRAINT IF EXISTS status_history_created_by_fkey,
  ADD CONSTRAINT status_history_created_by_fkey 
    FOREIGN KEY (created_by) 
    REFERENCES profiles(wallet_address);

-- Create or update indexes for better performance
DROP INDEX IF EXISTS idx_status_history_application;
DROP INDEX IF EXISTS idx_status_history_created_by;
DROP INDEX IF EXISTS idx_status_history_application_id;

CREATE INDEX idx_status_history_lookup ON status_history(application_id, created_at DESC);
CREATE INDEX idx_status_history_creator ON status_history(created_by);

-- Add trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_status_history_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_status_history_timestamp ON status_history;
CREATE TRIGGER update_status_history_timestamp
  BEFORE UPDATE ON status_history
  FOR EACH ROW
  EXECUTE FUNCTION update_status_history_timestamp(); 