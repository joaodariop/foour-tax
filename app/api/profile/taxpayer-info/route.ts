import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getDb()
  
  const { data, error } = await db
    .from('fiscal_info')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ taxpayerInfo: data || {} })
}

export async function PUT(request: NextRequest) {
  const userId = request.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const db = getDb()
  
  // Check if exists
  const { data: existing } = await db
    .from('fiscal_info')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (existing) {
    // Update
    const { data, error } = await db
      .from('fiscal_info')
      .update(body)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ taxpayerInfo: data })
  } else {
    // Insert
    const { data, error } = await db
      .from('fiscal_info')
      .insert({ ...body, user_id: userId })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ taxpayerInfo: data })
  }
}
