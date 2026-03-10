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
│   ├── layout.tsx              # Root layout (Header + Footer + EditModeProvider)
│   ├── page.tsx                # Home (server → HomePageClient)
│   ├── about/page.tsx          # About (server → AboutPageClient)
│   ├── blog/
│   │   ├── page.tsx            # Blog index — article card grid (server component)
│   │   └── [slug]/page.tsx     # Individual article page (SSG via generateStaticParams)
│   ├── contact/page.tsx        # Contact (server → ContactPageClient)
│   ├── newsletter/
│   │   ├── page.tsx            # Newsletter signup (server → NewsletterClient)
│   │   └── NewsletterClient.tsx # Email + name capture form
│   ├── ai-readiness-survey/
│   │   ├── page.tsx            # Survey placeholder (server → SurveyInterestClient)
│   │   └── SurveyInterestClient.tsx # Email capture ("notify when ready")
│   └── api/
│       ├── auth/callback/route.ts  # OAuth callback (Google → @omapex.com validation)
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
│       ├── index.ts            # Article metadata array + helper functions
│       └── *.md                # 10 article markdown files with YAML frontmatter
└── lib/
    ├── blog.ts                 # Blog content loader (markdown reading + callout preprocessing)
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
- Index: `/blog` — responsive card grid (1/2/3 col) showing published articles ascending by part number
- Articles: `/blog/[slug]` — SSG pages with header image, blue rule, markdown body, teal callout blocks, prev/next nav
- Content: 10-part "AI in Supply Chain" series, articles 1-6 published, 7-10 draft
- Content files: `src/content/blog/ai-in-supply-chain-N-of-10.md` with YAML frontmatter
- Header images: `public/blog/headers/header-N.png`
- Callout blocks: `:::callout-next-up` and `:::callout-question` markers pre-processed to HTML divs, styled with teal accent
- Adding articles: drop new `.md` file + update `src/content/blog/index.ts` metadata array, redeploy

## Deployment

- **Platform**: Vercel
- **Domain**: omaisolutions.com (when DNS configured)
- **Build**: `next build`
- **Environment**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `HUBSPOT_API_KEY_OMAPEX`
