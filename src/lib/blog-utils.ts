import type { Article } from '@/types/blog';

export const ARTICLES_PER_PAGE = 12;

export interface PaginatedResult {
  items: Article[];
  totalPages: number;
  currentPage: number;
}

export function paginateArticles(
  articles: Article[],
  page: number,
  perPage: number = ARTICLES_PER_PAGE
): PaginatedResult {
  const totalPages = Math.max(1, Math.ceil(articles.length / perPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * perPage;
  const items = articles.slice(start, start + perPage);

  return { items, totalPages, currentPage };
}

export function categorySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function categoryFromSlug(
  slug: string,
  categories: string[]
): string | undefined {
  return categories.find((cat) => categorySlug(cat) === slug);
}
