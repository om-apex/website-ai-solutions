'use client'

import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'

import { EditableText } from '@/components/content/EditableText'
import { useEditMode } from '@/contexts/EditModeContext'
import { cn } from '@/lib/utils'

export interface InteractiveAccordionItem {
  id: string
  title: string
  titleContentKey?: string
  description: string
  descriptionContentKey?: string
  icon: LucideIcon
  iconImageSrc?: string
  iconImageClassName?: string
  badge: string
  badgeContentKey?: string
  accentClass: string
  panelClass: string
  iconClass?: string
  href?: string
  inactiveLabelClass?: string
  ctaLabel?: string
}

interface InteractiveImageAccordionProps {
  items: InteractiveAccordionItem[]
  defaultActiveId?: string
  className?: string
}

export function InteractiveImageAccordion({
  items,
  defaultActiveId,
  className,
}: InteractiveImageAccordionProps) {
  const [activeId, setActiveId] = useState(defaultActiveId ?? items[0]?.id ?? '')
  const { editMode, isOmApexUser } = useEditMode()
  const disableNavigation = editMode && isOmApexUser

  return (
    <div className={cn('w-full', className)}>
      <div className="flex min-h-[480px] items-stretch justify-center gap-4 overflow-x-auto">
        {items.map((item) => {
          const isActive = item.id === activeId
          const Icon = item.icon

          return (
            <a
              key={item.id}
              href={item.href || '#'}
              target={item.href?.startsWith('http') ? '_blank' : undefined}
              rel={item.href?.startsWith('http') ? 'noreferrer' : undefined}
              onMouseEnter={() => setActiveId(item.id)}
              onFocus={() => setActiveId(item.id)}
              onClick={(event) => {
                if (disableNavigation) {
                  event.preventDefault()
                  if (!isActive) {
                    setActiveId(item.id)
                  }
                  return
                }

                if (!isActive) {
                  event.preventDefault()
                  setActiveId(item.id)
                }
              }}
              className={cn(
                'relative h-[480px] shrink-0 overflow-hidden rounded-[1.75rem] text-left transition-[width,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                item.panelClass,
                isActive ? 'w-[360px] shadow-[0_24px_70px_rgba(15,23,42,0.15)]' : 'w-[92px]'
              )}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.92),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.32)_0%,rgba(244,248,255,0.86)_100%)]" />

              <div
                className={cn(
                  'absolute left-4 top-4 flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/92 text-slate-950 shadow-sm',
                  item.iconClass
                )}
              >
                {item.iconImageSrc ? (
                  <img
                    src={item.iconImageSrc}
                    alt=""
                    className={cn('h-full w-full object-cover', item.iconImageClassName)}
                  />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>

              <div
                className={cn(
                  'absolute inset-0 flex flex-col items-center justify-center px-7 text-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                  isActive ? 'translate-y-0 opacity-100 delay-75' : 'pointer-events-none translate-y-3 opacity-0'
                )}
              >
                <div
                  className={cn(
                    'inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]',
                    item.accentClass
                  )}
                >
                  {item.badgeContentKey ? (
                    <EditableText
                      contentKey={item.badgeContentKey}
                      as="span"
                      className="uppercase"
                      fallback={item.badge}
                    />
                  ) : (
                    item.badge
                  )}
                </div>

                {item.titleContentKey ? (
                  <EditableText
                    contentKey={item.titleContentKey}
                    as="h3"
                    className="mt-4 max-w-[14rem] text-[1.85rem] font-semibold leading-tight text-slate-950"
                    fallback={item.title}
                  />
                ) : (
                  <h3 className="mt-4 max-w-[14rem] text-[1.85rem] font-semibold leading-tight text-slate-950">{item.title}</h3>
                )}

                {item.descriptionContentKey ? (
                  <EditableText
                    contentKey={item.descriptionContentKey}
                    as="p"
                    className="mt-3 max-w-[14rem] text-[15px] leading-6 text-slate-700"
                    fallback={item.description}
                  />
                ) : (
                  <p className="mt-3 max-w-[14rem] text-[15px] leading-6 text-slate-700">{item.description}</p>
                )}

                {item.href && (
                  <div className="mt-5 text-sm font-medium text-slate-900">
                    {item.ctaLabel || 'Open'}
                  </div>
                )}
              </div>

              <div
                className={cn(
                  'absolute inset-0 flex items-center justify-center whitespace-nowrap px-2 text-center text-[13px] font-semibold uppercase tracking-[0.22em] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]',
                  item.inactiveLabelClass || 'text-slate-900',
                  isActive ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
                )}
                style={!isActive ? { writingMode: 'vertical-rl', textOrientation: 'mixed' } : undefined}
              >
                {item.title}
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
