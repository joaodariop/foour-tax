import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = request.headers.get('x-user-id')

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data: attachments, error } = await supabase
      .from('bank_account_attachments')
      .select('*')
      .eq('user_id', userId)
      .eq('bank_account_id', params.id)
      .order('uploaded_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ attachments: attachments || [] })
  } catch (error) {
    console.error('[v0] Error fetching attachments:', error)
    return NextResponse.json({ error: 'Failed to fetch attachments' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = request.headers.get('x-user-id')

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const referenceYear = formData.get('reference_year') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // In a real app, upload to Vercel Blob or similar
    // For now, simulate with a fake URL
    const fakeUrl = `https://storage.foour.app/declarations/${userId}/${file.name}`

    const { data, error } = await supabase
      .from('bank_account_attachments')
      .insert({
        user_id: userId,
        bank_account_id: params.id,
        file_name: file.name,
        file_url: fakeUrl,
        file_size: file.size,
        file_type: file.type,
        reference_year: parseInt(referenceYear),
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ attachment: data })
  } catch (error) {
    console.error('[v0] Error uploading attachment:', error)
    return NextResponse.json({ error: 'Failed to upload attachment' }, { status: 500 })
  }
}
