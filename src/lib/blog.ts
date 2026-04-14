import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Article, ArticleSeries, LegacyFrontmatter } from '@/types/blog'

export type { Article, ArticleSeries }

const CONTENT_DIR = path.join(process.cwd(), 'src/content/blog')

function normalizeMarkdownSyntax(markdown: string): string {
  return markdown
    .replace(/^(#{1,6})([^#\s])/gm, '$1 $2')
    .replace(/^[-—–]{3,}\s*$/gm, '---')
}

// --- Reading time calculation ---
function calculateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

// --- Excerpt generation ---
function generateExcerpt(content: string, maxLength = 160): string {
  const plain = content
    .replace(/^:::.*$/gm, '')                // callout markers
    .replace(/<[^>]+>/g, '')                 // HTML tags
    .replace(/#{1,6}\s+/g, '')               // headings
    .replace(/\*\*([^*]+)\*\*/g, '$1')       // bold
    .replace(/\*([^*]+)\*/g, '$1')           // italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
    .replace(/[-*+]\s+/g, '')                // list markers
    .replace(/\n+/g, ' ')                    // newlines to spaces
    .trim()
  if (plain.length <= maxLength) return plain
  return plain.slice(0, maxLength).replace(/\s+\S*$/, '') + '...'
}

// --- Series slug generation ---
function seriesSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// --- Legacy frontmatter detection and mapping ---
function isLegacyFrontmatter(data: Record<string, unknown>): boolean {
  return typeof data.part === 'number'
    && typeof data.seriesTotal === 'number'
    && typeof data.seriesTitle === 'string'
    && !data.title
    && !data.date
}

function mapLegacyToArticle(data: LegacyFrontmatter, content: string): Article {
  const seriesName = 'AI in Supply Chain'
  const series: ArticleSeries = {
    name: seriesName,
    slug: seriesSlug(seriesName),
    part: data.part,
    total: data.seriesTotal,
  }

  return {
    slug: data.slug,
    title: data.subtitle,
    subtitle: data.subtitle,
    date: '',
    author: 'Om AI Solutions Team',
    excerpt: generateExcerpt(content),
    published: data.published,
    headerImage: data.headerImage,
    category: 'AI & Technology',
    tags: ['AI', 'Supply Chain', 'Warehouse'],
    series,
    readingTime: calculateReadingTime(content),
    part: data.part,
    seriesTotal: data.seriesTotal,
    seriesTitle: data.seriesTitle,
  }
}

function mapExtendedToArticle(data: Record<string, unknown>, content: string, filename: string): Article {
  const slugFromFrontmatter = data.slug as string | undefined
  const slug = slugFromFrontmatter || filename.replace(/\.md$/, '')

  let series: ArticleSeries | undefined
  if (data.series && typeof data.series === 'object') {
    const s = data.series as { name: string; part: number; total: number }
    series = {
      name: s.name,
      slug: seriesSlug(s.name),
      part: s.part,
      total: s.total,
    }
  }

  return {
    slug,
    title: (data.title as string) || slug,
    subtitle: (data.subtitle as string) || (data.title as string) || slug,
    date: (data.date as string) || '',
    author: (data.author as string) || 'Om AI Solutions Team',
    excerpt: (data.excerpt as string) || generateExcerpt(content),
    published: data.published !== false,
    headerImage: (data.headerImage as string) || '',
    category: (data.category as string) || 'Uncategorized',
    tags: Array.isArray(data.tags) ? data.tags : [],
    series,
    readingTime: calculateReadingTime(content),
    ...(series ? {
      part: series.part,
      seriesTotal: series.total,
      seriesTitle: `${series.name} - ${series.part} of ${series.total}`,
    } : {}),
  }
}

// --- Load all articles from filesystem ---
function loadArticles(): Article[] {
  if (!fs.existsSync(CONTENT_DIR)) return []

  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'))
  const articles: Article[] = []

  for (const file of files) {
    try {
      const filePath = path.join(CONTENT_DIR, file)
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(raw)

      const article = isLegacyFrontmatter(data)
        ? mapLegacyToArticle(data as unknown as LegacyFrontmatter, content)
        : mapExtendedToArticle(data, content, file)

      articles.push(article)
    } catch (err) {
      console.warn(`Warning: Failed to parse ${file}:`, err)
    }
  }

  // Sort: by date descending (newest first), then by series part ascending for dateless
  articles.sort((a, b) => {
    if (a.date && b.date) return b.date.localeCompare(a.date)
    if (a.date) return -1
    if (b.date) return 1
    return (a.part ?? 0) - (b.part ?? 0)
  })

  return articles
}

// Module-level cache (loaded once per build/server start)
const _articles = loadArticles()

// --- Public API ---

export const articles: Article[] = _articles

export function getArticleBySlug(slug: string): Article | undefined {
  return _articles.find(a => a.slug === slug)
}

export function getPublishedArticles(): Article[] {
  return _articles.filter(a => a.published)
}

export function getArticleByPart(part: number): Article | undefined {
  return _articles.find(a => a.part === part)
}

export function getAllCategories(): string[] {
  const cats = new Set(_articles.filter(a => a.published).map(a => a.category))
  return Array.from(cats).sort()
}

export function getAllTags(): string[] {
  const tags = new Set(_articles.filter(a => a.published).flatMap(a => a.tags))
  return Array.from(tags).sort()
}

export function getAllSeries(): ArticleSeries[] {
  const seen = new Map<string, ArticleSeries>()
  for (const a of _articles.filter(a => a.published && a.series)) {
    if (!seen.has(a.series!.slug)) {
      seen.set(a.series!.slug, a.series!)
    }
  }
  return Array.from(seen.values())
}

export function getArticleContent(slug: string): { metadata: Article; content: string } | null {
  const metadata = getArticleBySlug(slug)
  if (!metadata) return null

  const filePath = path.join(CONTENT_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { content } = matter(raw)

  const processed = processCallouts(normalizeMarkdownSyntax(content))

  return { metadata, content: processed }
}

// --- Callout processor (preserved from original) ---

function processCallouts(markdown: string): string {
  return markdown.replace(
    /^:::(callout-next-up|callout-question|hashtags)\s*\n([\s\S]*?)^:::\s*$/gm,
    (_match, type: string, content: string) => {
      return `<div class="callout ${type}">\n\n${content.trim()}\n\n</div>`
    }
  )
}
