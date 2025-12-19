import { NextRequest, NextResponse } from 'next/server'
import { getDbClient } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    const supabase = getDbClient()
    
    // Verificar se usuário já existe
    const { data: existing, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .limit(1)
    
    if (checkError) {
      console.error('[v0] Database check error:', checkError)
      return NextResponse.json(
        { error: 'Erro ao verificar email' },
        { status: 500 }
      )
    }
    
    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: 'Este email já está cadastrado' },
        { status: 400 }
      )
    }
    
    const { data: users, error: insertError } = await supabase
      .from('users')
      .insert({
        email,
        password,
        full_name: fullName || null
      })
      .select('id, email, full_name')
    
    if (insertError) {
      console.error('[v0] Database insert error:', insertError)
      return NextResponse.json(
        { error: 'Erro ao criar usuário' },
        { status: 500 }
      )
    }
    
    const user = users?.[0]
    
    if (user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          email: email
        })
      
      if (profileError) {
        console.error('[v0] Profile creation error:', profileError)
      }
    }
    
    return NextResponse.json({ user })
  } catch (error: any) {
    console.error('[v0] Signup error:', error)
    return NextResponse.json(
      { error: 'Erro ao criar conta: ' + error.message },
      { status: 500 }
    )
  }
}
