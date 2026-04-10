'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { createClient } from '@supabase/supabase-js'
import { DEFAULT_CONTENT } from '@/lib/content'

interface ContentContextType {
  content: Record<string, string>
  updateContent: (key: string, value: string) => Promise<boolean>
  getContent: (key: string, fallback?: string) => string
}

const ContentContext = createContext<ContentContextType>({
  content: {},
  updateContent: async () => false,
  getContent: () => '',
})

interface ContentProviderProps {
  children: ReactNode
  initialContent: Record<string, string>
}

export function ContentProvider({ children, initialContent }: ContentProviderProps) {
  const [content, setContent] = useState<Record<string, string>>(initialContent)

  const updateContent = useCallback(async (key: string, value: string): Promise<boolean> => {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const entry = DEFAULT_CONTENT[key]
      const now = new Date().toISOString()
      const payload = {
        content_key: key,
        site: 'ai',
        page: entry?.page || 'global',
        section: entry?.section || 'general',
        content_type: entry?.content_type || 'text',
        value,
        default_value: entry?.value || value,
        updated_at: now,
        updated_by: 'inline-edit',
      }

      const { error } = await supabase
        .from('site_content')
        .upsert(payload, { onConflict: 'content_key' })

      if (error) {
        console.error('Failed to update content:', error)
        return false
      }

      setContent(prev => ({ ...prev, [key]: value }))
      return true
    } catch (error) {
      console.error('Error updating content:', error)
      return false
    }
  }, [])

  const getContent = useCallback((key: string, fallback: string = ''): string => {
    return content[key] || fallback
  }, [content])

  return (
    <ContentContext.Provider value={{ content, updateContent, getContent }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  return useContext(ContentContext)
}
