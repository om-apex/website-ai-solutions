/**
 * Brand constants for Om AI Solutions
 *
 * Hardcoded values serve as BUILD-TIME FALLBACKS. At runtime/ISR, the root layout
 * fetches from company_configs in Supabase and injects CSS custom properties.
 * To update brand: edit company config in Owner Portal → Dashboard → Company Config.
 */
import { getBrandFromConfig, type DynamicBrand } from './content-fetcher'

const COMPANY_CONFIG_SLUG = 'om-ai-solutions'

/** Fetch brand from Supabase company_configs. Returns null if unavailable. */
export async function fetchBrand(): Promise<DynamicBrand | null> {
  try {
    return await getBrandFromConfig(COMPANY_CONFIG_SLUG)
  } catch {
    return null
  }
}

export interface BrandColors {
  primary: string        // Main brand color
  primaryDark: string    // Darker variant for hover states
  primaryLight: string   // Lighter variant for backgrounds
  accent: string         // Accent color
  accentLight: string    // Light accent for backgrounds
}

export interface BrandFonts {
  heading: string        // Font family for headings
  body: string           // Font family for body text
}

export interface CompanyInfo {
  name: string
  shortName: string
  tagline: string
  email: string
  location: string
}

export interface Brand {
  colors: BrandColors
  fonts: BrandFonts
  company: CompanyInfo
  logo: {
    png: string
    svg: string
  }
}

// Hex values for reference (used in design specs)
export const brandHex = {
  primary: '#1E4D7C',      // Navy
  accent: '#C9A227',       // Gold
} as const

// OkLCH values for Tailwind v4
export const brandOklch = {
  primary: 'oklch(0.392 0.085 249.1)',           // #1E4D7C navy
  primaryDark: 'oklch(0.32 0.09 249.1)',         // Darker navy
  primaryLight: 'oklch(0.95 0.02 249.1)',        // Light navy bg
  accent: 'oklch(0.725 0.145 85.4)',             // #C9A227 gold
  accentLight: 'oklch(0.95 0.04 85.4)',          // Light gold bg
} as const

// Om AI Solutions brand
export const omAiSolutions: Brand = {
  colors: {
    primary: brandOklch.primary,
    primaryDark: brandOklch.primaryDark,
    primaryLight: brandOklch.primaryLight,
    accent: brandOklch.accent,
    accentLight: brandOklch.accentLight,
  },
  fonts: {
    heading: "'Playfair Display', serif",
    body: "'Space Grotesk', sans-serif",
  },
  company: {
    name: 'Om AI Solutions LLC',
    shortName: 'Om AI Solutions',
    tagline: 'Intelligent Backbone for Your Business',
    email: 'hello@omaisolutions.com',
    location: 'Atlanta, Georgia',
  },
  logo: {
    png: '/images/logo.png',
    svg: '/images/logo.svg',
  },
}

// Re-export default brand for convenience
export const brand = omAiSolutions
