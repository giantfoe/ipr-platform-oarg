import { createServerSupabaseClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const data = await request.json()

    // Get the user's wallet address from the JWT
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError

    const walletAddress = user?.id

    // Create the application with the wallet address
    const { data: application, error } = await supabase
      .from('ip_applications')
      .insert([{
        ...data,
        application_type: 'copyright',
        wallet_address: walletAddress,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating copyright application:', error)
      return NextResponse.json(
        { error: 'Failed to create application' },
        { status: 400 }
      )
    }

    return NextResponse.json(application)
  } catch (err) {
    console.error('Error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 