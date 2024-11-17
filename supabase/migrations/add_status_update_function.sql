-- Create or replace the status update function
CREATE OR REPLACE FUNCTION handle_application_status_update(
  p_application_id UUID,
  p_new_status TEXT,
  p_admin_wallet TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify admin status
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE wallet_address = p_admin_wallet
    AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  -- Update application status
  UPDATE ip_applications
  SET 
    status = p_new_status,
    updated_at = NOW()
  WHERE id = p_application_id;

  -- Create status history entry
  INSERT INTO status_history (
    application_id,
    status,
    created_by,
    created_at
  ) VALUES (
    p_application_id,
    p_new_status,
    p_admin_wallet,
    NOW()
  );

END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION handle_application_status_update TO authenticated; 