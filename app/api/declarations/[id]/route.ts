import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = request.headers.get('x-user-id')
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const db = getDb()
    
    const { data, error } = await db
      .from('declarations')
      .update({
        year: body.year,
        status: body.status,
        declaration_type: body.declaration_type,
        total_income: body.total_income,
        total_deductions: body.total_deductions,
        tax_due: body.tax_due,
        submission_date: body.submission_date,
        receipt_number: body.receipt_number,
        notes: body.notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Error updating declaration:', error)
    return NextResponse.json(
      { error: 'Failed to update declaration' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = request.headers.get('x-user-id')
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const db = getDb()
    
    const { error } = await db
      .from('declarations')
      .delete()
      .eq('id', params.id)
      .eq('user_id', userId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Error deleting declaration:', error)
    return NextResponse.json(
      { error: 'Failed to delete declaration' },
      { status: 500 }
    )
  }
}
