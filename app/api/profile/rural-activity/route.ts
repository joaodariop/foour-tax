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
      .from('rural_activity')
      .select('*')
      .eq('user_id', userId)
      .single()

    return NextResponse.json(data || {})
  } catch (error) {
    console.error('Error fetching rural activity:', error)
    return NextResponse.json({ error: 'Failed to fetch rural activity' }, { status: 500 })
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

    const { data: existingActivity } = await db
      .from('rural_activity')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (existingActivity) {
      await db
        .from('rural_activity')
        .update(body)
        .eq('user_id', userId)
    } else {
      await db
        .from('rural_activity')
        .insert({ user_id: userId, ...body })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating rural activity:', error)
    return NextResponse.json({ error: 'Failed to update rural activity' }, { status: 500 })
  }
}
