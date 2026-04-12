import { createClient } from '@/lib/supabase/server'
import { getCurrentCommenterProfile, mapCommenterIdentity } from '@/lib/comments/server'
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

  const profile = await getCurrentCommenterProfile(supabase, user.id)
  const identity = mapCommenterIdentity(user, profile)

  return NextResponse.json({
    authenticated: true,
    user: identity,
    profile,
  })
}
