-- Create the new table with all fields
CREATE TABLE ip_applications_new (
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

-- Insert sample patent applications
INSERT INTO ip_applications_new (
    wallet_address,
    application_type,
    status,
    title,
    description,
    applicant_name,
    company_name,
    technical_field,
    background_art,
    invention,
    claims,
    inventors
) VALUES 
(
    '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr',
    'patent',
    'approved',
    'Improved Solar Cell Manufacturing Process',
    'A novel manufacturing process for high-efficiency solar cells using sustainable materials.',
    'John Smith',
    'Green Energy Solutions Ltd.',
    'Renewable Energy Technology',
    'Current solar cell manufacturing processes are costly and environmentally harmful.',
    '{"description": "The invention relates to a new manufacturing process that reduces costs by 40% while increasing efficiency.", "advantages": ["Lower cost", "Higher efficiency", "Environmentally friendly"]}',
    '{"claims": ["1. A method of manufacturing solar cells comprising...", "2. The method of claim 1, wherein..."]}',
    '{"inventors": [{"name": "John Smith", "contribution": "Primary Inventor"}, {"name": "Jane Doe", "contribution": "Process Optimization"}]}'
),
(
    '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr',
    'patent',
    'pending',
    'AI-Powered Water Purification System',
    'An intelligent water purification system that adapts to water quality in real-time.',
    'Sarah Johnson',
    'AquaTech Innovations',
    'Water Treatment Technology',
    'Traditional water purification systems lack adaptability to varying water conditions.',
    '{"description": "AI-driven system that optimizes purification based on real-time water quality data", "advantages": ["Adaptive processing", "Energy efficient", "Cost effective"]}',
    '{"claims": ["1. A water purification system comprising...", "2. The system of claim 1, wherein..."]}',
    '{"inventors": [{"name": "Sarah Johnson", "contribution": "System Architecture"}, {"name": "Mike Chen", "contribution": "AI Algorithm"}]}'
);

-- Insert sample trademark applications
INSERT INTO ip_applications_new (
    wallet_address,
    application_type,
    status,
    title,
    description,
    applicant_name,
    company_name,
    mark_type,
    mark_text,
    mark_description,
    nice_classifications,
    use_status
) VALUES 
(
    '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr',
    'trademark',
    'approved',
    'ECOWAVE',
    'Sustainable product branding for ocean-friendly products',
    'Marine Conservation Corp',
    'Ocean Friends Ltd.',
    'Combined',
    'ECOWAVE',
    'A stylized wave design in blue and green with text',
    '{"classes": [3, 21, 25], "specifications": ["Eco-friendly cleaning products", "Reusable containers", "Sustainable clothing"]}',
    'In Use'
),
(
    '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr',
    'trademark',
    'pending',
    'TECHFLOW',
    'Technology consulting services brand',
    'Digital Solutions Inc',
    'TechFlow Consulting',
    'Word',
    'TECHFLOW',
    'Standard character mark',
    '{"classes": [35, 42], "specifications": ["Business technology consulting", "Software development services"]}',
    'Intent to Use'
);

-- Insert sample copyright applications
INSERT INTO ip_applications_new (
    wallet_address,
    application_type,
    status,
    title,
    description,
    applicant_name,
    company_name,
    work_type,
    alternative_titles,
    date_of_creation,
    country_of_origin,
    authors,
    is_derivative,
    rights_ownership
) VALUES 
(
    '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr',
    'copyright',
    'approved',
    'The Digital Revolution',
    'A comprehensive book about the impact of technology on society',
    'Robert Brown',
    'Future Press',
    'Literary',
    '["Technology''s Impact", "Digital Age Chronicles"]',
    '2023-01-15',
    'Sierra Leone',
    '{"authors": [{"name": "Robert Brown", "contribution": "Author"}, {"name": "Lisa White", "contribution": "Editor"}]}',
    false,
    'Original Author'
),
(
    '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr',
    'copyright',
    'pending',
    'Sierra Leone Rhythms',
    'A musical compilation of traditional Sierra Leone songs',
    'Music Heritage Foundation',
    'Heritage Records',
    'Musical',
    '["Sounds of Sierra Leone", "Traditional Beats"]',
    '2023-06-01',
    'Sierra Leone',
    '{"authors": [{"name": "James Cole", "contribution": "Composer"}, {"name": "Maria Santos", "contribution": "Arranger"}]}',
    true,
    'Work for Hire'
);

-- Create indexes
CREATE INDEX idx_ip_applications_new_type ON ip_applications_new(application_type);
CREATE INDEX idx_ip_applications_new_status ON ip_applications_new(status);
CREATE INDEX idx_ip_applications_new_wallet ON ip_applications_new(wallet_address);

-- Enable RLS
ALTER TABLE ip_applications_new ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own applications"
ON ip_applications_new FOR SELECT
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
ON ip_applications_new FOR INSERT
TO authenticated
WITH CHECK (
    wallet_address = auth.jwt() ->> 'wallet_address'
);

CREATE POLICY "Users can update their draft applications"
ON ip_applications_new FOR UPDATE
TO authenticated
USING (
    (wallet_address = auth.jwt() ->> 'wallet_address' AND status::text = 'draft')
    OR EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
        AND profiles.is_admin = true
    )
);

-- Create views
CREATE OR REPLACE VIEW patent_applications AS
SELECT * FROM ip_applications_new WHERE application_type = 'patent'::application_type;

CREATE OR REPLACE VIEW trademark_applications AS
SELECT * FROM ip_applications_new WHERE application_type = 'trademark'::application_type;

CREATE OR REPLACE VIEW copyright_applications AS
SELECT * FROM ip_applications_new WHERE application_type = 'copyright'::application_type;

-- Grant permissions
GRANT ALL ON ip_applications_new TO authenticated;
GRANT ALL ON patent_applications TO authenticated;
GRANT ALL ON trademark_applications TO authenticated;
GRANT ALL ON copyright_applications TO authenticated; 