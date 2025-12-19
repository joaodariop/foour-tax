import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 })
    }

    const db = getDb()

    const { data: user } = await db
      .from('users')
      .select('id, email, full_name')
      .eq('id', userId)
      .maybeSingle()

    const { data: profile } = await db
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (!profile && user) {
      const { data: newProfile } = await db
        .from('profiles')
        .insert({ 
          user_id: userId, 
          email: user.email 
        })
        .select()
        .single()
      
      return NextResponse.json({
        ...newProfile,
        full_name: user.full_name,
        email: user.email
      })
    }

    // Merge user and profile data
    const combined = {
      ...(profile || {}),
      full_name: user?.full_name,
      email: user?.email,
      user_id: userId
    }

    return NextResponse.json(combined)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 })
    }

    const body = await request.json()
    const { full_name, email, ...profileData } = body

    const db = getDb()

    if (full_name || email) {
      const userUpdates: any = {}
      if (full_name) userUpdates.full_name = full_name
      if (email) userUpdates.email = email

      await db
        .from('users')
        .update(userUpdates)
        .eq('id', userId)
    }

    const { data: existingProfile } = await db
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (existingProfile) {
      await db
        .from('profiles')
        .update(profileData)
        .eq('user_id', userId)
    } else {
      await db
        .from('profiles')
        .insert({ user_id: userId, ...profileData })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
