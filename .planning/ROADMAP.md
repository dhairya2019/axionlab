# Roadmap: AXIONLAB Website

## Overview

This roadmap covers two milestones. **v1.0 (Phases 1-4)** migrated AXIONLAB from a Vite SPA to Next.js App Router with an MDX blog — fully complete. **v2.0 (Phases 5-7)** takes the site from zero Google indexing to first-page ranking for brand and niche service keywords through structured data, content scale, internal linking, and Core Web Vitals optimisation.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

### v1.0: Website Foundation (Complete)

- [x] **Phase 1: Next.js Migration Foundation** - Replace Vite + hash routing with Next.js App Router; all existing pages, routes, and APIs work at clean URLs (completed 2026-03-07)
- [x] **Phase 2: Blog Infrastructure** - MDX-based Insights blog at /insights with SSG, syntax highlighting, and tag filtering (completed 2026-03-08)
- [x] **Phase 3: SEO and Metadata** - Per-page metadata, sitemap.xml, robots.txt, and hash URL backward compatibility (completed 2026-03-08)
- [x] **Phase 4: Blog Enhancements** - Code copy buttons, custom callout components, and prev/next post navigation (completed 2026-03-08)

### v2.0: SEO & Discoverability

- [ ] **Phase 5: Technical SEO Foundation** - JSON-LD structured data, single H1 per page, canonical URLs, OG image, and GSC setup instructions enable Google to correctly index and understand all pages
- [ ] **Phase 6: Content & Internal Linking** - 10+ SEO-optimised blog posts targeting niche long-tail keywords, with descriptive anchor text and alt text throughout, create a crawlable content graph that builds topical authority
- [ ] **Phase 7: Performance SEO** - Core Web Vitals pass (LCP under 2.5s, CLS under 0.1) with optimised images and no render-blocking resources so ranking signals are not suppressed by poor page experience scores

## Phase Details

### Phase 1: Next.js Migration Foundation
**Goal**: The existing AXIONLAB site runs on Next.js App Router with all pages accessible at clean URLs, API routes working, Framer Motion animations intact, and no visual regression from the current dark theme
**Depends on**: Nothing (first phase)
**Requirements**: MIG-01, MIG-02, MIG-03, MIG-04, MIG-05, RTG-01, RTG-02, RTG-03, RTG-04, RTG-05, RND-01, RND-02, RND-03, RND-04, API-01, API-02, API-03
**Success Criteria** (what must be TRUE):
  1. `next build` completes without errors and all 7 pages are accessible at clean URLs (/philosophy, /capabilities, /work, /insights, /careers, /initiate)
  2. The site background renders as #080808 (not #0e0e0e) — Tailwind PostCSS uses CDN color values as canonical
  3. The AI chatbot widget sends messages and receives Gemini responses; the Initiate contact form submits without error
  4. Framer Motion page animations play on all pages; browser network tab shows zero requests to fonts.googleapis.com
  5. Navigating to /#/work in a browser redirects to /work; a custom 404 page appears for invalid paths
**Plans**: 5 plans
- [x] 01-01-PLAN.md — Build system foundation (vercel.json, package.json, tsconfig, postcss, next.config)
- [x] 01-02-PLAN.md — Tailwind v4 @theme with canonical colors + layout.tsx with next/font and hash redirect
- [x] 01-03-PLAN.md — API route migration (chat + send-email Route Handlers)
- [x] 01-04-PLAN.md — Navigation, MotionWrapper, Chatbot, Footer, all pages, and 404 page
- [x] 01-05-PLAN.md — Legacy file cleanup + next build verification + visual sign-off

### Phase 2: Blog Infrastructure
**Goal**: The Insights section is a functional MDX blog at /insights with a listing page, individual post pages generated at build time, syntax-highlighted code blocks, prose typography in the AXIONLAB design language, and tag-based filtering
**Depends on**: Phase 1
**Requirements**: BLG-01, BLG-02, BLG-03, BLG-04, BLG-05, BLG-06, BLG-07, BLG-08, BLG-09, BLG-10
**Success Criteria** (what must be TRUE):
  1. An MDX file placed in content/blog/ with valid frontmatter appears as a card on /insights showing title, date, reading time estimate, and tags
  2. Clicking a post card navigates to /insights/[slug] which renders the full post with prose typography matching the AXIONLAB dark theme
  3. Code blocks in posts render with syntax highlighting; no JavaScript is shipped to the client for highlighting
  4. Clicking a tag on the listing page filters visible posts to only those with that tag, without a page reload
  5. Accessing /insights/a-nonexistent-slug returns a 404 page (dynamicParams = false is enforced)
**Plans**: 4 plans
- [x] 02-01-PLAN.md — MDX build system + content infrastructure (packages, next.config.mjs, lib/blog.ts, mdx-components.tsx, typography, seed post)
- [x] 02-02-PLAN.md — Blog listing page with tag filtering (PostCard, TagFilter, app/insights/page.tsx)
- [x] 02-03-PLAN.md — Individual post pages with SSG and per-post SEO (app/insights/[slug]/page.tsx, generateStaticParams, generateMetadata)
- [x] 02-04-PLAN.md — Sitemap + build verification + visual sign-off (app/sitemap.ts, next build --webpack, self-verified)

### Phase 3: SEO and Metadata
**Goal**: Every page has unique, correct SEO metadata (title, description, OpenGraph, Twitter cards); /sitemap.xml includes all pages and blog posts with dates; /robots.txt allows all crawlers; old hash URLs redirect to clean paths
**Depends on**: Phase 2
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04
**Success Criteria** (what must be TRUE):
  1. `curl https://axionlab.in/philosophy` contains a unique `<title>` tag and `<meta name="description">` specific to the Philosophy page
  2. `/sitemap.xml` includes all 7 marketing pages and all blog post URLs with correct lastmod dates from frontmatter
  3. `/robots.txt` is present and allows all crawlers
  4. Social sharing a blog post URL on LinkedIn or X renders the correct OG title, description, and image
**Plans**: 2 plans
- [x] 03-01-PLAN.md — Root layout metadata (metadataBase, title template, OG/Twitter) + robots.ts + static metadata for 5 Server Component pages
- [x] 03-02-PLAN.md — Client page refactors (Home + Initiate extract to client components) + metadata exports + build verification

### Phase 4: Blog Enhancements
**Goal**: The blog reading experience is polished — code blocks have copy-to-clipboard, custom callout components are available for authors, and readers can navigate between posts
**Depends on**: Phase 3
**Requirements**: BLE-01, BLE-02, BLE-03
**Success Criteria** (what must be TRUE):
  1. Every code block in a post has a working copy-to-clipboard button that copies the code text to the system clipboard
  2. An MDX file using `<Info>`, `<Warning>`, or `<Tip>` renders styled callout boxes in the AXIONLAB design language
  3. At the bottom of any post (when 3 or more posts exist), previous and next post links appear and navigate correctly
**Plans**: 2 plans
- [x] 04-01-PLAN.md — Copy-to-clipboard buttons (rehype plugins + CopyButton component) + callout components (Info, Warning, Tip)
- [x] 04-02-PLAN.md — Prev/next post navigation (getAdjacentPosts + PostNavigation component + 2 additional seed posts)

### Phase 5: Technical SEO Foundation
**Goal**: Every page on axionlab.in is structurally correct for Google to crawl, understand, and index — JSON-LD schemas tell Google what the site is, canonical tags prevent duplicate content penalties, a single H1 per page signals topic focus, a branded OG image enables social sharing, and the site owner has clear instructions to connect Google Search Console
**Depends on**: Phase 4
**Requirements**: TSEO-01, TSEO-02, TSEO-03, TSEO-04, TSEO-05, INDX-01, INDX-02, INDX-03
**Success Criteria** (what must be TRUE):
  1. Google's Rich Results Test validates JSON-LD on the homepage (Organization + WebSite schemas) and on any blog post page (Article schema with author, datePublished, headline)
  2. Viewing page source on any page shows exactly one `<h1>` tag containing the page's primary keyword (e.g. homepage H1 contains "systems engineering")
  3. Every page response includes a `<link rel="canonical">` pointing to its canonical https://axionlab.in/... URL
  4. Sharing any axionlab.in URL on Slack, LinkedIn, or X renders the branded OG image with the page title and description
  5. A site owner following the GSC documentation can complete Search Console verification and submit the sitemap without needing to ask Claude for help
**Plans**: TBD

### Phase 6: Content & Internal Linking
**Goal**: axionlab.in has a content graph of 10+ SEO-optimised blog posts that target niche long-tail keywords across six defined clusters, with every post linking into service pages and every service page linking back to related posts — no orphan pages exist and every link uses descriptive anchor text with keyword-rich alt text on all images
**Depends on**: Phase 5
**Requirements**: CSEO-01, CSEO-02, CSEO-03, CSEO-04, CSEO-05, CSEO-06, TSEO-06, TSEO-07, INDX-04
**Success Criteria** (what must be TRUE):
  1. The /insights listing page shows 10 or more published posts, each with a unique target keyword visible in its title and meta description
  2. Clicking into any blog post shows a 1000+ word article with H2/H3 heading structure and at least one contextual link to a service page (/capabilities, /work, or /philosophy) using descriptive anchor text
  3. Visiting /capabilities (or /work or /philosophy) shows at least 2 inline links to related blog posts using descriptive anchor text — not "read more" or "click here"
  4. A crawler following links from the homepage can reach every page on the site within 3 clicks
  5. Every image in the codebase has a non-empty alt attribute containing a relevant keyword phrase
**Plans**: TBD

### Phase 7: Performance SEO
**Goal**: axionlab.in passes Core Web Vitals thresholds on mobile — LCP under 2.5 seconds, CLS under 0.1 — with no render-blocking resources and all images served through next/image so that poor page experience scores do not suppress search rankings
**Depends on**: Phase 6
**Requirements**: PERF-01, PERF-02, PERF-03, PERF-04
**Success Criteria** (what must be TRUE):
  1. PageSpeed Insights on mobile shows LCP at or below 2.5 seconds for the homepage and any blog post page
  2. PageSpeed Insights shows CLS at or below 0.1 across homepage, blog listing, and blog post pages
  3. Chrome DevTools Performance panel shows no render-blocking scripts or stylesheets delaying First Contentful Paint
  4. Every `<img>` element in the rendered HTML is served through next/image with explicit width and height attributes
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Next.js Migration Foundation | 5/5 | Complete | 2026-03-07 |
| 2. Blog Infrastructure | 4/4 | Complete | 2026-03-08 |
| 3. SEO and Metadata | 2/2 | Complete | 2026-03-08 |
| 4. Blog Enhancements | 2/2 | Complete | 2026-03-08 |
| 5. Technical SEO Foundation | 0/TBD | Not started | - |
| 6. Content & Internal Linking | 0/TBD | Not started | - |
| 7. Performance SEO | 0/TBD | Not started | - |
