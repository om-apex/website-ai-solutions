'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import {
  Blocks,
  CheckCircle,
  NotebookPen,
  Sparkles,
  Users,
  Workflow,
} from 'lucide-react'

import { ContactForm } from '@/components/ContactForm'
import { EditableList, EditableStat, EditableText } from '@/components/content/EditableText'
import { ContentProvider } from '@/contexts/ContentContext'
import { useContent } from '@/contexts/ContentContext'
import { InteractiveImageAccordion } from '@/components/ui/interactive-image-accordion'
import { cn } from '@/lib/utils'

const shellSections = ['home', 'about', 'contact'] as const
type ShellSection = (typeof shellSections)[number]

function getHashSection(): ShellSection {
  if (typeof window === 'undefined') {
    return 'home'
  }

  const raw = window.location.hash.replace('#', '')
  return shellSections.includes(raw as ShellSection) ? (raw as ShellSection) : 'home'
}

function SectionBadge({
  contentKey,
  fallback,
  className,
}: {
  contentKey: string
  fallback: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'inline-flex max-w-full items-center gap-2 self-start rounded-full border border-[#b9cae0] bg-[linear-gradient(180deg,rgba(219,231,244,0.96)_0%,rgba(203,220,239,0.9)_100%)] px-3.5 py-1.5 text-[10px] font-medium tracking-[0.02em] text-[#234d7a] shadow-sm sm:px-4 sm:text-[11px]',
        className
      )}
    >
      <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[#234d7a]" />
      <EditableText contentKey={contentKey} as="span" className="min-w-0 break-words leading-tight" fallback={fallback} />
    </div>
  )
}

function HomePanel() {
  const { getContent } = useContent()

  const accordionItems = [
    {
      id: 'quorum',
      title: getContent('ai_home_shell_card_1_title', 'AI Quorum'),
      titleContentKey: 'ai_home_shell_card_1_title',
      description: getContent(
        'ai_home_shell_card_1_description',
        'Multi-model deliberation for decision makers who no longer trust a single AI answer.'
      ),
      descriptionContentKey: 'ai_home_shell_card_1_description',
      icon: Sparkles,
      iconImageSrc: '/images/ai-icon.png',
      iconImageClassName: 'object-contain p-1',
      badge: 'Flagship product',
      badgeContentKey: 'ai_home_shell_card_1_badge',
      accentClass: 'border border-[#d7e4f2] bg-[#edf4fb] text-[#234d7a]',
      panelClass: 'border-2 border-[#234d7a] bg-[linear-gradient(180deg,#f7fbff_0%,#e9f1fa_100%)]',
      iconClass: 'bg-white text-[#234d7a]',
      inactiveLabelClass: 'text-[#234d7a]',
      href: 'https://aiquorum.ai',
      ctaLabel: 'Visit AI Quorum',
    },
    {
      id: 'readiness',
      title: getContent('ai_home_shell_card_2_title', 'Om Cortex'),
      titleContentKey: 'ai_home_shell_card_2_title',
      description: getContent(
        'ai_home_shell_card_2_description',
        'An autonomous AI office assistant, a unified AI Platform for Businesses that connect to all their business intelligence through a single conversation interface with shared memory, tools and governance.'
      ),
      descriptionContentKey: 'ai_home_shell_card_2_description',
      icon: Blocks,
      badge: 'Central Intelligence Hub',
      badgeContentKey: 'ai_home_shell_card_2_badge',
      accentClass: 'border border-[#c8d9ec] bg-[#dfeaf6] text-[#2a5b8e]',
      panelClass: 'border-2 border-[#4d79a6] bg-[linear-gradient(180deg,#f4f8fd_0%,#d9e7f4_100%)]',
      iconClass: 'bg-white text-[#2a5b8e]',
      inactiveLabelClass: 'text-[#2a5b8e]',
      href: '/#about',
      ctaLabel: 'See Platform Direction',
    },
    {
      id: 'operations',
      title: getContent('ai_home_shell_card_3_title', 'AI-Native Operations'),
      titleContentKey: 'ai_home_shell_card_3_title',
      description: getContent(
        'ai_home_shell_card_3_description',
        'The longer-range direction: AI-native workflows for warehouse and supply chain teams shaped by real operating pain.'
      ),
      descriptionContentKey: 'ai_home_shell_card_3_description',
      icon: Workflow,
      badge: 'Roadmap',
      badgeContentKey: 'ai_home_shell_card_3_badge',
      accentClass: 'border border-[#b5cbe3] bg-[#d1e0f0] text-[#204c78]',
      panelClass: 'border-2 border-[#6b8fb7] bg-[linear-gradient(180deg,#eef4fb_0%,#cfdff0_100%)]',
      iconClass: 'bg-white text-[#204c78]',
      inactiveLabelClass: 'text-[#204c78]',
      href: '/#about',
      ctaLabel: 'See Direction',
    },
  ]

  return (
    <div className="flex h-full items-center justify-center">
      <InteractiveImageAccordion items={accordionItems} defaultActiveId="quorum" className="w-full max-w-[820px]" />
    </div>
  )
}

function AboutPanel() {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="rounded-[1.6rem] border border-[#c4d6ea] bg-[linear-gradient(180deg,#f5f9fe_0%,#e6eff8_100%)] p-3.5 shadow-[0_12px_36px_rgba(15,23,42,0.05)]">
        <SectionBadge contentKey="ai_home_shell_about_badge_v2" fallback="About Om AI Solutions" />
        <EditableText
          contentKey="ai_home_shell_about_title_v2"
          as="h2"
          className="mt-3 max-w-3xl text-[1.72rem] font-semibold leading-tight text-slate-950 xl:text-[1.9rem]"
          fallback="An AI company with practical business and supply chain expertise"
        />
        <EditableText
          contentKey="ai_home_shell_about_description_v2"
          as="p"
          className="mt-2.5 max-w-2xl text-sm leading-6 text-slate-600"
          fallback="Om AI Solutions is built around a simple standard: the AI should help people think better, decide better, and run real work better."
        />
      </div>

      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="rounded-[1.6rem] border border-[#c4d6ea] bg-[linear-gradient(180deg,#f7fbff_0%,#e9f1fa_100%)] p-4 shadow-[0_12px_36px_rgba(15,23,42,0.05)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-primary">What This Company Stands For</p>
          <EditableList
            contentKey="ai_home_shell_about_list_v2"
            className="mt-4 grid gap-3"
            fallback="AI Quorum leads the public story today|Assessment tools help teams start from a practical baseline|Supply chain remains the deeper long-term product direction|The company is early-stage but grounded in industry expertise"
            renderItem={(item, index) => (
              <li
                key={index}
                className="flex items-start gap-3 rounded-[1rem] border border-[#d7e4f2] bg-[linear-gradient(180deg,#ffffff_0%,#eff5fb_100%)] px-3.5 py-3 shadow-[0_4px_18px_rgba(15,23,42,0.03)]"
              >
                <CheckCircle className="mt-0.5 h-4.5 w-4.5 flex-shrink-0 text-brand-primary" />
                <span className="text-sm leading-5 text-slate-700">{item}</span>
              </li>
            )}
          />
        </div>

        <div className="rounded-[1.6rem] border border-[#c4d6ea] bg-[linear-gradient(180deg,#f5f9fe_0%,#e6eff8_100%)] p-4 shadow-[0_12px_36px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#b9cae0] bg-[linear-gradient(180deg,#edf4fb_0%,#dce8f5_100%)] text-[#234d7a]">
              <Users className="h-4 w-4" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-primary">Leadership</p>
          </div>

          <EditableText
            contentKey="ai_home_founder_title"
            as="h3"
            className="mt-4 text-[1.34rem] font-semibold leading-tight text-slate-950 xl:text-[1.46rem]"
            fallback="Built by industry experts who know where AI can actually earn trust"
          />
          <EditableText
            contentKey="ai_home_founder_description"
            as="p"
            className="mt-2 text-sm leading-6 text-slate-600"
            fallback="This company is early, but the experience behind it is not. It is being built by Industry Experts with decades of software experience and deep supply chain operating context."
          />

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <div className="rounded-[1rem] border border-[#d7e3f0] bg-[linear-gradient(180deg,#f7faff_0%,#edf4fb_100%)] px-3 py-2 text-[#234d7a] shadow-[0_12px_26px_rgba(35,77,122,0.07)]">
              <EditableStat
                contentKey="ai_home_proof_stat_1"
                fallback="60+|Combined software years"
                valueClassName="text-[1.5rem] font-semibold"
                labelClassName="mt-0.5 text-[10px] text-[#4b678c]"
              />
            </div>
            <div className="rounded-[1rem] border border-[#bfd2e7] bg-[linear-gradient(180deg,#eff5fb_0%,#dbe8f6_100%)] px-3 py-2 text-[#2d5d8e] shadow-[0_12px_26px_rgba(35,77,122,0.08)]">
              <EditableStat
                contentKey="ai_home_proof_stat_2"
                fallback="20+|Years in supply chain"
                valueClassName="text-[1.5rem] font-semibold"
                labelClassName="mt-0.5 text-[10px] text-[#4f7397]"
              />
            </div>
            <div className="rounded-[1rem] border border-[#aec5de] bg-[linear-gradient(180deg,#e8f0f9_0%,#c9dcef_100%)] px-3 py-2 text-[#204c78] shadow-[0_12px_26px_rgba(35,77,122,0.09)]">
              <EditableStat
                contentKey="ai_home_proof_stat_3"
                fallback="2025|Om AI Solutions formed"
                valueClassName="text-[1.5rem] font-semibold"
                labelClassName="mt-0.5 text-[10px] text-[#40688f]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ContactPanel() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-full min-h-0 flex-col rounded-[1.6rem] border border-[#c4d6ea] bg-[linear-gradient(180deg,#f5f9fe_0%,#e6eff8_100%)] p-3 shadow-[0_12px_36px_rgba(15,23,42,0.05)]">
        <SectionBadge contentKey="ai_home_shell_contact_badge_v2" fallback="Contact" />
        <EditableText
          contentKey="ai_home_shell_contact_title_v2"
          as="h2"
          className="mt-2 max-w-3xl text-[1.46rem] font-semibold leading-tight text-slate-950 xl:text-[1.58rem]"
          fallback="Start a conversation with Om AI Solutions"
        />
        <EditableText
          contentKey="ai_home_shell_contact_description_v2"
          as="p"
          className="mt-1.5 max-w-2xl text-[13px] leading-5 text-slate-600"
          fallback="Tell us what you are exploring, and we will route the discussion toward AI Quorum, AI readiness, or broader AI-native operations."
        />

        <div className="mt-3 min-h-0 flex-1 rounded-[1.3rem] border border-[#d6e3f1] bg-[linear-gradient(180deg,#ffffff_0%,#eef4fb_100%)] p-3">
          <ContactForm formType="general" brand="om_ai_solutions" />
        </div>
      </div>
    </div>
  )
}

function ActivePanel({ activeSection }: { activeSection: ShellSection }) {
  const panels: Record<ShellSection, ReactNode> = {
    home: <HomePanel />,
    about: <AboutPanel />,
    contact: <ContactPanel />,
  }

  return <div className="h-full">{panels[activeSection]}</div>
}

function HomeContent() {
  const [activeSection, setActiveSection] = useState<ShellSection>('home')

  useEffect(() => {
    const syncFromHash = () => setActiveSection(getHashSection())
    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)
    return () => window.removeEventListener('hashchange', syncFromHash)
  }, [])

  const isHomeView = activeSection === 'home'

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[linear-gradient(135deg,#edf4fb_0%,#deebf7_54%,#d4e4f3_100%)] text-slate-900">
      <section className="relative flex min-h-0 flex-1 items-center overflow-hidden bg-[linear-gradient(135deg,#edf4fb_0%,#deebf7_54%,#d4e4f3_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(30,77,124,0.14),transparent_24%),radial-gradient(circle_at_84%_16%,rgba(111,148,186,0.2),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.42)_100%)]" />
        <div className="container relative mx-auto flex h-full min-h-0 items-center px-4 py-4">
          <div className="grid w-full gap-5 xl:grid-cols-[0.72fr_1.28fr] xl:items-stretch">
            <div className="min-w-0 max-w-[430px] xl:max-w-none flex h-full flex-col self-center rounded-[2rem] border border-[#c4d6ea] bg-[linear-gradient(180deg,rgba(247,251,255,0.92)_0%,rgba(231,240,249,0.9)_100%)] px-5 py-4 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur md:px-6 xl:h-[540px]">
              <div className="flex h-full flex-col gap-7">
                <SectionBadge
                  contentKey="ai_home_launch_badge"
                  fallback="AI software for business leaders, analysts, and decision makers"
                />

                <div className="space-y-3">
                  <h1 className="max-w-xl text-[1.62rem] font-semibold leading-tight tracking-[-0.03em] text-slate-950 md:text-[1.8rem] xl:text-[2rem]">
                    <EditableText
                      contentKey="ai_home_launch_title_prefix"
                      as="span"
                      fallback="AI products shaped by"
                    />
                    <span className="mt-1 block text-brand-primary">
                      <EditableText
                        contentKey="ai_home_launch_title_highlight"
                        as="span"
                        fallback="real operating experience"
                      />
                    </span>
                  </h1>

                  <EditableText
                    contentKey="ai_home_launch_description"
                    as="p"
                    className="max-w-xl text-[15px] leading-7 text-slate-600"
                    fallback="Om AI Solutions is building a focused portfolio of AI software around a simple idea: serious business users need better thinking tools and better operating tools. The company starts with AI Quorum and extends toward AI-native workflows for supply chain and warehouse operations."
                  />
                </div>

                <div className="w-full max-w-full rounded-[1.35rem] border border-[#d1dfef] bg-[linear-gradient(180deg,#ffffff_0%,#edf4fb_100%)] px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-primary">Positioning</p>
                  <EditableText
                    contentKey="ai_home_positioning_copy"
                    as="p"
                    className="mt-2 text-sm leading-6 text-slate-600"
                    fallback="We are not presenting Om AI Solutions as a giant enterprise vendor. We are presenting it as a focused company building practical AI products with strong business and supply chain expertise."
                  />
                </div>
              </div>
            </div>

            <div
              className={cn(
                'flex h-full min-h-0 flex-col',
                'min-w-0',
                isHomeView
                  ? 'justify-center'
                  : 'rounded-[2rem] border border-[#c4d6ea] bg-[linear-gradient(180deg,rgba(248,252,255,0.9)_0%,rgba(231,240,249,0.9)_100%)] p-3 shadow-[0_18px_60px_rgba(15,23,42,0.07)] backdrop-blur md:p-4'
              )}
            >
              <div className={cn('min-h-0 flex-1', isHomeView ? 'overflow-hidden' : 'overflow-y-auto lg:overflow-hidden')}>
                <ActivePanel activeSection={activeSection} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export function HomePageClient({ initialContent }: { initialContent: Record<string, string> }) {
  return (
    <ContentProvider initialContent={initialContent}>
      <HomeContent />
    </ContentProvider>
  )
}
