import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const walletAddress = request.headers.get('x-wallet-address')

    console.log('API received request:', {
      walletAddress,
      headers: Object.fromEntries(request.headers.entries()),
      data
    })

    if (!walletAddress) {
      console.error('Missing wallet address')
      return new NextResponse(
        JSON.stringify({ 
          error: 'Wallet address is required',
          details: 'x-wallet-address header is missing'
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const supabase = createServerSupabaseClient()

    // Validate required fields
    const requiredFields = ['title', 'description', 'applicant_name', 'application_type']
    const missingFields = requiredFields.filter(field => !data[field])
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields)
      return new NextResponse(
        JSON.stringify({ 
          error: 'Missing required fields',
          details: missingFields
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Format the data for insertion
    const applicationData = {
      ...data,
      wallet_address: walletAddress,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: walletAddress
    }

    console.log('Inserting application data:', applicationData)

    const { data: application, error: insertError } = await supabase
      .from('ip_applications')
      .insert([applicationData])
      .select()
      .single()

    if (insertError) {
      console.error('Supabase insert error:', insertError)
      return new NextResponse(
        JSON.stringify({ 
          error: 'Database error',
          details: insertError.message
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Application created successfully:', application)

    return new NextResponse(
      JSON.stringify({ 
        success: true,
        application 
      }),
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (err) {
    console.error('Unhandled error in API route:', err)
    return new NextResponse(
      JSON.stringify({ 
        error: 'Internal server error',
        details: err instanceof Error ? err.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
} 