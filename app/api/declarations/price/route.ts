import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const { data, error } = await supabase
      .from('system_settings')
      .select('setting_value')
      .eq('setting_key', 'declaration_price')
      .single()
    
    if (error) throw error
    
    return NextResponse.json(data.setting_value || { amount: 149.90, currency: 'BRL' })
  } catch (error: any) {
    return NextResponse.json({ amount: 149.90, currency: 'BRL' })
  }
}
