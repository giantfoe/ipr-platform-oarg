-- First create ENUM types
DO $$ BEGIN
    CREATE TYPE application_type AS ENUM ('patent', 'trademark', 'copyright');
    CREATE TYPE application_status AS ENUM ('draft', 'pending', 'in-review', 'approved', 'rejected');
    CREATE TYPE trademark_type AS ENUM ('Word', 'Logo', 'Combined', 'Sound', '3D');
    CREATE TYPE trademark_use_status AS ENUM ('In Use', 'Intent to Use');
    CREATE TYPE copyright_work_type AS ENUM ('Literary', 'Musical', 'Artistic', 'Dramatic', 'Audiovisual', 'Sound Recording');
    CREATE TYPE rights_ownership_type AS ENUM ('Original Author', 'Work for Hire', 'Transfer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Now create the table
CREATE TABLE ip_applications_new (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address TEXT REFERENCES profiles(wallet_address),
    application_type application_type NOT NULL,
    status application_status DEFAULT 'draft'::application_status,
    
    -- Rest of the previous SQL remains the same... 