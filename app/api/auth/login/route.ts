import { NextRequest, NextResponse } from 'next/server'
import { getDbClient } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    const supabase = getDbClient()
    
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, password')
      .eq('email', email)
      .limit(1)
    
    if (error) {
      console.error('[v0] Database error:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar usuário' },
        { status: 500 }
      )
    }
    
    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 401 }
      )
    }
    
    const user = users[0]
    
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Senha incorreta' },
        { status: 401 }
      )
    }
    
    // Retorna usuário sem a senha
    const { password: _, ...userWithoutPassword } = user
    
    return NextResponse.json({ user: userWithoutPassword })
  } catch (error: any) {
    console.error('[v0] Login error:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer login: ' + error.message },
      { status: 500 }
    )
  }
}
