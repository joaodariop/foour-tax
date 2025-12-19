import { NextRequest, NextResponse } from 'next/server'
import { getDbClient } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json({ isAdmin: false })
    }

    const supabase = getDbClient()
    
    const { data: adminRoles, error } = await supabase
      .from('admin_roles')
      .select('role')
      .eq('user_id', userId)
      .limit(1)
    
    if (error) {
      console.error('[v0] Admin check error:', error)
      return NextResponse.json({ isAdmin: false })
    }
    
    return NextResponse.json({ 
      isAdmin: adminRoles && adminRoles.length > 0 
    })
  } catch (error: any) {
    console.error('[v0] Admin check error:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar permissões', isAdmin: false },
      { status: 500 }
    )
  }
}
