-- Create the main applications table
CREATE TABLE public.ip_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    application_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    applicant_name TEXT,
    company_name TEXT,
    wallet_address TEXT REFERENCES public.profiles(wallet_address) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create indexes for applications
CREATE INDEX IF NOT EXISTS idx_ip_applications_wallet_address ON ip_applications(wallet_address);

-- Enable RLS for applications
ALTER TABLE public.ip_applications ENABLE ROW LEVEL SECURITY; 