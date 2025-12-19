import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Get client profile rules from settings
    const { data: settingsData, error: settingsError } = await supabase
      .from('system_settings')
      .select('setting_value')
      .eq('setting_key', 'client_profile_rules')
      .single()
    
    if (settingsError) throw settingsError
    
    const rules = settingsData.setting_value as any
    const threshold = rules.autonomous_threshold

    // Get user's assets
    const { data: assets, error: assetsError } = await supabase
      .from('assets')
      .select('value')
      .eq('user_id', userId)
    
    if (assetsError) throw assetsError

    // Get user's debts
    const { data: debts, error: debtsError } = await supabase
      .from('debts')
      .select('*')
      .eq('user_id', userId)
    
    if (debtsError) throw debtsError

    // Get user's incomes
    const { data: incomes, error: incomesError } = await supabase
      .from('incomes')
      .select('*')
      .eq('user_id', userId)
    
    if (incomesError) throw incomesError

    // Calculate totals
    const assetCount = assets?.length || 0
    const totalAssetValue = assets?.reduce((sum, a) => sum + parseFloat(a.value || 0), 0) || 0
    const debtCount = debts?.length || 0
    const incomeCount = incomes?.length || 0

    // Determine profile
    const isAutonomous = 
      assetCount <= threshold.max_assets &&
      totalAssetValue <= threshold.max_total_value &&
      debtCount <= threshold.max_debts &&
      incomeCount <= threshold.max_incomes

    const classification = {
      profile: isAutonomous ? 'autonomous' : 'inconsistency',
      metrics: {
        assetCount,
        totalAssetValue,
        debtCount,
        incomeCount
      },
      thresholds: threshold,
      requiresManualReview: !isAutonomous
    }

    // If not autonomous, create an inconsistency record
    if (!isAutonomous) {
      const body = await request.json()
      const declarationId = body.declaration_id

      if (declarationId) {
        await supabase
          .from('inconsistencies')
          .insert({
            user_id: userId,
            declaration_id: declarationId,
            type: 'profile_complexity',
            description: `Cliente excede limites para processamento autônomo: ${assetCount} bens (limite: ${threshold.max_assets}), valor total R$ ${totalAssetValue.toFixed(2)} (limite: R$ ${threshold.max_total_value})`,
            severity: 'medium',
            status: 'pending'
          })
      }
    }

    return NextResponse.json(classification)
  } catch (error: any) {
    console.error('[v0] Classification error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
