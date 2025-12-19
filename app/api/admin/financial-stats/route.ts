import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Count declarations
    const { count: declarationsCount } = await supabase
      .from('declarations')
      .select('*', { count: 'exact', head: true })

    // Count users
    const { count: usersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    // Calculate revenue (assuming R$ 150 per declaration)
    const totalRevenue = (declarationsCount || 0) * 150
    const avgTicket = declarationsCount ? totalRevenue / declarationsCount : 0

    return NextResponse.json({
      totalDeclarations: declarationsCount || 0,
      totalRevenue,
      avgTicket,
      totalUsers: usersCount || 0,
    })
  } catch (error: any) {
    console.error('[v0] Server error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
