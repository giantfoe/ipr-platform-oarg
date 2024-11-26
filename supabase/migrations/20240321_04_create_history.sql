-- Create the status history table
CREATE TABLE public.status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES public.ip_applications(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    created_by TEXT REFERENCES public.profiles(wallet_address),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for history
CREATE INDEX IF NOT EXISTS idx_status_history_application_id ON status_history(application_id);
CREATE INDEX IF NOT EXISTS idx_status_history_created_by ON status_history(created_by);

-- Enable RLS for history
ALTER TABLE public.status_history ENABLE ROW LEVEL SECURITY; 