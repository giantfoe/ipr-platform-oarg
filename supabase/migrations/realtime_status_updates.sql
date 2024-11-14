-- Enable realtime for specific tables
alter publication supabase_realtime add table ip_applications;
alter publication supabase_realtime add table status_history;

-- Create trigger function for status updates
create or replace function handle_status_update()
returns trigger as $$
begin
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
$$ language plpgsql;

-- Create trigger
drop trigger if exists on_status_update on ip_applications;
create trigger on_status_update
  before update of status
  on ip_applications
  for each row
  execute function handle_status_update(); 