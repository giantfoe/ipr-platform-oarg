-- Drop existing function if exists
DROP FUNCTION IF EXISTS handle_application_status_update CASCADE;

-- Create a new function that handles both status update and history creation
CREATE OR REPLACE FUNCTION handle_application_status_update(
  p_application_id UUID,
  p_new_status TEXT,
  p_admin_wallet TEXT
)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_old_status TEXT;
  v_is_admin BOOLEAN;
BEGIN
  -- Check if the user is an admin
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE wallet_address = p_admin_wallet
    AND is_admin = true
  ) INTO v_is_admin;

  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can update status';
  END IF;

  -- Get the current status
  SELECT status INTO v_old_status
  FROM ip_applications
  WHERE id = p_application_id;

  -- Update the application status
  UPDATE ip_applications
  SET 
    status = p_new_status,
    updated_at = NOW()
  WHERE id = p_application_id;

  -- Create history entry
  INSERT INTO status_history (
    application_id,
    status,
    created_by,
    notes,
    created_at
  ) VALUES (
    p_application_id,
    p_new_status,
    p_admin_wallet,
    format('Status changed from %s to %s', v_old_status, p_new_status),
    NOW()
  );

  RETURN TRUE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION handle_application_status_update TO authenticated; 