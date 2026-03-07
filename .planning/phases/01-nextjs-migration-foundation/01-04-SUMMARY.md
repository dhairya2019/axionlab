---
phase: 01-nextjs-migration-foundation
plan: 04
subsystem: ui
tags: [nextjs, framer-motion, react, app-router, navigation, server-components, client-components]

# Dependency graph
requires:
  - phase: 01-02
    provides: Next.js App Router layout with Tailwind PostCSS, nav and footer scaffolded in layout.tsx

provides:
  - MotionWrapper 'use client' re-export enabling framer-motion in Server Components
  - Nav with usePathname active-state detection and next/link clean URL navigation
  - Footer with next/link internal links (no hash prefixes)
  - Chatbot as Client Component with 'use client' directive
  - All 7 pages accessible at clean URLs with correct Server/Client Component types
  - Custom 404 page in AXIONLAB dark theme with 'Signal Lost.' heading

affects: [01-05, phase-2-blog-system, phase-3-seo-metadata]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "MotionWrapper pattern: thin 'use client' re-export of framer-motion allows Server Component pages to use motion.* without becoming Client Components"
    - "usePathname() from next/navigation replaces window.location.hash for active nav state"
    - "next/link Link component for all internal navigation (both Server and Client Components)"
    - "External links (mailto:, https://) remain as regular <a> tags; only internal routes use Link"

key-files:
  created:
    - components/motion/MotionWrapper.tsx
    - app/not-found.tsx
  modified:
    - components/Chatbot.tsx
    - components/Nav.tsx
    - components/Footer.tsx
    - app/page.tsx
    - app/initiate/page.tsx

key-decisions:
  - "MotionWrapper thin re-export pattern chosen over page-level 'use client' — keeps Home and other motion-using pages as Server Components"
  - "Footer has no hooks/state so it remains a Server Component even with Link from next/link"
  - "Only Nav, Chatbot, and Initiate need 'use client' — static pages (Philosophy, Capabilities, Work, Insights, Careers) are pure Server Components"
  - "app/page.tsx #systems anchor link kept as regular <a href=\"#systems\"> (same-page scroll) — only inter-page routes use Link"

patterns-established:
  - "MotionWrapper: import { motion } from '@/components/motion/MotionWrapper' in any Server Component page"
  - "Active nav detection: pathname === link.href (no .replace() needed with clean paths)"
  - "Close mobile menu on route change via useEffect watching pathname"

requirements-completed: [RTG-01, RTG-02, RTG-03, RTG-05, RND-01, RND-02, RND-03]

# Metrics
duration: 3min
completed: 2026-03-07
---

# Phase 1 Plan 04: Component and Page Migration Summary

**MotionWrapper 'use client' boundary, Nav migrated to usePathname + next/link, all 7 pages cleaned of hash routing, custom dark-theme 404 page added**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-07T18:42:17Z
- **Completed:** 2026-03-07T18:45:09Z
- **Tasks:** 3
- **Files modified:** 7 (2 created, 5 modified)

## Accomplishments
- Created MotionWrapper pattern enabling Framer Motion in Server Components without 'use client' on pages
- Migrated Nav from window.location.hash + hashchange events to usePathname() and next/link
- Footer and all 7 page files now use clean path URLs with next/link (zero hash hrefs remain)
- Custom 404 page with AXIONLAB dark theme and 'Signal Lost.' heading created

## Task Commits

Each task was committed atomically:

1. **Task 1: Create MotionWrapper and add 'use client' to Chatbot** - `d979cfc` (feat)
2. **Task 2: Migrate Nav.tsx and Footer.tsx to next/link + usePathname** - `749d620` (feat)
3. **Task 3: Fix all page components and create 404 page** - `8d4c2f9` (feat)

**Plan metadata:** (docs commit — added after state updates)

## Files Created/Modified
- `components/motion/MotionWrapper.tsx` - 'use client' re-export of motion and AnimatePresence from framer-motion
- `components/Chatbot.tsx` - Added 'use client' as first line (uses useState, useEffect, useRef, fetch)
- `components/Nav.tsx` - Replaced hash routing with usePathname(), all internal links use next/link
- `components/Footer.tsx` - All internal links use next/link (no 'use client' — Server Component)
- `app/page.tsx` - Changed framer-motion import to MotionWrapper, hash hrefs → Link
- `app/initiate/page.tsx` - Moved 'use client' to line 1 (was on line 2 after blank line)
- `app/not-found.tsx` - Custom 404 page: bg-background, text-accent, 'Signal Lost.' heading

## Decisions Made
- MotionWrapper thin re-export pattern chosen over page-level 'use client' — this is the correct RSC pattern for libraries that use browser APIs internally
- Footer remains a Server Component because Link from next/link works in Server Components, no hooks needed
- The `#systems` same-page anchor in app/page.tsx is kept as `<a href="#systems">` because it is an in-page scroll target, not an inter-page route; only inter-page routes use Link
- app/initiate/page.tsx already had 'use client' (added during previous phase scaffolding) but it was on line 2 — moved to line 1 as required by Next.js

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Moved 'use client' from line 2 to line 1 in app/initiate/page.tsx**
- **Found during:** Task 3 (Fix all page components)
- **Issue:** app/initiate/page.tsx had an empty first line followed by "use client" on line 2. Next.js requires the 'use client' directive as the literal first thing in the file (before any blank lines)
- **Fix:** Removed the leading blank line so "use client" is on line 1
- **Files modified:** app/initiate/page.tsx
- **Verification:** `head -1 app/initiate/page.tsx` outputs `"use client";`
- **Committed in:** 8d4c2f9 (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - bug fix)
**Impact on plan:** Required fix for Next.js directive placement correctness. No scope creep.

## Issues Encountered
None — all static pages (Philosophy, Capabilities, Work, Insights, Careers) were already clean with no framer-motion imports or hash hrefs, so no changes were needed to those files.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All components and pages are correctly typed as Server or Client Components
- Navigation works with active state via usePathname
- MotionWrapper pattern established for all future pages using Framer Motion
- Custom 404 in place and matching design system
- Ready for Plan 05 (build verification and cleanup of legacy Vite config files)

---
*Phase: 01-nextjs-migration-foundation*
*Completed: 2026-03-07*

## Self-Check: PASSED

| Item | Status |
|------|--------|
| components/motion/MotionWrapper.tsx | FOUND |
| app/not-found.tsx | FOUND |
| 01-04-SUMMARY.md | FOUND |
| Commit d979cfc (Task 1) | FOUND |
| Commit 749d620 (Task 2) | FOUND |
| Commit 8d4c2f9 (Task 3) | FOUND |
