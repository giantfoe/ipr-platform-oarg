-- First, drop all existing tables in the correct order
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.status_history CASCADE;
DROP TABLE IF EXISTS public.ip_applications CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address TEXT UNIQUE NOT NULL,
    full_name TEXT,
    company_name TEXT,
    email TEXT,
    phone_number TEXT,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create IP applications table
CREATE TABLE public.ip_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address TEXT REFERENCES public.profiles(wallet_address) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    application_type TEXT NOT NULL CHECK (application_type IN ('patent', 'trademark', 'copyright')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'in-review', 'approved', 'rejected')),
    
    -- Common fields
    applicant_name TEXT,
    company_name TEXT,
    phone_number TEXT,
    email TEXT,
    region TEXT[], -- ARIPO member states
    
    -- Patent specific
    technical_field TEXT,
    background_art TEXT,
    technical_problem TEXT,
    technical_solution TEXT,
    industrial_applicability TEXT,
    invention_description TEXT,
    advantages TEXT[],
    inventors JSONB,
    drawings_description TEXT,
    best_mode TEXT,
    claims JSONB,
    
    -- Trademark specific
    mark_type TEXT,
    mark_text TEXT,
    mark_description TEXT,
    nice_classifications JSONB,
    goods_services TEXT,
    priority_claim JSONB,
    
    -- Copyright specific
    work_type TEXT,
    date_of_creation TEXT,
    country_of_origin TEXT,
    authors JSONB,
    alternative_titles TEXT[],
    is_derivative BOOLEAN,
    rights_ownership TEXT,
    
    -- Payment and NFT fields
    fee_status TEXT DEFAULT 'unpaid' CHECK (fee_status IN ('unpaid', 'processing', 'paid')),
    fee_amount DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    nft_mint TEXT,
    nft_metadata_uri TEXT,
    nft_image_url TEXT,
    
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create documents table
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES public.ip_applications(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    public_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create status history table
CREATE TABLE public.status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES public.ip_applications(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    notes TEXT,
    created_by TEXT REFERENCES public.profiles(wallet_address),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create payments table
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES public.ip_applications(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
    payment_method TEXT,
    transaction_id TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX idx_applications_wallet ON ip_applications(wallet_address);
CREATE INDEX idx_applications_status ON ip_applications(status);
CREATE INDEX idx_applications_type ON ip_applications(application_type);
CREATE INDEX idx_documents_application ON documents(application_id);
CREATE INDEX idx_status_history_application ON status_history(application_id);
CREATE INDEX idx_payments_application ON payments(application_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON ip_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ip_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (wallet_address = auth.jwt() ->> 'wallet_address');

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (wallet_address = auth.jwt() ->> 'wallet_address');

CREATE POLICY "Users can view their own applications"
    ON ip_applications FOR SELECT
    USING (wallet_address = auth.jwt() ->> 'wallet_address');

CREATE POLICY "Users can create their own applications"
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

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated; 