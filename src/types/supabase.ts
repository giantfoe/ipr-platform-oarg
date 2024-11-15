export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          wallet_address: string
          full_name: string | null
          company_name: string | null
          phone_number: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          wallet_address: string
          full_name?: string | null
          company_name?: string | null
          phone_number?: string | null
          is_admin?: boolean
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
    }
  }
} 