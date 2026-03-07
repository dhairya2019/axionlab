# Stack Research

**Domain:** Next.js App Router migration + MDX blog system
**Researched:** 2026-03-07
**Confidence:** HIGH (all recommendations verified against official docs or Context7)

---

## Context: What This Migration Involves

The project is a React 19 + Vite 7 SPA migrating to Next.js App Router, with a new MDX blog system added under `/insights`. The existing app directory structure, TypeScript, Tailwind, Framer Motion, and API routes all carry forward — this research focuses only on the new/changed parts.

**What is NOT re-researched:** React 19, Tailwind CSS, Framer Motion, clsx/tailwind-merge, Lucide React, @google/genai, @sendgrid/mail. All remain as-is.

---

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| next | `latest` (16.x at time of writing) | App Router framework, SSR/SSG, metadata API, file routing | Latest stable. The official Next.js docs version is 16.1.6 (updated 2026-02-27). Turbopack is now default in v16, no additional flags needed. `npm install next@latest` gives this. |
| react | `latest` (19.x) | Already in use; upgrade type defs | Next.js 16 App Router requires React 19.2 (canary); `next@latest` pins the right version. |
| @types/react | `latest` | TypeScript types for React 19 | Must match the React version; `npm install next@latest react@latest react-dom@latest` updates all together. |

**Decision: Use Next.js 16 (latest), not pin to 15.**
Next.js 16 is stable (version 16.1.6, last doc update 2026-02-27). The only meaningful breaking change for this project is that async request APIs (`cookies`, `headers`, `params`) are now fully async — but this project uses no middleware or server-fetched params in the existing pages. Starting on 16 avoids an immediate upgrade path from 15.

### MDX Processing

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| @next/mdx | `latest` | Official MDX integration for Next.js App Router | Vercel-maintained, full Server Component support, works with Turbopack (v16 default), no RSC instability warnings. Requires `mdx-components.tsx` file convention. |
| @mdx-js/loader | `latest` | Webpack/Turbopack MDX loader used by @next/mdx | Peer dependency of @next/mdx. |
| @mdx-js/react | `latest` | React context provider for MDX components | Needed to provide custom component mappings via `mdx-components.tsx`. |
| @types/mdx | `latest` | TypeScript types for .mdx imports | Required for type-safe MDX imports in TypeScript projects. |

**Decision: Use `@next/mdx` over `next-mdx-remote` and over Contentlayer.**

- `next-mdx-remote`: Officially marked unstable with React Server Components as of 2025. Hashicorp has not resolved RSC stability. Avoid.
- `Contentlayer`: Abandoned. Developer confirmed maintenance depends on funding; incompatible with Next.js 13.3+ without patches. Do not use.
- `@next/mdx`: Official, Vercel-maintained, compatible with Turbopack (required for Next.js 16 default builds), stable RSC support. The only limitation — no native frontmatter — is easily solved with gray-matter (see below).

**Frontmatter approach with `@next/mdx`:** Use `export const metadata = {}` as a JS export inside each `.mdx` file (the official approach), and read it via `fs` + dynamic import at build time for the blog index page. Alternatively, use `gray-matter` to parse frontmatter from the raw file contents when building the post list.

### Frontmatter + Blog Utilities

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| gray-matter | `^4.x` (latest stable) | Parse YAML/JSON frontmatter from MDX files | For building the blog index page: read all `.mdx` files with `fs`, extract title/date/tags/description without importing the full MDX component. Widely used, actively maintained. |
| reading-time | `^1.x` (latest stable) | Calculate estimated reading time from text content | Use when building post metadata for the blog listing. Provides Medium-style "X min read" estimates. |

**Note on frontmatter strategy:** Use YAML frontmatter (`---`) with gray-matter for the blog list page (fast, no compilation needed). Inside individual MDX files, the frontmatter is stripped by gray-matter and the content passed to `@next/mdx` for rendering. This is the most common real-world pattern as of 2026.

### Syntax Highlighting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| rehype-pretty-code | `latest` | Server-side code block syntax highlighting | For blog posts containing code snippets. Powered by Shiki (same engine Vercel uses for nextjs.org docs). ESM-only, so requires `next.config.mjs`. Zero client JS — all done at build time. |
| shiki | `^1.x` | Shiki syntax highlighter (peer dep) | Peer dependency of rehype-pretty-code; install alongside it. |

**Alternative considered:** `@shikijs/rehype` directly. Both work. `rehype-pretty-code` provides more ergonomic API with line numbers, word highlighting, and copy button hooks. Use `rehype-pretty-code` unless code examples are very simple.

### Remark/Rehype Plugins (MDX Pipeline)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| remark-gfm | `latest` | GitHub Flavored Markdown (tables, strikethrough, autolinks) | Always. Blog posts will use tables and task lists. |
| rehype-slug | `latest` | Auto-adds `id` attributes to headings | For anchor links in blog posts (future TOC support). |

**Note on Turbopack compatibility:** Next.js 16 uses Turbopack by default. Remark/rehype plugins with serializable options work via string-name syntax in Turbopack config. Plugins that require passing JavaScript functions (non-serializable options) must use `--webpack` flag. `remark-gfm` and `rehype-slug` work with Turbopack string-name syntax. `rehype-pretty-code` requires a JavaScript function (the shiki theme object) — configure it via `next.config.mjs` options object (Webpack-based MDX config still works; the MDX webpack config is separate from the main Turbopack build config).

### Typography (MDX Content Styling)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @tailwindcss/typography | `latest` | Prose styling for MDX-rendered HTML | For blog post content. Adds `prose` class that styles `h1`, `p`, `code`, `blockquote`, etc. correctly. Use with `dark:prose-invert` for the dark theme. Fully compatible with Tailwind v4 (plugin was updated for v4 support). |

### Tailwind CSS Version Decision

**Recommendation: Migrate from Tailwind v3 to Tailwind v4 as part of this migration.**

Rationale:
- The project is already migrating everything; doing Tailwind v4 at the same time avoids a second migration.
- Tailwind v4 is required for the `@import "tailwindcss"` syntax used in the official Next.js + Tailwind guide.
- The existing `tailwind.config.js` uses a small `theme.extend` with 4 custom colors and 2 font families — trivial to migrate to CSS `@theme` variables.
- Tailwind v4 eliminates the `tailwind.config.js` vs CDN dual-config problem documented in PROJECT.md.

**Migration path for existing config:**

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-background: #080808;  /* Use CDN value, not config value */
  --color-accent: #ff1f3d;
  --color-muted: #888888;
  --color-surface: #1a1a1a;
  --font-sans: "Inter", sans-serif;
  --font-condensed: "Inter Tight", sans-serif;
  --letter-spacing-tighter: -0.04em;
  --radius-none: 0px;
}
```

**WARNING:** The project has a dual config conflict — `tailwind.config.js` uses `#0e0e0e` for background but the CDN script in `index.html` uses `#080808`. The CDN value (`#080808`) is what users currently see. Use `#080808` as the canonical background in the v4 config.

**PostCSS config for Tailwind v4:**

```javascript
// postcss.config.mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

Install: `npm install tailwindcss@latest @tailwindcss/postcss@latest postcss@latest @tailwindcss/typography@latest`

### Next.js Fonts

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| next/font | (built-in) | Self-hosted Inter and Inter Tight fonts | Replaces Google Fonts CDN `<link>` in `index.html`. Zero layout shift (font size fallback), no external network request, no privacy/GDPR risk. Fonts loaded from Vercel's CDN at build time. |

**Usage in `app/layout.tsx`:**
```typescript
import { Inter, Inter_Tight } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const interTight = Inter_Tight({ subsets: ['latin'], variable: '--font-condensed' })
```

This replaces the `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter...">` currently in `index.html`.

### SEO + Metadata

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| next Metadata API | (built-in) | Per-page title, description, OpenGraph, Twitter cards | Built into Next.js App Router. Export `metadata` object or `generateMetadata()` function from any `page.tsx`. No third-party library needed. |
| next/navigation (robots.ts) | (built-in) | robots.txt generation | `app/robots.ts` file convention generates robots.txt automatically. No package needed. |
| app/sitemap.ts | (built-in) | sitemap.xml generation | Native Next.js file convention. Export a function returning an array of URLs. Include blog posts dynamically by reading the `content/blog/` directory at build time. No `next-sitemap` package needed. |

**Decision: Use native Next.js metadata/sitemap APIs over `next-sitemap` package.**
`next-sitemap` (latest: 4.2.3, last published 3 years ago) is stale and adds an unnecessary dependency. The native `sitemap.ts` file convention provides the same functionality, is maintained by Vercel, and is the current recommended approach per official docs (v16.1.6).

### API Routes

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js Route Handlers | (built-in) | Replace `api/chat.js` and `api/send-email.js` Vite API routes | Next.js Route Handlers are `app/api/[route]/route.ts` files. Direct replacement for Vercel Serverless Functions. No package change — `@google/genai` and `@sendgrid/mail` stay as-is. |

### Hash URL Backward Compatibility

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| next.config redirects | (built-in) | Redirect old `/#/philosophy` hash URLs to `/philosophy` | Configured in `next.config.mjs` via the `redirects()` async function. Hash fragments (`#...`) are client-side only and not sent to the server, so server-side redirects from `/#/` paths won't work. Use JavaScript-based client redirect for this edge case (see Architecture). |

**Important nuance:** HTTP hash fragments are NOT sent to the server. `/#/philosophy` appears to the server as a request to `/`. The only way to redirect hash-based routes to clean URLs is via a client-side script in the root layout that checks `window.location.hash` on mount. This is a one-time `<script>` tag in the root layout.

---

## Installation

```bash
# Core framework (replaces vite, @vitejs/plugin-react)
npm install next@latest react@latest react-dom@latest
npm install -D @types/react@latest @types/react-dom@latest @types/node@latest

# MDX stack
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx

# Blog utilities
npm install gray-matter reading-time

# MDX pipeline plugins
npm install remark-gfm rehype-slug rehype-pretty-code shiki

# Tailwind v4 (replaces tailwindcss@3 + autoprefixer)
npm install tailwindcss@latest @tailwindcss/postcss postcss
npm install @tailwindcss/typography

# Remove Vite
npm uninstall vite @vitejs/plugin-react autoprefixer
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| @next/mdx | next-mdx-remote | When content comes from a remote CMS/database rather than local files. NOT recommended here — RSC support is officially unstable as of 2025. |
| @next/mdx | Contentlayer | Never for new projects. Contentlayer is abandoned (last commit 2023, no Next.js 14+ support). The author confirmed maintenance is unfunded. |
| @next/mdx | Velite | For power users who want typed content schemas + validation. More setup complexity for minimal gain on a small blog. Valid choice if content volume grows. |
| Native sitemap.ts | next-sitemap | Only if you need XML sitemap index files with >50,000 URLs or complex multi-sitemap splitting. Not needed here. |
| Tailwind v4 | Stay on Tailwind v3 | Only if you have complex custom plugins written as JS functions or need IE11 support. The existing config is simple enough to migrate in <30 minutes. |
| next/font | Google Fonts CDN link | Never in Next.js. next/font eliminates FOUT, improves LCP, avoids third-party request. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Contentlayer | Abandoned. Incompatible with Next.js 13.3+. No maintenance. | @next/mdx + gray-matter |
| next-mdx-remote | Officially unstable with React Server Components as of 2025 (Hashicorp's own warning in the README). | @next/mdx |
| next-sitemap | 3 years since last publish (4.2.3). Native sitemap.ts convention is fully capable. | Native app/sitemap.ts |
| tailwindcss CDN script | Not compatible with Next.js build pipeline. Produces dual-config conflicts. Already the root cause of the reverted migration attempt. | Tailwind v4 via PostCSS (@tailwindcss/postcss) |
| mdxRs: true (experimental Rust compiler) | Documented as experimental, not recommended for production in the official Next.js docs. | Default @next/mdx webpack path |
| react-router | Not needed. Next.js App Router provides file-based routing with SSG/SSR built-in. The previous migration attempt using React Router was reverted. | Next.js App Router |
| @types/react 18.x | React 19 is already in use. Mismatched type versions cause subtle type errors. | @types/react@latest |

---

## Stack Patterns by Variant

**For the blog listing page (`app/insights/page.tsx`):**
- Read `content/blog/*.mdx` with `fs.readdirSync` (server-side)
- Parse frontmatter with `gray-matter` (fast, no compilation)
- Compute reading time with `reading-time` on the raw content string
- Sort by date, filter by tag, return as props
- Because this runs in a Server Component, no API call needed

**For individual blog post pages (`app/insights/[slug]/page.tsx`):**
- Use `generateStaticParams` to enumerate all post slugs from `content/blog/`
- Import MDX file dynamically: `await import(`@/content/blog/${slug}.mdx`)`
- Wrap in blog post layout with `@tailwindcss/typography` prose classes
- Set `dynamicParams = false` to 404 on unknown slugs

**For syntax highlighting in posts:**
- Configure `rehype-pretty-code` in `next.config.mjs` `withMDX` options
- Use `next.config.mjs` (ESM required because remark/rehype ecosystem is ESM-only)
- Provide dark theme (e.g., `github-dark`) matching AXIONLAB's dark aesthetic

---

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| next@16.x | react@19.2, react-dom@19.2 | Next.js 16 ships with React 19.2 canary via App Router. Run `npm install next@latest react@latest react-dom@latest` together. |
| @next/mdx@latest | next@16.x | Use `next.config.mjs` (ESM) not `.js` for remark/rehype plugin compatibility. |
| tailwindcss@4.x | @tailwindcss/postcss (NOT autoprefixer, NOT tailwindcss/postcss) | v4 uses dedicated `@tailwindcss/postcss` package. Remove `autoprefixer` from postcss config — v4 handles vendor prefixes internally. |
| rehype-pretty-code | shiki@^1.0.0 | The package requires shiki v1+. Install `shiki` alongside. |
| @tailwindcss/typography | tailwindcss@4.x | Typography plugin was updated for v4 compatibility. Use `@plugin "@tailwindcss/typography"` in CSS (v4 approach) or `@config` with JS config (v3-style fallback). |
| framer-motion@12.x | react@19, next@16 | Framer Motion 12 supports React 19. Mark components using it as `"use client"` in App Router. |

---

## Key Files to Create/Modify

```
next.config.mjs          # MDX config, redirects, metadata
app/layout.tsx           # Root layout with next/font, metadata
app/globals.css          # Tailwind v4 @import + @theme block
postcss.config.mjs       # @tailwindcss/postcss plugin
mdx-components.tsx       # Required by @next/mdx App Router
tsconfig.json            # Next.js TypeScript settings
content/blog/            # MDX blog post files (new directory)
app/sitemap.ts           # Native sitemap generation
app/robots.ts            # Native robots.txt generation
app/insights/page.tsx    # Blog listing page
app/insights/[slug]/page.tsx  # Individual post page
app/api/chat/route.ts    # Migrated from api/chat.js
app/api/send-email/route.ts   # Migrated from api/send-email.js
```

---

## Sources

- [Next.js MDX Guide (official, v16.1.6, updated 2026-02-27)](https://nextjs.org/docs/app/guides/mdx) — @next/mdx packages, mdx-components.tsx requirement, remark/rehype plugin setup, Turbopack string syntax
- [Next.js Vite Migration Guide (official, v16.1.6)](https://nextjs.org/docs/app/guides/migrating/from-vite) — step-by-step migration approach, tsconfig changes, env var prefixes
- [Next.js v16 Upgrade Guide (official, v16.1.6)](https://nextjs.org/docs/app/guides/upgrading/version-16) — Turbopack default, async params API, breaking changes
- [Next.js 15.5 Release Blog (published 2025-08-18)](https://nextjs.org/blog/next-15-5) — confirmed Next.js 15.5 stable
- [Next.js Sitemap API Reference (official, v16.1.6)](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) — native sitemap.ts file convention
- [Tailwind CSS Next.js Install Guide (current, v4.2)](https://tailwindcss.com/docs/guides/nextjs) — @tailwindcss/postcss setup, v4 import syntax
- [Tailwind CSS v4 Upgrade Guide (official)](https://tailwindcss.com/docs/upgrade-guide) — config migration, breaking changes, @theme block
- [rehype-pretty-code documentation](https://rehype-pretty.pages.dev/) — shiki v1 peer dep requirement, ESM-only note — MEDIUM confidence (official site but no date)
- [Contentlayer abandoned status](https://www.wisp.blog/blog/contentlayer-has-been-abandoned-what-are-the-alternatives) — confirmed unmaintained — MEDIUM confidence (secondary source, corroborated by multiple community sources)
- [next-mdx-remote GitHub](https://github.com/hashicorp/next-mdx-remote) — RSC instability warning — MEDIUM confidence (GitHub README, project-maintained)

---

*Stack research for: AXIONLAB — Next.js App Router migration + MDX blog*
*Researched: 2026-03-07*
