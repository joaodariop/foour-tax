import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id')
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data, error } = await supabase
      .from('declarations')
      .select('*')
      .eq('user_id', userId)
      .order('year', { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('[v0] Error fetching declarations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch declarations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const userId = request.headers.get('x-user-id')
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const { data, error } = await supabase
      .from('declarations')
      .insert({
        user_id: userId,
        year: body.year,
        status: body.status || 'draft',
        type: body.type || body.declaration_type,
        total_income: body.total_income,
        total_assets: body.total_assets,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ declaration: data })
  } catch (error: any) {
    console.error('[v0] Error creating declaration:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create declaration' },
      { status: 500 }
    )
  }
}
