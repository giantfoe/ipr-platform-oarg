CREATE OR REPLACE FUNCTION reset_application_sequence(max_id bigint)
RETURNS void AS $$
BEGIN
    -- Reset the sequence to the max id + 1
    PERFORM setval(
        pg_get_serial_sequence('ip_applications', 'id'),
        max_id,
        true
    );
END;
$$ LANGUAGE plpgsql; 