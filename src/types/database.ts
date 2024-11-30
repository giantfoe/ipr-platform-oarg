export interface Application {
  id: string;
  title: string;
  description: string;
  application_type: 'patent' | 'trademark' | 'copyright';
  status: 'draft' | 'pending' | 'in-review' | 'approved' | 'rejected';
  regions: string[];
  created_at: string;
  updated_at: string;
  wallet_address: string;
  applicant_name: string;
  company_name: string;
  national_id?: string;
  phone_number?: string;
  documents?: Document[];
  status_history?: StatusHistory[];
  profiles?: Profile;
}

export interface StatusHistory {
  id: string;
  application_id: string;
  status: string;
  notes?: string;
  created_at: string;
  created_by: string;
}

export interface Profile {
  wallet_address: string;
  full_name: string;
  company_name?: string;
  phone_number?: string;
  email?: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  application_id: string;
  file_path: string;
  file_type: string;
  created_at: string;
}

export interface CopyrightApplication {
  id: string;
  title: string;
  description: string;
  applicant_name: string;
  company_name?: string;
  work_type: string;
  creation_date: string;
  first_publication?: string;
  authors: string[];
  mobile_number: string;
  email?: string;
  regions: string[];
  status: 'draft' | 'pending' | 'in-review' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  wallet_address: string;
} 