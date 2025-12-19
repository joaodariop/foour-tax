import { NextRequest, NextResponse } from 'next/server'
import { getDbClient } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log('[v0] Admin login attempt:', email)

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    const supabase = getDbClient()

    const { data: admins, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)

    console.log('[v0] Query result:', { admins, error })

    if (error) {
      console.error('[v0] Database error:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar administrador' },
        { status: 500 }
      )
    }

    if (!admins || admins.length === 0) {
      console.log('[v0] Admin not found for email:', email)
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    const admin = admins[0]

    const isValidPassword = password === admin.password_hash

    console.log('[v0] Password comparison:', { 
      provided: password, 
      stored: admin.password_hash, 
      match: isValidPassword 
    })

    if (!isValidPassword) {
      console.log('[v0] Invalid password for admin:', email)
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    const token = `admin_${admin.id}_${Date.now()}`

    await supabase
      .from('admins')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', admin.id)

    console.log('[v0] Admin login successful:', admin.email)

    return NextResponse.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role
      }
    })
  } catch (error: any) {
    console.error('[v0] Admin login error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
