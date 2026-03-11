import type { MetadataRoute } from 'next';
import { getPublishedArticles, getAllCategories, getAllSeries } from '@/lib/blog';
import { ARTICLES_PER_PAGE, categorySlug } from '@/lib/blog-utils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://omaisolutions.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getPublishedArticles();
  const categories = getAllCategories();
  const series = getAllSeries();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/newsletter`, changeFrequency: 'monthly', priority: 0.5 },
  ];

  // Blog article pages
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/blog/${article.slug}`,
    lastModified: article.date,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Blog pagination pages
  const totalBlogPages = Math.ceil(articles.length / ARTICLES_PER_PAGE);
  const paginationPages: MetadataRoute.Sitemap = [];
  for (let p = 2; p <= totalBlogPages; p++) {
    paginationPages.push({
      url: `${SITE_URL}/blog/page/${p}`,
      changeFrequency: 'weekly',
      priority: 0.5,
    });
  }

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/blog/category/${categorySlug(cat)}`,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  // Series pages
  const seriesPages: MetadataRoute.Sitemap = series.map((s) => ({
    url: `${SITE_URL}/blog/series/${s.slug}`,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...articlePages,
    ...paginationPages,
    ...categoryPages,
    ...seriesPages,
  ];
}
