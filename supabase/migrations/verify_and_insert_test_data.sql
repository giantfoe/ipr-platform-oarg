-- First, let's verify our admin user
SELECT * FROM profiles WHERE wallet_address = '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr';

-- Insert admin user if not exists
INSERT INTO profiles (wallet_address, is_admin, full_name)
VALUES (
    '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr',
    true,
    'Admin User'
)
ON CONFLICT (wallet_address) 
DO UPDATE SET is_admin = true;

-- Insert test applications
INSERT INTO ip_applications_new (
    wallet_address,
    application_type,
    status,
    title,
    description,
    applicant_name,
    company_name,
    created_at,
    technical_field,
    background_art,
    invention,
    claims,
    inventors
) VALUES 
(
    '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr',
    'patent',
    'pending',
    'Blockchain-Based Land Registry System',
    'A decentralized system for managing land titles and property records in Sierra Leone.',
    'James Wilson',
    'Digital Land Solutions',
    NOW(),
    'Blockchain Technology',
    'Current land registry systems are prone to fraud and inefficiency.',
    '{"description": "A blockchain-based system that ensures transparent and immutable land records", "advantages": ["Reduced fraud", "Increased efficiency", "Better accessibility"]}',
    '{"claims": ["1. A method for recording land titles using blockchain...", "2. The system of claim 1, wherein..."]}',
    '{"inventors": [{"name": "James Wilson", "contribution": "System Architecture"}, {"name": "Sarah Chen", "contribution": "Blockchain Implementation"}]}'
),
(
    '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr',
    'trademark',
    'in-review',
    'SIERRA GEMS',
    'Premium diamond and precious stones brand.',
    'Maria Santos',
    'Sierra Gems Ltd.',
    NOW(),
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr',
    'copyright',
    'approved',
    'Sierra Leone Cultural Heritage Documentation',
    'Comprehensive documentation of traditional practices and cultural heritage.',
    'Abdul Rahman',
    'Heritage Preservation Foundation',
    NOW(),
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
);

-- Verify the data
SELECT 
    id,
    application_type,
    status,
    title,
    applicant_name,
    created_at
FROM ip_applications_new
ORDER BY created_at DESC;

-- Verify RLS policies
SELECT * FROM pg_policies WHERE tablename = 'ip_applications_new'; 