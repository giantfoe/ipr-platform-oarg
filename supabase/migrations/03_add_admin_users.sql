-- Add specific admin users
SELECT add_admin_user(
    '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr',  -- Your wallet address
    'Primary Admin'  -- Your admin name
);

-- Add another admin (example)
-- SELECT add_admin_user(
--     'ANOTHER_WALLET_ADDRESS',
--     'Another Admin Name'
-- );

-- To verify admin users
SELECT wallet_address, full_name, is_admin 
FROM profiles 
WHERE is_admin = true;

-- To remove admin privileges if needed
-- SELECT remove_admin_user('WALLET_ADDRESS_TO_REMOVE'); 