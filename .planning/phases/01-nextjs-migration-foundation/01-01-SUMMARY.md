---
phase: 01-nextjs-migration-foundation
plan: 01
subsystem: infra
tags: [nextjs, vite, tailwindcss, postcss, typescript, vercel]

# Dependency graph
requires: []
provides:
  - "Next.js installed as primary framework (next@16)"
  - "Tailwind v4 via @tailwindcss/postcss (replaces v3 + autoprefixer)"
  - "vercel.json stripped to version:2 — Vercel now auto-detects Next.js"
  - "tsconfig.json with @/* path alias, jsx:preserve, Next.js plugin"
  - "postcss.config.mjs for Tailwind v4 PostCSS pipeline"
  - "next.config.mjs clean config — no Vite artifacts"
affects: [02-nextjs-migration-foundation, 01-nextjs-migration-foundation-plan-02, all subsequent plans]

# Tech tracking
tech-stack:
  added: [next@16.1.6, tailwindcss@4.2.1, "@tailwindcss/postcss@4.2.1"]
  patterns: ["Next.js App Router project layout", "Tailwind v4 PostCSS-only config (no tailwind.config.js needed)"]

key-files:
  created: [postcss.config.mjs]
  modified: [package.json, vercel.json, tsconfig.json, next.config.mjs, package-lock.json]

key-decisions:
  - "Remove all SPA-specific vercel.json settings (framework, buildCommand, outputDirectory, rewrites) — Vercel auto-detects Next.js from next.config.mjs presence"
  - "Use postcss.config.mjs (not .js) because project has type:module — ESM native config avoids require() issues"
  - "Tailwind v4 via @tailwindcss/postcss eliminates separate autoprefixer — v4 handles vendor prefixes internally"
  - "tsconfig moduleResolution:bundler required for Next.js App Router — Node resolution causes false TS errors with RSC imports"

patterns-established:
  - "Config-first migration: Fix framework configs before touching any source files"
  - "Vercel detection: Keep vercel.json minimal — only version:2. Vercel reads next.config.mjs for Next.js detection."

requirements-completed: [MIG-01, MIG-04]

# Metrics
duration: 2min
completed: 2026-03-07
---

# Phase 1 Plan 01: Next.js Build System Foundation Summary

**Next.js 16 installed, Vite fully removed, vercel.json stripped to version:2 so Vercel auto-detects Next.js instead of running vite build**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-07T18:32:49Z
- **Completed:** 2026-03-07T18:34:57Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Replaced Vite with Next.js as the build system — scripts are now `next dev/build/start/lint`
- Installed Tailwind v4 stack (`tailwindcss@4.2.1` + `@tailwindcss/postcss`) replacing v3 + autoprefixer
- Eliminated the root cause of the previous deployment revert: vercel.json no longer declares `"framework": "vite"`
- Established Next.js-compatible TypeScript config with `@/*` path alias, `jsx:preserve`, `moduleResolution:bundler`, and Next.js plugin

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Next.js dependencies and remove Vite** - `fd8eae6` (chore)
2. **Task 2: Update config files for Next.js** - `e19c9d5` (chore)

**Plan metadata:** `a92918c` (docs: complete plan)

## Files Created/Modified
- `package.json` - Scripts updated to next dev/build/start/lint; next installed; vite/autoprefixer removed
- `package-lock.json` - Regenerated with Next.js dependency tree
- `vercel.json` - Stripped to `{ "version": 2 }` only — removes framework/buildCommand/outputDirectory/rewrites
- `tsconfig.json` - Next.js config: jsx:preserve, moduleResolution:bundler, plugins:[next], paths:@/*
- `postcss.config.mjs` - Created with @tailwindcss/postcss (Tailwind v4 PostCSS plugin)
- `next.config.mjs` - Cleaned to empty config — removed images.unoptimized

## Decisions Made
- Verified that `"type": "module"` must stay in package.json — Next.js fully supports ESM projects
- Used `.mjs` extension for postcss config because project is `type:module` — avoids require() parse errors
- Kept next.config.mjs clean with no options — MDX support will be added in Phase 2

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- The plan's verification command used `require('./package.json')` which fails in ESM projects (`"type": "module"`). Used `node --input-type=module` with `readFileSync` instead. Not a deviation — just a verification script adaptation.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Next.js build system is in place — `next dev` can now start (will error on missing page structure)
- Plan 02 should wire up the App Router directory structure (app/layout.tsx, app/page.tsx, globals.css)
- Tailwind v4 PostCSS pipeline is ready but needs a `@import "tailwindcss"` directive in globals.css (Plan 02)
- The `tailwind.config.js` and `vite.config.js`/`vite.config.ts` files are still present but no longer used — can be cleaned in Plan 02

## Self-Check: PASSED

All files verified:
- package.json: FOUND
- vercel.json: FOUND
- tsconfig.json: FOUND
- postcss.config.mjs: FOUND
- next.config.mjs: FOUND
- postcss.config.js: confirmed absent
- 01-01-SUMMARY.md: FOUND
- Commit fd8eae6 (Task 1): FOUND
- Commit e19c9d5 (Task 2): FOUND

---
*Phase: 01-nextjs-migration-foundation*
*Completed: 2026-03-07*
