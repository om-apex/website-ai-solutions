import { Metadata } from 'next'
import { SurveyInterestClient } from './SurveyInterestClient'

export const metadata: Metadata = {
  title: 'AI Readiness Survey — Coming Soon',
  description: 'Assess your organization\'s AI readiness. Leave your email to be notified when our comprehensive AI readiness survey launches.',
}

export default function AIReadinessSurveyPage() {
  return <SurveyInterestClient />
}
