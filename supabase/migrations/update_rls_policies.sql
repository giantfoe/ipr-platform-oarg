-- Drop existing policies if they exist
drop policy if exists "Profiles are viewable by everyone" on profiles;
drop policy if exists "Profiles can be created by anyone" on profiles;
drop policy if exists "Profiles can be updated by owner" on profiles;

-- Create new policies that work with wallet authentication
create policy "Profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can create their own profile"
  on profiles for insert
  with check ( wallet_address = auth.jwt() ->> 'wallet_address' );

create policy "Users can update own profile"
  on profiles for update
  using ( wallet_address = auth.jwt() ->> 'wallet_address' );

-- Enable RLS
alter table public.profiles enable row level security;