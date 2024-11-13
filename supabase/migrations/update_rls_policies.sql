-- Drop existing policies if they exist
drop policy if exists "Applications are viewable by owner" on ip_applications;
drop policy if exists "Applications can be created by owner" on ip_applications;
drop policy if exists "Applications can be updated by owner" on ip_applications;

-- Create new policies that work with wallet authentication
create policy "Applications are viewable by owner"
  on ip_applications for select
  using (wallet_address = current_setting('request.jwt.claims')::json->>'wallet_address');

create policy "Applications can be created by anyone"
  on ip_applications for insert
  with check ( true );

create policy "Applications can be updated by owner"
  on ip_applications for update
  using (wallet_address = current_setting('request.jwt.claims')::json->>'wallet_address');

-- Enable RLS
alter table public.ip_applications enable row level security;