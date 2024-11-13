-- First, check if the column exists and drop it if it does
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 
               FROM information_schema.columns 
               WHERE table_name = 'ip_applications' 
               AND column_name = 'region') THEN
        ALTER TABLE public.ip_applications DROP COLUMN region;
    END IF;
END $$;

-- Add the regions column with the correct name and type
ALTER TABLE public.ip_applications 
ADD COLUMN regions text[] DEFAULT '{}';

-- Update existing rows to have an empty array if needed
UPDATE public.ip_applications 
SET regions = '{}' 
WHERE regions IS NULL;

-- Add a check constraint to ensure valid regions
ALTER TABLE public.ip_applications
ADD CONSTRAINT valid_regions CHECK (
    array_length(regions, 1) > 0
); 