# Om AI Solutions Website

Public marketing website for Om AI Solutions LLC — AI-powered supply chain software and consulting.

## Architecture
- **Framework:** Next.js 16.1.6 + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui (new-york style)
- **Branding:** `@om-apex/brand` package (teal #0D9488 primary)
- **CMS:** Supabase-backed inline editing with `ai_` content key prefix
- **Blog:** Markdown-based (10-part series on AI in supply chain)
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
- `src/content/blog/` — 10-part markdown blog series
- `src/lib/blog.ts` — Markdown parsing with callout block support
- `src/lib/content.ts` — CMS content fetcher
- `src/contexts/EditModeContext.tsx` — Inline editing toggle
- `src/lib/hubspot.ts` — HubSpot contact form integration

## Design Reference
See `DESIGN.md` for detailed architecture, CMS system, and brand guidelines.

## Gotchas
1. **CMS edit mode** — activate with `?editMode=true` or Cmd/Ctrl+Shift+E
2. **Content key prefix** — all CMS keys use `ai_` prefix (e.g., `ai_hero_title`)
3. **Blog callout blocks** — `:::callout-next-up` and `:::callout-question` syntax preprocessed to HTML divs
4. **HubSpot sync** — contact form submissions create HubSpot contacts
