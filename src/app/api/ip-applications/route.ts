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
  const { 
    title, 
    description, 
    application_type, 
    regions,
    applicant_name,
    company_name,
    national_id,
    phone_number 
  } = await request.json()
  
  const wallet = request.headers.get('x-wallet-address')
  
  if (!wallet) {
    return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
  }

  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from('ip_applications')
    .insert([
      {
        title,
        description,
        application_type,
        regions,
        wallet_address: wallet,
        status: 'draft',
        applicant_name,
        company_name,
        national_id,
        phone_number
      }
    ])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ application: data }, { status: 201 })
} 