-- Create temp tables for better data variety
CREATE TEMP TABLE temp_companies (
    name TEXT
);

INSERT INTO temp_companies (name) VALUES
    ('Blockchain Solutions Inc.'),
    ('Crypto Innovations Ltd.'),
    ('Digital Security Corp'),
    ('Web3 Technologies'),
    ('DeFi Systems LLC'),
    ('Chain Protocol Labs'),
    ('Quantum Ledger Tech'),
    ('Smart Contract Solutions'),
    ('Decentralized Systems Co.'),
    ('Blockchain Research Group'),
    ('Crypto Security Solutions'),
    ('Digital Asset Management'),
    ('Web3 Innovations Hub'),
    ('Blockchain Ventures Ltd.'),
    ('Tech Innovations Africa');

CREATE TEMP TABLE temp_applicants (
    name TEXT,
    email TEXT
);

INSERT INTO temp_applicants (name, email) VALUES
    ('John Smith', 'john.smith@example.com'),
    ('Sarah Johnson', 'sarah.j@example.com'),
    ('Michael Brown', 'michael.b@example.com'),
    ('Emily Davis', 'emily.d@example.com'),
    ('David Wilson', 'david.w@example.com'),
    ('James Anderson', 'james.a@example.com'),
    ('Emma Thompson', 'emma.t@example.com'),
    ('William Taylor', 'william.t@example.com'),
    ('Olivia Martinez', 'olivia.m@example.com'),
    ('Alexander White', 'alex.w@example.com'),
    ('Sophia Lee', 'sophia.l@example.com'),
    ('Daniel Clark', 'daniel.c@example.com'),
    ('Ava Rodriguez', 'ava.r@example.com'),
    ('Joseph Wright', 'joseph.w@example.com'),
    ('Isabella King', 'isabella.k@example.com');

WITH application_titles AS (
  SELECT 
    ARRAY[
      'Distributed Ledger Optimization System',
      'Blockchain Consensus Mechanism',
      'Smart Contract Execution Framework',
      'Decentralized Storage Protocol',
      'Cross-Chain Bridge Implementation',
      'Zero-Knowledge Proof Generator',
      'Quantum-Safe Blockchain Protocol',
      'Layer-2 Scaling Solution',
      'Blockchain Interoperability System',
      'Decentralized Identity Framework'
    ] as patent_titles,
    ARRAY[
      'BlockMaster™',
      'CryptoShield™',
      'ChainGuard Pro™',
      'SecureBlock™',
      'TrustChain™',
      'CryptoVault™',
      'BlockSecure™',
      'ChainProtect™',
      'CryptoLock™',
      'BlockShield™'
    ] as trademark_titles,
    ARRAY[
      'Complete Web3 Development Guide',
      'Blockchain Security Handbook',
      'Smart Contract Design Patterns',
      'DeFi Protocol Implementation',
      'Crypto Trading Strategies',
      'Blockchain Architecture Guide',
      'NFT Marketplace Development',
      'DAO Governance Framework',
      'DApp Security Guidelines',
      'Token Economics Blueprint'
    ] as copyright_titles
)
INSERT INTO ip_applications (
    title,
    description,
    application_type,
    status,
    applicant_name,
    company_name,
    wallet_address,
    created_at,
    updated_at
)
SELECT
    CASE application_type
        WHEN 'patent' THEN 'Patent: ' || patent_titles[1 + (i % 10)]
        WHEN 'trademark' THEN 'Trademark: ' || trademark_titles[1 + (i % 10)]
        ELSE 'Copyright: ' || copyright_titles[1 + (i % 10)]
    END as title,
    'Detailed description for application #' || i || ' - ' || 
    CASE (i % 3)
        WHEN 0 THEN 'Focusing on security and scalability'
        WHEN 1 THEN 'Addressing blockchain limitations'
        ELSE 'Implementing novel solutions'
    END as description,
    CASE (i % 3)
        WHEN 0 THEN 'patent'
        WHEN 1 THEN 'trademark'
        ELSE 'copyright'
    END as application_type,
    CASE (i % 5)
        WHEN 0 THEN 'draft'
        WHEN 1 THEN 'pending'
        WHEN 2 THEN 'in-review'
        WHEN 3 THEN 'approved'
        ELSE 'rejected'
    END as status,
    CASE (i % 5)
        WHEN 0 THEN 'John Smith'
        WHEN 1 THEN 'Sarah Johnson'
        WHEN 2 THEN 'Michael Brown'
        WHEN 3 THEN 'Emily Davis'
        ELSE 'David Wilson'
    END as applicant_name,
    CASE (i % 5)
        WHEN 0 THEN 'Blockchain Solutions Inc.'
        WHEN 1 THEN 'Crypto Innovations Ltd.'
        WHEN 2 THEN 'Digital Security Corp'
        WHEN 3 THEN 'Web3 Technologies'
        ELSE 'DeFi Systems LLC'
    END as company_name,
    '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr' as wallet_address,
    NOW() - ((200 - i) * interval '1 day') as created_at,
    NOW() - ((200 - i) * interval '1 day' + interval '2 hours') as updated_at
FROM application_titles, generate_series(1, 200) i;

-- Insert initial status history
INSERT INTO status_history (
    application_id,
    status,
    created_by,
    notes,
    created_at
)
SELECT 
    id,
    status,
    '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr',
    'Initial application submission with status: ' || status,
    created_at
FROM ip_applications;

-- Add status changes for some applications
INSERT INTO status_history (
    application_id,
    status,
    created_by,
    notes,
    created_at
)
SELECT 
    id,
    CASE (id::text::int % 5)
        WHEN 0 THEN 'pending'
        WHEN 1 THEN 'in-review'
        WHEN 2 THEN 'approved'
        WHEN 3 THEN 'rejected'
        ELSE 'draft'
    END as status,
    '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr',
    'Status updated after review',
    updated_at
FROM ip_applications
WHERE id::text::int % 2 = 0;

-- Clean up temp tables
DROP TABLE temp_companies;
DROP TABLE temp_applicants; 