-- Create educational resources table
create table public.educational_resources (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  type text not null check (type in ('patent', 'trademark', 'copyright')),
  description text not null,
  file_url text,
  author text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.educational_resources enable row level security;

-- Create RLS policies
create policy "Educational resources are viewable by everyone"
  on educational_resources for select
  using ( true );

-- Create indexes
create index idx_resources_type on educational_resources(type);
create index idx_resources_created_at on educational_resources(created_at);

-- Create trigger for updated_at
create trigger update_educational_resources_updated_at
  before update on educational_resources
  for each row
  execute function update_updated_at_column();

-- Insert some sample data
insert into public.educational_resources (title, type, description, author) values
  (
    'Understanding Patent Registration',
    'patent',
    'A comprehensive guide to patent registration process, requirements, and best practices.',
    'IP Register Team'
  ),
  (
    'Trademark Protection Guide',
    'trademark',
    'Learn how to protect your trademark and maintain its validity.',
    'IP Register Team'
  ),
  (
    'Copyright Basics',
    'copyright',
    'Essential information about copyright protection and registration procedures.',
    'IP Register Team'
  ); 