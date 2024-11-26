-- First, drop the existing trigger and function
DROP TRIGGER IF EXISTS on_status_update ON ip_applications;
DROP FUNCTION IF EXISTS handle_status_update CASCADE;

-- Now create the enum types
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

-- Recreate the status update trigger function with new type
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

-- Rest of the migration... 