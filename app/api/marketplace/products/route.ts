import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    
    const db = getDb()
    
    let query = db
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (limit) {
      query = query.limit(limit)
    }
    
    const { data: products, error } = await query
    
    if (error) {
      console.error('[v0] Database error loading products:', error)
      return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 })
    }
    
    return NextResponse.json(products || [])
  } catch (error) {
    console.error('[v0] Error in marketplace products API:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
