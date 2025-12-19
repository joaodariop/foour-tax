import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getDb()
    const { data, error } = await supabase
      .from('fii_operations')
      .select('*')
      .eq('user_id', userId)
      .order('operation_month', { ascending: false })

    if (error) throw error

    return NextResponse.json({ items: data || [] })
  } catch (error) {
    console.error('[v0] Error fetching FII operations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const supabase = getDb()
    
    const { data, error } = await supabase
      .from('fii_operations')
      .insert({
        user_id: userId,
        ...body
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Error creating FII operation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
