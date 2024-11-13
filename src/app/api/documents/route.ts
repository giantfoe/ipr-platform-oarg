import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  const { application_id, file_name, file_type, file_size, file_path } = await request.json()
  const wallet = request.headers.get('x-wallet-address')
  
  if (!wallet) {
    return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
  }

  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from('documents')
    .insert([
      {
        application_id,
        file_name,
        file_type,
        file_size,
        file_path,
        uploaded_by: wallet,
        status: 'pending'
      }
    ])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ document: data }, { status: 201 })
} 