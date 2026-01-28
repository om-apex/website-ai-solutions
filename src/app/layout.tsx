import type { Metadata } from "next"
import "./globals.css"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: {
    default: "Om AI Solutions | Intelligent Backbone for Your Business",
    template: "%s | Om AI Solutions",
  },
  description: "AI-powered enterprise software for supply chain optimization, warehouse management, and intelligent automation. Transform your operations with cutting-edge AI.",
  keywords: ["AI software", "supply chain AI", "warehouse management", "enterprise AI", "intelligent automation", "Atlanta"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
