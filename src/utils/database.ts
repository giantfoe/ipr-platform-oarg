import { createClient } from '@/utils/supabase/client'
import { createServerSupabaseClient } from '@/utils/supabase/server'
import { Application, ApplicationComment, ApplicationAttachment } from '@/types/database'

const TABLE_NAME = 'ip_applications'

export class DatabaseError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message)
    this.name = 'DatabaseError'
  }
}

// Client-side database operations
export const clientDb = {
  async getApplications(walletAddress: string): Promise<Application[]> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('wallet_address', walletAddress)
        .order('created_at', { ascending: false })

      if (error) throw new DatabaseError('Failed to fetch applications', error)
      return data
    } catch (err) {
      console.error('Database error in getApplications:', err)
      throw err
    }
  },

  async getApplicationById(id: string): Promise<Application | null> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select(`
          *,
          comments:application_comments(
            id, comment, is_internal, created_at, wallet_address,
            profiles(full_name)
          ),
          attachments:application_attachments(
            id, file_name, file_type, file_size, file_url, created_at, uploaded_by
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw new DatabaseError('Failed to fetch application', error)
      return data
    } catch (err) {
      console.error('Database error in getApplicationById:', err)
      throw err
    }
  }
}

// Server-side database operations
export const serverDb = {
  async createApplication(data: Partial<Application>): Promise<Application> {
    try {
      const supabase = createServerSupabaseClient()
      const { data: application, error } = await supabase
        .from(TABLE_NAME)
        .insert([{
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw new DatabaseError('Failed to create application', error)
      return application
    } catch (err) {
      console.error('Database error in createApplication:', err)
      throw err
    }
  },

  async updateApplication(id: string, updates: Partial<Application>): Promise<Application> {
    try {
      const supabase = createServerSupabaseClient()
      const { data: application, error } = await supabase
        .from(TABLE_NAME)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw new DatabaseError('Failed to update application', error)
      return application
    } catch (err) {
      console.error('Database error in updateApplication:', err)
      throw err
    }
  }
} 