import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 })
    }

    const db = getDb()
    await db
      .from('domestic_employees')
      .delete()
      .eq('id', params.id)
      .eq('user_id', userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting domestic employee:', error)
    return NextResponse.json({ error: 'Failed to delete domestic employee' }, { status: 500 })
  }
}
