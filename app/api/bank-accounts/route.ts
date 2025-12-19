import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id')

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data: accounts, error } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ accounts: accounts || [] })
  } catch (error) {
    console.error('[v0] Error fetching bank accounts:', error)
    return NextResponse.json({ error: 'Failed to fetch bank accounts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const userId = request.headers.get('x-user-id')

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { bank_name, bank_code, agency, account_number, account_type, ownership } = body

    const { data: account, error } = await supabase
      .from('bank_accounts')
      .insert({
        user_id: userId,
        bank_name,
        bank_code,
        agency,
        account_number,
        account_type,
        ownership,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ account }, { status: 201 })
  } catch (error) {
    console.error('[v0] Error creating bank account:', error)
    return NextResponse.json({ error: 'Failed to create bank account' }, { status: 500 })
  }
}
