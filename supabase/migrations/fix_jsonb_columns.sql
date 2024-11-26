-- First drop the views
DROP VIEW IF EXISTS patent_applications;
DROP VIEW IF EXISTS trademark_applications;
DROP VIEW IF EXISTS copyright_applications;

-- Update the columns to properly handle JSONB
ALTER TABLE ip_applications
  ALTER COLUMN invention TYPE JSONB USING CASE 
    WHEN invention IS NULL THEN NULL 
    WHEN invention::text = '' THEN '{}'::jsonb 
    ELSE invention::jsonb 
  END,
  ALTER COLUMN claims TYPE JSONB USING CASE 
    WHEN claims IS NULL THEN NULL 
    WHEN claims::text = '' THEN '[]'::jsonb 
    ELSE claims::jsonb 
  END,
  ALTER COLUMN inventors TYPE JSONB USING CASE 
    WHEN inventors IS NULL THEN NULL 
    WHEN inventors::text = '' THEN '[]'::jsonb 
    ELSE inventors::jsonb 
  END,
  ALTER COLUMN nice_classifications TYPE JSONB USING CASE 
    WHEN nice_classifications IS NULL THEN NULL 
    WHEN nice_classifications::text = '' THEN '[]'::jsonb 
    ELSE nice_classifications::jsonb 
  END,
  ALTER COLUMN authors TYPE JSONB USING CASE 
    WHEN authors IS NULL THEN NULL 
    WHEN authors::text = '' THEN '[]'::jsonb 
    ELSE authors::jsonb 
  END;

-- Add constraints to ensure valid JSON
ALTER TABLE ip_applications
  ADD CONSTRAINT invention_is_json CHECK (invention IS NULL OR jsonb_typeof(invention) = 'object'),
  ADD CONSTRAINT claims_is_json CHECK (claims IS NULL OR jsonb_typeof(claims) = 'array'),
  ADD CONSTRAINT inventors_is_json CHECK (inventors IS NULL OR jsonb_typeof(inventors) = 'array'),
  ADD CONSTRAINT nice_classifications_is_json CHECK (nice_classifications IS NULL OR jsonb_typeof(nice_classifications) = 'array'),
  ADD CONSTRAINT authors_is_json CHECK (authors IS NULL OR jsonb_typeof(authors) = 'array');

-- Add indexes for JSONB columns
CREATE INDEX IF NOT EXISTS idx_ip_applications_invention ON ip_applications USING gin (invention);
CREATE INDEX IF NOT EXISTS idx_ip_applications_claims ON ip_applications USING gin (claims);
CREATE INDEX IF NOT EXISTS idx_ip_applications_inventors ON ip_applications USING gin (inventors);
CREATE INDEX IF NOT EXISTS idx_ip_applications_nice_classifications ON ip_applications USING gin (nice_classifications);
CREATE INDEX IF NOT EXISTS idx_ip_applications_authors ON ip_applications USING gin (authors);

-- Recreate the views
CREATE OR REPLACE VIEW patent_applications AS
SELECT * FROM ip_applications WHERE application_type = 'patent';

CREATE OR REPLACE VIEW trademark_applications AS
SELECT * FROM ip_applications WHERE application_type = 'trademark';

CREATE OR REPLACE VIEW copyright_applications AS
SELECT * FROM ip_applications WHERE application_type = 'copyright';

-- Grant permissions
GRANT SELECT ON patent_applications TO authenticated;
GRANT SELECT ON trademark_applications TO authenticated;
GRANT SELECT ON copyright_applications TO authenticated; 