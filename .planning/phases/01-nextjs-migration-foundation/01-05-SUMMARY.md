---
phase: 01-nextjs-migration-foundation
plan: "05"
subsystem: infra
tags: [next.js, framer-motion, vite, cleanup, build]

# Dependency graph
requires:
  - phase: 01-04
    provides: All 7 App Router pages, MotionWrapper, Nav, Footer, 404 page
provides:
  - Clean codebase with all 13 legacy Vite/SPA files removed
  - Successful next build output in .next/ directory
  - Phase 1 Next.js migration fully verified
affects:
  - 02-blog-mdx-system
  - all future phases (clean baseline)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "app/page.tsx must be 'use client' when using framer-motion motion.* proxy"
    - "framer-motion v12 requires client context for motion proxy during prerendering"
    - "transpilePackages: ['framer-motion'] added to next.config.mjs for Turbopack compatibility"

key-files:
  created:
    - .next/ (build output directory)
  modified:
    - app/page.tsx (added 'use client' directive)
    - next.config.mjs (added transpilePackages)
  deleted:
    - index.html
    - index.tsx
    - App.tsx
    - vite.config.ts
    - vite.config.js
    - tailwind.config.js
    - components/Navbar.tsx
    - components/Hero.tsx
    - components/Services.tsx
    - components/Technologies.tsx
    - components/Portfolio.tsx
    - components/Clients.tsx
    - components/Process.tsx

key-decisions:
  - "app/page.tsx needs 'use client' because framer-motion v12 motion proxy requires client context during static prerendering"
  - "transpilePackages: ['framer-motion'] added for Turbopack bundler compatibility with framer-motion v12"
  - "framer-motion/client export does not provide motion object — main 'framer-motion' package used with client directive on page"

patterns-established:
  - "Pages using motion.* must declare 'use client' — cannot use motion proxy in Server Components even via MotionWrapper re-export"

requirements-completed: [MIG-05]

# Metrics
duration: 10min
completed: 2026-03-07
---

# Phase 1 Plan 5: Legacy Cleanup and Build Verification Summary

**Deleted 13 legacy Vite/SPA files and fixed framer-motion v12 prerender error to achieve successful `next build` completing Phase 1 migration**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-03-07T18:48:31Z
- **Completed:** 2026-03-07T18:58:00Z
- **Tasks:** 2 of 3 complete (Task 3 is checkpoint:human-verify)
- **Files modified:** 15 deleted + 2 modified

## Accomplishments
- Deleted all 13 legacy Vite/SPA files (index.html, index.tsx, App.tsx, 2 vite configs, tailwind.config.js, 7 deprecated components)
- Diagnosed and fixed framer-motion v12 prerender error: added `'use client'` to app/page.tsx
- Added `transpilePackages: ['framer-motion']` to next.config.mjs for Turbopack compatibility
- `next build` completes successfully: 7 static pages + 2 dynamic API routes + not-found page
- Phase 1 Next.js migration is complete pending human visual verification

## Task Commits

Each task was committed atomically:

1. **Task 1: Delete legacy Vite and SPA files** - `493b42b` (chore)
2. **Task 2: Run next build and fix build errors** - `1f71e8f` (fix)
3. **Task 3: Visual verification** - Awaiting human checkpoint

## Files Created/Modified
- `app/page.tsx` - Added `'use client'` directive (framer-motion requirement)
- `next.config.mjs` - Added `transpilePackages: ['framer-motion']`
- **Deleted:** `index.html`, `index.tsx`, `App.tsx`, `vite.config.ts`, `vite.config.js`, `tailwind.config.js`, `components/Navbar.tsx`, `components/Hero.tsx`, `components/Services.tsx`, `components/Technologies.tsx`, `components/Portfolio.tsx`, `components/Clients.tsx`, `components/Process.tsx`

## Decisions Made
- Added `'use client'` to home page rather than creating an intermediate wrapper component — simpler and direct since the page uses motion heavily
- Added `transpilePackages` rather than downgrading framer-motion — maintains latest version with proper Next.js config

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed framer-motion v12 prerender failure**
- **Found during:** Task 2 (next build)
- **Issue:** `next build` failed with "Element type is invalid: expected string but got undefined" on `/` page. framer-motion v12's `motion` proxy requires client-side context during static prerendering — importing from MotionWrapper (client component) in a Server Component page doesn't prevent server execution of motion during prerender.
- **Fix:** Added `'use client'` to `app/page.tsx` to force client rendering. Also added `transpilePackages: ['framer-motion']` to `next.config.mjs` as a Turbopack compatibility measure.
- **Files modified:** `app/page.tsx`, `next.config.mjs`
- **Verification:** `next build` completes successfully with all 7 pages
- **Committed in:** `1f71e8f` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug)
**Impact on plan:** Fix was required for build success. The MotionWrapper pattern from Plan 04 works correctly for components, but the page itself also needed `'use client'` when using `motion.*` directly. No scope creep.

## Issues Encountered
- framer-motion v12 `motion` proxy object appears as undefined during SSR/prerender when not in a `'use client'` context, even when imported from a `'use client'` boundary file. This is a v12 breaking change from v10/v11.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 1 complete: Next.js App Router migration fully done
- Clean codebase: no Vite artifacts, all legacy files removed
- Build verified: `next build` succeeds with zero errors
- Ready for Phase 2: Blog/MDX system implementation
- Awaiting human visual verification (Task 3 checkpoint) to confirm site renders correctly in browser

---
*Phase: 01-nextjs-migration-foundation*
*Completed: 2026-03-07*
