# Implementation Plan — TASK-393 / REQ-01: Content Pipeline — PDF to Markdown Conversion

**Task:** TASK-393
**Requirement:** REQ-01
**Date:** 2026-03-09
**Status:** Complete
**Complexity:** Medium
**Total Steps:** 4
**Steps Remaining:** 0
**Depends On:** None

---

## Overview

Extract text content from all 10 article PDFs, convert each to a structured markdown file with YAML frontmatter, and copy header PNG images into the repo's public directory. This creates the static content layer that REQ-02's blog pages will render. Articles 1-6 are marked published; 7-10 are marked draft.

## Scope

### In Scope
- Reading all 10 PDFs from Google Drive and extracting text
- Converting extracted text to markdown preserving structure (headings, paragraphs, bullet lists)
- Identifying and marking special callout sections ("Next up:", "Question for you:") with a consistent marker format
- Creating YAML frontmatter for each article (title, subtitle, part number, slug, published flag, series total)
- Copying and normalizing header PNG filenames into `public/blog/`
- Creating an article metadata index file for the blog pages to consume

### Out of Scope
- Blog page components (REQ-02)
- Styling or rendering (REQ-02)
- CMS integration — content is static files in the repo

## Architecture Notes

- **Content format:** Markdown files with YAML frontmatter, stored in `src/content/blog/`
- **Image location:** `public/blog/headers/` with normalized filenames (`header-1.png` through `header-10.png`)
- **Callout markers:** Use custom markdown convention for teal-highlighted sections:
  - `:::callout-next-up` / `:::` for "Next up:" blocks
  - `:::callout-question` / `:::` for "Question for you:" blocks
  - REQ-02 will parse these during rendering
- **Frontmatter schema:**
  ```yaml
  ---
  part: 6
  seriesTotal: 10
  seriesTitle: "AI in Supply Chain - 6 of 10"
  subtitle: "Part 6: RAG in the Warehouse — Grounding Your Agents in Reality"
  slug: "ai-in-supply-chain-6-of-10"
  published: true
  headerImage: "/blog/headers/header-6.png"
  ---
  ```
  - `seriesTitle` = "AI in Supply Chain - N of 10" (the series naming)
  - `subtitle` = the article's main heading (e.g., "Part 6: RAG in the Warehouse...")
  - "In AI - Context is the King" is the Om AI Solutions site-wide tagline, NOT per-article
- **Article index:** A single `src/content/blog/index.ts` file that exports the article metadata array, making it easy for blog pages to list and query articles without reading all markdown files at build time.

## Sub-Agent Roles Involved

- **Solution Architect (solo):** Reads PDFs, converts content, writes all files. No team needed for this requirement.

---

## Execution Steps

### Step 1: Read All PDFs and Extract Text Content
- **Agent:** Solution Architect
- **Status:** [x] Complete
- **Reads:**
  - All 10 PDFs from `/Users/nishad/Library/CloudStorage/GoogleDrive-nishad@omapex.com/Shared drives/om-apex-drive/business-plan/05 Marketing/Om AI Solutions/Article Series/`
- **Creates/Modifies:** Working notes (in-memory) — no files written yet
- **Task:** Read each of the 10 PDFs using the Read tool. For each PDF, capture:
  - The article title (e.g., "Part 6: RAG in the Warehouse — Grounding Your Agents in Reality")
  - The subtitle from the header image (e.g., "In AI - Context is the King")
  - All section headings
  - All body text (paragraphs, bullet lists)
  - Location of "Next up:" and "Question for you:" callout sections
  - Any hashtags at the end
  Note: Header images are separate PNG files, not extracted from PDFs.
- **Completion Check:** All 10 articles' text content captured with structure identified
- **Depends On:** None

### Step 2: Create Markdown Content Files
- **Agent:** Solution Architect
- **Status:** [x] Complete
- **Reads:** Extracted text from Step 1
- **Creates/Modifies:**
  - `src/content/blog/ai-in-supply-chain-1-of-10.md`
  - `src/content/blog/ai-in-supply-chain-2-of-10.md`
  - `src/content/blog/ai-in-supply-chain-3-of-10.md`
  - `src/content/blog/ai-in-supply-chain-4-of-10.md`
  - `src/content/blog/ai-in-supply-chain-5-of-10.md`
  - `src/content/blog/ai-in-supply-chain-6-of-10.md`
  - `src/content/blog/ai-in-supply-chain-7-of-10.md`
  - `src/content/blog/ai-in-supply-chain-8-of-10.md`
  - `src/content/blog/ai-in-supply-chain-9-of-10.md`
  - `src/content/blog/ai-in-supply-chain-10-of-10.md`
- **Task:** For each article, create a markdown file with:
  1. YAML frontmatter (part, seriesTotal, title, slug, subtitle, published flag, headerImage path)
  2. Article body converted to proper markdown:
     - `## ` for section headings
     - Paragraphs separated by blank lines
     - `- ` for bullet lists
     - `:::callout-next-up` wrapper around "Next up:" content
     - `:::callout-question` wrapper around "Question for you:" content
     - Hashtags as a final `:::hashtags` block
  3. Articles 1-6: `published: true`
  4. Articles 7-10: `published: false`
- **Completion Check:** All 10 `.md` files exist in `src/content/blog/` with valid frontmatter and properly structured markdown
- **Depends On:** Step 1

### Step 3: Copy and Normalize Header PNG Images
- **Agent:** Solution Architect
- **Status:** [x] Complete
- **Reads:**
  - All 10 PNG files from Google Drive Article Series folder
- **Creates/Modifies:**
  - `public/blog/headers/header-1.png` through `public/blog/headers/header-10.png`
- **Task:** Copy each header PNG from Google Drive to `public/blog/headers/` with normalized filenames. Handle the naming inconsistency (article 4 uses underscores: `AI_in_Supply_Chain__4_of_10.png`). Verify all 10 images copied successfully.
- **Completion Check:** `ls public/blog/headers/` shows 10 files: `header-1.png` through `header-10.png`
- **Depends On:** None (can run in parallel with Step 2)

### Step 4: Create Article Metadata Index
- **Agent:** Solution Architect
- **Status:** [x] Complete
- **Reads:**
  - All 10 markdown files from Step 2 (frontmatter)
- **Creates/Modifies:**
  - `src/content/blog/index.ts`
- **Task:** Create a TypeScript index file that exports:
  1. An `Article` type definition with all frontmatter fields
  2. An `articles` array with metadata for all 10 articles (sorted by part number ascending)
  3. Helper functions: `getArticleBySlug(slug: string)`, `getPublishedArticles()`, `getArticleByPart(part: number)`
  This file is the single import point for blog pages — they don't need to parse markdown frontmatter themselves.
- **Completion Check:** `src/content/blog/index.ts` exports articles array with 10 entries, helper functions compile without TypeScript errors
- **Depends On:** Step 2

---

## Risks & Assumptions

- **PDF text extraction quality:** Claude's Read tool handles PDFs well, but complex formatting (tables, multi-column layouts) may need manual cleanup. The article PDFs appear to be single-column text-heavy documents, so extraction should be clean.
- **Image file sizes:** Header PNGs from Google Drive may be large. No optimization is in scope for REQ-01, but if images are >500KB each, a follow-up optimization task may be warranted.

## Open Questions

None — all questions resolved during PRD review.
