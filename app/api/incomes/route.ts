import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const db = getDb()
    
    const { data: incomes, error } = await db
      .from('incomes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ incomes: incomes || [] })
  } catch (error) {
    console.error('[v0] Error fetching incomes:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar rendimentos' },
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
    const { source, type, amount, reference_date } = body

    const db = getDb()
    
    const { data: income, error } = await db
      .from('incomes')
      .insert({
        user_id: userId,
        source,
        type,
        amount,
        reference_date
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ income })
  } catch (error) {
    console.error('[v0] Error creating income:', error)
    return NextResponse.json(
      { error: 'Erro ao criar rendimento' },
      { status: 500 }
    )
  }
}
