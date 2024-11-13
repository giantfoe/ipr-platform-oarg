-- Add is_admin column to profiles
alter table public.profiles 
add column is_admin boolean default false;

-- Create admin-specific policies
create policy "Admins can view all profiles"
  on profiles for select
  using (
    exists (
      select 1 from profiles
      where wallet_address = auth.jwt() ->> 'wallet_address'
      and is_admin = true
    )
  );

create policy "Admins can update all applications"
  on ip_applications for update
  using (
    exists (
      select 1 from profiles
      where wallet_address = auth.jwt() ->> 'wallet_address'
      and is_admin = true
    )
  ); 