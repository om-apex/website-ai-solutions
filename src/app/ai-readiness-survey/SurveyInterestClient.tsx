'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ClipboardCheck, Sparkles } from 'lucide-react'

export function SurveyInterestClient() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/survey-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMessage(data.error || 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }
      setStatus('success')
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.')
      setStatus('error')
    }
  }

  return (
    <main className="min-h-[calc(100svh-80px)] bg-[linear-gradient(135deg,#edf4fb_0%,#deebf7_54%,#d4e4f3_100%)]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(30,77,124,0.14),transparent_24%),radial-gradient(circle_at_84%_16%,rgba(111,148,186,0.18),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.42)_100%)]" />
        <div className="container relative mx-auto px-4 py-16 md:py-20">
          <div className="mx-auto max-w-4xl rounded-[2rem] border border-[#c4d6ea] bg-[linear-gradient(180deg,rgba(248,252,255,0.94)_0%,rgba(231,240,249,0.9)_100%)] p-8 text-center shadow-[0_18px_60px_rgba(15,23,42,0.06)] md:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#b9cae0] bg-[linear-gradient(180deg,rgba(219,231,244,0.96)_0%,rgba(203,220,239,0.9)_100%)] px-4 py-1.5 text-[11px] font-medium tracking-[0.02em] text-[#234d7a] shadow-sm">
              <ClipboardCheck className="h-3.5 w-3.5" />
              Coming Soon
            </div>
            <h1 className="mt-5 text-4xl font-bold text-slate-950 md:text-5xl">
              AI Readiness Survey
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              We&apos;re building a practical readiness assessment for leadership teams that want to understand where AI can create real operating value and where more groundwork is still needed.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand-primary">
              <Sparkles className="h-4 w-4" />
              A structured starting point for real adoption conversations
            </div>

            <div className="mx-auto mt-8 grid max-w-3xl gap-3 text-left md:grid-cols-3">
              <div className="rounded-[1.2rem] border border-[#d1dfef] bg-[linear-gradient(180deg,#ffffff_0%,#edf4fb_100%)] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-primary">Assess</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Gauge current AI awareness, operating discipline, and leadership readiness.</p>
              </div>
              <div className="rounded-[1.2rem] border border-[#d1dfef] bg-[linear-gradient(180deg,#ffffff_0%,#edf4fb_100%)] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-primary">Prioritize</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Identify where AI pilots make sense and where expectations should stay grounded.</p>
              </div>
              <div className="rounded-[1.2rem] border border-[#d1dfef] bg-[linear-gradient(180deg,#ffffff_0%,#edf4fb_100%)] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-primary">Plan</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Turn survey signal into a clearer next step for teams, tools, and operating workflows.</p>
              </div>
            </div>

            {status === 'success' ? (
              <div className="mx-auto mt-10 max-w-xl rounded-[1.3rem] border border-[#bfd2e7] bg-[linear-gradient(180deg,#eef5fb_0%,#dbe8f6_100%)] p-6 shadow-sm">
                <p className="text-lg font-medium text-brand-primary">
                  Thank you! We&apos;ll reach out when the survey is ready.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-12 flex-1 rounded-xl border border-[#d7e3f0] bg-white px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={status === 'loading'}
                  className="h-12 rounded-xl bg-brand-primary px-8 text-white hover:bg-brand-primary-dark"
                >
                  {status === 'loading' ? 'Submitting...' : 'Notify Me'}
                </Button>
              </form>
            )}

            {status === 'error' && (
              <p className="mt-4 text-sm text-red-500">{errorMessage}</p>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
