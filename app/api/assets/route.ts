import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const db = getDb()
    
    const { data: assets, error } = await db
      .from('assets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ assets: assets || [] })
  } catch (error) {
    console.error('[v0] Error fetching assets:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar bens' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { type, description, acquisition_date, value } = body

    const db = getDb()
    
    const { data: asset, error } = await db
      .from('assets')
      .insert({
        user_id: userId,
        type,
        description,
        acquisition_date,
        value,
        status: 'active'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ asset })
  } catch (error) {
    console.error('[v0] Error creating asset:', error)
    return NextResponse.json(
      { error: 'Erro ao criar bem' },
      { status: 500 }
    )
  }
}
