-- Drop existing table and its dependencies
DROP TABLE IF EXISTS public.educational_resources CASCADE;

-- Recreate educational resources table with correct reference type
CREATE TABLE public.educational_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('patent', 'trademark', 'copyright')),
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    file_url TEXT,
    author TEXT NOT NULL,
    created_by TEXT REFERENCES profiles(wallet_address),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    published BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.educational_resources ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_resources_slug ON educational_resources(slug);
CREATE INDEX idx_resources_type ON educational_resources(type);
CREATE INDEX idx_resources_created_at ON educational_resources(created_at DESC);
CREATE INDEX idx_resources_published ON educational_resources(published);
CREATE INDEX idx_resources_created_by ON educational_resources(created_by);

-- Create policies
CREATE POLICY "Everyone can view published resources"
    ON educational_resources FOR SELECT
    USING (published = true);

CREATE POLICY "Admins can do everything"
    ON educational_resources FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
            AND profiles.is_admin = true
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_educational_resources_updated_at
    BEFORE UPDATE ON educational_resources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate and validate slug
CREATE OR REPLACE FUNCTION generate_unique_slug()
RETURNS TRIGGER AS $$
BEGIN
    -- Generate slug from title if not provided
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'));
    END IF;
    
    -- Remove leading and trailing hyphens
    NEW.slug := trim(both '-' from NEW.slug);
    
    -- Ensure uniqueness by appending number if necessary
    WHILE EXISTS (
        SELECT 1 FROM educational_resources 
        WHERE slug = NEW.slug AND id != NEW.id
    ) LOOP
        NEW.slug := NEW.slug || '-' || floor(random() * 1000)::text;
    END LOOP;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for slug generation
CREATE TRIGGER ensure_unique_slug
    BEFORE INSERT OR UPDATE ON educational_resources
    FOR EACH ROW
    EXECUTE FUNCTION generate_unique_slug();

-- Grant necessary permissions
GRANT SELECT ON educational_resources TO authenticated;
GRANT ALL ON educational_resources TO service_role;

-- Insert some initial resources
INSERT INTO educational_resources (
    title,
    type,
    description,
    content,
    author,
    published
) VALUES 
(
    'Understanding Intellectual Property',
    'patent',
    'A comprehensive guide to the different types of intellectual property and their importance.',
    'Detailed content about intellectual property basics...',
    'IP Register Team',
    true
),
(
    'IP Registration Process',
    'trademark',
    'Step-by-step instructions on how to register your IP with OARG.',
    'Complete guide to registration process...',
    'IP Register Team',
    true
),
(
    'Legal Framework in Sierra Leone',
    'copyright',
    'An overview of the legal protections available for your intellectual property.',
    'Detailed information about legal framework...',
    'IP Register Team',
    true
); 