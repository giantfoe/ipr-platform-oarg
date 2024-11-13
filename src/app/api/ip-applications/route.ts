import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const wallet = searchParams.get('wallet')

  if (!wallet) {
    return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
  }

  const supabase = createClient()
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
  try {
    const { title, description, application_type, region } = await request.json()
    const wallet = request.headers.get('x-wallet-address')
    
    if (!wallet) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 401 })
    }

    const supabase = createClient()

    // Convert region to regions array
    const regions = Array.isArray(region) ? region : [region]

    // Create the application
    const { data: application, error: applicationError } = await supabase
      .from('ip_applications')
      .insert([
        {
          title,
          description,
          application_type,
          regions,
          wallet_address: wallet,
          status: 'draft'
        }
      ])
      .select()
      .single()

    if (applicationError) {
      console.error('Application creation error:', applicationError)
      return NextResponse.json({ 
        error: applicationError.message,
        details: applicationError 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true,
      data: application 
    }, { status: 201 })

  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ 
      error: 'An unexpected error occurred',
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 })
  }
} 