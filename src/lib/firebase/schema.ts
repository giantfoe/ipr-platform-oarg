import { Timestamp } from 'firebase/firestore'

// Application Types
export type ApplicationType = 'patent' | 'trademark' | 'copyright'
export type ApplicationStatus = 'draft' | 'pending' | 'in-review' | 'approved' | 'rejected'

// Document Interfaces
export interface Application {
  applicant_name: string
  application_type: string
  company_name: string
  created_at: Timestamp
  description: string
  name: string
  status: string
  title: string
  updated_at: Timestamp
  wallet_address: string
}

export interface StatusHistory {
  id: string
  application_id: string
  status: ApplicationStatus
  notes?: string
  created_at: Timestamp
  created_by: string
}

export interface Profile {
  wallet_address: string
  is_admin: boolean
  created_at: Timestamp
  updated_at: Timestamp
}

// Helper function to validate application data
export function validateApplication(data: any): data is Application {
  return (
    typeof data.applicant_name === 'string' &&
    typeof data.application_type === 'string' &&
    typeof data.company_name === 'string' &&
    data.created_at instanceof Timestamp &&
    typeof data.description === 'string' &&
    typeof data.name === 'string' &&
    typeof data.status === 'string' &&
    typeof data.title === 'string' &&
    data.updated_at instanceof Timestamp &&
    typeof data.wallet_address === 'string'
  )
} 