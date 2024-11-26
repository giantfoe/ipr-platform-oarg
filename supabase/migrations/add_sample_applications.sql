-- Insert more sample patent applications
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
    inventors,
    created_at
) VALUES 
(
    '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr',
    'patent',
    'in-review',
    'Sustainable Fishing Net Recovery System',
    'An automated system for recovering and recycling fishing nets from ocean waters.',
    'Mohamed Kamara',
    'Ocean Clean SL Ltd.',
    'Marine Technology',
    'Lost fishing nets contribute significantly to ocean pollution and marine life endangerment.',
    '{"description": "Automated system using sonar and AI to locate and retrieve ghost nets", "advantages": ["Reduces marine pollution", "Protects marine life", "Recyclable materials recovery"]}',
    '{"claims": ["1. An automated net recovery system comprising...", "2. The system of claim 1, wherein..."]}',
    '{"inventors": [{"name": "Mohamed Kamara", "contribution": "System Design"}, {"name": "Aminata Sesay", "contribution": "Marine Biology Consultant"}]}',
    NOW() - INTERVAL '45 days'
),
(
    '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr',
    'patent',
    'pending',
    'Solar-Powered Water Filtration Device',
    'Portable water filtration system powered by solar energy for rural communities.',
    'Ibrahim Conteh',
    'Clean Water Initiative',
    'Water Purification',
    'Access to clean water remains a challenge in many rural areas.',
    '{"description": "Solar-powered portable water filtration system", "advantages": ["No external power needed", "Low maintenance", "Affordable"]}',
    '{"claims": ["1. A portable water filtration device comprising...", "2. The device of claim 1, wherein..."]}',
    '{"inventors": [{"name": "Ibrahim Conteh", "contribution": "Lead Inventor"}, {"name": "Fatmata Koroma", "contribution": "Technical Design"}]}',
    NOW() - INTERVAL '30 days'
);

-- Insert more sample trademark applications
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
    use_status,
    created_at
) VALUES 
(
    '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr',
    'trademark',
    'in-review',
    'SALONE FRESH',
    'Brand for locally sourced organic produce and foods',
    'Mariama Bangura',
    'Sierra Fresh Foods Ltd.',
    'Combined',
    'SALONE FRESH',
    'A stylized palm tree with text in green and brown',
    '{"classes": [29, 30, 31], "specifications": ["Fresh fruits and vegetables", "Processed foods", "Organic produce"]}',
    'In Use',
    NOW() - INTERVAL '60 days'
),
(
    '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr',
    'trademark',
    'approved',
    'DIAMOND CRAFT',
    'Artisanal diamond jewelry brand',
    'Samuel Williams',
    'Sierra Diamonds Ltd.',
    'Word',
    'DIAMOND CRAFT',
    'Text in elegant serif font',
    '{"classes": [14], "specifications": ["Jewelry", "Precious stones", "Diamond products"]}',
    'In Use',
    NOW() - INTERVAL '90 days'
);

-- Insert more sample copyright applications
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
    rights_ownership,
    created_at
) VALUES 
(
    '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr',
    'copyright',
    'approved',
    'Tales from Freetown',
    'Collection of traditional Sierra Leonean stories',
    'Aisha Kargbo',
    'Heritage Publishing House',
    'Literary',
    '["Stories of Sierra Leone", "Freetown Chronicles"]',
    '2023-03-15',
    'Sierra Leone',
    '{"authors": [{"name": "Aisha Kargbo", "contribution": "Author"}, {"name": "John Turay", "contribution": "Illustrator"}]}',
    false,
    'Original Author',
    NOW() - INTERVAL '75 days'
),
(
    '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr',
    'copyright',
    'in-review',
    'Modern Gumbe Fusion',
    'Contemporary musical album blending traditional Gumbe with modern elements',
    'Abdul Rahman',
    'Freetown Records',
    'Musical',
    '["Gumbe Evolution", "New Age Gumbe"]',
    '2023-05-01',
    'Sierra Leone',
    '{"authors": [{"name": "Abdul Rahman", "contribution": "Composer/Producer"}, {"name": "Marie Turay", "contribution": "Lead Vocalist"}]}',
    true,
    'Work for Hire',
    NOW() - INTERVAL '15 days'
); 