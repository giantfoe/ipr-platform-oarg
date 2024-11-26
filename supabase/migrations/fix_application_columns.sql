-- Add missing columns for all application types
ALTER TABLE ip_applications_new
  -- Patent specific
  ADD COLUMN IF NOT EXISTS technical_field TEXT,
  ADD COLUMN IF NOT EXISTS background_art TEXT,
  ADD COLUMN IF NOT EXISTS invention JSONB,
  ADD COLUMN IF NOT EXISTS claims JSONB,
  ADD COLUMN IF NOT EXISTS inventors JSONB,
  ADD COLUMN IF NOT EXISTS priority_claim JSONB,
  
  -- Trademark specific
  ADD COLUMN IF NOT EXISTS mark_type trademark_type,
  ADD COLUMN IF NOT EXISTS mark_text TEXT,
  ADD COLUMN IF NOT EXISTS mark_description TEXT,
  ADD COLUMN IF NOT EXISTS color_claim TEXT,
  ADD COLUMN IF NOT EXISTS nice_classifications JSONB,
  ADD COLUMN IF NOT EXISTS use_status trademark_use_status,
  ADD COLUMN IF NOT EXISTS first_use_date DATE,
  ADD COLUMN IF NOT EXISTS disclaimers JSONB,
  
  -- Copyright specific
  ADD COLUMN IF NOT EXISTS work_type copyright_work_type,
  ADD COLUMN IF NOT EXISTS alternative_titles JSONB, -- Fixed column name
  ADD COLUMN IF NOT EXISTS date_of_creation DATE,
  ADD COLUMN IF NOT EXISTS date_of_publication DATE,
  ADD COLUMN IF NOT EXISTS country_of_origin TEXT,
  ADD COLUMN IF NOT EXISTS authors JSONB,
  ADD COLUMN IF NOT EXISTS is_derivative BOOLEAN,
  ADD COLUMN IF NOT EXISTS preexisting_material TEXT,
  ADD COLUMN IF NOT EXISTS new_material TEXT,
  ADD COLUMN IF NOT EXISTS rights_ownership rights_ownership_type;

-- Update the column comment to reflect the JSONB structure
COMMENT ON COLUMN ip_applications_new.alternative_titles IS 'Array of alternative titles stored as JSONB';
COMMENT ON COLUMN ip_applications_new.nice_classifications IS 'Array of Nice classifications with class number and specifications';
COMMENT ON COLUMN ip_applications_new.authors IS 'Array of authors with their details';
COMMENT ON COLUMN ip_applications_new.inventors IS 'Array of inventors with their details';
COMMENT ON COLUMN ip_applications_new.claims IS 'Array of patent claims';
COMMENT ON COLUMN ip_applications_new.disclaimers IS 'Array of trademark disclaimers';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applications_type ON ip_applications_new(application_type);
CREATE INDEX IF NOT EXISTS idx_applications_status ON ip_applications_new(status);
CREATE INDEX IF NOT EXISTS idx_applications_work_type ON ip_applications_new(work_type) WHERE application_type = 'copyright';
CREATE INDEX IF NOT EXISTS idx_applications_mark_type ON ip_applications_new(mark_type) WHERE application_type = 'trademark'; 