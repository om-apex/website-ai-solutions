export interface Article {
  part: number;
  seriesTotal: number;
  seriesTitle: string;
  subtitle: string;
  slug: string;
  published: boolean;
  headerImage: string;
}

export const articles: Article[] = [
  {
    part: 1,
    seriesTotal: 10,
    seriesTitle: 'AI in Supply Chain - 1 of 10',
    subtitle: "Part 1: Why Your Supply Chain Isn't Ready for AI (Yet)",
    slug: 'ai-in-supply-chain-1-of-10',
    published: true,
    headerImage: '/blog/headers/header-1.png',
  },
  {
    part: 2,
    seriesTotal: 10,
    seriesTitle: 'AI in Supply Chain - 2 of 10',
    subtitle: "Part 2: What AI Agents Actually Are (And Aren't)",
    slug: 'ai-in-supply-chain-2-of-10',
    published: true,
    headerImage: '/blog/headers/header-2.png',
  },
  {
    part: 3,
    seriesTotal: 10,
    seriesTitle: 'AI in Supply Chain - 3 of 10',
    subtitle:
      'Part 3: The Model Context Protocol (MCP) and Why It Will Transform Supply Chain Integration',
    slug: 'ai-in-supply-chain-3-of-10',
    published: true,
    headerImage: '/blog/headers/header-3.png',
  },
  {
    part: 4,
    seriesTotal: 10,
    seriesTitle: 'AI in Supply Chain - 4 of 10',
    subtitle:
      'Part 4: AI-Powered Demand Sensing: Beyond Traditional Forecasting',
    slug: 'ai-in-supply-chain-4-of-10',
    published: true,
    headerImage: '/blog/headers/header-4.png',
  },
  {
    part: 5,
    seriesTotal: 10,
    seriesTitle: 'AI in Supply Chain - 5 of 10',
    subtitle:
      'Part 5: MCP — The Nervous System of Multi-Agent Supply Chains',
    slug: 'ai-in-supply-chain-5-of-10',
    published: true,
    headerImage: '/blog/headers/header-5.png',
  },
  {
    part: 6,
    seriesTotal: 10,
    seriesTitle: 'AI in Supply Chain - 6 of 10',
    subtitle: 'Part 6: AI in Procurement and Sourcing',
    slug: 'ai-in-supply-chain-6-of-10',
    published: true,
    headerImage: '/blog/headers/header-6.png',
  },
  {
    part: 7,
    seriesTotal: 10,
    seriesTitle: 'AI in Supply Chain - 7 of 10',
    subtitle: 'Part 7: AI in Logistics and Transportation',
    slug: 'ai-in-supply-chain-7-of-10',
    published: false,
    headerImage: '/blog/headers/header-7.png',
  },
  {
    part: 8,
    seriesTotal: 10,
    seriesTitle: 'AI in Supply Chain - 8 of 10',
    subtitle: 'Part 8: AI in Risk Management and Resilience',
    slug: 'ai-in-supply-chain-8-of-10',
    published: false,
    headerImage: '/blog/headers/header-8.png',
  },
  {
    part: 9,
    seriesTotal: 10,
    seriesTitle: 'AI in Supply Chain - 9 of 10',
    subtitle: 'Part 9: AI in Sustainability and Circular Supply Chains',
    slug: 'ai-in-supply-chain-9-of-10',
    published: false,
    headerImage: '/blog/headers/header-9.png',
  },
  {
    part: 10,
    seriesTotal: 10,
    seriesTitle: 'AI in Supply Chain - 10 of 10',
    subtitle: 'Part 10: The Future of AI in Supply Chain',
    slug: 'ai-in-supply-chain-10-of-10',
    published: false,
    headerImage: '/blog/headers/header-10.png',
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getPublishedArticles(): Article[] {
  return articles.filter((a) => a.published);
}

export function getArticleByPart(part: number): Article | undefined {
  return articles.find((a) => a.part === part);
}
