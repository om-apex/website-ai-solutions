'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { startCommentOAuth } from '@/lib/comments/auth'
import { fetchCommenterSession } from '@/lib/comments/session'
import type { CommentAuthProvider, CommenterIdentity, CommenterProfile, CommenterSessionPayload } from '@/lib/comments/types'

interface CommentAuthContextType {
  loading: boolean
  authenticated: boolean
  user: CommenterIdentity | null
  profile: CommenterProfile | null
  signInWithGoogle: () => Promise<void>
  signInWithLinkedIn: () => Promise<void>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const defaultValue: CommentAuthContextType = {
  loading: true,
  authenticated: false,
  user: null,
  profile: null,
  signInWithGoogle: async () => {},
  signInWithLinkedIn: async () => {},
  signOut: async () => {},
  refreshSession: async () => {},
}

const CommentAuthContext = createContext<CommentAuthContextType>(defaultValue)

export function CommentAuthProvider({ children }: { children: ReactNode }) {
  const supabaseRef = useRef<SupabaseClient | null>(null)
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState<CommenterIdentity | null>(null)
  const [profile, setProfile] = useState<CommenterProfile | null>(null)

  if (typeof window !== 'undefined' && !supabaseRef.current) {
    supabaseRef.current = createClient()
  }

  const hydrate = useCallback(async () => {
    try {
      const payload: CommenterSessionPayload = await fetchCommenterSession()
      setAuthenticated(payload.authenticated)
      setUser(payload.user)
      setProfile(payload.profile)
    } catch {
      setAuthenticated(false)
      setUser(null)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const supabase = supabaseRef.current
    if (!supabase) return

    let subscription: { unsubscribe: () => void } | null = null

    void hydrate()

    try {
      const { data } = supabase.auth.onAuthStateChange(() => {
        void hydrate()
      })
      subscription = data.subscription
    } catch {
      // Hydration still works through the session endpoint.
    }

    return () => {
      subscription?.unsubscribe()
    }
  }, [hydrate])

  const startOAuth = useCallback(async (provider: CommentAuthProvider) => {
    const supabase = supabaseRef.current
    if (!supabase || typeof window === 'undefined') return
    await startCommentOAuth(supabase, provider, window.location.href)
  }, [])

  const signOut = useCallback(async () => {
    const supabase = supabaseRef.current
    if (!supabase) return
    await supabase.auth.signOut()
    await hydrate()
  }, [hydrate])

  const value = useMemo<CommentAuthContextType>(() => ({
    loading,
    authenticated,
    user,
    profile,
    signInWithGoogle: async () => {
      await startOAuth('google')
    },
    signInWithLinkedIn: async () => {
      await startOAuth('linkedin')
    },
    signOut,
    refreshSession: hydrate,
  }), [authenticated, hydrate, loading, profile, signOut, startOAuth, user])

  return (
    <CommentAuthContext.Provider value={value}>
      {children}
    </CommentAuthContext.Provider>
  )
}

export function useCommentAuth() {
  return useContext(CommentAuthContext)
}
