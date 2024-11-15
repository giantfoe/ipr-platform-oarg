-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT UNIQUE NOT NULL,
  full_name TEXT,
  company_name TEXT,
  phone_number TEXT,
  email TEXT,
  national_id TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- IP Applications table
CREATE TABLE ip_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  application_type TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  regions TEXT[],
  wallet_address TEXT REFERENCES profiles(wallet_address),
  nft_mint TEXT,
  nft_metadata_uri TEXT,
  nft_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Status History table
CREATE TABLE status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES ip_applications(id),
  status TEXT NOT NULL,
  notes TEXT,
  created_by TEXT REFERENCES profiles(wallet_address),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Resources table
CREATE TABLE written_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  content TEXT,
  author TEXT,
  published BOOLEAN DEFAULT FALSE,
  category TEXT,
  reading_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ip_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE written_resources ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = wallet_address);

-- IP Applications policies
CREATE POLICY "Users can view own applications" ON ip_applications
  FOR SELECT USING (auth.uid() = wallet_address OR 
    EXISTS (SELECT 1 FROM profiles WHERE wallet_address = auth.uid() AND is_admin = true));

CREATE POLICY "Users can create applications" ON ip_applications
  FOR INSERT WITH CHECK (auth.uid() = wallet_address);

CREATE POLICY "Users can update own applications" ON ip_applications
  FOR UPDATE USING (auth.uid() = wallet_address OR 
    EXISTS (SELECT 1 FROM profiles WHERE wallet_address = auth.uid() AND is_admin = true));

-- Status History policies
CREATE POLICY "Status history viewable by application owner and admins" ON status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM ip_applications 
      WHERE id = application_id 
      AND (wallet_address = auth.uid() OR 
        EXISTS (SELECT 1 FROM profiles WHERE wallet_address = auth.uid() AND is_admin = true))
    )
  );

CREATE POLICY "Only admins can create status history" ON status_history
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE wallet_address = auth.uid() AND is_admin = true)
  );

-- Resources policies
CREATE POLICY "Published resources viewable by everyone" ON written_resources
  FOR SELECT USING (published = true OR 
    EXISTS (SELECT 1 FROM profiles WHERE wallet_address = auth.uid() AND is_admin = true));

CREATE POLICY "Only admins can manage resources" ON written_resources
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE wallet_address = auth.uid() AND is_admin = true)
  );

-- Create indexes for better performance
CREATE INDEX idx_applications_wallet ON ip_applications(wallet_address);
CREATE INDEX idx_applications_status ON ip_applications(status);
CREATE INDEX idx_status_history_application ON status_history(application_id);
CREATE INDEX idx_resources_slug ON written_resources(slug);