import { NextResponse } from 'next/server'
import { getDbClient } from '@/lib/db'

export async function POST() {
  try {
    const supabase = getDbClient()

    // Check if any admin exists
    const { data: existingAdmins, error: checkError } = await supabase
      .from('admins')
      .select('id')
      .limit(1)

    if (checkError) {
      console.error('[v0] Error checking admins:', checkError)
      return NextResponse.json(
        { error: 'Erro ao verificar administradores' },
        { status: 500 }
      )
    }

    if (existingAdmins && existingAdmins.length > 0) {
      return NextResponse.json(
        { message: 'Admin já existe no sistema' },
        { status: 200 }
      )
    }

    // Create default admin
    const { data: newAdmin, error: createError } = await supabase
      .from('admins')
      .insert({
        email: 'admin@foour.com.br',
        password_hash: 'Admin@123', // Simplified for demo
        full_name: 'Administrador',
        role: 'superadmin',
        is_active: true
      })
      .select()
      .single()

    if (createError) {
      console.error('[v0] Error creating admin:', createError)
      return NextResponse.json(
        { error: 'Erro ao criar administrador' },
        { status: 500 }
      )
    }

    console.log('[v0] Default admin created successfully')

    return NextResponse.json({
      message: 'Admin criado com sucesso',
      admin: {
        email: 'admin@foour.com.br',
        password: 'Admin@123'
      }
    })
  } catch (error: any) {
    console.error('[v0] Admin setup error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
