import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: declarations, error } = await supabase
      .from('declarations')
      .select(`
        *,
        user:users(full_name, email)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] Error fetching declarations:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(declarations)
  } catch (error: any) {
    console.error('[v0] Server error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
