import { createClient } from '@/utils/supabase/client'
import type { 
  Application, 
  ApplicationStatus, 
  Document,
  StatusHistory 
} from '@/types/database'

export const applicationDb = {
  async createApplication(data: Partial<Application>) {
    const supabase = createClient()

    try {
      // First create the application
      const { data: application, error: applicationError } = await supabase
        .from('ip_applications')
        .insert([{
          ...data,
          status: 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (applicationError) throw applicationError

      // Create initial status history
      const { error: historyError } = await supabase
        .from('status_history')
        .insert([{
          application_id: application.id,
          status: 'draft',
          notes: 'Initial application submission',
          created_by: data.wallet_address,
          created_at: new Date().toISOString()
        }])

      if (historyError) throw historyError

      return application
    } catch (error) {
      console.error('Error creating application:', error)
      throw error
    }
  },

  async updateApplication(id: string, data: Partial<Application>) {
    const supabase = createClient()

    try {
      const { data: application, error } = await supabase
        .from('ip_applications')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return application
    } catch (error) {
      console.error('Error updating application:', error)
      throw error
    }
  },

  async updateApplicationStatus(
    id: string, 
    status: ApplicationStatus, 
    notes: string,
    updatedBy: string
  ) {
    const supabase = createClient()

    try {
      // Start a transaction
      const { error: updateError } = await supabase
        .rpc('update_application_status', {
          p_application_id: id,
          p_status: status,
          p_notes: notes,
          p_updated_by: updatedBy
        })

      if (updateError) throw updateError

      return true
    } catch (error) {
      console.error('Error updating application status:', error)
      throw error
    }
  },

  async uploadDocument(
    applicationId: string,
    file: File,
    type: string
  ): Promise<Document> {
    const supabase = createClient()

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${applicationId}/${Date.now()}.${fileExt}`

      // Upload file to storage
      const { error: uploadError } = await supabase
        .storage
        .from('application-documents')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('application-documents')
        .getPublicUrl(fileName)

      // Create document record
      const { data: document, error: documentError } = await supabase
        .from('documents')
        .insert([{
          application_id: applicationId,
          file_path: fileName,
          file_type: type,
          public_url: publicUrl,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (documentError) throw documentError

      return document
    } catch (error) {
      console.error('Error uploading document:', error)
      throw error
    }
  },

  async getApplicationWithDetails(id: string) {
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from('ip_applications')
        .select(`
          *,
          documents (*),
          status_history (
            id,
            status,
            notes,
            created_by,
            created_at
          ),
          profiles (
            full_name,
            company_name,
            email,
            phone_number
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching application:', error)
      throw error
    }
  },

  async getApplicationsByWallet(walletAddress: string) {
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from('ip_applications')
        .select(`
          *,
          documents (id, file_type, public_url),
          status_history (
            status,
            created_at
          )
        `)
        .eq('wallet_address', walletAddress)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching applications:', error)
      throw error
    }
  },

  onApplicationUpdate(
    applicationId: string,
    callback: (payload: any) => void
  ) {
    const supabase = createClient()

    const subscription = supabase
      .channel('application-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ip_applications',
          filter: `id=eq.${applicationId}`
        },
        callback
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }
} 