---
gsd_state_version: 1.0
milestone: v2.0
milestone_name: SEO & Discoverability
status: roadmap_complete
last_updated: "2026-03-08T23:30:00.000Z"
progress:
  total_phases: 3
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-08)

**Core value:** AXIONLAB must rank on the first page of Google for its brand name and target service keywords.
**Current focus:** Phase 5 — Technical SEO Foundation (next phase to plan and execute)

## Current Position

Phase: 5 — Technical SEO Foundation
Plan: Not started
Status: Roadmap complete, ready for plan-phase
Last activity: 2026-03-08 — v2.0 roadmap written (Phases 5, 6, 7). 21 requirements mapped across 3 phases.

```
v2.0 Progress: [░░░░░░░░░░░░░░░░░░░░] 0% (0/3 phases complete)
```

## Performance Metrics

| Metric | Value |
|--------|-------|
| v2.0 phases total | 3 |
| v2.0 phases complete | 0 |
| v2.0 requirements total | 21 |
| v2.0 requirements shipped | 0 |
| v1.0 phases (context) | 4/4 complete |

## Accumulated Context

### Decisions

- [v2.0 init]: Target niche long-tail keywords — zero DA site can't compete with head terms like "distributed systems" or "systems engineering"
- [v2.0 init]: JSON-LD over microdata — Google recommended, easier to maintain, better tooling support
- [v2.0 audit]: Google has indexed ZERO pages of axionlab.in — technical SEO fixes unblock everything else
- [v2.0 roadmap]: Phase 5 before Phase 6 — structured data and canonical tags must be in place before publishing 10+ posts; no point indexing content that lacks JSON-LD
- [v2.0 roadmap]: Phase 6 before Phase 7 — performance optimisation applied after content is stable so image inventory is known

### Pending Todos

- Run `/gsd:plan-phase 5` to decompose Phase 5 into executable plans
- Site owner must set up Google Search Console (DNS verification — Claude cannot do this; GSC instructions are a Phase 5 deliverable)

### Blockers/Concerns

- [CRITICAL]: Google Search Console must be set up by site owner (DNS verification required) — Claude cannot do this; Phase 5 delivers the instructions
- [Note]: Domain authority is zero — rankings for competitive terms will take 3-6 months minimum after GSC submission
- [Note]: Only 3 blog posts exist — Phase 6 must scale to 10+ before meaningful keyword coverage is possible
- [Note]: Vercel free plan (SSG only) — no ISR; all content changes require a redeploy to update sitemap lastmod dates

## Session Continuity

Last session: 2026-03-08
Stopped at: v2.0 roadmap created (ROADMAP.md written, STATE.md updated, REQUIREMENTS.md traceability confirmed)
Resume with: `/gsd:plan-phase 5`
