import { createClient } from '@/lib/supabase/server'
import { getCommentProvider, getCurrentCommenterProfile, mapCommenterIdentity, upsertCommenterProfile } from '@/lib/comments/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const { data: { user } } = await supabase.auth.getUser()

  if (!session || !user) {
    return NextResponse.json({
      authenticated: false,
      user: null,
      profile: null,
    })
  }

  const currentProvider = getCommentProvider(user)
  const existingProfile = await getCurrentCommenterProfile(supabase, user.id)
  const profile = currentProvider && existingProfile?.lastSignInProvider !== currentProvider
    ? await upsertCommenterProfile(supabase, user)
    : existingProfile
  const identity = mapCommenterIdentity(user, profile)

  return NextResponse.json({
    authenticated: true,
    user: identity,
    profile,
  }, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}
