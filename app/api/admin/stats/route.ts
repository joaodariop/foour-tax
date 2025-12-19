import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get total users count
    const { count: usersCount, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    if (usersError) throw usersError

    // Get total products count
    const { count: productsCount, error: productsError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    if (productsError) throw productsError

    // Get total declarations count
    const { count: declarationsCount, error: declarationsError } = await supabase
      .from('declarations')
      .select('*', { count: 'exact', head: true })

    if (declarationsError) throw declarationsError

    const { count: inconsistenciesCount, error: inconsistenciesError } = await supabase
      .from('inconsistencies')
      .select('*', { count: 'exact', head: true })
      .neq('status', 'resolved')

    if (inconsistenciesError) throw inconsistenciesError

    const { count: completedCount, error: completedError } = await supabase
      .from('declarations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')

    if (completedError) throw completedError

    const { data: purchases, error: purchasesError } = await supabase
      .from('declaration_purchases')
      .select('amount')
      .eq('status', 'completed')

    if (purchasesError) throw purchasesError

    const totalRevenue = purchases?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0

    return NextResponse.json({
      users: usersCount || 0,
      products: productsCount || 0,
      declarations: declarationsCount || 0,
      inconsistencies: inconsistenciesCount || 0,
      revenue: totalRevenue,
      completedDeclarations: completedCount || 0
    })
  } catch (error) {
    console.error('[v0] Admin stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    )
  }
}
