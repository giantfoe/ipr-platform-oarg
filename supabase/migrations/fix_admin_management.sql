-- Drop existing policies for profiles table
DROP POLICY IF EXISTS "Enable admin management" ON profiles;

-- Create policy for admin management
CREATE POLICY "Enable admin management"
ON profiles
FOR UPDATE
USING (
  -- Allow if user is an admin
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
    AND profiles.is_admin = true
  )
)
WITH CHECK (
  -- Allow if user is an admin
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
    AND profiles.is_admin = true
  )
);

-- Create function to safely toggle admin status
CREATE OR REPLACE FUNCTION toggle_admin_status(
  user_id UUID,
  admin_wallet TEXT
)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_is_admin BOOLEAN;
  v_current_status BOOLEAN;
BEGIN
  -- Check if the requesting user is an admin
  SELECT is_admin INTO v_is_admin
  FROM profiles
  WHERE wallet_address = admin_wallet;

  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can modify admin status';
  END IF;

  -- Get current admin status
  SELECT is_admin INTO v_current_status
  FROM profiles
  WHERE id = user_id;

  -- Update the status
  UPDATE profiles
  SET 
    is_admin = NOT v_current_status,
    updated_at = NOW()
  WHERE id = user_id;

  RETURN TRUE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION toggle_admin_status TO authenticated; 