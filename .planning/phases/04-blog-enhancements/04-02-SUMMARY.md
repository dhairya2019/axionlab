# Summary: 04-02 — Prev/Next Post Navigation + Seed Posts

## What was done

1. **`getAdjacentPosts` utility** (`lib/blog.ts`): Accepts slug + optional pre-fetched posts array. Returns `{ prev, next }` from newest-first sorted list. Uses `findIndex` on pre-sorted array.

2. **PostNavigation Server Component** (`components/blog/PostNavigation.tsx`): Grid-based prev/next links using `next/link`. AXIONLAB design: uppercase muted labels, accent hover, border-top separator. Returns null when both prev/next are null.

3. **Slug page integration** (`app/insights/[slug]/page.tsx`): Calls `getAllPosts()` once, gates navigation behind `allPosts.length >= 3`, passes pre-fetched array to avoid double filesystem read.

4. **Two additional seed posts**: `engineering-high-performance-apis.mdx` (2026-02-15) and `observability-driven-development.mdx` (2026-01-28) — reaches 3-post threshold for navigation testing.

## Key decisions

- `getAdjacentPosts(slug, posts?)` accepts optional posts param to reuse pre-fetched array from the same page component — avoids double filesystem read.
- Navigation gated at call site (`allPosts.length >= 3`) per BLE-03 success criterion.

## Commit

`2013a0c` — feat: add copy-to-clipboard, callout components, and post navigation (shared commit with 04-01)
