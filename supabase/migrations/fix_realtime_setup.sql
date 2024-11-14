-- First, check if tables are in publication and remove them
do $$
begin
  if exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' 
    and tablename = 'ip_applications'
  ) then
    alter publication supabase_realtime drop table ip_applications;
  end if;
  
  if exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' 
    and tablename = 'status_history'
  ) then
    alter publication supabase_realtime drop table status_history;
  end if;
end$$;

-- Add tables to publication
alter publication supabase_realtime add table ip_applications;
alter publication supabase_realtime add table status_history;

-- Drop existing trigger if it exists
drop trigger if exists on_status_update on ip_applications;
drop function if exists handle_status_update cascade;

-- Create the trigger function
create or replace function handle_status_update()
returns trigger as $$
begin
  -- Only proceed if status has changed
  if OLD.status = NEW.status then
    return NEW;
  end if;

  -- Insert into status history
  insert into status_history (
    application_id,
    status,
    created_by,
    notes
  ) values (
    NEW.id,
    NEW.status,
    current_setting('request.jwt.claims', true)::json->>'wallet_address',
    'Status changed from ' || OLD.status || ' to ' || NEW.status
  );
  
  -- Update the updated_at timestamp
  NEW.updated_at = now();
  return NEW;
end;
$$ language plpgsql security definer;

-- Create the trigger
create trigger on_status_update
  before update of status
  on ip_applications
  for each row
  execute function handle_status_update();

-- Ensure proper permissions
grant select, update on ip_applications to authenticated;
grant select, insert on status_history to authenticated;

-- Create index for better performance
create index if not exists idx_applications_status 
  on ip_applications(status, updated_at);