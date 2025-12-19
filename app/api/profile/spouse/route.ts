import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 })
    }

    const db = getDb()
    const { data } = await db
      .from('spouses')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    return NextResponse.json(data || {})
  } catch (error) {
    console.error('Error fetching spouse:', error)
    return NextResponse.json({ error: 'Failed to fetch spouse' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 })
    }

    const body = await request.json()
    const db = getDb()

    const { data: existingSpouse } = await db
      .from('spouses')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    if (existingSpouse) {
      await db
        .from('spouses')
        .update(body)
        .eq('user_id', userId)
    } else {
      await db
        .from('spouses')
        .insert({ user_id: userId, ...body })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating spouse:', error)
    return NextResponse.json({ error: 'Failed to update spouse' }, { status: 500 })
  }
}
