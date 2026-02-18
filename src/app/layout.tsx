import type { Metadata } from "next"
import "./globals.css"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { EditModeProvider } from "@/contexts/EditModeContext"
import { getSiteContent, getCompanyContact } from "@/lib/content-fetcher"
import { DEFAULT_CONTENT } from "@/lib/content"

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
  const defaults: Record<string, string> = {}
  for (const [key, val] of Object.entries(DEFAULT_CONTENT)) {
    defaults[key] = val.value
  }
  const footerContent = { ...defaults, ...dbContent, ...companyContact }

  return (
    <html lang="en">
      <body className="antialiased">
        <EditModeProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer content={footerContent} />
          </div>
        </EditModeProvider>
      </body>
    </html>
  )
}
