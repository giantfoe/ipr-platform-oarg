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
    .from('ip_registrations')
    .select('*')
    .eq('wallet_address', wallet)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ ipRegistrations: data }, { status: 200 })
}

export async function POST(request: Request) {
  const { ip_name, ip_type } = await request.json()
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from('ip_registrations')
    .insert([
      { ip_name, ip_type, wallet_address: request.headers.get('x-wallet-address') }
    ])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ ipRegistration: data }, { status: 201 })
} 