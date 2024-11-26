-- Drop the temporary table if it exists
DROP TABLE IF EXISTS ip_applications_new;

-- Ensure the main table has the correct schema
CREATE TABLE IF NOT EXISTS ip_applications (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    application_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    wallet_address TEXT NOT NULL,
    applicant_name TEXT,
    company_name TEXT,
    national_id TEXT,
    phone_number TEXT,
    email TEXT,
    
    -- Patent specific
    technical_field TEXT,
    background_art TEXT,
    invention JSONB,
    claims JSONB,
    inventors JSONB,
    
    -- Trademark specific
    mark_type TEXT,
    mark_text TEXT,
    mark_description TEXT,
    nice_classifications JSONB,
    
    -- Copyright specific
    work_type TEXT,
    authors JSONB,
    date_of_creation TEXT,
    
    -- Common fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by TEXT NOT NULL,
    nft_mint TEXT,
    nft_metadata_uri TEXT,
    nft_image_url TEXT,
    
    CONSTRAINT fk_wallet
        FOREIGN KEY(wallet_address) 
        REFERENCES profiles(wallet_address)
        ON DELETE CASCADE
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_applications_wallet ON ip_applications(wallet_address);
CREATE INDEX IF NOT EXISTS idx_applications_status ON ip_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_type ON ip_applications(application_type);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ip_applications_updated_at
    BEFORE UPDATE ON ip_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 