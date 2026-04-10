'use client'

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
        <div className="flex flex-col gap-2 text-[11px] text-slate-500 md:flex-row md:items-center md:justify-between md:gap-4">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 md:flex-nowrap">
            <span className="font-semibold uppercase tracking-[0.22em] text-brand-primary">Om AI Solutions</span>
            <span>{location}</span>
            <a href={`mailto:${email}`} className="transition-colors hover:text-brand-primary">
              {email}
            </a>
            {phone && <span>{formatPhone(phone)}</span>}
          </div>

          <span className="shrink-0 whitespace-nowrap text-slate-400">
            A subsidiary of &copy; {new Date().getFullYear()} Om Apex Holdings LLC
          </span>
        </div>
      </div>
    </footer>
  )
}
