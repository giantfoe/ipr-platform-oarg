import { createServerSupabaseClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const data = await request.json()

    // Get the user's wallet address from the JWT
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError) throw authError
    
    const walletAddress = session?.user?.user_metadata?.wallet_address
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'No wallet address found' },
        { status: 401 }
      )
    }

    // Create the application with the wallet address
    const { data: application, error } = await supabase
      .from('ip_applications')
      .insert([{
        ...data,
        wallet_address: walletAddress,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating application:', error)
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