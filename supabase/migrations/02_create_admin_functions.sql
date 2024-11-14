-- Function to add an admin user
CREATE OR REPLACE FUNCTION add_admin_user(wallet_address_param text, full_name_param text)
RETURNS void AS $$
BEGIN
    -- Insert or update the profile with admin privileges
    INSERT INTO public.profiles (wallet_address, full_name, is_admin)
    VALUES (wallet_address_param, full_name_param, true)
    ON CONFLICT (wallet_address) 
    DO UPDATE SET is_admin = true, full_name = EXCLUDED.full_name;

    -- Log the action
    INSERT INTO public.admin_audit_log (admin_wallet, action, details)
    VALUES (
        wallet_address_param,
        'ADMIN_ADDED',
        jsonb_build_object(
            'wallet_address', wallet_address_param,
            'full_name', full_name_param
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Function to remove admin privileges
CREATE OR REPLACE FUNCTION remove_admin_user(wallet_address_param text)
RETURNS void AS $$
BEGIN
    -- Remove admin privileges
    UPDATE public.profiles
    SET is_admin = false
    WHERE wallet_address = wallet_address_param;

    -- Log the action
    INSERT INTO public.admin_audit_log (admin_wallet, action, details)
    VALUES (
        auth.jwt() ->> 'wallet_address',
        'ADMIN_REMOVED',
        jsonb_build_object('wallet_address', wallet_address_param)
    );
END;
$$ LANGUAGE plpgsql;

-- Now add the initial admin user
DO $$ 
BEGIN
    PERFORM add_admin_user(
        '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr',  -- Replace with your wallet address
        'Admin User'  -- Replace with admin name
    );
END $$; 