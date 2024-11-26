-- First, create the enum types
CREATE TYPE application_type AS ENUM ('patent', 'trademark', 'copyright');
CREATE TYPE application_status AS ENUM ('draft', 'pending', 'in-review', 'approved', 'rejected');
CREATE TYPE trademark_type AS ENUM ('Word', 'Logo', 'Combined', 'Sound', '3D');
CREATE TYPE trademark_use_status AS ENUM ('In Use', 'Intent to Use');
CREATE TYPE copyright_work_type AS ENUM ('Literary', 'Musical', 'Artistic', 'Dramatic', 'Audiovisual', 'Sound Recording');
CREATE TYPE rights_ownership_type AS ENUM ('Original Author', 'Work for Hire', 'Transfer');

-- Remove the default value temporarily
ALTER TABLE ip_applications 
  ALTER COLUMN status DROP DEFAULT;

-- Convert existing columns to the new types
ALTER TABLE ip_applications
  ALTER COLUMN application_type TYPE application_type USING application_type::text::application_type,
  ALTER COLUMN status TYPE application_status USING status::text::application_status;

-- Add back the default value with proper casting
ALTER TABLE ip_applications 
  ALTER COLUMN status SET DEFAULT 'draft'::application_status;

-- Add new columns
ALTER TABLE ip_applications
  ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN updated_by TEXT REFERENCES profiles(wallet_address),
  ADD COLUMN technical_field TEXT,
  ADD COLUMN background_art TEXT,
  ADD COLUMN invention JSONB,
  ADD COLUMN claims JSONB,
  ADD COLUMN inventors JSONB,
  ADD COLUMN priority_claim JSONB,
  ADD COLUMN mark_type trademark_type,
  ADD COLUMN mark_text TEXT,
  ADD COLUMN mark_description TEXT,
  ADD COLUMN color_claim TEXT,
  ADD COLUMN nice_classifications JSONB,
  ADD COLUMN use_status trademark_use_status,
  ADD COLUMN first_use_date DATE,
  ADD COLUMN disclaimers JSONB,
  ADD COLUMN work_type copyright_work_type,
  ADD COLUMN alternative_titles JSONB,
  ADD COLUMN date_of_creation DATE,
  ADD COLUMN date_of_publication DATE,
  ADD COLUMN country_of_origin TEXT,
  ADD COLUMN authors JSONB,
  ADD COLUMN is_derivative BOOLEAN,
  ADD COLUMN preexisting_material TEXT,
  ADD COLUMN new_material TEXT,
  ADD COLUMN rights_ownership rights_ownership_type;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ip_applications_type ON ip_applications(application_type);
CREATE INDEX IF NOT EXISTS idx_ip_applications_status ON ip_applications(status);
CREATE INDEX IF NOT EXISTS idx_ip_applications_work_type ON ip_applications(work_type) WHERE application_type = 'copyright';
CREATE INDEX IF NOT EXISTS idx_ip_applications_mark_type ON ip_applications(mark_type) WHERE application_type = 'trademark';

-- Create views
CREATE OR REPLACE VIEW patent_applications AS
SELECT 
  id,
  title,
  description,
  status,
  technical_field,
  background_art,
  invention,
  claims,
  inventors,
  priority_claim,
  created_at,
  updated_at,
  wallet_address,
  applicant_name,
  company_name,
  national_id,
  phone_number
FROM ip_applications
WHERE application_type = 'patent';

CREATE OR REPLACE VIEW trademark_applications AS
SELECT 
  id,
  title,
  description,
  status,
  mark_type,
  mark_text,
  mark_description,
  color_claim,
  nice_classifications,
  use_status,
  first_use_date,
  disclaimers,
  created_at,
  updated_at,
  wallet_address,
  applicant_name,
  company_name,
  national_id,
  phone_number
FROM ip_applications
WHERE application_type = 'trademark';

CREATE OR REPLACE VIEW copyright_applications AS
SELECT 
  id,
  title,
  description,
  status,
  work_type,
  alternative_titles,
  date_of_creation,
  date_of_publication,
  country_of_origin,
  authors,
  is_derivative,
  preexisting_material,
  new_material,
  rights_ownership,
  created_at,
  updated_at,
  wallet_address,
  applicant_name,
  company_name,
  national_id,
  phone_number
FROM ip_applications
WHERE application_type = 'copyright';

-- Update RLS policies
DROP POLICY IF EXISTS "Users can view their own applications" ON ip_applications;
DROP POLICY IF EXISTS "Users can create their own applications" ON ip_applications;
DROP POLICY IF EXISTS "Users can update their draft applications" ON ip_applications;

CREATE POLICY "Users can view their own applications"
ON ip_applications FOR SELECT
TO authenticated
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
TO authenticated
WITH CHECK (
  wallet_address = auth.jwt() ->> 'wallet_address'
);

CREATE POLICY "Users can update their draft applications"
ON ip_applications FOR UPDATE
TO authenticated
USING (
  (wallet_address = auth.jwt() ->> 'wallet_address' AND status = 'draft')
  OR EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
    AND profiles.is_admin = true
  )
);

-- Grant permissions
GRANT SELECT ON patent_applications TO authenticated;
GRANT SELECT ON trademark_applications TO authenticated;
GRANT SELECT ON copyright_applications TO authenticated; 