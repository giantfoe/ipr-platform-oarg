-- Check which tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check the actual data in ip_applications
SELECT COUNT(*) as total_applications FROM ip_applications;

-- Check a sample of the data
SELECT id, title, application_type, status, created_at 
FROM ip_applications 
LIMIT 5; 