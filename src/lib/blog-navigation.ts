export interface ArticleHeading {
  id: string;
  title: string;
  level: 2 | 3;
}

function stripMarkdownFormatting(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[#>*-]/g, '')
    .trim();
}

function slugifyHeading(text: string): string {
  const normalized = stripMarkdownFormatting(text)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || 'section';
}

export function createHeadingIdFactory() {
  const seen = new Map<string, number>();

  return (rawText: string): string => {
    const base = slugifyHeading(rawText);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  };
}

export function extractArticleHeadings(markdown: string): ArticleHeading[] {
  const createId = createHeadingIdFactory();
  const headings: ArticleHeading[] = [];
  const matches = markdown.matchAll(/^(#{2,3})\s+(.+)$/gm);

  for (const match of matches) {
    const hashes = match[1];
    const level = hashes.length as 2 | 3;
    if (level !== 2 && level !== 3) {
      continue;
    }

    const title = stripMarkdownFormatting(match[2]);
    if (!title) {
      continue;
    }

    headings.push({
      id: createId(title),
      title,
      level,
    });
  }

  return headings;
}
