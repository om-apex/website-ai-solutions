import { createClient } from '@/lib/supabase/server'
import {
  getCurrentCommenterProfile,
  updateCommenterProfile,
} from '@/lib/comments/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { authenticated: false, profile: null },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )
  }

  try {
    const profile = await getCurrentCommenterProfile(supabase, user.id)
    return NextResponse.json(
      { authenticated: true, profile },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load profile' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const payload = {
    displayName: typeof body.displayName === 'string' ? body.displayName : undefined,
    avatarUrl: typeof body.avatarUrl === 'string' || body.avatarUrl === null ? body.avatarUrl : undefined,
    lastSignInProvider: typeof body.lastSignInProvider === 'string' ? body.lastSignInProvider : undefined,
  }

  if (
    typeof payload.displayName === 'undefined' &&
    typeof payload.avatarUrl === 'undefined' &&
    typeof payload.lastSignInProvider === 'undefined'
  ) {
    return NextResponse.json({ error: 'No profile changes provided' }, { status: 400 })
  }

  const profile = await updateCommenterProfile(supabase, user.id, payload)
  return NextResponse.json({ authenticated: true, profile })
}
