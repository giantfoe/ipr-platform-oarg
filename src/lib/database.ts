import { createClient } from '@supabase/supabase-js'
import type { Application, Profile, StatusHistory } from '@/types/database'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const db = {
  // Applications
  async getApplicationsByWallet(walletAddress: string) {
    const { data, error } = await supabase
      .from('ip_applications')
      .select(`
        *,
        status_history (
          status,
          created_at,
          notes,
          created_by
        ),
        documents (*)
      `)
      .eq('wallet_address', walletAddress)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Application[]
  },

  async getApplicationById(id: string) {
    const { data, error } = await supabase
      .from('ip_applications')
      .select(`
        *,
        status_history (
          status,
          created_at,
          notes,
          created_by
        ),
        documents (*),
        profiles (
          full_name,
          company_name,
          phone_number,
          email
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Application
  },

  async createApplication(application: Partial<Application>) {
    const { data, error } = await supabase
      .from('ip_applications')
      .insert([{
        ...application,
        status: 'draft'
      }])
      .select()
      .single()

    if (error) throw error
    return data as Application
  },

  async updateApplicationStatus(
    applicationId: string,
    status: string,
    notes: string,
    adminWallet: string
  ) {
    const { error } = await supabase
      .rpc('handle_application_status_update', {
        p_application_id: applicationId,
        p_new_status: status,
        p_notes: notes,
        p_admin_wallet: adminWallet
      })

    if (error) throw error
  },

  // Profiles
  async getProfile(walletAddress: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data as Profile | null
  },

  async updateProfile(walletAddress: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('wallet_address', walletAddress)
      .select()
      .single()

    if (error) throw error
    return data as Profile
  },

  // Admin
  async isAdmin(walletAddress: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('wallet_address', walletAddress)
      .single()

    if (error) return false
    return data?.is_admin || false
  },

  async getAllApplications() {
    const { data, error } = await supabase
      .from('ip_applications')
      .select(`
        *,
        status_history (
          status,
          created_at,
          notes,
          created_by
        ),
        profiles (
          full_name,
          company_name,
          phone_number,
          email
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Application[]
  }
} 