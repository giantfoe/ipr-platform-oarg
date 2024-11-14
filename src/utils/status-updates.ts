import { createClient } from '@/utils/supabase/client'

export async function updateApplicationStatus(
  applicationId: string,
  newStatus: string,
  adminWallet: string
) {
  const supabase = createClient()

  try {
    // Start a transaction by using multiple operations
    // Update application status
    const { error: updateError } = await supabase
      .from('ip_applications')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', applicationId)

    if (updateError) throw updateError

    // Create status history entry
    const { error: historyError } = await supabase
      .from('status_history')
      .insert([
        {
          application_id: applicationId,
          status: newStatus,
          created_by: adminWallet,
          notes: `Status updated to ${newStatus} by admin`,
          created_at: new Date().toISOString()
        }
      ])

    if (historyError) throw historyError

    // Return success
    return { success: true }
  } catch (error) {
    console.error('Error updating status:', error)
    return { success: false, error }
  }
} 