'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

type FormType = 'general' | 'demo_request' | 'consultation_request'
type FormState = 'idle' | 'submitting' | 'success' | 'error'

interface ContactFormProps {
  formType?: FormType
  brand?: string
}

export function ContactForm({ formType = 'general', brand = 'om_ai_solutions' }: ContactFormProps) {
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMsg('Please enter a valid email address.')
      return
    }
    if (!formData.message.trim()) {
      setErrorMsg('Please enter a message.')
      return
    }

    setState('submitting')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          formType,
          metadata: { brand },
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Submission failed')
      }

      setState('success')
      setFormData({ firstname: '', lastname: '', email: '', company: '', phone: '', message: '' })
      setTimeout(() => setState('idle'), 5000)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="rounded-[1.2rem] border border-emerald-200 bg-emerald-50 p-8 text-center">
        <h3 className="mb-2 text-xl font-semibold text-emerald-800">Message Sent</h3>
        <p className="text-green-700">
          Thank you for reaching out. We&apos;ll get back to you shortly.
        </p>
      </div>
    )
  }

  const messageLabel =
    formType === 'demo_request'
      ? 'What are you looking to solve?'
      : formType === 'consultation_request'
        ? 'Describe your warehouse/logistics challenge'
        : 'Message'

  return (
    <form onSubmit={handleSubmit} className="grid h-full min-h-0 grid-rows-[auto_auto_auto_minmax(0,1fr)_auto] gap-1.5">
      <div className="grid gap-1.5 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="firstname" className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            First Name
          </Label>
          <Input
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            placeholder="John"
            className="h-8 rounded-xl border-[#d7e3f0] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="lastname" className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Last Name
          </Label>
          <Input
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            placeholder="Doe"
            className="h-8 rounded-xl border-[#d7e3f0] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="email" className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="john@example.com"
          className="h-8 rounded-xl border-[#d7e3f0] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
        />
      </div>

      <div className="grid gap-1.5 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="company" className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Company
          </Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Acme Corp"
            className="h-8 rounded-xl border-[#d7e3f0] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="phone" className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Phone
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(555) 123-4567"
            className="h-8 rounded-xl border-[#d7e3f0] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-col space-y-1">
        <Label htmlFor="message" className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {messageLabel} <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={4}
          value={formData.message}
          onChange={handleChange}
          placeholder={
            formType === 'demo_request'
              ? 'Tell us about your business challenges and what you hope to achieve...'
              : 'How can we help you?'
          }
          className="min-h-[84px] flex-1 rounded-[1.1rem] border-[#d7e3f0] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
        />
      </div>

      {(errorMsg || state === 'error') && (
        <p className="text-sm text-red-600">
          {errorMsg || 'Something went wrong. Please try again.'}
        </p>
      )}

      <Button
        type="submit"
        disabled={state === 'submitting'}
        className="mt-1 w-full self-end rounded-full border border-[#c7d6e6] bg-[linear-gradient(180deg,#2f6299_0%,#234d7a_50%,#1b3d60_100%)] px-8 text-white shadow-[0_16px_30px_rgba(35,77,122,0.24)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_36px_rgba(35,77,122,0.28)]"
        size="default"
      >
        {state === 'submitting'
          ? 'Sending...'
          : formType === 'demo_request'
            ? 'Request Demo'
            : 'Send Message'}
      </Button>
    </form>
  )
}
