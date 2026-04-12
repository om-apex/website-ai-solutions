import { createClient } from '@/lib/supabase/server'
import { getSafeCommentRedirectTarget } from '@/lib/comments/auth'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirect = searchParams.get('redirect')
  const safeRedirectTarget = getSafeCommentRedirectTarget(redirect, origin)
  const safeErrorTarget = (() => {
    try {
      return new URL(safeRedirectTarget).origin
    } catch {
      return origin
    }
  })()

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(safeRedirectTarget)
    }
  }

  return NextResponse.redirect(`${safeErrorTarget}/?error=auth_failed`)
}

