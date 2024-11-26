-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE application_type AS ENUM ('patent', 'trademark', 'copyright');
CREATE TYPE application_status AS ENUM ('draft', 'pending', 'in-review', 'approved', 'rejected');
CREATE TYPE trademark_type AS ENUM ('Word', 'Logo', 'Combined', 'Sound', '3D');
CREATE TYPE trademark_use_status AS ENUM ('In Use', 'Intent to Use');
CREATE TYPE copyright_work_type AS ENUM ('Literary', 'Musical', 'Artistic', 'Dramatic', 'Audiovisual', 'Sound Recording');
CREATE TYPE rights_ownership_type AS ENUM ('Original Author', 'Work for Hire', 'Transfer');

-- Create or update profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address TEXT UNIQUE NOT NULL,
    full_name TEXT,
    company_name TEXT,
    phone_number TEXT,
    national_id TEXT,
    email TEXT,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create main applications table
CREATE TABLE ip_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address TEXT REFERENCES profiles(wallet_address),
    application_type application_type NOT NULL,
    status application_status DEFAULT 'draft',
    
    -- Basic Information
    title TEXT NOT NULL,
    description TEXT,
    applicant_name TEXT NOT NULL,
    company_name TEXT NOT NULL,
    national_id TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    
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
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by TEXT REFERENCES profiles(wallet_address),
    updated_by TEXT REFERENCES profiles(wallet_address)
);

-- Create status history table
CREATE TABLE status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES ip_applications(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    notes TEXT,
    created_by TEXT REFERENCES profiles(wallet_address),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create application documents table
CREATE TABLE application_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES ip_applications(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_by TEXT REFERENCES profiles(wallet_address),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create NFT certificates table
CREATE TABLE nft_certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES ip_applications(id) ON DELETE CASCADE,
    mint_address TEXT NOT NULL,
    metadata_uri TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create status update trigger function
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

-- Create status update trigger
CREATE TRIGGER on_status_update
    BEFORE UPDATE ON ip_applications
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION handle_status_update();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at triggers
CREATE TRIGGER update_ip_applications_updated_at
    BEFORE UPDATE ON ip_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create application type views
CREATE OR REPLACE VIEW patent_applications AS
SELECT * FROM ip_applications WHERE application_type = 'patent';

CREATE OR REPLACE VIEW trademark_applications AS
SELECT * FROM ip_applications WHERE application_type = 'trademark';

CREATE OR REPLACE VIEW copyright_applications AS
SELECT * FROM ip_applications WHERE application_type = 'copyright';

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ip_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_certificates ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (wallet_address = auth.jwt() ->> 'wallet_address');

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (wallet_address = auth.jwt() ->> 'wallet_address');

CREATE POLICY "Users can view their applications"
    ON ip_applications FOR SELECT
    USING (
        wallet_address = auth.jwt() ->> 'wallet_address'
        OR EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
            AND profiles.is_admin = true
        )
    );

CREATE POLICY "Users can create their applications"
    ON ip_applications FOR INSERT
    WITH CHECK (wallet_address = auth.jwt() ->> 'wallet_address');

CREATE POLICY "Users can update their draft applications"
    ON ip_applications FOR UPDATE
    USING (
        (wallet_address = auth.jwt() ->> 'wallet_address' AND status = 'draft')
        OR EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
            AND profiles.is_admin = true
        )
    );

-- Create indexes for better performance
CREATE INDEX idx_ip_applications_wallet ON ip_applications(wallet_address);
CREATE INDEX idx_ip_applications_type ON ip_applications(application_type);
CREATE INDEX idx_ip_applications_status ON ip_applications(status);
CREATE INDEX idx_status_history_app_id ON status_history(application_id);
CREATE INDEX idx_documents_app_id ON application_documents(application_id);
CREATE INDEX idx_nft_certificates_app_id ON nft_certificates(application_id);

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated; 