import { createClient } from '@/utils/supabase/client'

export async function updateApplicationStatus(
  applicationId: string,
  newStatus: string
) {
  const supabase = createClient()

  const { error } = await supabase
    .from('ip_applications_new')
    .update({ 
      status: newStatus,
      updated_at: new Date().toISOString()
    })
    .eq('id', applicationId)

  if (error) throw error
  return { success: true }
} 