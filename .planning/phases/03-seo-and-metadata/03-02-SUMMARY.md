# Summary: 03-02 — Client Component Extraction + Metadata for Home & Initiate

## What was done

1. **HomeClient extraction**: Moved all Home page JSX (hero, domain grid, systems classification with framer-motion) from `app/page.tsx` to `components/HomeClient.tsx` as a `'use client'` component.

2. **InitiateClient extraction**: Moved all Initiate page JSX (form, state management, success/error states) from `app/initiate/page.tsx` to `components/InitiateClient.tsx` as a `'use client'` component.

3. **Server Component wrappers**: Replaced both page files with thin Server Components that export `metadata` and render the client component:
   - `app/page.tsx` — Uses `title: { absolute: 'AXIONLAB | Engineering for the obsessed.' }` to bypass the template (prevents double suffix).
   - `app/initiate/page.tsx` — Uses `title: 'Initiate'` (template adds "| AXIONLAB").

4. **Build verification**: `next build --webpack` passes cleanly — all 14 pages generated as static.

5. **Self-verification via preview**:
   - Homepage: title, OG tags, visual rendering all correct
   - Initiate: title, OG tags, form rendering correct
   - Work/Philosophy: title template applied correctly
   - robots.txt: serving correctly

## Key decisions

- Home page uses `title: { absolute: '...' }` to override the template — the brand name is already in the title.
- Both client components are exact extractions with no logic changes — zero visual regression risk.

## Commits

- `69632bf` (prior) — HomeClient.tsx + InitiateClient.tsx created
- `9dca3b8` — Page files replaced with Server Component wrappers + metadata exports
