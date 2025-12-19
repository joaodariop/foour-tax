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
      .from('fiscal_info')
      .select('*')
      .eq('user_id', userId)
      .single()

    return NextResponse.json(data || {})
  } catch (error) {
    console.error('Error fetching fiscal info:', error)
    return NextResponse.json({ error: 'Failed to fetch fiscal info' }, { status: 500 })
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

    const { data: existingInfo } = await db
      .from('fiscal_info')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (existingInfo) {
      await db
        .from('fiscal_info')
        .update(body)
        .eq('user_id', userId)
    } else {
      await db
        .from('fiscal_info')
        .insert({ user_id: userId, ...body })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating fiscal info:', error)
    return NextResponse.json({ error: 'Failed to update fiscal info' }, { status: 500 })
  }
}
