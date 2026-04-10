'use client'

import Link from 'next/link'

interface FooterProps {
  content?: Record<string, string>
}

function formatPhone(raw: string): string {
  const digits = raw.replace(/[^\d]/g, '')
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  return raw
}

export function Footer({ content = {} }: FooterProps) {
  const email = content['ai_global_contact_email'] || 'info@omaisolutions.com'
  const phone = content['ai_global_contact_phone'] || ''
  const rawLocation = content['ai_global_contact_location']?.trim() || ''
  const location = !rawLocation || /atlanta/i.test(rawLocation) ? 'Roswell, GA' : rawLocation

  return (
    <footer className="sticky bottom-0 z-40 shrink-0 border-t border-slate-200 bg-white">
      <div className="container mx-auto px-4 py-3">
        <div className="grid gap-2 text-[11px] text-slate-500 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-4">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 md:flex-nowrap md:justify-self-start">
            <span className="font-semibold uppercase tracking-[0.22em] text-brand-primary">Om AI Solutions</span>
            <span>{location}</span>
            <a href={`mailto:${email}`} className="transition-colors hover:text-brand-primary">
              {email}
            </a>
            {phone && <span>{formatPhone(phone)}</span>}
          </div>

          <div className="flex items-center justify-center gap-3 text-slate-400">
            <Link href="/privacy-policy" className="transition-colors hover:text-brand-primary">
              Privacy Policy
            </Link>
            <span aria-hidden="true">•</span>
            <Link href="/terms-of-service" className="transition-colors hover:text-brand-primary">
              Terms of Service
            </Link>
          </div>

          <span className="shrink-0 whitespace-nowrap text-slate-400 md:justify-self-end">
            A subsidiary of &copy; {new Date().getFullYear()} Om Apex Holdings LLC
          </span>
        </div>
      </div>
    </footer>
  )
}
