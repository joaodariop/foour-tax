import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const db = getDb()
    
    const { data: debts, error } = await db
      .from('debts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ debts: debts || [] })
  } catch (error) {
    console.error('[v0] Error fetching debts:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar dívidas' },
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
    const { type, creditor, amount, due_date } = body

    const db = getDb()
    
    const { data: debt, error } = await db
      .from('debts')
      .insert({
        user_id: userId,
        type,
        creditor,
        amount,
        due_date,
        status: 'active'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ debt })
  } catch (error) {
    console.error('[v0] Error creating debt:', error)
    return NextResponse.json(
      { error: 'Erro ao criar dívida' },
      { status: 500 }
    )
  }
}
