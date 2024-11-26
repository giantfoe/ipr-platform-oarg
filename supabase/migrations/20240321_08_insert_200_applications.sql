WITH RECURSIVE numbers AS (
  SELECT 1 as n
  UNION ALL
  SELECT n + 1 FROM numbers WHERE n < 200
),
application_data AS (
  SELECT 
    n,
    CASE (n % 3)
      WHEN 0 THEN 'Patent: ' || (
        CASE (n % 10)
          WHEN 0 THEN 'Distributed Ledger Optimization System'
          WHEN 1 THEN 'Blockchain Consensus Mechanism'
          WHEN 2 THEN 'Smart Contract Execution Framework'
          WHEN 3 THEN 'Decentralized Storage Protocol'
          WHEN 4 THEN 'Cross-Chain Bridge Implementation'
          WHEN 5 THEN 'Zero-Knowledge Proof Generator'
          WHEN 6 THEN 'Quantum-Safe Blockchain Protocol'
          WHEN 7 THEN 'Layer-2 Scaling Solution'
          WHEN 8 THEN 'Blockchain Interoperability System'
          WHEN 9 THEN 'Decentralized Identity Framework'
        END
      )
      WHEN 1 THEN 'Trademark: ' || (
        CASE (n % 10)
          WHEN 0 THEN 'BlockMaster™'
          WHEN 1 THEN 'CryptoShield™'
          WHEN 2 THEN 'ChainGuard Pro™'
          WHEN 3 THEN 'SecureBlock™'
          WHEN 4 THEN 'TrustChain™'
          WHEN 5 THEN 'CryptoVault™'
          WHEN 6 THEN 'BlockSecure™'
          WHEN 7 THEN 'ChainProtect™'
          WHEN 8 THEN 'CryptoLock™'
          WHEN 9 THEN 'BlockShield™'
        END
      )
      ELSE 'Copyright: ' || (
        CASE (n % 10)
          WHEN 0 THEN 'Complete Web3 Development Guide'
          WHEN 1 THEN 'Blockchain Security Handbook'
          WHEN 2 THEN 'Smart Contract Design Patterns'
          WHEN 3 THEN 'DeFi Protocol Implementation'
          WHEN 4 THEN 'Crypto Trading Strategies'
          WHEN 5 THEN 'Blockchain Architecture Guide'
          WHEN 6 THEN 'NFT Marketplace Development'
          WHEN 7 THEN 'DAO Governance Framework'
          WHEN 8 THEN 'DApp Security Guidelines'
          WHEN 9 THEN 'Token Economics Blueprint'
        END
      )
    END as title,
    CASE (n % 3)
      WHEN 0 THEN 'patent'
      WHEN 1 THEN 'trademark'
      ELSE 'copyright'
    END as application_type,
    CASE (n % 5)
      WHEN 0 THEN 'draft'
      WHEN 1 THEN 'pending'
      WHEN 2 THEN 'in-review'
      WHEN 3 THEN 'approved'
      ELSE 'rejected'
    END as status,
    CASE (n % 5)
      WHEN 0 THEN 'John Smith'
      WHEN 1 THEN 'Sarah Johnson'
      WHEN 2 THEN 'Michael Brown'
      WHEN 3 THEN 'Emily Davis'
      ELSE 'David Wilson'
    END as applicant_name,
    CASE (n % 5)
      WHEN 0 THEN 'Blockchain Solutions Inc.'
      WHEN 1 THEN 'Crypto Innovations Ltd.'
      WHEN 2 THEN 'Digital Security Corp'
      WHEN 3 THEN 'Web3 Technologies'
      ELSE 'DeFi Systems LLC'
    END as company_name
  FROM numbers
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
    title,
    'Application #' || n || ': ' || 
    CASE application_type
      WHEN 'patent' THEN 'A novel technological solution focusing on blockchain innovation and scalability.'
      WHEN 'trademark' THEN 'A distinctive brand identity in the blockchain and cryptocurrency space.'
      ELSE 'An original work in the field of blockchain technology and decentralized systems.'
    END as description,
    application_type,
    status,
    applicant_name,
    company_name,
    '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr' as wallet_address,
    NOW() - ((200 - n) * interval '1 day') as created_at,
    NOW() - ((200 - n) * interval '1 day' + interval '2 hours') as updated_at
FROM application_data;

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
    'Initial submission - Status: ' || status,
    created_at
FROM ip_applications;

-- Add status updates for applications
INSERT INTO status_history (
    application_id,
    status,
    created_by,
    notes,
    created_at
)
SELECT 
    id,
    CASE 
      WHEN status = 'draft' THEN 'pending'
      WHEN status = 'pending' THEN 'in-review'
      WHEN status = 'in-review' THEN 'approved'
      WHEN status = 'approved' THEN 'approved'
      ELSE 'rejected'
    END as status,
    '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr',
    'Status update after review',
    updated_at
FROM ip_applications
WHERE id IN (
    SELECT id FROM ip_applications 
    ORDER BY created_at 
    LIMIT 100
); 