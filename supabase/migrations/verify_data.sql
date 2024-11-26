-- Check applications
SELECT COUNT(*) FROM ip_applications;

-- Check status history
SELECT COUNT(*) FROM status_history;

-- Check a sample of joined data
SELECT 
    a.id,
    a.title,
    a.application_type,
    a.status,
    a.created_at,
    sh.status as history_status,
    sh.created_at as status_changed_at
FROM ip_applications a
LEFT JOIN status_history sh ON a.id = sh.application_id
LIMIT 5; 