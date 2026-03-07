# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-07)

**Core value:** Every page must be server-rendered with proper meta tags and crawlable URLs so search engines can discover and index AXIONLAB's content.
**Current focus:** Phase 1 — Next.js Migration Foundation

## Current Position

Phase: 1 of 4 (Next.js Migration Foundation)
Plan: 4 of 5 in current phase
Status: In progress
Last activity: 2026-03-07 — Completed plan 01-04 (Component and page migration — MotionWrapper, Nav, Footer, all 7 pages, 404)

Progress: [████░░░░░░] 40%

## Performance Metrics

**Velocity:**
- Total plans completed: 4
- Average duration: 1.5 min
- Total execution time: 0.09 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-nextjs-migration-foundation | 4 | 7 min | 1.75 min |

**Recent Trend:**
- Last 5 plans: 01-01 (2 min), 01-02 (1 min), 01-03 (1 min), 01-04 (3 min)
- Trend: -

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

### Pending Todos

None yet.

### Blockers/Concerns

- [Phase 1 risk RESOLVED]: vercel.json framework:vite removed — now auto-detects Next.js
- [Phase 1 risk RESOLVED]: Framer Motion crash risk — MotionWrapper with "use client" created in 01-04, all pages updated
- [Phase 2 risk]: Turbopack + rehype-pretty-code compatibility uncertain — test early in Phase 2; fall back to --webpack if Shiki options are non-serializable
- [Phase 2 risk RESOLVED]: API route chat.js unstable gemini-3-flash-preview model replaced with configurable GEMINI_MODEL env var defaulting to gemini-2.0-flash
- [Deferred from 01-01]: tailwind.config.js, vite.config.js, vite.config.ts still present but unused — clean up in Plan 05

## Session Continuity

Last session: 2026-03-07
Stopped at: Completed 01-04-PLAN.md — Component and page migration (MotionWrapper, Nav, Footer, all pages, 404)
Resume file: None
