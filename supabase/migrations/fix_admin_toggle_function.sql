-- Drop existing function
DROP FUNCTION IF EXISTS toggle_admin_status;

-- Create improved function with better error handling
CREATE OR REPLACE FUNCTION toggle_admin_status(
  user_id UUID,
  admin_wallet TEXT
)
RETURNS JSON
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_is_admin BOOLEAN;
  v_current_status BOOLEAN;
  v_result JSON;
BEGIN
  -- Check if the requesting user exists and is an admin
  SELECT is_admin INTO v_is_admin
  FROM profiles
  WHERE wallet_address = admin_wallet;

  IF v_is_admin IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Admin wallet not found'
    );
  END IF;

  IF NOT v_is_admin THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Unauthorized: Only admins can modify admin status'
    );
  END IF;

  -- Get current admin status
  SELECT is_admin, wallet_address INTO v_current_status, v_result
  FROM profiles
  WHERE id = user_id;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'User not found'
    );
  END IF;

  -- Update the status
  UPDATE profiles
  SET 
    is_admin = NOT v_current_status,
    updated_at = NOW()
  WHERE id = user_id
  RETURNING json_build_object(
    'success', true,
    'data', json_build_object(
      'id', id,
      'is_admin', is_admin,
      'updated_at', updated_at
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION toggle_admin_status TO authenticated; 