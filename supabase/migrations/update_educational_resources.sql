-- Add new columns to educational_resources
alter table public.educational_resources
add column if not exists slug text unique,
add column if not exists content text;

-- Update existing rows with slugs
update public.educational_resources
set slug = lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'))
where slug is null;

-- Add not null constraint to slug
alter table public.educational_resources
alter column slug set not null;

-- Create index for slug lookups
create index if not exists idx_resources_slug on educational_resources(slug);

-- Insert sample detailed content
insert into public.educational_resources (
  title,
  slug,
  type,
  description,
  content,
  author
) values (
  'IP Registration Process',
  'ip-registration-process',
  'patent',
  'A comprehensive guide to the IP registration process.',
  '<h2>Understanding IP Registration</h2><p>The process of registering intellectual property involves several key steps...</p>',
  'IP Register Team'
); 