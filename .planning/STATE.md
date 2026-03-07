---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: complete
last_updated: "2026-03-08T22:00:00.000Z"
progress:
  total_phases: 4
  completed_phases: 4
  total_plans: 13
  completed_plans: 13
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-07)

**Core value:** Every page must be server-rendered with proper meta tags and crawlable URLs so search engines can discover and index AXIONLAB's content.
**Current focus:** ALL PHASES COMPLETE — Milestone v1.0 achieved

## Current Position

Phase: 4 of 4 (Blog Enhancements) — COMPLETE
Plan: 2 of 2 in current phase — COMPLETE (self-verified 2026-03-08)
Status: All 4 phases complete — milestone v1.0 ready for deployment
Last activity: 2026-03-08 — Self-verified copy buttons, callout components, post navigation

Progress: [██████████] 100%

## Performance Metrics

**Velocity:**
- Total plans completed: 13
- Average duration: 1.8 min
- Total execution time: 0.39 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-nextjs-migration-foundation | 5 | 17 min | 3.4 min |
| 02-blog-infrastructure | 4 | 10 min | 2.5 min |
| 03-seo-and-metadata | 2 | 4 min | 2.0 min |
| 04-blog-enhancements | 2 | 5 min | 2.5 min |

**Recent Trend:**
- Last 4 plans: 03-01 (2 min), 03-02 (2 min), 04-01 (3 min), 04-02 (2 min)
- Trend: Steady — 04-01 required debugging rehype-pretty-code figure-wrapping behavior

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Pre-Phase 1]: Use Next.js App Router over React Router — SSR/SSG built-in, existing app/ structure matches
- [Pre-Phase 1]: Tailwind v4 via PostCSS over CDN — eliminates dual-config conflict that caused previous revert
- [Pre-Phase 1]: @next/mdx over next-mdx-remote/Contentlayer — official, RSC-stable, Turbopack-compatible
- [Pre-Phase 1]: CDN color values (#080808) are canonical — PostCSS config must match these, not #0e0e0e
- [01-01]: vercel.json stripped to version:2 only — Vercel auto-detects Next.js from next.config.mjs presence
- [01-01]: postcss.config.mjs (not .js) required because project has type:module — ESM native avoids require() parse errors
- [01-01]: Tailwind v4 @tailwindcss/postcss eliminates need for separate autoprefixer
- [01-01]: tsconfig moduleResolution:bundler required for Next.js App Router — Node resolution causes false TS errors with RSC imports
- [01-02]: next/font replaces Google Fonts CDN — CSS variables wired as --font-inter/--font-inter-tight on <html>, consumed by @theme block
- [01-02]: Hash redirect uses dangerouslySetInnerHTML inline script (not next/script afterInteractive) — must run synchronously before hydration
- [01-02]: CDN color values (#080808 bg, #666666 muted, #111111 surface) now canonical in @theme — not tailwind.config.js values
- [01-03]: Gemini model configurable via GEMINI_MODEL env var with gemini-2.0-flash fallback — unstable preview model risk from blockers now resolved
- [01-03]: Web standard Response.json() used instead of NextResponse.json() — portable, no import required, functionally identical in App Router
- [01-04]: MotionWrapper thin re-export pattern — 'use client' wrapper for framer-motion allows Server Component pages to use motion.* without client boundary on page itself
- [01-04]: Footer is Server Component — next/link works in Server Components, no 'use client' needed just for Link
- [01-04]: Same-page anchor href="#systems" kept as <a> — only inter-page routes use next/link Link component
- [01-05]: app/page.tsx needs 'use client' — framer-motion v12 motion proxy requires client context during static prerendering, even when imported from a 'use client' MotionWrapper
- [01-05]: transpilePackages: ['framer-motion'] added to next.config.mjs — Turbopack bundler compatibility with framer-motion v12
- [02-01]: Both dev and build scripts use --webpack — Turbopack cannot serialize rehype-pretty-code Shiki JS options
- [02-01]: remark-frontmatter included proactively to strip YAML from rendered MDX output
- [02-01]: rehype-slug added for future TOC/deep-link support (Phase 4 ready)
- [02-01]: getAllPosts() returns empty array if content/blog/ doesn't exist — graceful empty state
- [02-02]: TagFilter is client island — receives serializable PostMeta[] from Server Component, owns useState for tag filtering
- [02-03]: params is Promise<{slug: string}> in Next.js 16 — must await before accessing slug
- [02-03]: Dynamic MDX import uses @/content/blog/${slug}.mdx path alias
- [02-04]: Sitemap uses https://axionlab.in as BASE_URL, /insights has changeFrequency: 'weekly'
- [03-01]: metadataBase set to https://axionlab.in — resolves all relative OG URLs to absolute
- [03-01]: OpenGraph shallow merge — each page's openGraph must be self-contained (child replaces parent entirely)
- [03-01]: Title template '%s | AXIONLAB' — child pages just set string title, template adds suffix
- [03-02]: Home page uses title: { absolute: '...' } to bypass template — brand already in title
- [03-02]: Client component extraction pattern — 'use client' pages split to components/ for metadata export capability
- [04-01]: Single post-RPC rehype plugin (addRawToCodeBlocks) instead of pre/post pattern — RPC v0.14+ wraps in <figure> and replaces node properties, breaking the documented preProcess/postProcess approach
- [04-01]: extractText() recursively walks tokenized spans to reconstruct raw code — more robust than storing on nodes that get replaced
- [04-01]: CopyButton uses opacity-0 group-hover:opacity-100 — hidden until hover, keyboard accessible via focus:opacity-100
- [04-01]: Callouts use not-prose to isolate from typography plugin prose margins
- [04-02]: getAdjacentPosts accepts optional pre-fetched posts array to avoid double filesystem read
- [04-02]: Navigation gated behind allPosts.length >= 3 per BLE-03 success criterion

### Pending Todos

None.

### Blockers/Concerns

- [Phase 1 risk RESOLVED]: vercel.json framework:vite removed — now auto-detects Next.js
- [Phase 1 risk RESOLVED]: Framer Motion crash risk — MotionWrapper with "use client" created in 01-04, all pages updated
- [Phase 1 risk RESOLVED]: Legacy Vite files cleaned up — all 13 files deleted in 01-05
- [Phase 1 risk RESOLVED]: next build succeeded — all 7 pages + 2 API routes compile
- [Phase 2 risk RESOLVED]: Turbopack + rehype-pretty-code — confirmed incompatible, --webpack used for both dev and build
- [Phase 2 risk RESOLVED]: API route chat.js unstable gemini-3-flash-preview model replaced with configurable GEMINI_MODEL env var defaulting to gemini-2.0-flash
- [Phase 4 risk RESOLVED]: rehype-pretty-code v0.14+ figure-wrapping breaks preProcess/postProcess pattern — solved with single post-RPC extractText plugin
- [Note]: Pages using motion.* must declare 'use client' — framer-motion v12 breaking change from v10/v11

## Session Continuity

Last session: 2026-03-08
Stopped at: All 4 phases complete. Milestone v1.0 fully implemented and self-verified. Ready for deployment.
Resume file: None
