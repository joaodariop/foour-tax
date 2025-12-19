import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: setting, error } = await supabase
      .from('system_settings')
      .select('setting_value')
      .eq('setting_key', 'declaration_price')
      .maybeSingle()

    if (error) {
      console.error('[v0] Error fetching price:', error)
      return NextResponse.json({ price: 199.90 }) // Default fallback
    }

    return NextResponse.json({ 
      price: setting?.setting_value || 199.90 
    })
  } catch (error) {
    console.error('[v0] Pricing API error:', error)
    return NextResponse.json({ price: 199.90 })
  }
}
