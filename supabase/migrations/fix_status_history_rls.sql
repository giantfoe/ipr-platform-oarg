-- First, drop all existing policies on status_history
DROP POLICY IF EXISTS "Enable admin write access" ON status_history;
DROP POLICY IF EXISTS "Enable admin update access" ON status_history;
DROP POLICY IF EXISTS "Enable read access for owners and admins" ON status_history;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON status_history;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON status_history;
DROP POLICY IF EXISTS "Status history insertable by admins" ON status_history;
DROP POLICY IF EXISTS "Status history viewable by application owner and admins" ON status_history;

-- Enable RLS
ALTER TABLE status_history ENABLE ROW LEVEL SECURITY;

-- Create a single, simple policy for admin write access
CREATE POLICY "Enable insert for admins"
ON status_history FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
    AND profiles.is_admin = true
  )
);

-- Create a simple read policy
CREATE POLICY "Enable read for owners and admins"
ON status_history FOR SELECT
USING (
  EXISTS (
    SELECT 1 
    FROM ip_applications 
    WHERE ip_applications.id = status_history.application_id
    AND (
      ip_applications.wallet_address = auth.jwt() ->> 'wallet_address'
      OR EXISTS (
        SELECT 1 
        FROM profiles 
        WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
        AND profiles.is_admin = true
      )
    )
  )
);

-- Grant proper permissions
GRANT ALL ON status_history TO authenticated;

-- Ensure proper references
ALTER TABLE status_history 
  DROP CONSTRAINT IF EXISTS status_history_created_by_fkey,
  ADD CONSTRAINT status_history_created_by_fkey 
    FOREIGN KEY (created_by) 
    REFERENCES profiles(wallet_address)
    ON DELETE SET NULL;

ALTER TABLE status_history 
  DROP CONSTRAINT IF EXISTS status_history_application_id_fkey,
  ADD CONSTRAINT status_history_application_id_fkey 
    FOREIGN KEY (application_id) 
    REFERENCES ip_applications(id)
    ON DELETE CASCADE; 