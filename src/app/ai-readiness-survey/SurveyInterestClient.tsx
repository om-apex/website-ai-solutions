'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

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
    <div>
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-primary/20 text-brand-primary text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-primary mr-2" />
              Coming Soon
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              AI Readiness Survey
            </h1>
            <p className="text-lg text-gray-300 mb-10 leading-relaxed">
              We&apos;re building a comprehensive AI readiness assessment to help you understand
              where your organization stands and where to begin your AI journey. Leave your
              email below and we&apos;ll notify you as soon as it&apos;s ready.
            </p>

            {status === 'success' ? (
              <div className="bg-brand-primary/20 border border-brand-primary/30 rounded-xl p-6">
                <p className="text-lg font-medium text-brand-primary">
                  Thank you! We&apos;ll reach out when the survey is ready.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={status === 'loading'}
                  className="bg-brand-primary hover:bg-brand-primary-dark text-white px-8"
                >
                  {status === 'loading' ? 'Submitting...' : 'Notify Me'}
                </Button>
              </form>
            )}

            {status === 'error' && (
              <p className="mt-4 text-sm text-red-400">{errorMessage}</p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
