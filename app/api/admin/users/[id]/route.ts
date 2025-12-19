import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Fetch user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', params.id)
      .single()

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 404 })
    }

    // Fetch all related data
    const [profile, spouse, dependents, declarations, assets, debts, incomes] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', params.id).maybeSingle(),
      supabase.from('spouses').select('*').eq('user_id', params.id).maybeSingle(),
      supabase.from('dependents').select('*').eq('user_id', params.id),
      supabase.from('declarations').select('*').eq('user_id', params.id).order('year', { ascending: false }),
      supabase.from('assets').select('*').eq('user_id', params.id),
      supabase.from('debts').select('*').eq('user_id', params.id),
      supabase.from('incomes').select('*').eq('user_id', params.id),
    ])

    return NextResponse.json({
      user,
      profile: profile.data,
      spouse: spouse.data,
      dependents: dependents.data || [],
      declarations: declarations.data || [],
      assets: assets.data || [],
      debts: debts.data || [],
      incomes: incomes.data || [],
    })
  } catch (error: any) {
    console.error('[v0] Server error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
