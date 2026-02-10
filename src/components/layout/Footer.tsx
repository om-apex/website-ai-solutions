'use client'

import Link from 'next/link'
import { Logo } from '@/components/brand/Logo'
import { Phone } from 'lucide-react'

interface FooterProps {
  content?: Record<string, string>
}

export function Footer({ content = {} }: FooterProps) {
  const get = (key: string, fallback: string) => content[key] || fallback

  const companyName = get('ai_global_company_name', 'Om AI Solutions')
  const tagline = get('ai_footer_tagline', 'Intelligent backbone for your business. AI-powered software for warehouse and supply chain operations.')
  const productsTitle = get('ai_footer_products_title', 'Products')
  const productsList = get('ai_footer_products_list', 'AI Quorum|Yard Shack|Floor Assistant|Voice & Vision Picking')
  const companyTitle = get('ai_footer_company_title', 'Company')
  const contactTitle = get('ai_footer_contact_title', 'Contact')
  const location = get('ai_global_contact_location', 'Atlanta, Georgia')
  const email = get('ai_global_contact_email', 'hello@omaisolutions.com')
  const phone = get('ai_global_contact_phone', '')
  const copyright = get('ai_global_copyright', 'Om AI Solutions LLC. All rights reserved.')
  const subsidiaryNote = get('ai_footer_subsidiary_note', 'A subsidiary of')
  const parentCompany = get('ai_global_parent_company', 'Om Apex Holdings')
  const parentUrl = get('ai_global_parent_url', 'https://omapex.com')

  const products = productsList.split('|').filter(Boolean)

  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Logo size="sm" />
              <span className="font-semibold text-lg text-gray-900">{companyName}</span>
            </div>
            <p className="text-sm text-gray-600">
              {tagline}
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">{productsTitle}</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {products.map((product, index) => (
                <li key={index}>{product}</li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">{companyTitle}</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/about" className="hover:text-brand-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a href={parentUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary transition-colors">
                  {parentCompany}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">{contactTitle}</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>{location}</li>
              <li>
                <a href={`mailto:${email}`} className="hover:text-brand-primary transition-colors">
                  {email}
                </a>
              </li>
              {phone && (
                <li className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <a href={`tel:${phone}`} className="hover:text-brand-primary transition-colors">
                    {phone}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} {copyright}</p>
          <p className="mt-1">{subsidiaryNote} <a href={parentUrl} className="hover:text-brand-primary transition-colors">{parentCompany}</a></p>
        </div>
      </div>
    </footer>
  )
}
