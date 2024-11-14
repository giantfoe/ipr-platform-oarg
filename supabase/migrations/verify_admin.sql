-- Check admin status for specific wallet
SELECT wallet_address, full_name, is_admin, created_at
FROM profiles
WHERE wallet_address = '7DTJdXNNdcosyrCAMWDKFBYJp2iMEsMbu35o4CZfVVPp';

-- List all admins
SELECT wallet_address, full_name, is_admin, created_at
FROM profiles
WHERE is_admin = true;

-- Ensure admin flag is set correctly
UPDATE profiles
SET is_admin = true
WHERE wallet_address = '7DTJdXNNdcosyrCAMWDKFBYJp2iMEsMbu35o4CZfVVPp'
AND is_admin IS NOT true; 