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

export interface DynamicBrand {
  companyName: string
  shortName: string
  tagline: string
  email: string
  phone: string
  website: string
  primaryColor: string
  accentColor: string
  headingFont: string
  bodyFont: string
}

export async function getBrandFromConfig(slug: string): Promise<DynamicBrand | null> {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const { data, error } = await supabase
    .from('company_configs')
    .select('config')
    .eq('id', slug)
    .single()

  if (error || !data?.config) return null

  const cfg = data.config as Record<string, Record<string, string>>
  const company = cfg.company || {}
  const brand = cfg.brand || {}
  const contact = cfg.contact || {}

  return {
    companyName: company.name || '',
    shortName: company.short_name || '',
    tagline: company.tagline || '',
    email: contact.email || '',
    phone: contact.phone || '',
    website: contact.website || '',
    primaryColor: brand.primary_color || '',
    accentColor: brand.accent_color || '',
    headingFont: brand.heading_font || '',
    bodyFont: brand.body_font || '',
  }
}

export async function getCompanyContact(
  slug: string,
  keyMap: { phone: string; email: string; name: string }
): Promise<Record<string, string>> {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const { data, error } = await supabase
    .from('company_configs')
    .select('config')
    .eq('id', slug)
    .single()

  if (error || !data?.config) return {}

  const cfg = data.config as Record<string, unknown>
  const contact = cfg.contact as Record<string, string> | undefined
  const company = cfg.company as Record<string, string> | undefined

  const result: Record<string, string> = {}
  if (contact?.phone) result[keyMap.phone] = contact.phone
  if (contact?.email) result[keyMap.email] = contact.email
  if (company?.short_name) result[keyMap.name] = company.short_name

  return result
}
