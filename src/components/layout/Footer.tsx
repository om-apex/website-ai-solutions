import Link from 'next/link'
import { Logo } from '@/components/brand/Logo'

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Logo size="sm" />
              <span className="font-semibold text-lg text-gray-900">Om AI Solutions</span>
            </div>
            <p className="text-sm text-gray-600">
              Intelligent backbone for your business. AI-powered software for warehouse
              and supply chain operations.
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Products</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>AI Quorum</li>
              <li>Yard Shack</li>
              <li>Floor Assistant</li>
              <li>Voice & Vision Picking</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
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
                <a href="https://omapex.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary transition-colors">
                  Om Apex Holdings
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Atlanta, Georgia</li>
              <li>
                <a href="mailto:hello@omaisolutions.com" className="hover:text-brand-primary transition-colors">
                  hello@omaisolutions.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Om AI Solutions LLC. All rights reserved.</p>
          <p className="mt-1">A subsidiary of <a href="https://omapex.com" className="hover:text-brand-primary transition-colors">Om Apex Holdings</a></p>
        </div>
      </div>
    </footer>
  )
}
