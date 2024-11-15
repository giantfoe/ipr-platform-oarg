export interface APIResponse<T = Record<string, unknown>> {
  data?: T
  error?: string | { message: string }
  status: number
}

export interface ErrorResponse {
  message: string
  code?: string
  details?: unknown
}

export interface Profile {
  id: string
  wallet_address: string
  full_name: string
  company_name?: string
  phone_number?: string
  email?: string
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface IPApplication {
  id: string
  wallet_address: string
  title: string
  description?: string
  application_type: 'patent' | 'trademark' | 'copyright'
  status: 'draft' | 'pending' | 'in-review' | 'approved' | 'rejected'
  region: string[]
  documents: Document[]
  status_history: StatusHistory[]
  payments: Payment[]
  created_at: string
  updated_at: string
}

// Add other type definitions... 