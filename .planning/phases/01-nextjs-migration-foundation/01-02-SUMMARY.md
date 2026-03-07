---
phase: 01-nextjs-migration-foundation
plan: 02
subsystem: ui
tags: [tailwind, css, next-font, layout, fonts, hash-routing]

# Dependency graph
requires:
  - phase: 01-nextjs-migration-foundation/01-01
    provides: Next.js App Router build system, postcss.config.mjs, next.config.mjs, tsconfig with bundler resolution

provides:
  - Tailwind v4 @theme block with canonical CDN colors (#080808, #ff1f3d, #666666, #111111)
  - next/font Inter + Inter_Tight wired through CSS variables to Tailwind font-sans/font-condensed
  - Root layout with Nav, Footer, Chatbot mounted globally
  - Synchronous hash-to-clean-URL redirect script (pre-hydration)
  - Zero Google Fonts CDN requests

affects:
  - All page components (use bg-background, text-muted, etc. — now resolved via @theme)
  - Any new pages added (receive Nav/Footer/Chatbot automatically from root layout)
  - Phase 2 blog system (font and color tokens available globally)

# Tech tracking
tech-stack:
  added:
    - next/font/google (Inter, Inter_Tight — replaces Google Fonts CDN)
    - Tailwind v4 @import "tailwindcss" syntax
    - @theme block (Tailwind v4 custom token API)
  patterns:
    - CDN color values are canonical — @theme block must match index.html, not tailwind.config.js
    - CSS variable chain: next/font declaration -> var() on <html> -> @theme reference -> utility class
    - Hash redirect as synchronous inline script (dangerouslySetInnerHTML, not next/script)

key-files:
  created: []
  modified:
    - app/globals.css
    - app/layout.tsx

key-decisions:
  - "next/font replaces Google Fonts CDN — variables wired as --font-inter/--font-inter-tight on <html>, consumed by @theme"
  - "Hash redirect uses dangerouslySetInnerHTML inline script (not next/script afterInteractive) — must run before hydration to avoid flash"
  - "Chatbot added as named import { Chatbot } — matches export const Chatbot: React.FC in Chatbot.tsx"
  - "Inter_Tight loaded with weights 700/800/900 only — matches original CDN wght@700;800;900 subset"

patterns-established:
  - "Tailwind token pattern: define in @theme with --color-* prefix, use as bg-*/text-* utility classes"
  - "Font loading pattern: next/font with variable option -> className on <html> -> var() in @theme -> font-sans class"
  - "Global component mounting: Nav, Footer, Chatbot in root layout body, outside main"

requirements-completed: [MIG-02, MIG-03, RND-04, RTG-04]

# Metrics
duration: 1min
completed: 2026-03-07
---

# Phase 1 Plan 02: Tailwind v4 @theme + next/font + Root Layout Summary

**Tailwind v4 with canonical CDN colors (#080808 background), next/font replacing Google CDN, and root layout with Nav/Footer/Chatbot plus synchronous hash redirect**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-07T18:37:30Z
- **Completed:** 2026-03-07T18:38:34Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Replaced Tailwind v3 directives with Tailwind v4 @import + @theme block using canonical CDN colors — background is now exactly #080808, muted #666666, surface #111111
- Eliminated Google Fonts CDN dependency — next/font now loads Inter and Inter_Tight with font-display:swap, wired through CSS variables to Tailwind utilities
- Added Chatbot global component to root layout and synchronous hash-to-clean-URL redirect script running before React hydration

## Task Commits

Each task was committed atomically:

1. **Task 1: Replace globals.css with Tailwind v4 @theme configuration** - `e7bcdff` (feat)
2. **Task 2: Rewrite layout.tsx with next/font, global components, and hash redirect** - `ffae628` (feat)

**Plan metadata:** (docs commit — pending)

## Files Created/Modified
- `app/globals.css` - Tailwind v4 @import, @theme block with canonical colors, global resets, glass-panel overrides, fluid-heading utility
- `app/layout.tsx` - next/font declarations, CSS variable wiring on html element, Nav/Footer/Chatbot global mounts, hash redirect inline script

## Decisions Made
- Used `dangerouslySetInnerHTML` for hash redirect script rather than `next/script strategy="afterInteractive"` — inline script runs synchronously before hydration, preventing a flash of the wrong URL
- Named import `{ Chatbot }` confirmed correct — Chatbot.tsx uses `export const Chatbot: React.FC` (named export, not default)
- Inter_Tight loaded with only weights `['700', '800', '900']` — matches the original CDN `wght@700;800;900` subset exactly to avoid loading unnecessary font data

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Tailwind token layer complete — all pages using bg-background, text-muted, text-accent will resolve to correct CDN-canonical colors
- Font loading is now zero-CDN — next/font handles caching and optimization
- Root layout provides Nav, Footer, Chatbot automatically to all pages — no per-page boilerplate needed
- Hash URL backward compatibility handled — old bookmarks like /#/work redirect to /work before hydration
- Ready for Plan 03: page migration (each page component can be moved to app/ directory)

---
*Phase: 01-nextjs-migration-foundation*
*Completed: 2026-03-07*
