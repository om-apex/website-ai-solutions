'use client'

import {
  Mail,
  MapPin,
  Phone,
} from 'lucide-react'

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
  const location = content['ai_global_contact_location'] || 'Atlanta, Georgia'
  const copyright = content['ai_global_copyright'] || 'Om AI Solutions LLC. All rights reserved.'

  return (
    <footer className="sticky bottom-0 z-40 shrink-0 border-t border-[#c8d8e9]/90 bg-[linear-gradient(135deg,rgba(237,244,251,0.96)_0%,rgba(222,235,247,0.96)_54%,rgba(212,228,243,0.96)_100%)] backdrop-blur-xl supports-[backdrop-filter]:bg-[rgba(229,240,249,0.88)]">
      <div className="container mx-auto px-4 py-2.5">
        <div className="flex flex-col gap-1 text-[11px] text-slate-600">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <span className="text-slate-500">
              &copy; {new Date().getFullYear()} {copyright}
            </span>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-brand-primary" />
                {location}
              </span>
              <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 transition-colors hover:text-brand-primary">
                <Mail className="h-3.5 w-3.5 text-brand-primary" />
                {email}
              </a>
              {phone && (
                <a href={`tel:${phone}`} className="inline-flex items-center gap-1.5 transition-colors hover:text-brand-primary">
                  <Phone className="h-3.5 w-3.5 text-brand-primary" />
                  {formatPhone(phone)}
                </a>
              )}
            </div>
          </div>

          <span className="text-slate-500">
            A subsidiary of Om Apex Holdings LLC
          </span>
        </div>
      </div>
    </footer>
  )
}
