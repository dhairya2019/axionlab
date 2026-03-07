# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-07)

**Core value:** Every page must be server-rendered with proper meta tags and crawlable URLs so search engines can discover and index AXIONLAB's content.
**Current focus:** Phase 1 — Next.js Migration Foundation

## Current Position

Phase: 1 of 4 (Next.js Migration Foundation)
Plan: 3 of TBD in current phase
Status: In progress
Last activity: 2026-03-07 — Completed plan 01-03 (API Route Handler migration — chat and send-email)

Progress: [███░░░░░░░] 30%

## Performance Metrics

**Velocity:**
- Total plans completed: 3
- Average duration: 1.3 min
- Total execution time: 0.07 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-nextjs-migration-foundation | 3 | 4 min | 1.3 min |

**Recent Trend:**
- Last 5 plans: 01-01 (2 min), 01-02 (1 min), 01-03 (1 min)
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
- [01-03]: Gemini model configurable via GEMINI_MODEL env var with gemini-2.0-flash fallback — unstable preview model risk from blockers now resolved
- [01-03]: Web standard Response.json() used instead of NextResponse.json() — portable, no import required, functionally identical in App Router

### Pending Todos

None yet.

### Blockers/Concerns

- [Phase 1 risk RESOLVED]: vercel.json framework:vite removed — now auto-detects Next.js
- [Phase 1 risk]: Framer Motion will crash Server Component pages — requires MotionWrapper with "use client" before touching page components
- [Phase 2 risk]: Turbopack + rehype-pretty-code compatibility uncertain — test early in Phase 2; fall back to --webpack if Shiki options are non-serializable
- [Phase 2 risk RESOLVED]: API route chat.js unstable gemini-3-flash-preview model replaced with configurable GEMINI_MODEL env var defaulting to gemini-2.0-flash
- [Deferred from 01-01]: tailwind.config.js, vite.config.js, vite.config.ts still present but unused — clean up in Plan 02

## Session Continuity

Last session: 2026-03-07
Stopped at: Completed 01-03-PLAN.md — API Route Handler migration (chat + send-email)
Resume file: None
