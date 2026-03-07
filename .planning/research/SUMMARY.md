# Project Research Summary

**Project:** AXIONLAB — Vite SPA to Next.js App Router Migration + MDX Blog
**Domain:** Marketing/portfolio website with engineering blog (systems engineering services company)
**Researched:** 2026-03-07
**Confidence:** HIGH

## Executive Summary

AXIONLAB is a dark-themed React SPA (Vite + React 19 + Tailwind + Framer Motion) that needs to migrate to Next.js App Router for SSR/SSG, SEO, and a new MDX-based Insights blog at `/insights`. This is a well-understood migration with official guidance from Vercel — the technology choices are clear, the dependency tree is linear, and the main risk is not technical novelty but migration hygiene: a previous attempt was reverted (commit `b4f41ef`) due to a dual Tailwind config conflict and incorrect SPA routing assumptions. This time the migration must be done in strict dependency order, resolving the Tailwind color divergence and vercel.json cleanup before touching any page components.

The recommended approach is Next.js 16 (latest stable, v16.1.6) with `@next/mdx` for the blog, Tailwind v4 via PostCSS (eliminating the CDN dual-config root cause of the revert), `gray-matter` for frontmatter parsing, and `rehype-pretty-code` + Shiki for syntax highlighting. All library choices favor official, Vercel-maintained packages — alternatives like Contentlayer (abandoned) and next-mdx-remote (RSC unstable) are explicitly ruled out. The existing API routes (Gemini AI chat, SendGrid email) migrate to Next.js Route Handlers with a different function signature but identical business logic.

The key risks are concentrated in Phase 1 and are all preventable with a structured migration checklist: wrong vercel.json fields causing deployment to the wrong framework, Tailwind color values diverging between the CDN config and the PostCSS config, Framer Motion crashing Server Component pages, and API route handler signatures being copied verbatim from the old Vercel serverless format. None of these risks require new solutions — the research documents exactly what to do. The MDX blog phases are lower risk once the Next.js foundation is correct.

## Key Findings

### Recommended Stack

The migration removes Vite and the Tailwind CDN script, replacing them with Next.js 16 + Turbopack (default in v16), Tailwind v4 via `@tailwindcss/postcss`, and `next/font` for self-hosted Inter/Inter Tight. The MDX pipeline uses `@next/mdx` (official, Turbopack-compatible), `gray-matter` for frontmatter (two-pass: metadata for listing, MDX import for content), `rehype-pretty-code` + Shiki for server-side syntax highlighting, and `remark-gfm` + `rehype-slug` for GFM support and heading anchors. All SEO infrastructure (sitemap, robots.txt, OG metadata) uses native Next.js file conventions — no third-party packages needed.

**Core technologies:**
- `next@latest` (v16.x): App Router framework, SSG/SSR, metadata API, file routing — Turbopack is default; no additional flags needed
- `@next/mdx`: Official MDX integration for App Router — Vercel-maintained, RSC-stable, Turbopack-compatible; NOT next-mdx-remote (RSC unstable) or Contentlayer (abandoned)
- `gray-matter@^4`: Frontmatter parsing via `fs` scan — used for blog listing page and sitemap; not inside MDX files themselves
- `rehype-pretty-code` + `shiki@^1`: Zero-JS server-side syntax highlighting; all processing at build time
- `tailwindcss@latest` (v4) + `@tailwindcss/postcss`: Replaces CDN script and eliminates the dual-config conflict that caused the previous revert
- `next/font/google`: Self-hosted Inter and Inter Tight — replaces Google Fonts CDN link, eliminates FOUC and external requests
- `@tailwindcss/typography`: Prose styling for MDX content — updated for Tailwind v4 compatibility
- `reading-time@^1`: Word count-based reading time estimate for blog post cards

**Do not use:** Contentlayer (abandoned, incompatible with Next.js 13.3+), next-mdx-remote (officially RSC-unstable as of 2025), next-sitemap (3-year-old package, native `sitemap.ts` is sufficient), `react-router` (not needed, was used in the reverted migration attempt), `mdxRs: true` (experimental), Tailwind CDN script in Next.js.

### Expected Features

The blog needs a core set of features to launch credibly. The competitor pattern (Stripe Engineering, Vercel Blog) is: excellent typography + syntax highlighting + clear metadata + minimal chrome. AXIONLAB should match this exactly — authority comes from content quality, not engagement features.

**Must have (table stakes — v1 launch):**
- Frontmatter parsing (title, date, tags, description, author) — required by every downstream feature
- Post listing page (`/insights`) with cards: title, date, tags, reading time
- Individual post pages with SSG via `generateStaticParams` + `dynamicParams = false`
- Prose typography with `@tailwindcss/typography` using `dark:prose-invert` (dark-only — brand decision)
- Syntax-highlighted code blocks via `rehype-pretty-code` + Shiki dark theme
- Code block copy-to-clipboard button (custom `pre` override in `mdx-components.tsx`)
- Per-page SEO metadata (title, description, OG, Twitter) via Next.js metadata API
- `metadataBase` in root layout (required for OG images to resolve correctly)
- Sitemap including all blog post URLs with `lastmod` from frontmatter
- `robots.ts` for crawler control
- Tag-based filtering on listing page (client-side — sufficient at current post volume)
- Custom callout components (Info, Warning, Tip) registered in `mdx-components.tsx`
- `next/image` override for MDX images
- Reading time estimate on cards and post header

**Should have (v1.x — after first posts are live):**
- Dynamic OG image generation per post via `next/og` `ImageResponse` — trigger: first LinkedIn/X share
- Table of contents for long posts — trigger: first post exceeding 2000 words
- Prev/next post navigation — trigger: when >= 3 posts exist
- `rehype-autolink-headings` for deep-link anchors — alongside TOC

**Defer (v2+):**
- RSS feed — low ROI at low post volume; adds XML build complexity
- Search — defer until >30 posts; tag filtering covers the real use case
- Pagination — defer until >30 posts
- View counts / engagement metrics — requires persistent storage not available on Vercel free plan
- CMS integration — unnecessary while team is technical and post volume is low

**Explicitly excluded (anti-features):**
- Comments — moderation overhead, spam, no business value for a services company
- Dark/light mode toggle — AXIONLAB is dark-only by brand decision
- ISR — Vercel free plan doesn't support it; SSG + full rebuild is correct for publish frequency
- Newsletter signup — single conversion action ("Initiate" contact form) is the right pattern

### Architecture Approach

The architecture is a hybrid Server Component app with surgical `"use client"` placement. Server Components handle all page rendering (SSG for blog, SSG/SSR for marketing pages), metadata, and filesystem operations. Client Components are limited to four cases: Nav (scroll state, `usePathname`), Chatbot (AI chat state and fetch), Initiate form (contact form state), and Framer Motion wrappers (thin `MotionWrapper` client islands inserted into Server Component pages). The MDX blog uses a content layer at `content/blog/*.mdx` — files outside `app/` that are compiled at build time and served as pre-rendered HTML with zero client JS. API routes migrate from Vercel serverless function format to Next.js Route Handlers, keeping identical business logic.

**Major components:**
1. `app/layout.tsx` (Server) — root HTML shell, global metadata, next/font declarations, Nav/Footer/Chatbot mounting
2. `components/Nav.tsx` (Client) — scroll detection, mobile menu, `usePathname()` for active link (replaces hash-based route detection)
3. `components/motion/MotionWrapper.tsx` (Client) — thin Framer Motion re-export; Server pages import this, not `framer-motion` directly
4. `lib/blog.ts` (Server-only) — Node.js `fs` + `gray-matter` utility for enumerating posts; never imported in Client Components
5. `app/insights/page.tsx` (Server) — blog listing, reads MDX frontmatter via `lib/blog.ts` at build time
6. `app/insights/[slug]/page.tsx` (Server) — individual post, `generateStaticParams` + dynamic MDX import
7. `app/api/chat/route.ts` + `app/api/send-email/route.ts` (Route Handlers) — Gemini + SendGrid, Web API `Request`/`Response` signatures
8. `mdx-components.tsx` (project root) — required by `@next/mdx`; maps markdown elements to AXIONLAB-styled components

**Key build sequence (architecture-dictated):** Foundation (package.json, next.config.mjs, postcss, mdx-components.tsx, tsconfig) → Layout layer (globals.css, layout.tsx, Nav, Footer) → Static pages → API routes → Blog system → SEO infrastructure → Cleanup (remove Vite, index.html, old SPA files).

### Critical Pitfalls

Six critical pitfalls identified, all specific to this project's state. All are preventable with pre-migration actions:

1. **vercel.json still declares `"framework": "vite"`** — Vercel reads this file first, overriding auto-detection; deployment runs `vite build` and outputs to `dist/` instead of `.next/`. Fix: remove `framework`, `buildCommand`, `outputDirectory`, and the SPA catch-all rewrite from `vercel.json` before any other work.

2. **Dual Tailwind config divergence causes visual regression** — CDN config (what users see): `background: #080808`, `muted: #666666`, `surface: #111111`. PostCSS config (unused): `background: #0e0e0e`, `muted: #888888`, `surface: #1a1a1a`. Switching to PostCSS without reconciling values reproduces the revert. Fix: use CDN values as canonical in the Tailwind v4 `@theme` block.

3. **Framer Motion crashes all pages with "Server Component" error** — All components were client-side in Vite; App Router defaults to Server Components. Fix: create `components/motion/MotionWrapper.tsx` with `"use client"` that re-exports motion components; Server pages import the wrapper.

4. **API route handler signature mismatch** — Old handlers use `handler(req, res)` with `res.status(200).json()`. App Router Route Handlers use `POST(request: Request)` returning `Response.json()`. Fix: convert both API files completely; `await request.json()` for body parsing.

5. **`@next/mdx` does not support frontmatter by default** — YAML `---` blocks either throw a parse error or render verbatim. Fix: use `gray-matter` in `lib/blog.ts` for the listing page (two-pass approach); do not rely on `@next/mdx` for frontmatter parsing.

6. **`mdx-components.tsx` missing** — Required file for `@next/mdx` with App Router. Without it, MDX renders with browser defaults or build fails. Fix: create immediately when setting up `@next/mdx`; must export `useMDXComponents` (not a default export).

## Implications for Roadmap

Based on the build sequence dictated by architecture dependencies and the pitfall-to-phase mapping in PITFALLS.md, this project maps naturally to a 4-phase structure:

### Phase 1: Foundation and Migration Infrastructure

**Rationale:** Every subsequent phase depends on Next.js being correctly configured and the existing pages being migrated without breakage. The previous revert happened because foundation issues were not resolved first. Phase 1 must be complete and verified before any blog work begins.

**Delivers:** A working Next.js App Router deployment on Vercel with all existing pages, routes, API functions, and Framer Motion animations intact. No new features — parity with current site, cleanly migrated.

**Addresses (from FEATURES.md):** Not feature-facing — this is migration work. Unblocks all subsequent features.

**Must resolve before starting:**
- Delete/update `vercel.json` (remove Vite framework, SPA rewrite) — Pitfall 1
- Reconcile Tailwind color values (CDN vs. PostCSS), migrate to Tailwind v4 — Pitfall 2
- Wrap Framer Motion in `"use client"` MotionWrapper — Pitfall 4
- Migrate API routes to Route Handler signature — Pitfall 3
- Set up `next/font` to replace Google Fonts CDN link
- Update `Nav.tsx` to use `usePathname()` instead of `window.location.hash`
- Update all `#/path` hrefs to `/path` in Footer and internal links
- Remove `"use client"` additions that are unnecessary (anti-pattern: marking all components as client)
- Remove `images: { unoptimized: true }` from next.config; add Unsplash to `remotePatterns`

**Verification:** `next build` completes without errors. All existing pages accessible at clean URLs. Chatbot and contact form work. Visual regression check: background is `#080808`. Network tab shows zero requests to `fonts.googleapis.com`. Vercel function logs show no `TypeError: res.status is not a function`.

**Research flag:** Standard patterns — no additional research needed. Official Next.js Vite migration guide covers this exactly.

---

### Phase 2: MDX Blog Infrastructure

**Rationale:** The MDX pipeline is the new capability requiring the most integration work. It builds on the Next.js foundation from Phase 1 and must be validated end-to-end with a real post before Phase 3 adds more features on top.

**Delivers:** A functional `/insights` listing page and `/insights/[slug]` post pages with SSG, syntax-highlighted code blocks, AXIONLAB prose typography, and correct frontmatter metadata.

**Uses (from STACK.md):** `@next/mdx`, `gray-matter`, `reading-time`, `rehype-pretty-code`, `shiki`, `remark-gfm`, `rehype-slug`, `@tailwindcss/typography`, `mdx-components.tsx`

**Implements (from ARCHITECTURE.md):** Content layer (`content/blog/`), `lib/blog.ts` server utility, blog listing page, individual post page with `generateStaticParams`

**Addresses (from FEATURES.md):**
- Frontmatter parsing (title, date, tags, description, reading time)
- Post listing page with cards
- Individual post pages with SSG
- Prose typography (dark theme, AXIONLAB fonts)
- Syntax highlighting with copy-to-clipboard button
- Custom callout components (Info, Warning, Tip)
- `next/image` override for MDX images
- Tag-based filtering (client-side)

**Must resolve before moving on:**
- Create `mdx-components.tsx` at project root (Pitfall 6) — verify it exports `useMDXComponents`, not default export
- Use `gray-matter` two-pass approach, not `@next/mdx` native frontmatter (Pitfall 5)
- Validate `generateStaticParams` returns all slugs and `dynamicParams = false` is set (prevents 404 in SSG production)
- Add empty state to listing page for when zero posts exist
- Verify `next.config.mjs` is ESM (`.mjs`) — required for remark/rehype ESM-only plugins
- Test `rehype-pretty-code` Turbopack compatibility; may need `--webpack` flag if Shiki options are non-serializable

**Verification:** `next build` produces static HTML for at least one blog post. Listing page shows correct title/date/reading time from frontmatter. Code blocks render with syntax highlighting. `dynamicParams = false` verified by accessing a non-existent slug and confirming 404.

**Research flag:** Standard patterns — official Next.js MDX docs cover the setup. Turbopack + rehype-pretty-code compatibility may need a quick check if build issues arise.

---

### Phase 3: SEO and Metadata Completeness

**Rationale:** Once pages and blog posts are rendering correctly, SEO infrastructure should be added as a discrete phase before the site is considered launch-ready. This is low-complexity but high-importance work that is easy to forget if bundled into Phase 1 or 2.

**Delivers:** Per-page SEO metadata on all pages, complete sitemap.xml including blog posts with `lastmod` dates, robots.txt, `metadataBase` in root layout, and hash-URL backward compatibility for any existing links to `/#/philosophy` etc.

**Uses (from STACK.md):** Native Next.js Metadata API, `app/sitemap.ts`, `app/robots.ts`, `next/og` (deferred to v1.x)

**Addresses (from FEATURES.md):**
- Per-page SEO metadata (all marketing pages + blog posts via `generateMetadata`)
- Sitemap with blog post URLs and `lastmod`
- robots.txt
- Canonical URL field in frontmatter
- Hash URL backward compatibility (client-side redirect in root page for `/#/path` links)

**Must resolve before starting:**
- Set `metadataBase` in `app/layout.tsx` (required for OG images and social sharing to resolve correctly)
- Every `page.tsx` must export its own `metadata` — layout metadata is only a fallback
- Hash redirect: cannot be done server-side; needs a client-side `<Script>` in root layout that checks `window.location.hash` on mount

**Verification:** `curl axionlab.in/philosophy` contains correct `<title>` tag. `/sitemap.xml` includes all blog post URLs with dates. Navigate to `axionlab.in/#/work` → redirects to `axionlab.in/work`.

**Research flag:** Standard patterns — no additional research needed.

---

### Phase 4: Blog Enhancement and Polish

**Rationale:** Once the blog is live and first posts are published, trigger-based enhancements can be added. These are deferred from Phase 2 because they depend on having real content to test against.

**Delivers:** Dynamic per-post OG images for social sharing, table of contents for long posts, prev/next post navigation, heading deep-link anchors.

**Uses (from STACK.md):** `next/og` (`ImageResponse`), `rehype-autolink-headings`

**Addresses (from FEATURES.md — v1.x tier):**
- Dynamic OG image generation per post (`opengraph-image.tsx` file convention)
- Table of contents for posts >2000 words
- Prev/next post navigation (when >= 3 posts exist)
- `rehype-slug` + `rehype-autolink-headings` for heading anchors

**Trigger conditions (from FEATURES.md):**
- OG images: first external post share on LinkedIn/X
- TOC: first post exceeding 2000 words
- Prev/next: when >= 3 posts published
- Heading anchors: alongside TOC

**Research flag:** Dynamic OG image generation via `next/og` may need a quick research pass — the `ImageResponse` API and `metadataBase` interaction has some nuance. Flag for `/gsd:research-phase` if this is the first time using it.

---

### Phase Ordering Rationale

- **Phase 1 before everything:** Previous migration revert proves that foundation issues cascade. No blog work should begin until `next build` completes cleanly on all existing pages.
- **Phase 2 before Phase 3:** Sitemap needs blog post URLs with dates — blog system must exist first. Per-post metadata (`generateMetadata`) depends on `lib/blog.ts` which is built in Phase 2.
- **Phase 3 before Phase 4:** OG image generation requires `metadataBase` to be correctly set (Phase 3 work) or social images will produce broken absolute URLs.
- **Phase 4 is trigger-based:** These features have no business value until content exists. Building them speculatively delays launch.

### Research Flags

Phases needing deeper research during planning:
- **Phase 4 (Dynamic OG images):** `next/og` `ImageResponse` API, font loading in Edge runtime, `opengraph-image.tsx` file convention nuances. Recommend `/gsd:research-phase` before implementing.

Phases with standard, well-documented patterns (skip research-phase):
- **Phase 1:** Official Next.js Vite migration guide. All patterns verified against v16.1.6 docs.
- **Phase 2:** Official Next.js MDX guide. Verified against v16.1.6 docs. Only unknown is Turbopack + rehype-pretty-code — test first, fall back to Webpack if needed.
- **Phase 3:** Native Next.js Metadata API, sitemap.ts, robots.ts — all official, well-documented.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All core recommendations verified against official Next.js v16.1.6 docs (updated 2026-02-27). Library exclusions (Contentlayer, next-mdx-remote) verified from official sources. Only MEDIUM confidence item: rehype-pretty-code docs have no date, but corroborated by community usage. |
| Features | HIGH (table stakes) / MEDIUM (differentiators) | Table stakes verified against official docs. Differentiator assessments (competitor feature analysis) are pattern-based industry analysis, not verified against a specific authoritative source. |
| Architecture | HIGH | Based on official Next.js Server/Client Component docs (v16.1.6) and direct codebase analysis. Component boundaries and data flow have no ambiguity. |
| Pitfalls | HIGH | Six critical pitfalls are all project-specific and verified against the actual codebase files (`vercel.json`, `tailwind.config.js`, `api/chat.js`, `index.html`). The Tailwind dual-config pitfall is confirmed by the documented revert in git history. |

**Overall confidence:** HIGH

### Gaps to Address

- **Turbopack + rehype-pretty-code compatibility:** `rehype-pretty-code` requires a JavaScript function (Shiki theme object) as an option, which is non-serializable and may not work with Turbopack's string-name plugin syntax. The MDX webpack config runs separately from the main Turbopack build, so this may not be an issue — but test early in Phase 2 and fall back to `next dev --webpack` if needed. Resolution: first `next build` in Phase 2 will surface this immediately.

- **Gemini model stability:** The existing `api/chat.js` uses `gemini-3-flash-preview` which is a preview/unstable model. This should be updated to a stable model (e.g., `gemini-2.0-flash`) and made configurable via `process.env.GEMINI_MODEL` as part of the Phase 1 API migration. Not a blocker but a risk of silent breakage.

- **`next/font` + Tailwind v4 CSS variable wiring:** Tailwind v4 uses `@theme` CSS variables; `next/font` exposes fonts via CSS variables. The exact syntax for connecting these in Tailwind v4 (using `@theme { --font-sans: var(--font-inter) }` vs. legacy `tailwind.config.js` `fontFamily` config) should be verified during Phase 1 implementation. The research provides the pattern but v4 has different config conventions than v3.

## Sources

### Primary (HIGH confidence)
- [Next.js MDX Guide (official, v16.1.6, updated 2026-02-27)](https://nextjs.org/docs/app/guides/mdx) — `@next/mdx` setup, `mdx-components.tsx` requirement, remark/rehype plugin configuration, Turbopack string-name syntax
- [Next.js Vite Migration Guide (official, v16.1.6)](https://nextjs.org/docs/app/guides/migrating/from-vite) — step-by-step migration, tsconfig changes, env var prefix changes
- [Next.js v16 Upgrade Guide (official, v16.1.6)](https://nextjs.org/docs/app/guides/upgrading/version-16) — Turbopack default, async request APIs, breaking changes
- [Next.js Metadata and OG Images (official, v16.1.6)](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) — `metadataBase` requirement, `opengraph-image.tsx` convention
- [Next.js Server and Client Components (official, v16.1.6)](https://nextjs.org/docs/app/getting-started/server-and-client-components) — component boundary patterns
- [Next.js Route Handlers (official, v16.1.6)](https://nextjs.org/docs/app/api-reference/file-conventions/route) — `POST(request: Request)` signature
- [Next.js Sitemap API Reference (official, v16.1.6)](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) — native `sitemap.ts` convention
- [Tailwind CSS v4 Next.js Install Guide (official, v4.2)](https://tailwindcss.com/docs/guides/nextjs) — `@tailwindcss/postcss` setup, v4 import syntax
- [Tailwind CSS v4 Upgrade Guide (official)](https://tailwindcss.com/docs/upgrade-guide) — `@theme` block, config migration
- AXIONLAB codebase direct inspection (2026-03-07): `vercel.json`, `tailwind.config.js`, `api/chat.js`, `index.html`, `next.config.mjs`, `app/layout.tsx`, `package.json`
- AXIONLAB git history — confirms previous migration revert (commit `b4f41ef`) and root cause

### Secondary (MEDIUM confidence)
- [rehype-pretty-code documentation](https://rehype-pretty.pages.dev/) — Shiki v1 peer dep requirement, ESM-only constraint
- [next-mdx-remote GitHub README](https://github.com/hashicorp/next-mdx-remote) — RSC instability warning from Hashicorp
- [Contentlayer abandoned status](https://www.wisp.blog/blog/contentlayer-has-been-abandoned-what-are-the-alternatives) — maintenance status, corroborated by multiple community sources
- [Vercel Function Limits](https://vercel.com/docs/functions/limitations) — 10s timeout, 4.5MB payload limit
- [App Router pitfalls community roundup](https://imidef.com/en/2026-02-11-app-router-pitfalls) — validated against official docs

### Tertiary (context/pattern-based)
- Stripe Engineering, Vercel Blog, Linear Changelog — competitor feature pattern analysis (dark-only theme, no comments, syntax highlighting, reading time as standard)
- AXIONLAB PROJECT.md — explicit out-of-scope decisions (RSS, comments, search, CMS) used directly as anti-features rationale

---
*Research completed: 2026-03-07*
*Ready for roadmap: yes*
