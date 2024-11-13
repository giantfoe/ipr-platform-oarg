-- Drop existing policies
drop policy if exists "Applications are viewable by owner" on ip_applications;
drop policy if exists "Applications can be created by anyone" on ip_applications;
drop policy if exists "Applications can be updated by owner" on ip_applications;

-- Create new, more permissive policies for the API routes
create policy "Enable read access for all users"
  on ip_applications for select
  using ( true );

create policy "Enable insert access for all users"
  on ip_applications for insert
  with check ( true );

create policy "Enable update for users based on wallet_address"
  on ip_applications for update
  using ( wallet_address = auth.jwt() ->> 'wallet_address' );

-- Make sure RLS is enabled
alter table public.ip_applications enable row level security; 