import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .in('setting_key', ['declaration_price', 'client_profile_rules'])
    
    if (error) throw error
    
    const settings: any = {}
    data?.forEach(setting => {
      settings[setting.setting_key] = setting.setting_value
    })
    
    return NextResponse.json(settings)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Update declaration price
    if (body.declaration_price) {
      await supabase
        .from('system_settings')
        .upsert({
          setting_key: 'declaration_price',
          setting_value: body.declaration_price,
          updated_at: new Date().toISOString()
        })
    }
    
    // Update client profile rules
    if (body.client_profile_rules) {
      await supabase
        .from('system_settings')
        .upsert({
          setting_key: 'client_profile_rules',
          setting_value: body.client_profile_rules,
          updated_at: new Date().toISOString()
        })
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
