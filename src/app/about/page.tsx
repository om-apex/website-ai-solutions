import { Metadata } from 'next'
import { getSiteContent } from '@/lib/content-fetcher'
import { DEFAULT_CONTENT } from '@/lib/content'
import { AboutPageClient } from '@/components/pages/AboutPageClient'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Om AI Solutions, our mission, and the team building AI-powered supply chain software.',
}

export default async function AboutPage() {
  const dbContent = await getSiteContent('ai')
  const defaults: Record<string, string> = {}
  for (const [key, val] of Object.entries(DEFAULT_CONTENT)) {
    defaults[key] = val.value
  }
  const content = { ...defaults, ...dbContent }
  return <AboutPageClient initialContent={content} />
}
