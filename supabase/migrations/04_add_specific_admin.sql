-- Add the new admin user
SELECT add_admin_user(
    '7DTJdXNNdcosyrCAMWDKFBYJp2iMEsMbu35o4CZfVVPp',  -- The new admin wallet address
    'Secondary Admin'  -- Admin name
);

-- Verify the admin was added
SELECT wallet_address, full_name, is_admin 
FROM profiles 
WHERE wallet_address = '7DTJdXNNdcosyrCAMWDKFBYJp2iMEsMbu35o4CZfVVPp';

-- List all current admins for verification
SELECT wallet_address, full_name, is_admin, created_at 
FROM profiles 
WHERE is_admin = true
ORDER BY created_at DESC; 