-- Drop existing status_history table if it exists
drop table if exists status_history;

-- Create status_history table with proper structure
create table public.status_history (
    id uuid primary key default uuid_generate_v4(),
    application_id uuid references ip_applications(id) on delete cascade,
    status text not null,
    created_by text references profiles(wallet_address),
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table status_history enable row level security;

-- Create policies for status_history
create policy "Enable insert for authenticated users"
    on status_history for insert
    to authenticated
    with check (true);

create policy "Enable select for users with access to the application"
    on status_history for select
    to authenticated
    using (
        exists (
            select 1 from ip_applications
            where ip_applications.id = status_history.application_id
            and (
                ip_applications.wallet_address = auth.jwt() ->> 'wallet_address'
                or exists (
                    select 1 from profiles
                    where profiles.wallet_address = auth.jwt() ->> 'wallet_address'
                    and profiles.is_admin = true
                )
            )
        )
    );

-- Create indexes
create index if not exists idx_status_history_application 
    on status_history(application_id);
create index if not exists idx_status_history_created_by 
    on status_history(created_by);

-- Grant necessary permissions
grant all on status_history to authenticated; 