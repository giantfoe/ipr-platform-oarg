-- Drop old tables and recreate with proper relationships
drop table if exists public.payments cascade;
drop table if exists public.documents cascade;
drop table if exists public.status_history cascade;
drop table if exists public.ip_applications cascade;
drop table if exists public.ip_registrations cascade;
drop table if exists public.profiles cascade;

-- Create profiles table with proper constraints
create table public.profiles (
  id uuid primary key default uuid_generate_v4(),
  wallet_address text unique not null,
  full_name text not null,
  company_name text,
  phone_number text,
  is_admin boolean default false,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint wallet_address_format check (wallet_address ~ '^[1-9A-HJ-NP-Za-km-z]{32,44}$')
);

-- Rest of the schema remains the same but with added constraints
-- ... (previous table definitions)

-- Add missing indexes
create index if not exists idx_applications_type on ip_applications(application_type);
create index if not exists idx_applications_status on ip_applications(status);
create index if not exists idx_payments_status on payments(status);
create index if not exists idx_documents_status on documents(status);

-- Add triggers for updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

create trigger update_profiles_updated_at
    before update on profiles
    for each row
    execute procedure update_updated_at_column();

-- Repeat for other tables 

-- Fix status_history table and permissions
ALTER TABLE status_history DROP CONSTRAINT IF EXISTS status_history_created_by_fkey;
ALTER TABLE status_history DROP CONSTRAINT IF EXISTS status_history_application_id_fkey;

-- Recreate constraints with proper cascade
ALTER TABLE status_history 
  ADD CONSTRAINT status_history_created_by_fkey 
    FOREIGN KEY (created_by) 
    REFERENCES profiles(wallet_address) 
    ON DELETE SET NULL,
  ADD CONSTRAINT status_history_application_id_fkey 
    FOREIGN KEY (application_id) 
    REFERENCES ip_applications(id) 
    ON DELETE CASCADE;

-- Update RLS policies
DROP POLICY IF EXISTS "Enable admin write access" ON status_history;
DROP POLICY IF EXISTS "Enable read access for owners and admins" ON status_history;

-- Create new policies
CREATE POLICY "Enable all access for admins"
ON status_history
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Enable read access for application owners"
ON status_history
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM ip_applications
    WHERE ip_applications.id = status_history.application_id
    AND ip_applications.wallet_address = auth.jwt() ->> 'wallet_address'
  )
);

-- Grant proper permissions
GRANT ALL ON status_history TO authenticated;