import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('is_global', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] Error fetching notifications:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(notifications)
  } catch (error: any) {
    console.error('[v0] Server error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        title: body.title,
        message: body.message,
        type: body.type,
        is_global: body.is_global,
        is_read: false,
      })
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating notification:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(notification)
  } catch (error: any) {
    console.error('[v0] Server error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
