import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { Application } from '@/types/database'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function getApplications(walletAddress: string): Promise<Application[]> {
  const { data, error } = await supabase
    .from('ip_applications_new')
    .select('*')
    .eq('wallet_address', walletAddress)
    
  if (error) throw error
  return data as Application[]
}

export async function getApplicationById(id: string): Promise<Application | null> {
  const { data, error } = await supabase
    .from('ip_applications_new')
    .select('*')
    .eq('id', id)
    .single()
    
  if (error) throw error
  return data as Application
}

export async function createApplication(application: Partial<Application>): Promise<Application> {
  const { data, error } = await supabase
    .from('ip_applications_new')
    .insert([application])
    .select()
    .single()
    
  if (error) throw error
  return data as Application
}

export async function updateApplication(id: string, updates: Partial<Application>): Promise<Application> {
  const { data, error } = await supabase
    .from('ip_applications_new')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
    
  if (error) throw error
  return data as Application
} 