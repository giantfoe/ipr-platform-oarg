-- Drop existing policies if they exist
drop policy if exists "Profiles are viewable by everyone" on profiles;
drop policy if exists "Profiles can be created by anyone" on profiles;
drop policy if exists "Profiles can be updated by wallet owner" on profiles;

-- Create new policies
create policy "Profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Profiles can be created by anyone"
  on profiles for insert
  with check ( true );

create policy "Profiles can be updated by wallet owner"
  on profiles for update
  using ( wallet_address = auth.jwt() ->> 'wallet_address' );

-- Enable RLS
alter table public.profiles enable row level security;

-- Create index for better performance
create index if not exists profiles_wallet_address_idx 
  on profiles (wallet_address); 