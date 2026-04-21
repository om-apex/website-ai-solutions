import type { Metadata } from "next"
import { Playfair_Display, Space_Grotesk } from "next/font/google"
import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  variable: "--font-playfair-display",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-space-grotesk",
})
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { EditModeProvider } from "@/contexts/EditModeContext"
import { CommentAuthProvider } from "@/contexts/CommentAuthContext"
import { getSiteContent, getCompanyContact, getBrandFromConfig } from "@/lib/content-fetcher"
import { DEFAULT_CONTENT } from "@/lib/content"
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { VoiceWidget } from "@/components/VoiceWidget"

export const metadata: Metadata = {
  title: {
    default: "Om AI Solutions | Intelligent Backbone for Your Business",
    template: "%s | Om AI Solutions",
  },
  description: "AI-powered enterprise software for supply chain optimization, warehouse management, and intelligent automation. Transform your operations with cutting-edge AI.",
  keywords: ["AI software", "supply chain AI", "warehouse management", "enterprise AI", "intelligent automation", "Atlanta"],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const dbContent = await getSiteContent('ai')
  const companyContact = await getCompanyContact('om-ai-solutions', {
    phone: 'ai_global_contact_phone',
    email: 'ai_global_contact_email',
    name: 'ai_global_company_name',
  })
  const dynamicBrand = await getBrandFromConfig('om-ai-solutions')
  const defaults: Record<string, string> = {}
  for (const [key, val] of Object.entries(DEFAULT_CONTENT)) {
    defaults[key] = val.value
  }
  const footerContent = { ...defaults, ...dbContent, ...companyContact }

  // Inject dynamic brand values as CSS custom properties (override Tailwind defaults)
  const brandStyle = dynamicBrand ? {
    '--brand-primary': dynamicBrand.primaryColor,
    '--brand-accent': dynamicBrand.accentColor,
    '--brand-heading-font': dynamicBrand.headingFont,
    '--brand-body-font': dynamicBrand.bodyFont,
  } as React.CSSProperties : undefined

  return (
    <html lang="en" className={`${playfairDisplay.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="alternate" type="application/rss+xml" title="Om AI Solutions Blog" href="/blog/rss.xml" />
      </head>
      <body className="overflow-x-hidden antialiased" style={brandStyle}>
        <EditModeProvider>
          <CommentAuthProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex min-h-0 flex-1 flex-col">{children}</main>
              <Footer content={footerContent} />
            </div>
          </CommentAuthProvider>
        </EditModeProvider>
        <VoiceWidget agent_id="agent_18c69fe1d7786ace21f6eafec9" brand="om-ai-solutions" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
