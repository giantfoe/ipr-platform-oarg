export type ApplicationType = 'patent' | 'trademark' | 'copyright'
export type ApplicationStatus = 'draft' | 'pending' | 'in-review' | 'approved' | 'rejected'
export type TrademarkType = 'Word' | 'Logo' | 'Combined' | 'Sound' | '3D'
export type TrademarkUseStatus = 'In Use' | 'Intent to Use'
export type CopyrightWorkType = 'Literary' | 'Musical' | 'Artistic' | 'Dramatic' | 'Audiovisual' | 'Sound Recording'
export type RightsOwnershipType = 'Original Author' | 'Work for Hire' | 'Transfer'

export interface Application {
  id: string
  wallet_address: string
  application_type: ApplicationType
  status: ApplicationStatus
  
  // Basic Information
  title: string
  description?: string
  applicant_name: string
  company_name?: string
  national_id?: string
  phone_number?: string
  
  // Patent Specific
  technical_field?: string
  background_art?: string
  invention?: any
  claims?: any
  inventors?: any
  priority_claim?: any
  
  // Trademark Specific
  mark_type?: TrademarkType
  mark_text?: string
  mark_description?: string
  color_claim?: string
  nice_classifications?: any
  use_status?: TrademarkUseStatus
  first_use_date?: string
  disclaimers?: any
  
  // Copyright Specific
  work_type?: CopyrightWorkType
  alternative_titles?: string[]
  date_of_creation?: string
  date_of_publication?: string
  country_of_origin?: string
  authors?: any
  is_derivative?: boolean
  preexisting_material?: string
  new_material?: string
  rights_ownership?: RightsOwnershipType
  
  // Metadata
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
} 