# Phase 3: SEO and Metadata - Research

**Researched:** 2026-03-08
**Domain:** Next.js App Router Metadata API — static exports, `metadataBase`, OpenGraph, Twitter cards, sitemap, robots.txt
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SEO-01 | Each page exports unique metadata (title, description, OpenGraph, Twitter cards) | Static `metadata` export in Server Component pages; `generateMetadata` for dynamic pages. Both are supported and verified against Next.js 16.1.6 docs. |
| SEO-02 | Root layout sets `metadataBase` for absolute OG URLs | `metadataBase: new URL('https://axionlab.in')` in `app/layout.tsx` metadata object. Already has a metadata export — just needs `metadataBase` added and upgraded to a title template. |
| SEO-03 | sitemap.ts auto-generates /sitemap.xml including all pages and blog posts | **Already complete in Phase 2 (02-04).** `app/sitemap.ts` exists and covers all 7 marketing pages + dynamic blog posts. Phase 3 must verify lastmod accuracy and confirm the build output. |
| SEO-04 | robots.ts auto-generates /robots.txt allowing all crawlers | `app/robots.ts` does not exist. Must be created with `MetadataRoute.Robots` returning `{ rules: { userAgent: '*', allow: '/' }, sitemap: 'https://axionlab.in/sitemap.xml' }`. |
</phase_requirements>

---

## Summary

Phase 3 is the narrowest phase in the roadmap. Two of the four requirements are largely or entirely pre-satisfied by prior phases: the sitemap is complete (Phase 2, 02-04) and the blog post pages already have `generateMetadata` with full OG/Twitter fields (Phase 2, 02-03). The remaining work is: (1) add a `title` template and `metadataBase` to the root layout, (2) add static `metadata` exports to the seven marketing pages, and (3) create `app/robots.ts`.

Every mechanism needed is provided by Next.js's built-in Metadata API — no external library is required. The API is stable as of Next.js 13.2 and unchanged in 16.1.6 (the current version). Static metadata in Server Component pages, `generateMetadata` in dynamic pages, and file-based `robots.ts`/`sitemap.ts` are the three patterns to apply. Nothing needs to be hand-rolled.

The primary caution is metadata merging behavior: when a page defines `openGraph`, the entire `openGraph` object from the root layout is replaced, not merged. Each page's metadata export must therefore be self-contained with respect to any nested field it defines. The `title.template` pattern in the root layout + a plain `title` string in each page is the correct pattern; Next.js will apply the template automatically.

**Primary recommendation:** Add `metadataBase` + `title.template` to `app/layout.tsx`, then add a static `metadata` export to each of the 7 marketing pages with unique title, description, OG, and Twitter fields. Create `app/robots.ts`. Verify `app/sitemap.ts` lastmod dates are dynamic (not hardcoded `new Date()` for static pages).

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next` (built-in Metadata API) | 16.1.6 | `metadata` export, `generateMetadata`, `MetadataRoute.Robots`, `MetadataRoute.Sitemap` | Official, zero-dependency, compiled at build time — no runtime overhead |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| None | — | — | No third-party SEO library is needed; Next.js handles title, description, OG, Twitter, robots, sitemap natively |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Native `metadata` export | `next-seo` (v6) | `next-seo` is a legacy approach from Pages Router; App Router's native API is the recommended replacement |
| `app/robots.ts` | Static `app/robots.txt` file | Static file is simpler but doesn't interpolate the sitemap URL or allow future dynamic rules; `robots.ts` is preferred |

**Installation:**

```bash
# No new packages required
```

---

## Architecture Patterns

### Recommended Project Structure

```
app/
├── layout.tsx              # Root: metadataBase + title template + global description
├── robots.ts               # NEW: /robots.txt — allow all, reference sitemap
├── sitemap.ts              # EXISTING (Phase 2): /sitemap.xml
├── page.tsx                # Home: static metadata export (title, description, OG, Twitter)
├── philosophy/page.tsx     # Static metadata export
├── capabilities/page.tsx   # Static metadata export
├── work/page.tsx           # Static metadata export
├── insights/page.tsx       # Static metadata export
├── careers/page.tsx        # Static metadata export
├── initiate/page.tsx       # Static metadata export — 'use client' CONSTRAINT (see pitfall 1)
└── insights/[slug]/page.tsx # EXISTING (Phase 2): generateMetadata with OG/Twitter
```

### Pattern 1: Root Layout — `metadataBase` + `title.template`

**What:** The root `app/layout.tsx` sets `metadataBase` so all relative URLs in `openGraph.images` and similar fields resolve to absolute URLs. It also sets a `title.template` so child pages only need to supply the page-specific portion of the title.

**When to use:** Always set `metadataBase` in root layout when any page will use relative paths in OG image fields. Required by Next.js to avoid build errors on URL-based metadata fields.

**Example:**

```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://axionlab.in'),
  title: {
    template: '%s | AXIONLAB',
    default: 'AXIONLAB | Engineering for the obsessed.',
  },
  description: 'Independent systems engineering lab designing commerce infrastructure and high-performance applications.',
  openGraph: {
    siteName: 'AXIONLAB',
    type: 'website',
  },
}
```

Child page result: a page exporting `title: 'Philosophy'` gets `<title>Philosophy | AXIONLAB</title>`.

### Pattern 2: Static Metadata in a Server Component Page

**What:** Export a `const metadata: Metadata` object from a page that has no dynamic data requirements. This is compiled at build time — no runtime overhead.

**When to use:** All 7 marketing pages (home, philosophy, capabilities, work, insights listing, careers, initiate). These pages have fixed content so their metadata is fixed.

**Example:**

```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
// app/philosophy/page.tsx (Server Component — no 'use client')
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Philosophy',                    // → "Philosophy | AXIONLAB" via template
  description: 'We embed. We analyze. We architect. Systems engineered from within the ecosystems they serve.',
  openGraph: {
    title: 'Philosophy | AXIONLAB',
    description: 'We embed. We analyze. We architect. Systems engineered from within the ecosystems they serve.',
    url: 'https://axionlab.in/philosophy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Philosophy | AXIONLAB',
    description: 'We embed. We analyze. We architect. Systems engineered from within the ecosystems they serve.',
  },
}

export default function Philosophy() { /* ... */ }
```

### Pattern 3: `metadata` Export in a `'use client'` Page — IMPOSSIBLE DIRECTLY

**What:** `metadata` export and `generateMetadata` are only supported in Server Components. `app/page.tsx` (Home) and `app/initiate/page.tsx` currently declare `'use client'` at the top because they use Framer Motion and `useState` respectively.

**Resolution:** Extract the client-side logic into a child component, keeping the page file itself as a Server Component that can export `metadata`.

**When to use:** Any `'use client'` page that needs per-page metadata.

**Example for `app/page.tsx`:**

```typescript
// app/page.tsx — becomes Server Component, exports metadata
import type { Metadata } from 'next'
import HomeClient from '@/components/HomeClient'   // 'use client' component

export const metadata: Metadata = {
  title: 'AXIONLAB | Engineering for the obsessed.',   // title.absolute — bypasses template for home
  description: 'Independent systems engineering lab...',
  openGraph: { /* ... */ },
  twitter: { /* ... */ },
}

export default function Home() {
  return <HomeClient />
}
```

```typescript
// components/HomeClient.tsx
'use client'
import { motion } from '@/components/motion/MotionWrapper'
// ... rest of existing app/page.tsx content
```

**Same pattern applies to `app/initiate/page.tsx`** — extract form logic into `components/InitiateClient.tsx`.

### Pattern 4: `app/robots.ts`

**What:** A file at `app/robots.ts` exports a default function returning `MetadataRoute.Robots`. Next.js compiles this to `/robots.txt` at build time (cached by default).

**Example:**

```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://axionlab.in/sitemap.xml',
  }
}
```

Output at `/robots.txt`:
```
User-Agent: *
Allow: /

Sitemap: https://axionlab.in/sitemap.xml
```

### Pattern 5: Sitemap `lastModified` for Static Pages (Existing Sitemap Audit)

The existing `app/sitemap.ts` uses `new Date()` for `lastModified` on static pages. This means every build changes the `lastModified` date, which misleads crawlers. A better approach is to use a fixed date or the build-time date only for pages that actually changed.

**Current behavior (Phase 2 output):**
```typescript
{ url: `${BASE_URL}/philosophy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.8 }
```

**Options:**
1. Keep `new Date()` — acceptable for v1; crawlers will revisit but this isn't harmful
2. Use hardcoded dates per page — maintenance burden, not worth it for 7 pages
3. Use a `SITE_LAST_MODIFIED` constant set to latest commit date — good practice but requires build-time injection

**Recommendation:** Keep `new Date()` for v1. The success criterion only requires that blog posts use `lastmod` dates from frontmatter — which the existing sitemap already does correctly (`lastModified: new Date(post.date)`).

### Anti-Patterns to Avoid

- **Setting metadata in Client Components:** `export const metadata` inside a `'use client'` file silently does nothing; it is not an error but the metadata is ignored. Must convert page to Server Component and push client logic into a child.
- **Defining `openGraph` partially:** If a page defines `openGraph: { title: 'X' }` but not `openGraph.description`, the root layout's `openGraph.description` is NOT inherited — the entire `openGraph` object is replaced. Always specify all needed OG fields in the page.
- **Using relative image URLs without `metadataBase`:** Will cause a Next.js build warning/error. Always set `metadataBase` first.
- **Using `title.template` in `page.js` files:** Has no effect — template only applies to child segments. Only use it in layout files.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| `/robots.txt` generation | Custom Route Handler at `app/api/robots/route.ts` | `app/robots.ts` with `MetadataRoute.Robots` | Built-in, cached, correct content-type, no setup |
| `/sitemap.xml` generation | Custom XML string builder | `app/sitemap.ts` with `MetadataRoute.Sitemap` | Already exists from Phase 2; Next.js handles XML encoding and `content-type: application/xml` |
| `<title>` / `<meta>` injection | `dangerouslySetInnerHTML` in layout or `next/head` | `export const metadata` or `generateMetadata` | Next.js deduplicates, handles streaming, and provides TypeScript types |
| OG image generation | Custom `/api/og` route | `app/opengraph-image.tsx` with `ImageResponse` | Phase 4+ concern; not needed for Phase 3 — plain text OG is sufficient for success criterion 4 |

**Key insight:** Every SEO primitive in this phase has a first-class Next.js API. The only work is writing the metadata objects — no infrastructure, no libraries.

---

## Common Pitfalls

### Pitfall 1: `'use client'` Page Cannot Export `metadata`
**What goes wrong:** Developer adds `export const metadata = { ... }` to `app/page.tsx` or `app/initiate/page.tsx` which have `'use client'` at the top. The build does not error, but the metadata is completely ignored — the page renders with only the root layout's metadata.
**Why it happens:** The `metadata` export is a Server Component convention. In Client Components, it is stripped.
**How to avoid:** Convert the page file to a Server Component by removing `'use client'` from `page.tsx`. Move all client-side code (Framer Motion, `useState`, `useEffect`) into a new `'use client'` component that the page renders.
**Warning signs:** After adding metadata to a `'use client'` page, `curl https://axionlab.in/` does not show the unique `<title>` or description.

### Pitfall 2: OpenGraph Object Shallow Merge — Missing Description
**What goes wrong:** Root layout defines `openGraph: { siteName: 'AXIONLAB', description: '...' }`. Page defines `openGraph: { title: 'Philosophy' }`. The resulting OG tags have no `description` because the page's `openGraph` object replaced (not merged with) the root's.
**Why it happens:** Metadata merging is shallow — nested objects are replaced entirely by the child segment.
**How to avoid:** Each page must specify all OG fields it wants to appear, including description. Do not rely on inheritance for nested fields.
**Warning signs:** LinkedIn/Twitter link preview shows no description for some pages.

### Pitfall 3: `metadataBase` Missing Causes Build Warning on Relative OG Image Paths
**What goes wrong:** A page or blog post uses `openGraph: { images: ['/og.png'] }` (relative path). Without `metadataBase` set in the root layout, Next.js emits a warning and resolves to `http://localhost:3000/og.png` in production output.
**Why it happens:** Next.js cannot resolve a relative URL without knowing the base.
**How to avoid:** Set `metadataBase: new URL('https://axionlab.in')` in `app/layout.tsx` before any page uses relative image paths.
**Warning signs:** OG image tags in HTML contain `localhost` or are missing.

### Pitfall 4: `title.template` Does Not Affect Root Layout's Own Title
**What goes wrong:** Root layout sets `title: { template: '%s | AXIONLAB', default: 'AXIONLAB | Engineering for the obsessed.' }`. Developer expects the root layout page (home `/`) to show "AXIONLAB | Engineering for the obsessed." but it might conflict if `app/page.tsx` also sets a `title`.
**Why it happens:** `title.template` applies to child segments only. The page's own `title` string is substituted into the template of its nearest parent layout.
**How to avoid:** Home page should use `title: { absolute: 'AXIONLAB | Engineering for the obsessed.' }` (bypasses template entirely) OR just not define a `title` at all in `app/page.tsx` (inherits `default` from root layout). Given home is currently `'use client'`, the refactor approach using `title.absolute` in a Server Component wrapper is cleanest.

### Pitfall 5: `app/initiate/page.tsx` Uses `useState` — Full Refactor Required
**What goes wrong:** The Initiate page is a large client component with form state. Splitting it requires creating `components/InitiateClient.tsx`, moving all logic there, and making `app/initiate/page.tsx` a thin Server Component wrapper.
**Why it happens:** SEO-01 requires per-page metadata for all 7 pages including Initiate.
**How to avoid:** Plan this as its own sub-task. The refactor is mechanical — copy the entire component body to `InitiateClient.tsx`, add `'use client'`, then replace `app/initiate/page.tsx` with a Server Component that exports `metadata` and renders `<InitiateClient />`.

---

## Code Examples

Verified patterns from official sources:

### Root Layout Metadata (metadataBase + title template)

```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://axionlab.in'),
  title: {
    template: '%s | AXIONLAB',
    default: 'AXIONLAB | Engineering for the obsessed.',
  },
  description: 'Independent systems engineering lab designing commerce infrastructure and high-performance applications.',
  openGraph: {
    siteName: 'AXIONLAB',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
}
```

### Static Page Metadata (Server Component)

```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
// app/philosophy/page.tsx — no 'use client' needed here
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Philosophy',                  // Becomes "Philosophy | AXIONLAB"
  description: 'We do not operate as consultants. We embed directly into the technical and cultural layers of an organization.',
  openGraph: {
    title: 'Philosophy | AXIONLAB',
    description: 'We do not operate as consultants. We embed directly...',
    url: '/philosophy',                 // Resolved to https://axionlab.in/philosophy via metadataBase
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Philosophy | AXIONLAB',
    description: 'We do not operate as consultants. We embed directly...',
  },
}
```

### `'use client'` Page Refactor Pattern

```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata (Server Component constraint)
// app/page.tsx — REMOVE 'use client', ADD metadata export, DELEGATE to HomeClient
import type { Metadata } from 'next'
import HomeClient from '@/components/HomeClient'

export const metadata: Metadata = {
  title: {
    absolute: 'AXIONLAB | Engineering for the obsessed.',
  },
  description: 'Independent systems engineering lab...',
  openGraph: {
    title: 'AXIONLAB | Engineering for the obsessed.',
    description: 'Independent systems engineering lab...',
    url: '/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AXIONLAB | Engineering for the obsessed.',
    description: 'Independent systems engineering lab...',
  },
}

export default function Home() {
  return <HomeClient />
}
```

```typescript
// components/HomeClient.tsx — receives all client-side logic from old app/page.tsx
'use client'
import React from 'react'
import { motion } from '@/components/motion/MotionWrapper'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

// ... entire existing app/page.tsx component body here
export default function HomeClient() { /* ... */ }
```

### robots.ts

```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://axionlab.in/sitemap.xml',
  }
}
```

### Sitemap (existing — verified correct)

```typescript
// Source: Phase 2 implementation — app/sitemap.ts
// Blog posts correctly use lastModified: new Date(post.date) from frontmatter
// Static pages use new Date() — acceptable for v1
const blogPages: MetadataRoute.Sitemap = posts.map(post => ({
  url: `${BASE_URL}/insights/${post.slug}`,
  lastModified: new Date(post.date),   // Correct — from frontmatter
  changeFrequency: 'yearly' as const,
  priority: 0.8,
}))
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `next/head` with `<Head>` in every page | `export const metadata` / `generateMetadata` in layout or page | Next.js 13.2 (App Router) | No more client-side `<Head>` injection; metadata is compiled into static HTML |
| `next-seo` library | Native `Metadata` type from `next` | Next.js 13.2 | Zero dependency; TypeScript-native; handles OG, Twitter, robots natively |
| Manual `robots.txt` in `public/` | `app/robots.ts` with `MetadataRoute.Robots` | Next.js 13.3 | Programmatic, typed, can reference dynamic base URL |
| Manual `sitemap.xml` in `public/` | `app/sitemap.ts` with `MetadataRoute.Sitemap` | Next.js 13.3 | Already in use from Phase 2 |

**Deprecated/outdated:**
- `next/head`: Only available in Pages Router (`pages/` directory). Cannot be used in App Router at all.
- `next-seo`: Still works in Pages Router, but has no role in App Router where native API is superior.
- `themeColor` / `colorScheme` in `metadata`: Deprecated since Next.js 14 — use `generateViewport` instead.

---

## Open Questions

1. **OG image for marketing pages (Phase 3 vs. Phase 4+)**
   - What we know: Success criterion 4 says "social sharing a blog post URL renders the correct OG title, description, and image." Blog posts already have OG text metadata from Phase 2. There is no explicit requirement for an OG image file.
   - What's unclear: Does "image" mean a static image file or generated image? The requirement says the existing blog post `generateMetadata` (which sets `twitter.card: 'summary_large_image'`) must produce a correct preview. Without an `opengraph-image.*` file, social crawlers will show a blank image but valid title/description.
   - Recommendation: Phase 3 should NOT implement OG image generation (that is `BLE-04` / v2 scope). The success criterion is satisfiable with text-only OG metadata. If LinkedIn/Twitter show a blank image but correct text, criterion 4 is met for v1.

2. **Sitemap `lastModified` accuracy for static pages**
   - What we know: The existing sitemap uses `new Date()` for all static pages. This changes on every build.
   - What's unclear: Whether this causes crawler issues at the scale of axionlab.in (very low volume site).
   - Recommendation: Keep `new Date()` for v1. Not a Phase 3 blocker.

---

## Validation Architecture

> `workflow.nyquist_validation` is not present in `.planning/config.json` — skipping this section.

*(The config.json has `workflow.research`, `workflow.plan_check`, `workflow.verifier` but no `nyquist_validation` key — treating as false/absent.)*

---

## Current State Inventory

Audited all 8 page files against Phase 3 requirements:

| File | Has Metadata? | Client Component? | Phase 3 Action |
|------|--------------|------------------|----------------|
| `app/layout.tsx` | Partial (title + description only, no metadataBase, no template) | No | Update: add `metadataBase`, convert `title` to template object, add global `openGraph`/`twitter` base fields |
| `app/page.tsx` | None | YES (`'use client'`) | Refactor: extract to `HomeClient.tsx`, add `metadata` export |
| `app/philosophy/page.tsx` | None | No | Add `metadata` export |
| `app/capabilities/page.tsx` | None | No | Add `metadata` export |
| `app/work/page.tsx` | None | No | Add `metadata` export |
| `app/insights/page.tsx` | None | No | Add `metadata` export |
| `app/careers/page.tsx` | None | No | Add `metadata` export |
| `app/initiate/page.tsx` | None | YES (`'use client'`) | Refactor: extract to `InitiateClient.tsx`, add `metadata` export |
| `app/insights/[slug]/page.tsx` | YES (full OG + Twitter via `generateMetadata`) | No | No change needed |
| `app/sitemap.ts` | N/A | N/A | No change needed (complete from Phase 2) |
| `app/robots.ts` | MISSING | N/A | Create: 3-line file |

**Minimum plan count:** 2 plans (logically separable)
- Plan 03-01: Root layout update + robots.ts creation + 5 straightforward Server Component pages (philosophy, capabilities, work, insights, careers)
- Plan 03-02: `'use client'` page refactors (Home → HomeClient, Initiate → InitiateClient) + metadata for both + final build verification

Alternatively, could be 1 plan if preferred (small phase — all changes are additive).

---

## Sources

### Primary (HIGH confidence)

- `https://nextjs.org/docs/app/api-reference/functions/generate-metadata` — full `Metadata` type reference, `metadataBase`, `openGraph`, `twitter`, `title.template`, merge behavior. Verified against Next.js 16.1.6 (lastUpdated: 2026-02-27).
- `https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots` — `MetadataRoute.Robots` type, `robots.ts` pattern, output format. Verified against Next.js 16.1.6 (lastUpdated: 2026-02-27).
- `https://nextjs.org/docs/app/getting-started/metadata-and-og-images` — static metadata, `generateMetadata`, OG images, streaming metadata behavior. Verified against Next.js 16.1.6 (lastUpdated: 2026-02-27).
- Direct codebase inspection — `app/layout.tsx`, `app/sitemap.ts`, `app/insights/[slug]/page.tsx`, all 7 marketing page files. Verified Phase 2 completion state.

### Secondary (MEDIUM confidence)

- WebSearch results confirming robots.ts pattern is current and standard for Next.js App Router in 2025-2026.

---

## Metadata

**Confidence breakdown:**
- Standard Stack: HIGH — verified against Next.js 16.1.6 official docs, fetched 2026-03-08
- Architecture: HIGH — all patterns taken directly from official Next.js documentation
- Pitfalls: HIGH — Pitfall 1 (Client Component constraint) and Pitfall 2 (shallow merge) are documented in official Next.js docs; Pitfalls 3-5 are direct corollaries verified in the same source

**Research date:** 2026-03-08
**Valid until:** 2026-06-08 (Next.js metadata API is stable since v13.2; low churn risk)
