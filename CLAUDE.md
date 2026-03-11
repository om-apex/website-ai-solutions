# Om AI Solutions Website

Public marketing website for Om AI Solutions LLC — AI-powered supply chain software and consulting.

## Architecture
- **Framework:** Next.js 16.1.6 + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui (new-york style)
- **Branding:** `@om-apex/brand` package (teal #0D9488 primary)
- **CMS:** Supabase-backed inline editing with `ai_` content key prefix
- **Blog:** Markdown-based with auto-discovery via gray-matter (drop `.md` in `src/content/blog/`, no registry needed)
- **Deployed URL:** https://om-ai-site.vercel.app / omaisolutions.com
- **GitHub Repo:** om-apex/website-ai-solutions
- **Supabase:** `hympgocuivzxzxllgmcy` (shared Owner Portal project)

## Key Directories
```
src/
├── app/              (routes: home, about, blog, contact, api/)
├── components/       (ContactForm, EditableText, Header, Footer, brand/, ui/, pages/)
├── contexts/         (ContentContext, EditModeContext)
├── content/          (blog/ with 10 markdown articles)
├── lib/              (blog.ts, brand.ts, content.ts, hubspot.ts, supabase/)
└── middleware.ts
```

## Development
- **Local Port:** 3002
- **Dev Server:** `npm run dev`
- **Build:** `npm run build`
- **Deploy:** Auto-deploy to Vercel on push to main

## Key Files
- `src/content/blog/` — Markdown articles with YAML frontmatter (auto-discovered at build time)
- `src/types/blog.ts` — Article, ArticleSeries, LegacyFrontmatter type definitions
- `src/lib/blog.ts` — Blog auto-discovery loader (gray-matter parsing + callout preprocessing)
- `src/lib/content.ts` — CMS content fetcher
- `src/contexts/EditModeContext.tsx` — Inline editing toggle
- `src/lib/hubspot.ts` — HubSpot contact form integration

## Design Reference
See `DESIGN.md` for detailed architecture, CMS system, and brand guidelines.

## Gotchas
1. **CMS edit mode** — activate with `?editMode=true` or Cmd/Ctrl+Shift+E
2. **Content key prefix** — all CMS keys use `ai_` prefix (e.g., `ai_hero_title`)
3. **Blog callout blocks** — `:::callout-next-up`, `:::callout-question`, and `:::hashtags` syntax preprocessed to HTML divs
4. **Blog auto-discovery** — drop `.md` file in `src/content/blog/`, no manual registry needed. Extended frontmatter: title, date, author, excerpt, category, tags, series
5. **HubSpot sync** — contact form submissions create HubSpot contacts
6. **Shared architecture** — nearly identical to Supply Chain site (shared patterns)
