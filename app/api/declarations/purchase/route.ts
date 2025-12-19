import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { declaration_id, amount } = body

    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Create purchase record
    const { data: purchase, error } = await supabase
      .from('declaration_purchases')
      .insert({
        user_id: userId,
        declaration_id,
        amount,
        status: 'completed', // In beta, auto-complete
        payment_method: 'beta',
        purchased_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    
    // Update declaration status
    await supabase
      .from('declarations')
      .update({ status: 'purchased' })
      .eq('id', declaration_id)
    
    const classifyResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('/rest/v1', '')}/api/declarations/classify-client`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify({ declaration_id })
      }
    )

    let classification = null
    if (classifyResponse.ok) {
      classification = await classifyResponse.json()
    }

    return NextResponse.json({ 
      success: true, 
      purchase,
      classification 
    })
  } catch (error: any) {
    console.error('[v0] Purchase error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
