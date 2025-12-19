import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    
    if (!token.startsWith('admin_')) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    const parts = token.split('_')
    if (parts.length < 3) {
      return NextResponse.json(
        { error: 'Formato de token inválido' },
        { status: 401 }
      )
    }

    const adminId = parts[1]
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Configuração do banco de dados inválida' },
        { status: 500 }
      )
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    })

    const { data: admins, error } = await supabase
      .from('admins')
      .select('*')
      .eq('id', adminId)
      .eq('is_active', true)

    if (error || !admins || admins.length === 0) {
      return NextResponse.json(
        { error: 'Admin não encontrado ou inativo' },
        { status: 401 }
      )
    }

    const admin = admins[0]

    return NextResponse.json({
      admin: {
        id: admin.id,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role
      }
    })
  } catch (error: any) {
    console.error('[v0] Admin verify error:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar sessão' },
      { status: 500 }
    )
  }
}
