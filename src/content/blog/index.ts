export interface Article {
  part: number;
  seriesTotal: number;
  seriesTitle: string;
  subtitle: string;
  slug: string;
  published: boolean;
  headerImage: string;
}

export const articles: Article[] = [];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getPublishedArticles(): Article[] {
  return articles.filter((a) => a.published);
}

export function getArticleByPart(part: number): Article | undefined {
  return articles.find((a) => a.part === part);
}
