-- First, ensure we have the is_admin column in profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Create admin audit log table to track admin actions
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_wallet text REFERENCES public.profiles(wallet_address),
    action text NOT NULL,
    details jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies for admin audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
    ON public.admin_audit_log FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
        AND profiles.is_admin = true
    ));

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

-- Add initial admin user (replace with your wallet address)
SELECT add_admin_user(
    '9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr',  -- Replace with your wallet address
    'Admin User'  -- Replace with admin name
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_audit_log_admin ON admin_audit_log(admin_wallet);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON admin_audit_log(created_at);

-- Update existing RLS policies to allow admin access
CREATE POLICY "Admins can view all profiles"
    ON profiles FOR SELECT
    USING (
        (auth.jwt() ->> 'wallet_address' = wallet_address) OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
            AND profiles.is_admin = true
        )
    );

CREATE POLICY "Admins can update all profiles"
    ON profiles FOR UPDATE
    USING (
        (auth.jwt() ->> 'wallet_address' = wallet_address) OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
            AND profiles.is_admin = true
        )
    ); 