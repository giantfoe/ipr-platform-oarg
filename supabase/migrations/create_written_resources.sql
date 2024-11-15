-- Drop existing educational_resources table and its policies
DROP TABLE IF EXISTS public.educational_resources CASCADE;

-- Create new written_resources table
CREATE TABLE public.written_resources (
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
    metadata JSONB DEFAULT '{}'::jsonb,
    category TEXT DEFAULT 'general',
    reading_time INTEGER,
    likes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE written_resources ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_written_resources_slug ON written_resources(slug);
CREATE INDEX idx_written_resources_type ON written_resources(type);
CREATE INDEX idx_written_resources_created_at ON written_resources(created_at DESC);
CREATE INDEX idx_written_resources_published ON written_resources(published);
CREATE INDEX idx_written_resources_category ON written_resources(category);

-- Create simple RLS policies
CREATE POLICY "Anyone can read published resources"
    ON written_resources
    FOR SELECT
    USING (published = true);

CREATE POLICY "Admins can do anything"
    ON written_resources
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.wallet_address = auth.jwt() ->> 'wallet_address'
            AND profiles.is_admin = true
        )
    );

-- Create updated_at trigger
CREATE TRIGGER update_written_resources_updated_at
    BEFORE UPDATE ON written_resources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create automatic slug generation function
CREATE OR REPLACE FUNCTION generate_resource_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'));
    END IF;
    
    NEW.slug := trim(both '-' from NEW.slug);
    
    WHILE EXISTS (
        SELECT 1 FROM written_resources 
        WHERE slug = NEW.slug AND id != NEW.id
    ) LOOP
        NEW.slug := NEW.slug || '-' || floor(random() * 1000)::text;
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create slug trigger
CREATE TRIGGER ensure_resource_slug
    BEFORE INSERT OR UPDATE ON written_resources
    FOR EACH ROW
    EXECUTE FUNCTION generate_resource_slug();

-- Grant permissions
GRANT ALL ON written_resources TO authenticated;

-- Insert sample content
INSERT INTO written_resources (
    title,
    type,
    description,
    content,
    author,
    published,
    category,
    reading_time
) VALUES 
(
    'Understanding IP Registration Process',
    'patent',
    'A comprehensive guide to registering your intellectual property.',
    'Detailed content about IP registration process...',
    'IP Register Team',
    true,
    'guides',
    10
); 