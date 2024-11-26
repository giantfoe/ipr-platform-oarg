-- First backup existing data
CREATE TABLE ip_applications_backup AS SELECT * FROM ip_applications;

-- Drop ALL existing triggers and functions that depend on the status column
DROP TRIGGER IF EXISTS on_status_update ON ip_applications;
DROP TRIGGER IF EXISTS status_change_trigger ON ip_applications;
DROP FUNCTION IF EXISTS handle_status_update() CASCADE;
DROP FUNCTION IF EXISTS process_status_change() CASCADE;

-- Create new ENUM types
DO $$ BEGIN
    CREATE TYPE application_type AS ENUM ('patent', 'trademark', 'copyright');
    CREATE TYPE application_status AS ENUM ('draft', 'pending', 'in-review', 'approved', 'rejected');
    CREATE TYPE trademark_type AS ENUM ('Word', 'Logo', 'Combined', 'Sound', '3D');
    CREATE TYPE trademark_use_status AS ENUM ('In Use', 'Intent to Use');
    CREATE TYPE copyright_work_type AS ENUM ('Literary', 'Musical', 'Artistic', 'Dramatic', 'Audiovisual', 'Sound Recording');
    CREATE TYPE rights_ownership_type AS ENUM ('Original Author', 'Work for Hire', 'Transfer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Remove the default value temporarily
ALTER TABLE ip_applications 
  ALTER COLUMN status DROP DEFAULT;

-- Convert the column type
ALTER TABLE ip_applications 
  ALTER COLUMN status TYPE application_status USING status::text::application_status,
  ALTER COLUMN application_type TYPE application_type USING application_type::text::application_type;

-- Add back the default with proper casting
ALTER TABLE ip_applications 
  ALTER COLUMN status SET DEFAULT 'draft'::application_status;

-- Add new columns to existing table
ALTER TABLE ip_applications
  -- Patent Specific
  ADD COLUMN IF NOT EXISTS technical_field TEXT,
  ADD COLUMN IF NOT EXISTS background_art TEXT,
  ADD COLUMN IF NOT EXISTS invention JSONB,
  ADD COLUMN IF NOT EXISTS claims JSONB,
  ADD COLUMN IF NOT EXISTS inventors JSONB,
  ADD COLUMN IF NOT EXISTS priority_claim JSONB,
  
  -- Trademark Specific
  ADD COLUMN IF NOT EXISTS mark_type trademark_type,
  ADD COLUMN IF NOT EXISTS mark_text TEXT,
  ADD COLUMN IF NOT EXISTS mark_description TEXT,
  ADD COLUMN IF NOT EXISTS color_claim TEXT,
  ADD COLUMN IF NOT EXISTS nice_classifications JSONB,
  ADD COLUMN IF NOT EXISTS use_status trademark_use_status,
  ADD COLUMN IF NOT EXISTS first_use_date DATE,
  ADD COLUMN IF NOT EXISTS disclaimers JSONB,
  
  -- Copyright Specific
  ADD COLUMN IF NOT EXISTS work_type copyright_work_type,
  ADD COLUMN IF NOT EXISTS alternative_titles JSONB,
  ADD COLUMN IF NOT EXISTS date_of_creation DATE,
  ADD COLUMN IF NOT EXISTS date_of_publication DATE,
  ADD COLUMN IF NOT EXISTS country_of_origin TEXT,
  ADD COLUMN IF NOT EXISTS authors JSONB,
  ADD COLUMN IF NOT EXISTS is_derivative BOOLEAN,
  ADD COLUMN IF NOT EXISTS preexisting_material TEXT,
  ADD COLUMN IF NOT EXISTS new_material TEXT,
  ADD COLUMN IF NOT EXISTS rights_ownership rights_ownership_type;

-- Recreate the status update trigger function with proper type casting
CREATE OR REPLACE FUNCTION handle_status_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO status_history (
      application_id,
      status,
      created_by
    ) VALUES (
      NEW.id,
      NEW.status::text,
      NEW.updated_by
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_status_update
  BEFORE UPDATE ON ip_applications
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION handle_status_update();

-- Create application type views
CREATE OR REPLACE VIEW patent_applications AS
SELECT * FROM ip_applications WHERE application_type = 'patent'::application_type;

CREATE OR REPLACE VIEW trademark_applications AS
SELECT * FROM ip_applications WHERE application_type = 'trademark'::application_type;

CREATE OR REPLACE VIEW copyright_applications AS
SELECT * FROM ip_applications WHERE application_type = 'copyright'::application_type;

-- Create new indexes
CREATE INDEX IF NOT EXISTS idx_ip_applications_type ON ip_applications(application_type);
CREATE INDEX IF NOT EXISTS idx_ip_applications_work_type ON ip_applications(work_type) WHERE application_type = 'copyright'::application_type;
CREATE INDEX IF NOT EXISTS idx_ip_applications_mark_type ON ip_applications(mark_type) WHERE application_type = 'trademark'::application_type;

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
  (wallet_address = auth.jwt() ->> 'wallet_address' AND status = 'draft'::application_status)
  OR EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
    AND profiles.is_admin = true
  )
);

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated; 