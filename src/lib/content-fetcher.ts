import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function getPageContent(
  site: string,
  page: string
): Promise<Record<string, string>> {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const { data, error } = await supabase
    .from('site_content')
    .select('content_key, value, default_value')
    .eq('site', site)
    .eq('page', page)

  if (error) {
    console.error('Error fetching page content:', error)
    return {}
  }

  const content: Record<string, string> = {}
  for (const row of data || []) {
    content[row.content_key] = row.value || row.default_value || ''
  }

  return content
}

export async function getSiteContent(
  site: string
): Promise<Record<string, string>> {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const { data, error } = await supabase
    .from('site_content')
    .select('content_key, value, default_value')
    .eq('site', site)

  if (error) {
    console.error('Error fetching site content:', error)
    return {}
  }

  const content: Record<string, string> = {}
  for (const row of data || []) {
    content[row.content_key] = row.value || row.default_value || ''
  }

  return content
}
