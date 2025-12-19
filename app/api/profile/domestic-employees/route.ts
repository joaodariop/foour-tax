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
      .from('domestic_employees')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    return NextResponse.json({ employees: data || [] })
  } catch (error) {
    console.error('Error fetching domestic employees:', error)
    return NextResponse.json({ error: 'Failed to fetch domestic employees' }, { status: 500 })
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

    const { data } = await db
      .from('domestic_employees')
      .insert({ user_id: userId, ...body })
      .select()
      .single()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating domestic employee:', error)
    return NextResponse.json({ error: 'Failed to create domestic employee' }, { status: 500 })
  }
}
