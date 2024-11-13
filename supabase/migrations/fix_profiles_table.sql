-- First drop the dependent tables in the correct order
drop table if exists public.payments cascade;
drop table if exists public.documents cascade;
drop table if exists public.status_history cascade;
drop table if exists public.ip_applications cascade;
drop table if exists public.profiles cascade;

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Recreate the profiles table with proper UUID handling
create table public.profiles (
  id uuid primary key default uuid_generate_v4(),
  wallet_address text unique,
  full_name text,
  company_name text,
  phone_number text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create IP applications table
create table public.ip_applications (
  id uuid default uuid_generate_v4() primary key,
  wallet_address text references public.profiles(wallet_address),
  title text not null,
  description text,
  application_type text not null check (application_type in ('patent', 'trademark', 'copyright')),
  status text not null default 'draft' check (status in ('draft', 'pending', 'in-review', 'approved', 'rejected')),
  region text[], -- ARIPO member states
  documents jsonb default '{}',
  fee_status text default 'unpaid' check (fee_status in ('unpaid', 'processing', 'paid')),
  fee_amount decimal(10,2),
  currency text default 'USD',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create status history table
create table public.status_history (
  id uuid default uuid_generate_v4() primary key,
  application_id uuid references public.ip_applications(id) on delete cascade,
  status text not null,
  notes text,
  created_by text references public.profiles(wallet_address),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create documents table
create table public.documents (
  id uuid default uuid_generate_v4() primary key,
  application_id uuid references public.ip_applications(id) on delete cascade,
  file_name text not null,
  file_type text not null,
  file_size integer not null,
  file_path text not null,
  uploaded_by text references public.profiles(wallet_address),
  version integer default 1,
  status text default 'pending' check (status in ('pending', 'verified', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create payments table
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  application_id uuid references public.ip_applications(id),
  amount decimal(10,2) not null,
  currency text default 'USD',
  status text default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  payment_method text,
  transaction_id text unique,
  wallet_address text references public.profiles(wallet_address),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.ip_applications enable row level security;
alter table public.status_history enable row level security;
alter table public.documents enable row level security;
alter table public.payments enable row level security;

-- Create policies
create policy "Profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can create their own profile"
  on profiles for insert
  with check ( true );

create policy "Users can update own profile"
  on profiles for update
  using ( wallet_address = current_setting('request.jwt.claims')::json->>'wallet_address' );

-- Create indexes for better query performance
create index idx_profiles_wallet on profiles(wallet_address);
create index idx_applications_wallet on ip_applications(wallet_address);
create index idx_applications_status on ip_applications(status);
create index idx_documents_application on documents(application_id);
create index idx_payments_application on payments(application_id);
create index idx_status_history_application on status_history(application_id);