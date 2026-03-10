# Implementation Plan — TASK-393 / REQ-02: Blog Pages, Styling, and Navigation Integration

**Task:** TASK-393
**Requirement:** REQ-02
**Date:** 2026-03-09
**Status:** Ready for Execution
**Complexity:** Medium
**Total Steps:** 6
**Steps Remaining:** 6
**Depends On:** REQ-01

---

## Overview

Build the blog index page and individual article pages for the Om AI Solutions website. The index page displays article cards in ascending order with header thumbnails and titles. Individual article pages render the markdown content from REQ-01 with brand-consistent styling — header image, blue horizontal rule, teal callout highlights, Segoe UI typography. Includes navigation integration, prev/next article links, and per-article SEO metadata.

## Scope

### In Scope
- Blog index page at `/blog` with article card grid
- Individual article page at `/blog/[slug]` with full content rendering
- Markdown-to-HTML rendering with custom callout support
- Blog-specific styling (blue rule, teal highlights, brand colors, Segoe UI)
- Previous/next article navigation on article pages
- "Blog" link in site header navigation
- Per-article Open Graph and SEO metadata (title, description, og:image)
- Responsive layout (mobile, tablet, desktop)

### Out of Scope
- Content creation or PDF extraction (REQ-01)
- CMS editability for blog content (static markdown files)
- Comments, social features, RSS, search
- Analytics beyond existing PostHog site-wide setup

## Architecture Notes

- **Follow existing page pattern:** Server component fetches data, passes to client component (see `src/app/page.tsx` → `HomePageClient.tsx`). Blog pages can be fully server-rendered since content is static markdown — no client component needed unless CMS editing is required.
- **Markdown rendering:** Use a lightweight markdown renderer. Options:
  - `react-markdown` + `remark-gfm` — well-maintained, supports custom components
  - Manual parsing — overkill for this use case
  - **Decision: Use `react-markdown` with custom renderers** for callout blocks
- **Callout parsing:** The `:::callout-*` markers from REQ-01 markdown files need custom parsing. Parse them before passing to react-markdown, converting to `<div>` elements with CSS classes.
- **Static generation:** Use `generateStaticParams()` for article pages — all slugs are known at build time. This gives optimal performance and SEO.
- **Card component:** Use existing shadcn Card component for index page cards, consistent with the rest of the site.
- **No new CMS content keys:** Blog content lives in markdown files, not in the Supabase CMS system. This avoids complexity and keeps articles version-controlled in git.

## Sub-Agent Roles Involved

- **Developer:** Builds all components, pages, and styles
- **Solution Architect (lead):** Reviews integration points and styling decisions

---

## Execution Steps

### Step 1: Install Markdown Rendering Dependencies
- **Agent:** Developer
- **Status:** [ ] Incomplete
- **Reads:**
  - `package.json`
- **Creates/Modifies:**
  - `package.json` (add dependencies)
- **Task:** Install `react-markdown` and `remark-gfm` for markdown rendering:
  ```
  npm install react-markdown remark-gfm
  ```
  These are the only new dependencies needed. `react-markdown` renders markdown as React components; `remark-gfm` adds GitHub-flavored markdown support (tables, strikethrough, etc.).
- **Completion Check:** `npm install` succeeds, `react-markdown` and `remark-gfm` in `package.json` dependencies
- **Depends On:** None

### Step 2: Create Blog Utility — Markdown Parser with Callout Support
- **Agent:** Developer
- **Status:** [ ] Incomplete
- **Reads:**
  - `src/content/blog/index.ts` (from REQ-01 — article metadata)
  - Sample markdown files from REQ-01 (content structure)
  - `src/lib/utils.ts` (existing utility patterns)
- **Creates/Modifies:**
  - `src/lib/blog.ts`
- **Task:** Create a blog utility module that:
  1. Reads a markdown file by slug from `src/content/blog/`
  2. Parses YAML frontmatter (extract metadata)
  3. Pre-processes the markdown body to convert `:::callout-next-up` and `:::callout-question` blocks into HTML `<div>` elements with CSS class names (e.g., `<div class="callout callout-next-up">`)
  4. Exports: `getArticleContent(slug: string): { metadata, content }` — reads and parses a single article
  5. Re-exports helper functions from `src/content/blog/index.ts` for convenience

  Note: Frontmatter parsing can use a simple regex or the `gray-matter` package. Since frontmatter is simple YAML, a lightweight regex approach is preferred to avoid another dependency. Alternatively, since the index.ts from REQ-01 already has all metadata, this function only needs to read the markdown body (everything after the second `---`).
- **Completion Check:** `getArticleContent('ai-in-supply-chain-1-of-10')` returns metadata object and processed markdown string
- **Depends On:** Step 1, REQ-01

### Step 3: Create Blog Index Page
- **Agent:** Developer
- **Status:** [ ] Incomplete
- **Reads:**
  - `src/app/page.tsx` (existing page pattern)
  - `src/components/pages/HomePageClient.tsx` (card layout patterns)
  - `src/content/blog/index.ts` (article metadata)
  - `src/lib/brand.ts` (brand colors)
  - `src/components/ui/card.tsx` (shadcn Card)
- **Creates/Modifies:**
  - `src/app/blog/page.tsx`
- **Task:** Create the blog index page as a server component:
  1. Import `getPublishedArticles()` from the blog content index
  2. Render a page header: "AI in Supply Chain" series title with brief intro
  3. Render a responsive grid of article cards (1 col mobile, 2 col tablet, 3 col desktop)
  4. Each card shows:
     - Header PNG thumbnail (from `headerImage` path, using Next.js `Image` component)
     - Series title (e.g., "AI in Supply Chain - 6 of 10")
     - Article subtitle overlaid on or below the thumbnail (e.g., "Part 6: RAG in the Warehouse — Grounding Your Agents in Reality")
     - Link wrapping the entire card → `/blog/[slug]`
  5. Cards sorted ascending by part number (Part 1 first)
  6. Export metadata for SEO: title "Blog | Om AI Solutions", description about the article series
  7. Use existing brand colors: primary navy for headings, gold accent for part number badges
- **Completion Check:** `/blog` renders in dev server showing article cards for articles 1-6, cards are clickable, responsive grid works at all breakpoints
- **Depends On:** Step 2

### Step 4: Create Individual Article Page
- **Agent:** Developer
- **Status:** [ ] Incomplete
- **Reads:**
  - `src/app/blog/page.tsx` (from Step 3 — consistency)
  - `src/lib/blog.ts` (from Step 2 — content loading)
  - `src/content/blog/index.ts` (article metadata for prev/next)
  - `src/lib/brand.ts` (brand colors)
- **Creates/Modifies:**
  - `src/app/blog/[slug]/page.tsx`
- **Task:** Create the individual article page:
  1. `generateStaticParams()` — return all published article slugs for static generation
  2. `generateMetadata()` — per-article title, description, og:image (header PNG), og:type "article"
  3. Page component (server component):
     - Load article content via `getArticleContent(slug)`
     - If article not found or not published → `notFound()`
     - Render:
       a. **Header image** — full-width or max-width constrained, using Next.js `Image`
       b. **Blue horizontal rule** — `<hr>` styled with brand primary color (#1E4D7C), 3px solid
       c. **Article title** — `<h1>` with part number
       d. **Article body** — rendered via `react-markdown` with `remark-gfm`
       e. **Custom components** for react-markdown: map callout divs to styled callout boxes with teal background/accent
       f. **Previous/next navigation** — links to adjacent articles in the series at the bottom
  4. Style callout blocks:
     - "Next up:" → teal left border + light teal background
     - "Question for you:" → teal left border + light teal background
     - Both use a distinct visual treatment from regular body text
  5. Typography: Segoe UI body font, Georgia headings (matching site convention from `globals.css`)
- **Completion Check:** `/blog/ai-in-supply-chain-1-of-10` renders full article with header image, blue rule, styled body, teal callouts, and prev/next links. All 6 published articles render correctly.
- **Depends On:** Step 2, Step 3

### Step 5: Add Blog Link to Site Navigation
- **Agent:** Developer
- **Status:** [ ] Incomplete
- **Reads:**
  - `src/components/layout/Header.tsx`
- **Creates/Modifies:**
  - `src/components/layout/Header.tsx`
- **Task:** Add "Blog" to the navigation links array in Header.tsx:
  ```typescript
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ]
  ```
  This integrates with both desktop and mobile nav since both read from the same array. Verify the active link highlight works for `/blog` and `/blog/[slug]` paths (the existing `usePathname()` check in Header.tsx should handle this — may need `pathname.startsWith('/blog')` logic).
- **Completion Check:** "Blog" link appears in header nav (desktop and mobile), active state works on blog pages
- **Depends On:** None (can be done independently)

### Step 6: Blog-Specific CSS Styles
- **Agent:** Developer
- **Status:** [ ] Incomplete
- **Reads:**
  - `src/app/globals.css` (existing CSS custom properties, brand colors)
  - `src/lib/brand.ts` (brand hex values)
- **Creates/Modifies:**
  - `src/app/globals.css` (append blog-specific styles)
- **Task:** Add blog-specific styles to the global CSS file (or a dedicated blog stylesheet imported in the blog layout). Styles needed:
  1. **Article body typography:** Prose-like styling for markdown-rendered content — line-height, paragraph spacing, heading sizes, list styling. Use Tailwind's `@apply` or plain CSS.
  2. **Blue horizontal rule:** `.blog-rule` — 3px solid #1E4D7C, margin spacing
  3. **Callout blocks:**
     - `.callout` — shared base: left border 4px, padding, margin, border-radius
     - `.callout-next-up` — teal accent color (#008080 or similar teal from the PDFs), light teal background
     - `.callout-question` — same teal treatment
  4. **Article card hover state:** Subtle shadow/scale on hover for index page cards
  5. **Part number badge:** Gold (#C9A227) background with white text, small rounded pill
  6. **Hashtag styling:** Teal colored, inline list at article bottom
  7. Ensure all styles are responsive
- **Completion Check:** Blog pages render with correct brand styling at all breakpoints. Blue rule, teal callouts, gold badges, and typography all match the PDF visual style.
- **Depends On:** Step 3, Step 4

---

## Risks & Assumptions

- **react-markdown compatibility:** React 19 + Next.js 16 should work with latest react-markdown. If compatibility issues arise, fallback is `next-mdx-remote` or manual HTML rendering.
- **Callout parsing:** The `:::` fence syntax is not standard markdown. Pre-processing before passing to react-markdown is the safest approach. If callouts don't parse cleanly, an alternative is storing callout content in frontmatter as separate fields.
- **Static generation:** `generateStaticParams` works well for a fixed set of articles. When articles 7-10 are added, a rebuild/redeploy is needed — this is expected behavior for static content.
- **Image optimization:** Next.js `Image` component will handle responsive sizing and lazy loading automatically. Header PNGs should be reasonable sizes (the originals from Google Drive will be used as-is per REQ-01 scope).

## Open Questions

None — all questions resolved during PRD review.
