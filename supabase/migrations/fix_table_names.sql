-- Drop the old table if it exists
DROP TABLE IF EXISTS public.ip_applications_new;

-- Rename ip_applications_new to ip_applications if needed
ALTER TABLE IF EXISTS public.ip_applications_new 
  RENAME TO ip_applications;

-- Ensure the correct foreign key relationship exists
ALTER TABLE IF EXISTS public.ip_applications
  DROP CONSTRAINT IF EXISTS ip_applications_wallet_address_fkey,
  ADD CONSTRAINT ip_applications_wallet_address_fkey 
    FOREIGN KEY (wallet_address) 
    REFERENCES public.profiles(wallet_address) 
    ON DELETE CASCADE;

-- Ensure the status_history table references the correct table
ALTER TABLE IF EXISTS public.status_history
  DROP CONSTRAINT IF EXISTS status_history_application_id_fkey,
  ADD CONSTRAINT status_history_application_id_fkey 
    FOREIGN KEY (application_id) 
    REFERENCES public.ip_applications(id) 
    ON DELETE CASCADE; 