import { getPublishedArticles } from '@/lib/blog';

export interface SearchItem {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  series?: string;
  readingTime: number;
}

export function getSearchIndex(): SearchItem[] {
  return getPublishedArticles().map((article) => ({
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    tags: article.tags,
    series: article.series?.name,
    readingTime: article.readingTime,
  }));
}
