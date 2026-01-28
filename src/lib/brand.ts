/**
 * Brand constants for Om AI Solutions
 *
 * This file defines the brand identity including colors, fonts, and company info.
 * Colors are defined in both hex (for reference) and OkLCH (for Tailwind v4).
 */

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
    heading: 'Georgia, serif',
    body: "'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  company: {
    name: 'Om AI Solutions LLC',
    shortName: 'Om AI',
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
