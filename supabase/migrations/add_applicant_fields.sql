-- Add new columns for applicant information
ALTER TABLE ip_applications
ADD COLUMN IF NOT EXISTS applicant_name TEXT,
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS national_id TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Update RLS policies to include new fields
DROP POLICY IF EXISTS "Applications are viewable by owner and admins" ON ip_applications;
DROP POLICY IF EXISTS "Users can create their own applications" ON ip_applications;

-- Recreate policies with new fields
CREATE POLICY "Applications are viewable by owner and admins"
    ON ip_applications FOR SELECT
    USING (
        wallet_address = auth.jwt() ->> 'wallet_address'
        OR EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
            AND profiles.is_admin = true
        )
    );

CREATE POLICY "Users can create their own applications"
    ON ip_applications FOR INSERT
    WITH CHECK (
        wallet_address = auth.jwt() ->> 'wallet_address'
    );

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ip_applications_applicant_name ON ip_applications(applicant_name);
CREATE INDEX IF NOT EXISTS idx_ip_applications_national_id ON ip_applications(national_id);

-- Grant necessary permissions
GRANT ALL ON ip_applications TO authenticated; 