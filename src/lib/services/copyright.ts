import { createBrowserSupabaseClient } from '@/utils/supabase/client-utils'
import type { CopyrightFormData } from '@/lib/validations'

export const copyrightService = {
  async createApplication(data: CopyrightFormData) {
    const supabase = createBrowserSupabaseClient()

    const { data: application, error } = await supabase
      .from('ip_applications')
      .insert([{
        ...data,
        application_type: 'copyright',
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return application
  },

  async getApplication(id: string) {
    const supabase = createBrowserSupabaseClient()

    const { data, error } = await supabase
      .from('ip_applications')
      .select('*')
      .eq('id', id)
      .eq('application_type', 'copyright')
      .single()

    if (error) throw error
    return data
  },

  async updateApplication(id: string, data: Partial<CopyrightFormData>) {
    const supabase = createBrowserSupabaseClient()

    const { data: updated, error } = await supabase
      .from('ip_applications')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('application_type', 'copyright')
      .select()
      .single()

    if (error) throw error
    return updated
  }
} 