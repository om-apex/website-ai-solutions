'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Target, Eye, Brain } from 'lucide-react'
import { ContentProvider, useContent } from '@/contexts/ContentContext'
import { EditableText, EditableStat } from '@/components/content/EditableText'

function AboutContent() {
  const { getContent } = useContent()

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <EditableText
              contentKey="ai_about_hero_title"
              as="h1"
              className="text-4xl md:text-5xl font-bold mb-6"
            />
            <EditableText
              contentKey="ai_about_hero_description"
              as="p"
              className="text-xl text-gray-300"
            />
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <EditableText
                contentKey="ai_about_story_title"
                as="h2"
                className="text-3xl font-bold text-gray-900 mb-6"
              />
              <div className="space-y-4 text-gray-600">
                <EditableText contentKey="ai_about_story_p1" as="p" />
                <EditableText contentKey="ai_about_story_p2" as="p" />
                <EditableText contentKey="ai_about_story_p3" as="p" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-brand-primary-light to-brand-accent-light rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <EditableStat
                    contentKey="ai_about_stat_years"
                    valueClassName="text-3xl font-bold text-brand-primary"
                    labelClassName="text-sm text-gray-600"
                  />
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <EditableStat
                    contentKey="ai_about_stat_products"
                    valueClassName="text-3xl font-bold text-brand-primary"
                    labelClassName="text-sm text-gray-600"
                  />
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <EditableStat
                    contentKey="ai_about_stat_expertise"
                    valueClassName="text-3xl font-bold text-brand-primary"
                    labelClassName="text-sm text-gray-600"
                  />
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <EditableStat
                    contentKey="ai_about_stat_location"
                    valueClassName="text-3xl font-bold text-brand-primary"
                    labelClassName="text-sm text-gray-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Approach */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-14 h-14 rounded-full bg-brand-primary-light flex items-center justify-center mx-auto mb-6">
                  <Target className="h-7 w-7 text-brand-primary" />
                </div>
                <EditableText
                  contentKey="ai_about_mission_title"
                  as="h3"
                  className="text-xl font-bold text-gray-900 mb-4"
                />
                <EditableText
                  contentKey="ai_about_mission_description"
                  as="p"
                  className="text-gray-600"
                />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-14 h-14 rounded-full bg-brand-primary-light flex items-center justify-center mx-auto mb-6">
                  <Eye className="h-7 w-7 text-brand-primary" />
                </div>
                <EditableText
                  contentKey="ai_about_vision_title"
                  as="h3"
                  className="text-xl font-bold text-gray-900 mb-4"
                />
                <EditableText
                  contentKey="ai_about_vision_description"
                  as="p"
                  className="text-gray-600"
                />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-14 h-14 rounded-full bg-brand-accent-light flex items-center justify-center mx-auto mb-6">
                  <Brain className="h-7 w-7 text-brand-accent" />
                </div>
                <EditableText
                  contentKey="ai_about_approach_title"
                  as="h3"
                  className="text-xl font-bold text-gray-900 mb-4"
                />
                <EditableText
                  contentKey="ai_about_approach_description"
                  as="p"
                  className="text-gray-600"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <EditableText
            contentKey="ai_about_leadership_title"
            as="h2"
            className="text-3xl font-bold text-gray-900 mb-12 text-center"
          />
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-md">
              <CardContent className="pt-8">
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-primary to-brand-primary-dark flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-3xl">
                      {getContent('ai_about_leader_initials', 'NT')}
                    </span>
                  </div>
                  <div>
                    <EditableText
                      contentKey="ai_about_leader_name"
                      as="h3"
                      className="text-xl font-bold text-gray-900"
                    />
                    <EditableText
                      contentKey="ai_about_leader_role"
                      as="p"
                      className="text-brand-primary font-medium mb-3"
                    />
                    <EditableText
                      contentKey="ai_about_leader_bio"
                      as="p"
                      className="text-gray-600"
                    />
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
            {getContent('ai_about_parent_note', 'Om AI Solutions is a subsidiary of')}{' '}
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

export function AboutPageClient({ initialContent }: { initialContent: Record<string, string> }) {
  return (
    <ContentProvider initialContent={initialContent}>
      <AboutContent />
    </ContentProvider>
  )
}
