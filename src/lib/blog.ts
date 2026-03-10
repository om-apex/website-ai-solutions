import fs from 'fs';
import path from 'path';
import { articles, getArticleBySlug, getArticleByPart, getPublishedArticles, type Article } from '@/content/blog';

export { articles, getArticleBySlug, getArticleByPart, getPublishedArticles, type Article };

const CONTENT_DIR = path.join(process.cwd(), 'src/content/blog');

export function getArticleContent(slug: string): { metadata: Article; content: string } | null {
  const metadata = getArticleBySlug(slug);
  if (!metadata) return null;

  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');

  // Strip frontmatter (everything between the first two ---)
  const bodyMatch = raw.match(/^---[\s\S]*?---\s*([\s\S]*)$/);
  const body = bodyMatch ? bodyMatch[1].trim() : raw;

  // Pre-process callout blocks: convert :::callout-* markers to HTML divs
  const content = processCallouts(body);

  return { metadata, content };
}

function processCallouts(markdown: string): string {
  // Convert :::callout-next-up ... ::: blocks to HTML divs
  // Convert :::callout-question ... ::: blocks to HTML divs
  // Convert :::hashtags ... ::: blocks to HTML divs
  return markdown.replace(
    /^:::(callout-next-up|callout-question|hashtags)\s*\n([\s\S]*?)^:::\s*$/gm,
    (_match, type: string, content: string) => {
      return `<div class="callout ${type}">\n\n${content.trim()}\n\n</div>`;
    }
  );
}
