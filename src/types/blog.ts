export interface ArticleSeries {
  name: string       // e.g., "AI in Supply Chain"
  slug: string       // e.g., "ai-in-supply-chain" (derived from name)
  part: number       // e.g., 1
  total: number      // e.g., 10
}

export interface Article {
  // Core fields (always present after normalization)
  slug: string
  title: string
  subtitle: string
  date: string             // ISO date string: "2026-01-15"
  author: string           // default: "Nishad Tambe"
  excerpt: string          // first ~160 chars of content if not in frontmatter
  published: boolean
  headerImage: string

  // Taxonomy
  category: string         // default: "Uncategorized"
  tags: string[]           // default: []

  // Series (optional — only for series articles)
  series?: ArticleSeries

  // Computed
  readingTime: number      // minutes, calculated from word count

  // Legacy compat (kept for backward compat, mapped from series)
  part?: number
  seriesTotal?: number
  seriesTitle?: string
}

/**
 * Raw frontmatter as it exists in the old articles' YAML.
 * Used only for backward-compat mapping.
 */
export interface LegacyFrontmatter {
  part: number
  seriesTotal: number
  seriesTitle: string
  subtitle: string
  slug: string
  published: boolean
  headerImage: string
}
