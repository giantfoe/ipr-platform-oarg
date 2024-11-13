import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const wallet = searchParams.get('wallet')

  if (!wallet) {
    return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
  }

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('ip_applications')
    .select(`
      *,
      documents(*),
      status_history(*),
      payments(*)
    `)
    .eq('wallet_address', wallet)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ applications: data }, { status: 200 })
}

export async function POST(request: Request) {
  const { title, description, application_type, region } = await request.json()
  const wallet = request.headers.get('x-wallet-address')
  
  if (!wallet) {
    return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
  }

  const supabase = createServerSupabaseClient()

  // Create application
  const { data: application, error: applicationError } = await supabase
    .from('ip_applications')
    .insert([
      {
        title,
        description,
        application_type,
        region,
        wallet_address: wallet,
        status: 'draft'
      }
    ])
    .select()
    .single()

  if (applicationError) {
    return NextResponse.json({ error: applicationError.message }, { status: 400 })
  }

  // Create initial status history
  const { error: statusError } = await supabase
    .from('status_history')
    .insert([
      {
        application_id: application.id,
        status: 'draft',
        notes: 'Application created',
        created_by: wallet
      }
    ])

  if (statusError) {
    return NextResponse.json({ error: statusError.message }, { status: 400 })
  }

  return NextResponse.json({ application }, { status: 201 })
} 