CREATE OR REPLACE FUNCTION update_application_status(
  p_application_id UUID,
  p_status TEXT,
  p_notes TEXT,
  p_updated_by TEXT
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update application status
  UPDATE ip_applications
  SET 
    status = p_status,
    updated_at = NOW()
  WHERE id = p_application_id;

  -- Create status history entry
  INSERT INTO status_history (
    application_id,
    status,
    notes,
    created_by,
    created_at
  ) VALUES (
    p_application_id,
    p_status,
    p_notes,
    p_updated_by,
    NOW()
  );
END;
$$; 