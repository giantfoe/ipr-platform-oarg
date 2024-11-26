-- Drop existing tables and types
DROP TABLE IF EXISTS ip_applications_new CASCADE;
DROP TABLE IF EXISTS ip_applications CASCADE;
DROP TABLE IF EXISTS application_comments CASCADE;
DROP TABLE IF EXISTS application_attachments CASCADE;
DROP TABLE IF EXISTS application_history CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS application_type CASCADE;
DROP TYPE IF EXISTS application_status CASCADE;
DROP TYPE IF EXISTS trademark_type CASCADE;
DROP TYPE IF EXISTS trademark_use_status CASCADE;
DROP TYPE IF EXISTS copyright_work_type CASCADE;
DROP TYPE IF EXISTS rights_ownership_type CASCADE;

-- Create ENUM types
CREATE TYPE application_type AS ENUM ('patent', 'trademark', 'copyright');
CREATE TYPE application_status AS ENUM ('draft', 'pending', 'in-review', 'approved', 'rejected');
CREATE TYPE trademark_type AS ENUM ('Word', 'Logo', 'Combined', 'Sound', '3D');
CREATE TYPE trademark_use_status AS ENUM ('In Use', 'Intent to Use');
CREATE TYPE copyright_work_type AS ENUM ('Literary', 'Musical', 'Dramatic', 'Artistic', 'Audiovisual', 'Sound Recording', 'Architectural');
CREATE TYPE rights_ownership_type AS ENUM ('Original Author', 'Work for Hire', 'Transfer of Rights');

-- Create the main applications table
CREATE TABLE ip_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address TEXT REFERENCES profiles(wallet_address),
    application_type application_type NOT NULL,
    status application_status DEFAULT 'draft'::application_status,
    
    -- Basic Information
    title TEXT NOT NULL,
    description TEXT,
    applicant_name TEXT NOT NULL,
    company_name TEXT,
    national_id TEXT,
    phone_number TEXT,
    email TEXT,
    
    -- Patent Specific
    technical_field TEXT,
    background_art TEXT,
    invention JSONB,
    claims JSONB,
    inventors JSONB,
    priority_claim JSONB,
    
    -- Trademark Specific
    mark_type trademark_type,
    mark_text TEXT,
    mark_description TEXT,
    color_claim TEXT,
    nice_classifications JSONB,
    use_status trademark_use_status,
    first_use_date DATE,
    disclaimers JSONB,
    
    -- Copyright Specific
    work_type copyright_work_type,
    alternative_titles JSONB,
    date_of_creation DATE,
    date_of_publication DATE,
    country_of_origin TEXT,
    authors JSONB,
    is_derivative BOOLEAN,
    preexisting_material TEXT,
    new_material TEXT,
    rights_ownership rights_ownership_type,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by TEXT REFERENCES profiles(wallet_address),
    updated_by TEXT REFERENCES profiles(wallet_address)
);

-- Create comments table
CREATE TABLE application_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES ip_applications(id) ON DELETE CASCADE,
    wallet_address TEXT REFERENCES profiles(wallet_address),
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create attachments table
CREATE TABLE application_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES ip_applications(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_by TEXT REFERENCES profiles(wallet_address),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create history table
CREATE TABLE application_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES ip_applications(id) ON DELETE CASCADE,
    status application_status NOT NULL,
    changed_by TEXT REFERENCES profiles(wallet_address),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX idx_applications_type ON ip_applications(application_type);
CREATE INDEX idx_applications_status ON ip_applications(status);
CREATE INDEX idx_applications_wallet ON ip_applications(wallet_address);
CREATE INDEX idx_applications_created ON ip_applications(created_at);
CREATE INDEX idx_comments_application ON application_comments(application_id);
CREATE INDEX idx_attachments_application ON application_attachments(application_id);
CREATE INDEX idx_history_application ON application_history(application_id);

-- Create views
CREATE OR REPLACE VIEW patent_applications AS
SELECT * FROM ip_applications WHERE application_type = 'patent'::application_type;

CREATE OR REPLACE VIEW trademark_applications AS
SELECT * FROM ip_applications WHERE application_type = 'trademark'::application_type;

CREATE OR REPLACE VIEW copyright_applications AS
SELECT * FROM ip_applications WHERE application_type = 'copyright'::application_type;

-- RLS Policies
ALTER TABLE ip_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_history ENABLE ROW LEVEL SECURITY;

-- Applications policies
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
WITH CHECK (wallet_address = auth.jwt() ->> 'wallet_address');

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

-- Comments policies
CREATE POLICY "Users can view comments on their applications"
ON application_comments FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM ip_applications
        WHERE ip_applications.id = application_comments.application_id
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

CREATE POLICY "Users can create comments on their applications"
ON application_comments FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM ip_applications
        WHERE ip_applications.id = application_comments.application_id
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

-- Attachments policies
CREATE POLICY "Users can view attachments on their applications"
ON application_attachments FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM ip_applications
        WHERE ip_applications.id = application_attachments.application_id
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

CREATE POLICY "Users can upload attachments to their applications"
ON application_attachments FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM ip_applications
        WHERE ip_applications.id = application_attachments.application_id
        AND ip_applications.wallet_address = auth.jwt() ->> 'wallet_address'
    )
);

-- History policies
CREATE POLICY "Users can view history of their applications"
ON application_history FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM ip_applications
        WHERE ip_applications.id = application_history.application_id
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

-- Grant permissions
GRANT ALL ON ip_applications TO authenticated;
GRANT ALL ON application_comments TO authenticated;
GRANT ALL ON application_attachments TO authenticated;
GRANT ALL ON application_history TO authenticated;
GRANT ALL ON patent_applications TO authenticated;
GRANT ALL ON trademark_applications TO authenticated;
GRANT ALL ON copyright_applications TO authenticated;

-- Create function to update application history
CREATE OR REPLACE FUNCTION update_application_history()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO application_history (
            application_id,
            status,
            changed_by,
            notes
        ) VALUES (
            NEW.id,
            NEW.status,
            NEW.updated_by,
            'Status changed from ' || OLD.status || ' to ' || NEW.status
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for application history
CREATE TRIGGER application_status_history
    AFTER UPDATE ON ip_applications
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION update_application_history(); 