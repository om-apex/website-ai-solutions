import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { Target, Eye, Heart, Brain } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Om AI Solutions, our mission, and the team building AI-powered supply chain software.',
}

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Om AI Solutions</h1>
            <p className="text-xl text-gray-300">
              We combine 30+ years of supply chain expertise with cutting-edge AI to build
              software that transforms warehouse and logistics operations.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Om AI Solutions was born from a simple observation: the supply chain industry
                  is ripe for AI transformation, but most solutions are built by technologists
                  who don&apos;t understand the operational realities of warehouses.
                </p>
                <p>
                  With decades of hands-on experience implementing and optimizing warehouse
                  management systems—particularly Blue Yonder—we know exactly where AI can
                  make the biggest impact. We&apos;ve walked the warehouse floors, debugged the
                  integrations, and felt the pain points firsthand.
                </p>
                <p>
                  Now we&apos;re building the AI solutions we always wished we had: practical,
                  reliable, and designed for real-world warehouse environments.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-brand-primary-light to-brand-accent-light rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-3xl font-bold text-brand-primary">30+</div>
                  <div className="text-sm text-gray-600">Years in Supply Chain</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-3xl font-bold text-brand-primary">4</div>
                  <div className="text-sm text-gray-600">AI Products</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-3xl font-bold text-brand-primary">BY</div>
                  <div className="text-sm text-gray-600">Blue Yonder Expert</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-3xl font-bold text-brand-primary">ATL</div>
                  <div className="text-sm text-gray-600">Based</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-14 h-14 rounded-full bg-brand-primary-light flex items-center justify-center mx-auto mb-6">
                  <Target className="h-7 w-7 text-brand-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600">
                  To make AI practical and accessible for warehouse operations, helping
                  companies optimize their supply chains with intelligent automation.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-14 h-14 rounded-full bg-brand-primary-light flex items-center justify-center mx-auto mb-6">
                  <Eye className="h-7 w-7 text-brand-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-600">
                  A world where every warehouse operates at peak efficiency, powered by
                  AI that truly understands logistics operations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-14 h-14 rounded-full bg-brand-accent-light flex items-center justify-center mx-auto mb-6">
                  <Brain className="h-7 w-7 text-brand-accent" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Our Approach</h3>
                <p className="text-gray-600">
                  We build AI that works in the real world—not demos. Every feature
                  is designed by people who have spent decades on warehouse floors.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Leadership</h2>
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-md">
              <CardContent className="pt-8">
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-primary to-brand-primary-dark flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-3xl">NT</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Nishad Tambe</h3>
                    <p className="text-brand-primary font-medium mb-3">Founder & CEO</p>
                    <p className="text-gray-600">
                      30+ years of supply chain leadership with deep expertise in warehouse
                      management systems, particularly Blue Yonder. Former implementation
                      consultant who has worked with Fortune 500 companies to optimize
                      their distribution operations. Now applying that experience to build
                      AI solutions that solve real problems warehouse teams face every day.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Parent Company */}
      <section className="py-16 bg-gray-50">
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
