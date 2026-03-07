# Requirements: AXIONLAB Website Migration

**Defined:** 2026-03-07
**Core Value:** Every page must be server-rendered with proper meta tags and crawlable URLs so search engines can discover and index AXIONLAB's content.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Migration Foundation

- [ ] **MIG-01**: Site builds and runs on Next.js App Router (replaces Vite + hash routing)
- [ ] **MIG-02**: Tailwind CSS processes via PostCSS with unified color config (#080808 background)
- [ ] **MIG-03**: Fonts load via next/font (Inter + Inter Tight) with zero layout shift
- [ ] **MIG-04**: vercel.json updated for Next.js framework (not Vite)
- [ ] **MIG-05**: Legacy files cleaned up (index.html, index.tsx, vite configs, unused components)

### Page Routing

- [ ] **RTG-01**: All 7 pages accessible at clean URLs (/philosophy, /capabilities, /work, /insights, /careers, /initiate)
- [ ] **RTG-02**: Navigation (Nav component) uses next/link with usePathname for active state
- [ ] **RTG-03**: Footer uses next/link for internal navigation
- [ ] **RTG-04**: Old hash URLs (/#/work) redirect to clean URLs (/work) via client-side script
- [ ] **RTG-05**: Custom 404 page in AXIONLAB design language

### Page Rendering

- [ ] **RND-01**: Static pages (Philosophy, Capabilities, Work, Careers) render as Server Components
- [ ] **RND-02**: Interactive pages (Home, Initiate) use "use client" with Framer Motion wrappers
- [ ] **RND-03**: Chatbot component works as client component with existing /api/chat endpoint
- [ ] **RND-04**: Root layout (app/layout.tsx) wraps all pages with Nav, Chatbot, Footer

### SEO

- [ ] **SEO-01**: Each page exports unique metadata (title, description, OpenGraph, Twitter cards)
- [ ] **SEO-02**: Root layout sets metadataBase for absolute OG URLs
- [ ] **SEO-03**: sitemap.ts auto-generates /sitemap.xml including all pages and blog posts
- [ ] **SEO-04**: robots.ts auto-generates /robots.txt allowing all crawlers

### API Routes

- [ ] **API-01**: /api/chat migrated to Next.js Route Handler (app/api/chat/route.ts)
- [ ] **API-02**: /api/send-email migrated to Next.js Route Handler (app/api/send-email/route.ts)
- [ ] **API-03**: Client-side fetch URLs unchanged — chatbot and contact form work without frontend changes

### Blog Infrastructure

- [ ] **BLG-01**: MDX files in content/blog/ with frontmatter (title, date, description, tags, author)
- [ ] **BLG-02**: Blog listing page at /insights renders post cards from filesystem scan
- [ ] **BLG-03**: Individual post pages at /insights/[slug] with SSG via generateStaticParams
- [ ] **BLG-04**: Prose typography via @tailwindcss/typography with AXIONLAB theme overrides
- [ ] **BLG-05**: Syntax-highlighted code blocks via rehype-pretty-code + Shiki
- [ ] **BLG-06**: Reading time estimate displayed per post
- [ ] **BLG-07**: Tag-based filtering on listing page (client-side)
- [ ] **BLG-08**: Per-post SEO metadata (title, description, OG tags from frontmatter)
- [ ] **BLG-09**: Blog posts auto-included in sitemap.ts
- [ ] **BLG-10**: mdx-components.tsx at project root for global MDX component registry

### Blog Enhancements

- [ ] **BLE-01**: Code block copy-to-clipboard button on all code blocks
- [ ] **BLE-02**: Custom MDX callout components (Info, Warning, Tip) in AXIONLAB design language
- [ ] **BLE-03**: Post-to-post navigation (prev/next links at bottom of each post)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Blog Enhancements

- **BLE-04**: Dynamic OG image generation per post (next/og ImageResponse)
- **BLE-05**: Table of contents for long posts (rehype-slug + sidebar)
- **BLE-06**: next/image optimization for MDX inline images
- **BLE-07**: Canonical URL in metadata for syndication protection

### Content & Discovery

- **DSC-01**: RSS feed generation for blog posts
- **DSC-02**: Search functionality on blog listing (when post count > 30)
- **DSC-03**: Pagination on listing page (when post count > 30)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Visual redesign | Keep existing design system intact — migration only |
| CMS integration | File-based MDX is simpler, free, version-controlled |
| Comments on posts | Requires moderation, backend storage, spam management |
| Newsletter signup | Complicates CTA hierarchy — existing contact form is sufficient |
| Like/reaction buttons | Requires persistent storage (no DB on Vercel free plan) |
| View counts/analytics | Requires storage — use Vercel Analytics passively instead |
| Dark/light toggle | AXIONLAB brand is dark-only by design |
| ISR | Vercel free plan — SSG + rebuild on deploy is sufficient |
| User authentication | Site is public-facing only |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| MIG-01 | Phase 1 | Pending |
| MIG-02 | Phase 1 | Pending |
| MIG-03 | Phase 1 | Pending |
| MIG-04 | Phase 1 | Pending |
| MIG-05 | Phase 1 | Pending |
| RTG-01 | Phase 2 | Pending |
| RTG-02 | Phase 2 | Pending |
| RTG-03 | Phase 2 | Pending |
| RTG-04 | Phase 2 | Pending |
| RTG-05 | Phase 2 | Pending |
| RND-01 | Phase 2 | Pending |
| RND-02 | Phase 2 | Pending |
| RND-03 | Phase 2 | Pending |
| RND-04 | Phase 2 | Pending |
| SEO-01 | Phase 3 | Pending |
| SEO-02 | Phase 3 | Pending |
| SEO-03 | Phase 3 | Pending |
| SEO-04 | Phase 3 | Pending |
| API-01 | Phase 2 | Pending |
| API-02 | Phase 2 | Pending |
| API-03 | Phase 2 | Pending |
| BLG-01 | Phase 4 | Pending |
| BLG-02 | Phase 4 | Pending |
| BLG-03 | Phase 4 | Pending |
| BLG-04 | Phase 4 | Pending |
| BLG-05 | Phase 4 | Pending |
| BLG-06 | Phase 4 | Pending |
| BLG-07 | Phase 4 | Pending |
| BLG-08 | Phase 4 | Pending |
| BLG-09 | Phase 4 | Pending |
| BLG-10 | Phase 4 | Pending |
| BLE-01 | Phase 5 | Pending |
| BLE-02 | Phase 5 | Pending |
| BLE-03 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 31 total
- Mapped to phases: 31
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-07*
*Last updated: 2026-03-07 after initial definition*
