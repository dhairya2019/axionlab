# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-07)

**Core value:** Every page must be server-rendered with proper meta tags and crawlable URLs so search engines can discover and index AXIONLAB's content.
**Current focus:** Phase 1 — Next.js Migration Foundation

## Current Position

Phase: 1 of 4 (Next.js Migration Foundation)
Plan: 0 of TBD in current phase
Status: Ready to plan
Last activity: 2026-03-07 — Roadmap created; phases derived from 34 v1 requirements

Progress: [░░░░░░░░░░] 0%

## Performance Metrics

**Velocity:**
- Total plans completed: 0
- Average duration: -
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:**
- Last 5 plans: -
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

### Pending Todos

None yet.

### Blockers/Concerns

- [Phase 1 risk]: vercel.json still declares `"framework": "vite"` — must be updated before first deploy or Vercel will run `vite build` against .next/
- [Phase 1 risk]: Framer Motion will crash Server Component pages — requires MotionWrapper with "use client" before touching page components
- [Phase 2 risk]: Turbopack + rehype-pretty-code compatibility uncertain — test early in Phase 2; fall back to --webpack if Shiki options are non-serializable
- [Phase 2 risk]: API route chat.js uses `gemini-3-flash-preview` (unstable model) — update to stable model during Phase 1 API migration

## Session Continuity

Last session: 2026-03-07
Stopped at: Roadmap created — ready to run /gsd:plan-phase 1
Resume file: None
