import { Metadata } from 'next'
import { NewsletterClient } from './NewsletterClient'

export const metadata: Metadata = {
  title: 'Newsletter — Om AI Solutions',
  description: 'Subscribe to the Om AI Solutions newsletter for insights on AI adoption, implementation strategies, and industry innovations.',
}

export default function NewsletterPage() {
  return <NewsletterClient />
}
