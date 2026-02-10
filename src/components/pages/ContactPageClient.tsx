'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, MapPin, Calendar, MessageSquare, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ContentProvider, useContent } from '@/contexts/ContentContext'
import { EditableText } from '@/components/content/EditableText'

function formatPhone(raw: string): string {
  const digits = raw.replace(/[^\d]/g, '')
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  return raw
}

function ContactContent() {
  const { getContent } = useContent()

  const email = getContent('ai_global_contact_email', 'hello@omaisolutions.com')
  const phone = getContent('ai_global_contact_phone', '')
  const location = getContent('ai_global_contact_location', 'Atlanta, Georgia')

  const contactOptions = [
    {
      icon: Calendar,
      titleKey: 'ai_contact_option1_title',
      descriptionKey: 'ai_contact_option1_description',
      actionKey: 'ai_contact_option1_action',
      href: `mailto:${email}?subject=Demo Request`,
    },
    {
      icon: MessageSquare,
      titleKey: 'ai_contact_option2_title',
      descriptionKey: 'ai_contact_option2_description',
      actionKey: 'ai_contact_option2_action',
      href: `mailto:${email}`,
    },
    {
      icon: Mail,
      titleKey: 'ai_contact_option3_title',
      descriptionKey: 'ai_contact_option3_description',
      actionKey: 'ai_contact_option3_action',
      href: `mailto:${email}?subject=Partnership Inquiry`,
    },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <EditableText
              contentKey="ai_contact_hero_title"
              as="h1"
              className="text-4xl md:text-5xl font-bold mb-6"
            />
            <EditableText
              contentKey="ai_contact_hero_description"
              as="p"
              className="text-xl text-gray-300"
            />
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {contactOptions.map((option, index) => {
              const Icon = option.icon
              return (
                <Card key={index} className="border-0 shadow-md text-center">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-full bg-brand-primary-light flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-7 w-7 text-brand-primary" />
                    </div>
                    <CardTitle className="text-xl">
                      <EditableText contentKey={option.titleKey} as="span" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <EditableText
                      contentKey={option.descriptionKey}
                      as="p"
                      className="text-gray-600"
                    />
                    <Button asChild className="bg-brand-primary hover:bg-brand-primary-dark">
                      <a href={option.href}>
                        {getContent(option.actionKey)}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Direct Contact */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <EditableText
              contentKey="ai_contact_direct_title"
              as="h2"
              className="text-3xl font-bold text-gray-900 mb-8"
            />
            <div className={`grid gap-8 ${phone ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <Mail className="h-8 w-8 text-brand-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {getContent('ai_contact_direct_email_label', 'Email')}
                  </h3>
                  <a
                    href={`mailto:${email}`}
                    className="text-brand-primary hover:text-brand-primary-dark"
                  >
                    {email}
                  </a>
                </CardContent>
              </Card>

              {phone && (
                <Card className="border-0 shadow-md">
                  <CardContent className="pt-6">
                    <Phone className="h-8 w-8 text-brand-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                    <a
                      href={`tel:${phone}`}
                      className="text-brand-primary hover:text-brand-primary-dark"
                    >
                      {formatPhone(phone)}
                    </a>
                  </CardContent>
                </Card>
              )}

              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <MapPin className="h-8 w-8 text-brand-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {getContent('ai_contact_direct_location_label', 'Location')}
                  </h3>
                  <p className="text-gray-600">{location}</p>
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
            {getContent('ai_contact_parent_note', 'Om AI Solutions is a subsidiary of')}{' '}
            <a
              href={getContent('ai_global_parent_url', 'https://omapex.com')}
              className="text-brand-primary hover:text-brand-primary-dark font-medium"
            >
              {getContent('ai_global_parent_company', 'Om Apex Holdings LLC')}
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}

export function ContactPageClient({ initialContent }: { initialContent: Record<string, string> }) {
  return (
    <ContentProvider initialContent={initialContent}>
      <ContactContent />
    </ContentProvider>
  )
}
