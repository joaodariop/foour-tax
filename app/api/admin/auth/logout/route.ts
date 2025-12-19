import { NextRequest, NextResponse } from 'next/server'
import { getDbClient } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: true })
    }

    const token = authHeader.substring(7)
    const supabase = getDbClient()

    // Deletar sessão
    await supabase
      .from('admin_sessions')
      .delete()
      .eq('token', token)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[v0] Admin logout error:', error)
    return NextResponse.json({ success: true })
  }
}
