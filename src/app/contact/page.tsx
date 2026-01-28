import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, MapPin, Calendar, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Om AI Solutions. Request a demo or learn more about our AI-powered supply chain software.',
}

const contactOptions = [
  {
    icon: Calendar,
    title: 'Request a Demo',
    description: 'See our AI products in action with a personalized demonstration.',
    action: 'Schedule Demo',
    href: 'mailto:hello@omaisolutions.com?subject=Demo Request',
  },
  {
    icon: MessageSquare,
    title: 'General Inquiries',
    description: 'Have questions about our products or company? We\'d love to hear from you.',
    action: 'Send Message',
    href: 'mailto:hello@omaisolutions.com',
  },
  {
    icon: Mail,
    title: 'Partnership',
    description: 'Interested in partnering or integrating with our solutions? Let\'s talk.',
    action: 'Get in Touch',
    href: 'mailto:hello@omaisolutions.com?subject=Partnership Inquiry',
  },
]

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl text-gray-300">
              Ready to transform your warehouse operations with AI? Let&apos;s discuss
              how we can help optimize your supply chain.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {contactOptions.map((option) => (
              <Card key={option.title} className="border-0 shadow-md text-center">
                <CardHeader>
                  <div className="w-14 h-14 rounded-full bg-brand-primary-light flex items-center justify-center mx-auto mb-4">
                    <option.icon className="h-7 w-7 text-brand-primary" />
                  </div>
                  <CardTitle className="text-xl">{option.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{option.description}</p>
                  <Button asChild className="bg-brand-primary hover:bg-brand-primary-dark">
                    <a href={option.href}>{option.action}</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Direct Contact */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Direct Contact</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <Mail className="h-8 w-8 text-brand-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                  <a
                    href="mailto:hello@omaisolutions.com"
                    className="text-brand-primary hover:text-brand-primary-dark"
                  >
                    hello@omaisolutions.com
                  </a>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <MapPin className="h-8 w-8 text-brand-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                  <p className="text-gray-600">Atlanta, Georgia</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Parent Company */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            Om AI Solutions is a subsidiary of{' '}
            <a href="https://omapex.com" className="text-brand-primary hover:text-brand-primary-dark font-medium">
              Om Apex Holdings LLC
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}
