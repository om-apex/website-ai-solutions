'use client'

import { OmLogoWithText } from '@om-apex/brand'
import { brand } from '@/lib/brand'

type LogoSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

interface LogoProps {
  size?: LogoSize
  className?: string
  showText?: boolean
}

export function Logo({ size = 'md', className = '', showText = false }: LogoProps) {
  return (
    <OmLogoWithText
      size={size}
      showText={showText}
      showTagline
      companyName={brand.company.shortName}
      tagline={brand.company.tagline}
      diamondColor="#1E4D7C"
      className={className}
      nameClassName="text-xl font-bold tracking-tight text-brand-primary"
      nameStyle={{
        fontFamily: 'var(--font-heading)',
        textShadow: '0 1px 0 rgba(35, 77, 122, 0.32), 0 2px 3px rgba(0, 0, 0, 0.06)',
      }}
    />
  )
}
