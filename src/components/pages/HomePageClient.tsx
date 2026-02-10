'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, Warehouse, Mic, Sparkles, ArrowRight, CheckCircle } from 'lucide-react'
import { ContentProvider, useContent } from '@/contexts/ContentContext'
import { EditableText, EditableList, EditableStat } from '@/components/content/EditableText'

const productIcons = [Sparkles, Warehouse, Brain, Mic]
const productColors = [
  'from-brand-primary to-brand-primary-dark',
  'from-brand-primary to-brand-primary-dark',
  'from-brand-primary to-brand-primary-dark',
  'from-brand-primary to-brand-primary-dark',
]

function HomeContent() {
  const { getContent } = useContent()

  const products = [1, 2, 3, 4].map((i) => ({
    nameKey: `ai_home_product${i}_name`,
    descriptionKey: `ai_home_product${i}_description`,
    statusKey: `ai_home_product${i}_status`,
    icon: productIcons[i - 1],
    color: productColors[i - 1],
  }))

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-primary/20 text-brand-primary text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-primary mr-2" />
              <EditableText contentKey="ai_home_hero_badge" as="span" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <EditableText contentKey="ai_home_hero_title_prefix" as="span" />{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">
                <EditableText contentKey="ai_home_hero_title_highlight" as="span" />
              </span>
            </h1>
            <EditableText
              contentKey="ai_home_hero_description"
              as="p"
              className="text-xl text-gray-300 mb-8 leading-relaxed"
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary-dark text-white">
                <Link href="#products">
                  {getContent('ai_home_hero_cta_primary', 'Explore Products')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                <Link href="/contact">{getContent('ai_home_hero_cta_secondary', 'Request Demo')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-gray-50 scroll-mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <EditableText
              contentKey="ai_home_products_title"
              as="h2"
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            />
            <EditableText
              contentKey="ai_home_products_description"
              as="p"
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {products.map((product, index) => {
              const Icon = product.icon
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-brand-accent/10 text-brand-accent">
                        <EditableText contentKey={product.statusKey} as="span" />
                      </span>
                    </div>
                    <CardTitle className="text-xl">
                      <EditableText contentKey={product.nameKey} as="span" />
                    </CardTitle>
                    <CardDescription className="text-base">
                      <EditableText contentKey={product.descriptionKey} as="span" />
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <EditableText
                contentKey="ai_home_features_title"
                as="h2"
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
              />
              <EditableText
                contentKey="ai_home_features_description"
                as="p"
                className="text-lg text-gray-600 mb-8"
              />
              <EditableList
                contentKey="ai_home_features_list"
                className="space-y-4"
                renderItem={(feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-brand-primary mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                )}
              />
            </div>
            <div className="bg-gradient-to-br from-brand-primary-light to-brand-accent-light rounded-2xl p-8 md:p-12">
              <div className="text-center">
                <EditableStat
                  contentKey="ai_home_stats_primary"
                  valueClassName="text-5xl md:text-6xl font-bold text-brand-primary mb-2"
                  labelClassName="text-gray-600 mb-6"
                />
                <div className="grid grid-cols-2 gap-6 text-center">
                  <EditableStat
                    contentKey="ai_home_stats_products"
                    valueClassName="text-2xl font-bold text-gray-900"
                    labelClassName="text-sm text-gray-600"
                  />
                  <EditableStat
                    contentKey="ai_home_stats_location"
                    valueClassName="text-2xl font-bold text-gray-900"
                    labelClassName="text-sm text-gray-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-brand-primary to-brand-primary-dark">
        <div className="container mx-auto px-4 text-center">
          <EditableText
            contentKey="ai_home_cta_title"
            as="h2"
            className="text-3xl font-bold text-white mb-4"
          />
          <EditableText
            contentKey="ai_home_cta_description"
            as="p"
            className="text-brand-primary-light mb-8 max-w-xl mx-auto"
          />
          <Button asChild size="lg" variant="secondary" className="bg-white text-brand-primary hover:bg-gray-100">
            <Link href="/contact">
              {getContent('ai_home_cta_button', 'Get in Touch')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

export function HomePageClient({ initialContent }: { initialContent: Record<string, string> }) {
  return (
    <ContentProvider initialContent={initialContent}>
      <HomeContent />
    </ContentProvider>
  )
}
