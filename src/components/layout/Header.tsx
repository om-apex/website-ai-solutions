'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { House, Lightbulb, Mail, Menu, NotebookPen, Sparkles, X } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { useEffect, useState } from 'react'

const navLinks = [
  { href: '/#home', label: 'Home', hash: 'home', icon: House },
  { href: '/#about', label: 'About', hash: 'about', icon: Lightbulb },
  { href: '/blog', label: 'Insights', icon: NotebookPen },
  { href: '/#contact', label: 'Contact', hash: 'contact', icon: Mail },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeHash, setActiveHash] = useState('home')

  useEffect(() => {
    if (pathname !== '/') {
      return
    }

    const syncHash = () => {
      const raw = window.location.hash.replace('#', '')
      setActiveHash(raw || 'home')
    }

    syncHash()
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [pathname])

  const isActiveLink = (href: string, hash?: string) => {
    if (hash) {
      return pathname === '/' && activeHash === hash
    }

    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#d1dfef]/80 bg-[linear-gradient(180deg,rgba(249,252,255,0.94)_0%,rgba(240,247,255,0.84)_100%)] backdrop-blur-xl supports-[backdrop-filter]:bg-[rgba(244,249,255,0.78)]">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Logo size="2xl" showText />
          </Link>

          <nav className="hidden items-center space-x-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-brand-primary ${
                  isActiveLink(link.href, link.hash)
                    ? 'text-brand-primary'
                    : 'text-slate-600'
                }`}
              >
                <link.icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            ))}
            <a
              href="https://aiquorum.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-brand-primary"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI Quorum
            </a>
            <Button asChild className="bg-brand-primary hover:bg-brand-primary-dark">
              <Link href="/ai-readiness-survey" className="inline-flex items-center gap-1.5">
                <NotebookPen className="h-3.5 w-3.5" />
                AI Readiness Survey
              </Link>
            </Button>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-slate-200 py-4 md:hidden">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-brand-primary ${
                    isActiveLink(link.href, link.hash)
                      ? 'text-brand-primary'
                      : 'text-slate-600'
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
              <a
                href="https://aiquorum.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-brand-primary"
              >
                <Sparkles className="h-4 w-4" />
                AI Quorum
              </a>
              <Button asChild className="w-full bg-brand-primary hover:bg-brand-primary-dark">
                <Link href="/ai-readiness-survey" className="inline-flex items-center justify-center gap-2">
                  <NotebookPen className="h-4 w-4" />
                  AI Readiness Survey
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
