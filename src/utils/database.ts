import { createClient as createClientSide } from './supabase/client'
import { createClientSupabaseClient } from './supabase/server'
import { Application } from '@/types/database'

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
      const supabase = createClientSide()
      const { data, error } = await supabase
        .from('ip_applications')
        .select('*')
        .eq('wallet_address', walletAddress)
        .order('created_at', { ascending: false })

      if (error) throw new DatabaseError('Failed to fetch applications', error)
      return data
    } catch (err) {
      console.error('Database error in getApplications:', err)
      throw err
    }
  }
}

// Server-side database operations
export const serverDb = {
  async getApplications(walletAddress: string): Promise<Application[]> {
    try {
      const supabase = createClientSupabaseClient()
      const { data, error } = await supabase
        .from('ip_applications')
        .select('*')
        .eq('wallet_address', walletAddress)
        .order('created_at', { ascending: false })

      if (error) throw new DatabaseError('Failed to fetch applications', error)
      return data
    } catch (err) {
      console.error('Database error in getApplications:', err)
      throw err
    }
  }
} 