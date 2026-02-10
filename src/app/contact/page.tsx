import { Metadata } from 'next'
import { getSiteContent } from '@/lib/content-fetcher'
import { DEFAULT_CONTENT } from '@/lib/content'
import { ContactPageClient } from '@/components/pages/ContactPageClient'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Om AI Solutions. Request a demo or learn more about our AI-powered supply chain software.',
}

export default async function ContactPage() {
  const dbContent = await getSiteContent('ai')
  const defaults: Record<string, string> = {}
  for (const [key, val] of Object.entries(DEFAULT_CONTENT)) {
    defaults[key] = val.value
  }
  const content = { ...defaults, ...dbContent }
  return <ContactPageClient initialContent={content} />
}
