-- Insert mock applications
WITH application_titles AS (
  SELECT 
    ARRAY[
      'Smart Contract Implementation System',
      'Blockchain-Based Voting Mechanism',
      'Decentralized Identity Management',
      'Secure Data Storage Protocol',
      'Distributed Computing Framework',
      'AI-Powered Trading Algorithm',
      'Quantum-Resistant Encryption Method',
      'Peer-to-Peer Payment System',
      'Cross-Chain Communication Protocol',
      'Zero-Knowledge Proof System'
    ] as patent_titles,
    ARRAY[
      'CryptoSecure™',
      'BlockGuard™',
      'ChainLink Pro™',
      'DataShield™',
      'SmartVault™',
      'TokenTrust™',
      'SecureChain™',
      'CryptoVault™',
      'BlockShield™',
      'ChainGuard™'
    ] as trademark_titles,
    ARRAY[
      'Blockchain Development Guide',
      'Smart Contract Best Practices',
      'Crypto Trading Handbook',
      'DeFi Protocol Documentation',
      'Web3 Security Guidelines',
      'NFT Creation Manual',
      'DAO Governance Framework',
      'DApp Development Tutorial',
      'Token Economics Whitepaper',
      'Blockchain Architecture Guide'
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
    CASE (random() * 3)::int
        WHEN 0 THEN 'Patent: ' || patent_titles[(random() * 9 + 1)::int]
        WHEN 1 THEN 'Trademark: ' || trademark_titles[(random() * 9 + 1)::int]
        ELSE 'Copyright: ' || copyright_titles[(random() * 9 + 1)::int]
    END as title,
    'Detailed description for application #' || generate_series || ' including technical specifications and implementation details.',
    CASE (random() * 2)::int
        WHEN 0 THEN 'patent'
        WHEN 1 THEN 'trademark'
        ELSE 'copyright'
    END as application_type,
    CASE (random() * 4)::int
        WHEN 0 THEN 'draft'
        WHEN 1 THEN 'pending'
        WHEN 2 THEN 'in-review'
        WHEN 3 THEN 'approved'
        ELSE 'rejected'
    END as status,
    CASE (random() * 4)::int
        WHEN 0 THEN 'John Smith'
        WHEN 1 THEN 'Sarah Johnson'
        WHEN 2 THEN 'Michael Brown'
        WHEN 3 THEN 'Emily Davis'
        ELSE 'David Wilson'
    END as applicant_name,
    CASE (random() * 4)::int
        WHEN 0 THEN 'Blockchain Solutions Inc.'
        WHEN 1 THEN 'Crypto Innovations Ltd.'
        WHEN 2 THEN 'Digital Security Corp'
        WHEN 3 THEN 'Web3 Technologies'
        ELSE 'DeFi Systems LLC'
    END as company_name,
    '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr' as wallet_address,
    NOW() - (random() * interval '90 days') as created_at,
    NOW() - (random() * interval '30 days') as updated_at
FROM generate_series(1, 100), application_titles;

-- Insert corresponding status history entries
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
    'Initial status set to ' || status,
    created_at
FROM ip_applications;

-- Add some additional status changes for variety
INSERT INTO status_history (
    application_id,
    status,
    created_by,
    notes,
    created_at
)
SELECT 
    id,
    CASE (random() * 4)::int
        WHEN 0 THEN 'draft'
        WHEN 1 THEN 'pending'
        WHEN 2 THEN 'in-review'
        WHEN 3 THEN 'approved'
        ELSE 'rejected'
    END as status,
    '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr',
    'Status updated during review process',
    updated_at
FROM ip_applications
WHERE random() < 0.5;