import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 })
    }

    const db = getDb()
    const { data, error } = await db
      .from('taxes_paid')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ taxes: data || [] })
  } catch (error) {
    console.error('Error fetching taxes paid:', error)
    return NextResponse.json({ error: 'Failed to fetch taxes paid' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 })
    }

    const body = await request.json()
    const db = getDb()

    const { data, error } = await db
      .from('taxes_paid')
      .insert({ user_id: userId, ...body })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating tax paid:', error)
    return NextResponse.json({ error: 'Failed to create tax paid' }, { status: 500 })
  }
}
