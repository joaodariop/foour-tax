import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      )
    }

    const supabase = getDb()
    
    const [
      { count: assetsCount },
      { count: debtsCount },
      { count: incomesCount },
      assetsData,
      debtsData
    ] = await Promise.all([
      supabase.from('assets').select('*', { count: 'exact', head: true }).eq('user_id', userId).then(r => ({ count: r.count || 0 })),
      supabase.from('debts').select('*', { count: 'exact', head: true }).eq('user_id', userId).then(r => ({ count: r.count || 0 })),
      supabase.from('incomes').select('*', { count: 'exact', head: true }).eq('user_id', userId).then(r => ({ count: r.count || 0 })),
      supabase.from('assets').select('value').eq('user_id', userId),
      supabase.from('debts').select('value').eq('user_id', userId),
    ])

    // Calculate net worth
    const totalAssetsValue = assetsData.data?.reduce((sum, asset) => sum + (parseFloat(asset.value) || 0), 0) || 0
    const totalDebtsValue = debtsData.data?.reduce((sum, debt) => sum + (parseFloat(debt.value) || 0), 0) || 0
    const netWorth = totalAssetsValue - totalDebtsValue

    return NextResponse.json({
      totalAssets: assetsCount,
      totalDebts: debtsCount,
      totalIncomes: incomesCount,
      netWorth: Math.round(netWorth),
    })
  } catch (error) {
    console.error('[v0] Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
