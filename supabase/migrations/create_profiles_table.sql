create table if not exists public.profiles (
  id uuid references auth.users on delete cascade,
  full_name text,
  company_name text,
  phone_number text,
  wallet_address text unique,
  updated_at timestamp with time zone,
  primary key (id)
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create a trigger to automatically create a profile for new users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, wallet_address, updated_at)
  values (new.id, new.raw_user_meta_data->>'wallet_address', now());
  return new;
end;
$$ language plpgsql security definer;

-- Set up the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 