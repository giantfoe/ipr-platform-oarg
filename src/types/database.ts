export interface IPApplication {
  id: string;
  wallet_address: string;
  title: string;
  description: string;
  application_type: 'patent' | 'trademark' | 'copyright';
  regions: string[];
  status: 'draft' | 'pending' | 'in-review' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  submission_date?: string;
  approval_date?: string;
  rejection_date?: string;
  rejection_reason?: string;
}

export interface StatusHistory {
  id: string;
  application_id: string;
  status: string;
  notes?: string;
  created_by: string;
  created_at: string;
}

export interface ApplicationDocument {
  id: string;
  application_id: string;
  document_type: string;
  file_name: string;
  file_url: string;
  uploaded_by: string;
  uploaded_at: string;
}

export interface ApplicationPayment {
  id: string;
  application_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  transaction_hash?: string;
  paid_at?: string;
  created_at: string;
} 