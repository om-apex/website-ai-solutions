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
| Database | Supabase (shared Owner Portal project: `hympgocuivzxzxllgmcy`) |
| Icons | Lucide React |
| Deployment | Vercel |
| Dev Port | 3002 |

## Brand

| Element | Value |
|---------|-------|
| Primary Color | Navy #1E4D7C |
| Accent Color | Gold #C9A227 |
| Heading Font | Georgia, serif |
| Body Font | Segoe UI, system-ui |
| Email | hello@omaisolutions.com |
| Location | Atlanta, Georgia |

## Directory Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (Header + Footer + EditModeProvider)
│   ├── page.tsx                # Home (server → HomePageClient)
│   ├── about/page.tsx          # About (server → AboutPageClient)
│   ├── contact/page.tsx        # Contact (server → ContactPageClient)
│   └── api/
│       └── contact/route.ts    # Contact form POST (→ Supabase leads + HubSpot)
├── components/
│   ├── ContactForm.tsx          # Contact form (tabbed: Demo Request / General)
│   ├── brand/Logo.tsx          # Logo component (SVG + optional text)
│   ├── content/EditableText.tsx # CMS inline editing (EditableText, EditableList, EditableStat)
│   ├── layout/
│   │   ├── Header.tsx          # Sticky header with nav + CTA
│   │   └── Footer.tsx          # 4-column footer (Company, Products, Links, Contact)
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
│   └── EditModeContext.tsx      # Edit mode + auth
└── lib/
    ├── brand.ts                # Brand config (colors, fonts, company info)
    ├── content.ts              # DEFAULT_CONTENT (~60 keys, ai_ prefix)
    ├── content-fetcher.ts      # Server-side Supabase content fetch
    ├── hubspot.ts              # HubSpot v3 API helper (contacts + deals)
    ├── supabase.ts             # Supabase client helper
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
Same as apex: `?editMode=true` URL param + @omapex.com Supabase auth.
Uses simplified EditableText (modal overlay instead of shadcn Popover).

## Pages

### Home
- Hero: tagline, heading, description, 2 CTAs
- Products: 4 product cards (AI Quorum, Yard Shack, Floor Assistant, Voice & Vision Picking)
- Features: "Why Om AI Solutions?" + 6 feature bullets + stats box
- CTA: closing call to action

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

## Deployment

- **Platform**: Vercel
- **Domain**: omaisolutions.com (when DNS configured)
- **Build**: `next build`
- **Environment**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `HUBSPOT_API_KEY_OMAPEX`
