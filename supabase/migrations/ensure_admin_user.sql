-- Ensure admin user exists and has admin rights
INSERT INTO profiles (wallet_address, is_admin, full_name)
VALUES (
    '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr',  -- Your wallet address
    true,
    'Admin User'
)
ON CONFLICT (wallet_address) 
DO UPDATE SET 
    is_admin = true,
    updated_at = NOW(); 