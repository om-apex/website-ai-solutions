import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, Warehouse, Mic, Eye, ArrowRight, CheckCircle, Sparkles } from 'lucide-react'

const products = [
  {
    name: 'AI Quorum',
    description: 'Multi-model AI consensus platform that delivers verified, trustworthy answers by consulting multiple AI models.',
    icon: Sparkles,
    color: 'from-brand-primary to-brand-primary-dark',
    status: 'Coming Soon',
  },
  {
    name: 'Yard Shack',
    description: 'AI-powered yard management system that optimizes trailer movements, dock scheduling, and yard operations.',
    icon: Warehouse,
    color: 'from-brand-primary to-brand-primary-dark',
    status: 'In Development',
  },
  {
    name: 'Floor Assistant',
    description: 'Intelligent warehouse floor operations optimizer that guides workers and improves efficiency in real-time.',
    icon: Brain,
    color: 'from-brand-primary to-brand-primary-dark',
    status: 'In Development',
  },
  {
    name: 'Voice & Vision Picking',
    description: 'Next-generation picking systems using voice commands and computer vision for hands-free, error-free operations.',
    icon: Mic,
    color: 'from-brand-primary to-brand-primary-dark',
    status: 'Planned',
  },
]

const features = [
  'Multi-model AI for verified answers',
  'Real-time warehouse optimization',
  'Seamless WMS integration',
  '30+ years of supply chain expertise',
  'Built for Blue Yonder environments',
  'Enterprise-grade security',
]

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-primary/20 text-brand-primary text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-primary mr-2" />
              AI-Powered Supply Chain Software
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Intelligent Backbone for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">
                Your Business
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Om AI Solutions builds cutting-edge AI software for warehouse and supply chain operations.
              Combining 30+ years of industry expertise with advanced AI to transform how enterprises operate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary-dark text-white">
                <Link href="#products">
                  Explore Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                <Link href="/contact">Request Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-gray-50 scroll-mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              AI-powered solutions designed to optimize every aspect of your warehouse and supply chain operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {products.map((product) => (
              <Card key={product.name} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <product.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-brand-accent/10 text-brand-accent">
                      {product.status}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                  <CardDescription className="text-base">{product.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Om AI Solutions?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We combine deep supply chain expertise with cutting-edge AI technology
                to deliver solutions that actually work in real-world warehouse environments.
              </p>
              <ul className="space-y-4">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-brand-primary mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-brand-primary-light to-brand-accent-light rounded-2xl p-8 md:p-12">
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-brand-primary mb-2">30+</div>
                <div className="text-gray-600 mb-6">Years of Supply Chain Expertise</div>
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">4</div>
                    <div className="text-sm text-gray-600">AI Products</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">ATL</div>
                    <div className="text-sm text-gray-600">Based</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-brand-primary to-brand-primary-dark">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-brand-primary-light mb-8 max-w-xl mx-auto">
            Let&apos;s discuss how AI can optimize your warehouse and supply chain.
            Schedule a demo or consultation today.
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-white text-brand-primary hover:bg-gray-100">
            <Link href="/contact">
              Get in Touch
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
