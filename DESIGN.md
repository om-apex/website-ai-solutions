# Om AI Solutions Website — Design Document

## Overview

Marketing website for Om AI Solutions LLC, a subsidiary of Om Apex Holdings. Showcases AI-powered supply chain products (AI Quorum, Yard Shack, Floor Assistant, Voice & Vision Picking).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.1.6 (App Router) |
| Language | TypeScript 5, React 19 |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (Button, Card, Input, Textarea, Label) |
| Markdown | react-markdown + remark-gfm |
| Database | Supabase (shared Owner Portal project: `hympgocuivzxzxllgmcy`) |
| Icons | Lucide React |
| Deployment | Vercel |
| Dev Port | 3002 |

## Brand

| Element | Value |
|---------|-------|
| Primary Color | Navy #1E4D7C |
| Accent Color | Gold #C9A227 |
| Heading Font | Playfair Display (700) via next/font/google |
| Body Font | Space Grotesk (300-700) via next/font/google |
| Logo Name Font | Playfair Display font-bold (700), tracking-tight |
| Email | hello@omaisolutions.com |
| Location | Atlanta, Georgia |

## Directory Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (Header + Footer + EditModeProvider + RSS link)
│   ├── sitemap.ts              # Dynamic sitemap (blog, categories, series, static pages)
│   ├── page.tsx                # Home (server → HomePageClient)
│   ├── about/page.tsx          # About (server → AboutPageClient)
│   ├── blog/
│   │   ├── page.tsx            # Blog index — paginated card grid with category chips
│   │   ├── [slug]/page.tsx     # Individual article page (SSG via generateStaticParams)
│   │   ├── page/[page]/page.tsx          # Paginated blog listing (page 2+)
│   │   ├── category/[category]/page.tsx  # Category listing page
│   │   ├── category/[category]/page/[page]/page.tsx  # Paginated category listing
│   │   ├── series/[series-slug]/page.tsx # Series listing page (ordered by part)
│   │   └── rss.xml/route.ts     # RSS 2.0 feed (dynamic)
│   ├── contact/page.tsx        # Contact (server → ContactPageClient)
│   ├── newsletter/
│   │   ├── page.tsx            # Newsletter signup (server → NewsletterClient)
│   │   └── NewsletterClient.tsx # Email + name capture form
│   ├── ai-readiness-survey/
│   │   ├── page.tsx            # Survey placeholder (server → SurveyInterestClient)
│   │   └── SurveyInterestClient.tsx # Email capture ("notify when ready")
│   └── api/
│       ├── auth/callback/route.ts  # OAuth callback (Google → @omapex.com validation)
│       ├── cms/redeploy/route.ts   # CMS publish — triggers Vercel deploy hook
│       ├── contact/route.ts    # Contact form POST (→ Supabase leads + HubSpot)
│       ├── newsletter/route.ts # Newsletter signup POST (→ Supabase leads + HubSpot, tag: newsletter_ai)
│       └── survey-interest/route.ts # Survey interest POST (→ Supabase leads + HubSpot, tag: survey_interest_ai)
├── components/
│   ├── ContactForm.tsx          # Contact form (tabbed: Demo Request / General)
│   ├── brand/Logo.tsx          # Logo component (SVG + optional text)
│   ├── content/EditableText.tsx # CMS inline editing (EditableText, EditableList, EditableStat)
│   ├── layout/
│   │   ├── Header.tsx          # Sticky header with nav + "AI Readiness Survey" CTA button
│   │   └── Footer.tsx          # Minimal 3-line footer (copyright, contact, subsidiary attribution)
│   ├── pages/
│   │   ├── HomePageClient.tsx  # Home page client component
│   │   ├── AboutPageClient.tsx # About page client component
│   │   └── ContactPageClient.tsx # Contact page (tabbed form + direct contact)
│   ├── blog/
│   │   ├── BlogGrid.tsx       # Reusable article card grid
│   │   ├── Pagination.tsx     # Shared pagination with ellipsis truncation
│   │   └── SearchDialog.tsx   # Client-side fuzzy search (Fuse.js, Cmd+K)
│   └── ui/
│       ├── button.tsx          # Radix Button + CVA variants
│       ├── card.tsx            # Card component system
│       ├── input.tsx           # Input component
│       ├── textarea.tsx        # Textarea component
│       └── label.tsx           # Label component
├── contexts/
│   ├── ContentContext.tsx       # CMS content state provider
│   └── EditModeContext.tsx      # Edit mode + auth + login prompt + keyboard shortcut
├── content/
│   └── blog/
│       └── *.md                # Markdown articles with YAML frontmatter (auto-discovered)
├── types/
│   └── blog.ts                # Article, ArticleSeries, LegacyFrontmatter interfaces
└── lib/
    ├── blog.ts                 # Blog auto-discovery loader (gray-matter + callout preprocessing)
    ├── blog-utils.ts            # Pagination helper + category slug utilities
    ├── search-index.ts          # Build-time search index for Fuse.js
    ├── brand.ts                # Brand config (colors, fonts, company info)
    ├── content.ts              # DEFAULT_CONTENT (~60 keys, ai_ prefix)
    ├── content-fetcher.ts      # Server-side Supabase content fetch
    ├── hubspot.ts              # HubSpot v3 API helper (contacts + deals)
    ├── supabase/
    │   ├── client.ts           # SSR-aware browser client (@supabase/ssr)
    │   └── server.ts           # Server client with cookie handling
    └── utils.ts                # cn() utility
```

## CMS Integration

### Content Key Convention
All keys use `ai_` prefix: `ai_{page}_{section}_{descriptor}`

### Site Value
Supabase queries filter by `site = 'ai'`

### Data Flow
```
Server page.tsx
  → getSiteContent('ai')
  → merge with DEFAULT_CONTENT
  → pass to *PageClient
  → ContentProvider + EditableText components
  → Edits saved directly to Supabase client SDK
```

### Edit Mode
- Activated by `?editMode=true` URL parameter or `Cmd+Shift+E` / `Ctrl+Shift+E` keyboard shortcut
- Requires Google OAuth with @omapex.com Supabase auth (SSR-aware client via `@supabase/ssr`)
- If not authenticated, a floating "Sign in to edit" banner appears at top of page
- After OAuth login, user is redirected back to same page with editMode active
- Gold dashed outlines on editable fields, pencil icon on hover
- Click-to-edit modal saves to Supabase
- Floating "Publish Changes" button (bottom-right) triggers Vercel redeploy via `/api/cms/redeploy`
- Shows loading, success ("Live in ~60s"), and error states
- Middleware refreshes auth sessions on every request (no route protection — site stays public)

## Pages

### Home
- Hero: tagline, heading, description, 2 CTAs
- Products: 4 product cards (AI Quorum, Yard Shack, Floor Assistant, Voice & Vision Picking)
- Features: "Why Om AI Solutions?" + 6 feature bullets + stats box
- CTA: "Ready to start your AI journey" — dark rounded-3xl card with "AI Readiness Survey" button → `/ai-readiness-survey`

### About
- Hero: heading, description
- Our Story: narrative paragraphs + stats cards
- Mission/Vision/Approach: 3 cards
- Leadership: Nishad Tambe profile
- Parent Company: link to Om Apex Holdings

### Contact
- Hero: heading, description
- Contact Form: Tabbed — "Request a Demo" (demo_request) / "General Inquiry" (general)
  - Submits to /api/contact → Supabase leads table + HubSpot CRM (dual-write)
  - Fields: First Name, Last Name, Email*, Company, Phone, Message*
  - Rate limited: 5 per IP per 10 minutes
- Direct Contact: Email + Location + Phone (if set)
- Parent Company: link to Om Apex Holdings

### Newsletter (/newsletter)
- Email + optional name signup form
- Submits to /api/newsletter → Supabase leads table + HubSpot CRM (tag: `newsletter_ai`)
- Success/error states displayed inline

### AI Readiness Survey (/ai-readiness-survey)
- Placeholder page — survey to be developed separately
- Email capture: "Leave your email — we'll notify you when the survey is ready"
- Submits to /api/survey-interest → Supabase leads table + HubSpot CRM (tag: `survey_interest_ai`)

### Blog
- Index: `/blog` — paginated card grid (12/page) with category filter chips, sorted by date
- Pagination: `/blog/page/[page]` — pages 2+ for main listing
- Categories: `/blog/category/[category]` — articles filtered by category, paginated
- Series: `/blog/series/[series-slug]` — sequential reading order by part number
- Articles: `/blog/[slug]` — SSG pages with header image, author/date/reading time, markdown body, callout blocks, prev/next nav
- Content files: `src/content/blog/*.md` with extended YAML frontmatter (auto-discovered at build time via `gray-matter`)
- Extended frontmatter: `title`, `date`, `author`, `excerpt`, `category`, `tags[]`, `series` (name/part/total), `published`, `headerImage`
- Reading time: calculated at build time from word count (~200 wpm)
- Adding articles: drop new `.md` file in `src/content/blog/`, redeploy — no registry editing needed
- Backward compat: legacy frontmatter format (`part`, `seriesTotal`, `seriesTitle`, `subtitle`) auto-mapped to new interface
- Shared components: `BlogGrid` (reusable card grid), `Pagination` (page numbers with ellipsis), `SearchDialog` (Fuse.js fuzzy search, Cmd+K)
- RSS: `/blog/rss.xml` — RSS 2.0 feed with all published articles
- Sitemap: `/sitemap.xml` — includes all blog, category, series, and static pages
- Search: client-side fuzzy search via Fuse.js (~6KB), triggered by search button or Cmd+K

## Deployment

- **Platform**: Vercel
- **Domain**: omaisolutions.com (when DNS configured)
- **Build**: `next build`
- **Environment**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `HUBSPOT_API_KEY_OMAPEX`, `VERCEL_DEPLOY_HOOK_URL`
