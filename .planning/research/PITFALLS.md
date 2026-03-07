# Pitfalls Research

**Domain:** Vite SPA → Next.js App Router migration + MDX blog
**Researched:** 2026-03-07
**Confidence:** HIGH (official Next.js docs + Vercel docs verified; codebase confirmed directly)

---

## Critical Pitfalls

### Pitfall 1: vercel.json Still Declares `"framework": "vite"` After Migration

**What goes wrong:**
The current `vercel.json` has `"framework": "vite"`, `"buildCommand": "npm run build"`, and `"outputDirectory": "dist"`. When Next.js is adopted, Vercel will still run `vite build` (outputting to `dist/`) instead of `next build` (outputting to `.next/`). The deployment will either use the wrong output or fail silently.

**Why it happens:**
The `vercel.json` was written for the Vite deployment and was never cleaned up. Vercel's framework auto-detection reads this file first, so the explicit `"framework": "vite"` overrides auto-detection even when `next.config.mjs` is present.

**How to avoid:**
Delete the `framework`, `buildCommand`, and `outputDirectory` fields from `vercel.json` entirely. Vercel auto-detects Next.js from `next.config.mjs` and sets the correct defaults. The `rewrites` block in `vercel.json` must also be removed — Next.js handles its own routing internally, and the current SPA catch-all rewrite (`"source": "/(.*)", "destination": "/index.html"`) will conflict with Next.js page routing.

**Warning signs:**
- Deployment succeeds but all pages return 404 or the old SPA
- Build logs show `vite` commands instead of `next build`
- `.next/` directory is not created during build

**Phase to address:** Phase 1 (initial migration setup) — must be the very first file changed before any Next.js work.

---

### Pitfall 2: Dual Tailwind Config Divergence Causes Visual Regression

**What goes wrong:**
The CDN Tailwind config in `index.html` uses `background: "#080808"`, `muted: "#666666"`, `surface: "#111111"`. The `tailwind.config.js` uses `background: "#0e0e0e"`, `muted: "#888888"`, `surface: "#1a1a1a"`. When switching from CDN to PostCSS, the PostCSS config becomes canonical. If `tailwind.config.js` values are used without correction, the entire dark theme shifts visibly — background lightens from `#080808` to `#0e0e0e`, text becomes lighter.

**Why it happens:**
The Tailwind CDN config and the `tailwind.config.js` were independently modified. The CDN was what users saw; the `tailwind.config.js` was never actively applied. This is the likely root cause of the previous migration revert (commit `b4f41ef`): styles appeared broken because the wrong color values were in use.

**How to avoid:**
Before migrating, explicitly audit every custom value in `index.html`'s `tailwind.config = {...}` block and update `tailwind.config.js` to match exactly. The correct canonical values (what users currently see) are: `background: "#080808"`, `accent: "#ff1f3d"`, `muted: "#666666"`, `surface: "#111111"`. Additionally, the `index.html` global CSS overrides (`border-radius: 0 !important`, `.glass-panel` background overrides, etc.) must be replicated in `globals.css` or `tailwind.config.js` before removing `index.html`.

**Warning signs:**
- Background appears noticeably lighter after switch
- Text color changes from near-white to a grayer tone
- Elements with `surface` class look different
- Components that relied on the CDN's `border-radius: 0 !important` global reset suddenly show rounded corners

**Phase to address:** Phase 1 — the color reconciliation must be done before any UI is tested in Next.js.

---

### Pitfall 3: API Route Handler Signature Mismatch

**What goes wrong:**
The existing `api/chat.js` and `api/send-email.js` use the Vercel/Pages Router signature: `export default async function handler(req, res)` with `res.status(200).json(...)`. Next.js App Router Route Handlers use a completely different signature: named exports (`export async function POST(request: Request)`) that return a `Response` object. Body parsing also differs — Vercel handlers access `req.body` (pre-parsed by the platform), while App Router handlers require `const body = await request.json()`.

**Why it happens:**
Developers copy-paste existing serverless handlers into the `app/api/` directory without converting the signature. The file compiles without errors but throws at runtime because `res.status` is not a function on a Web `Request` object.

**How to avoid:**
Convert both API files to Route Handler format:
```typescript
// app/api/chat/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { message, history } = await request.json()
  // ... logic
  return NextResponse.json({ text: result })
}
```
Place files at `app/api/chat/route.ts` and `app/api/send-email/route.ts`. Do NOT place a `route.ts` at the same level as a `page.ts` — Next.js will error with a conflict.

**Warning signs:**
- 500 errors on API calls with `TypeError: res.status is not a function` in function logs
- Vercel function logs show the handler executing but crashing immediately
- API responses return HTML error pages instead of JSON

**Phase to address:** Phase 1 (API migration) — before any frontend form or chatbot is tested.

---

### Pitfall 4: Framer Motion Breaks All Pages with "Server Component" Error

**What goes wrong:**
Framer Motion components (`motion.div`, `AnimatePresence`, etc.) use React Context and DOM APIs internally. In Next.js App Router, all components are Server Components by default. Importing `framer-motion` directly into a page component causes a build error: "You're importing a component that needs X. It only works in a Client Component but none of its parents are marked with 'use client'." Every page that uses animations will fail to build.

**Why it happens:**
The existing components (Nav.tsx, individual page files) import and use Framer Motion without `"use client"` directives — this worked in Vite because everything was client-side. App Router changes the default.

**How to avoid:**
The most surgical fix is to create a thin wrapper layer. Create `components/motion.tsx` with `"use client"` at the top that re-exports typed motion components:
```typescript
"use client"
export { motion, AnimatePresence } from "framer-motion"
```
Then import from `@/components/motion` instead of `framer-motion` in page components. Alternatively, add `"use client"` to each component file that uses animations — this is simpler but makes those components client components (acceptable for this project since pages are mostly presentational).

**Warning signs:**
- Build fails with errors referencing `useState`, `useEffect`, or `window` in unexpected places
- Pages that worked in Vite fail with "Server Component" errors immediately after migration
- `AnimatePresence` specifically causes errors because it wraps children and affects the rendering tree

**Phase to address:** Phase 1 — must be resolved before any page can be verified as working.

---

### Pitfall 5: `@next/mdx` Does Not Support Frontmatter by Default

**What goes wrong:**
The MDX blog requires frontmatter (title, date, tags, description) in each `.mdx` file. `@next/mdx`, the official Next.js MDX integration, does **not** parse YAML frontmatter by default. Adding `---\ntitle: My Post\n---` to an MDX file will either throw a parse error or be silently ignored, resulting in missing metadata on blog listing pages.

**Why it happens:**
Developers assume MDX frontmatter works the same as in other systems (Gatsby, Jekyll, Astro). The official Next.js docs explicitly state this limitation but it is easy to miss.

**How to avoid:**
Use the `remark-frontmatter` + `remark-mdx-frontmatter` plugin combination added to `next.config.mjs`:
```javascript
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
  },
})
```
This exposes frontmatter as a named export from each MDX file. Alternatively, use `gray-matter` with `fs.readFileSync` to parse frontmatter separately from the MDX content (two-pass approach: read metadata for listing, import MDX for content). The two-pass approach is more maintainable for blog listing pages.

**Warning signs:**
- Blog listing page shows empty titles or undefined dates
- Build succeeds but `post.metadata.title` is undefined at runtime
- `---` YAML block appears verbatim in rendered post content

**Phase to address:** Phase 2 (MDX blog infrastructure) — must be verified before writing any real blog content.

---

### Pitfall 6: `mdx-components.tsx` File Missing — App Router MDX Will Silently Fail

**What goes wrong:**
When using `@next/mdx` with the App Router, a `mdx-components.tsx` file at the project root is **required**. Without it, MDX compilation either throws a build error or MDX content renders without any custom component overrides, meaning code blocks, headings, and links get browser defaults instead of the AXIONLAB design system styles.

**Why it happens:**
The `mdx-components.tsx` file is an App Router convention that did not exist in the Pages Router. Developers migrating from other MDX setups (or following older tutorials) skip this file.

**How to avoid:**
Create `mdx-components.tsx` at the repo root immediately when setting up `@next/mdx`:
```typescript
import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <h1 className="font-condensed text-4xl uppercase tracking-tighter">{children}</h1>,
    code: ({ children }) => <code className="bg-surface px-1 text-accent font-mono text-sm">{children}</code>,
    ...components,
  }
}
```

**Warning signs:**
- Build error: "mdx-components file is missing"
- MDX renders without any custom styling — headings look like browser defaults
- `prose` classes not applied to MDX content

**Phase to address:** Phase 2 — must be created before first MDX file is tested.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Add `"use client"` to every component | Silences all Server Component errors immediately | Loses all SSR/SSG benefits; defeats the purpose of Next.js migration | Never — use surgical `"use client"` placement |
| Keep Google Fonts CDN `<link>` in layout.tsx | No change needed | Google Fonts CDN fires a network request on every page load; flash of unstyled text on slow connections; Google tracks users | Never — use `next/font/google` which self-hosts at build time |
| Leave `"type": "module"` + Vite deps in package.json | Avoid npm install changes | Causes ESM/CJS conflicts; Vite `type: "module"` interacts badly with Next.js CJS requirements in some configs | Never — clean break is safer |
| Keep `importmap` in index.html loaded via CDN (esm.sh) | Works in browser | `importmap` is irrelevant in Next.js (Webpack/Turbopack bundles deps); the CDN URLs in `index.html` do nothing after Next.js takes over and `index.html` is removed | Never — remove entirely |
| Use `output: 'export'` in next.config.mjs (static export) | Simpler hosting | Disables API routes, Route Handlers, and all server features; Vercel auto-detects Next.js natively and handles serverless correctly | Never — Vercel handles Next.js server output natively |

---

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| SendGrid via Route Handler | Copy old `req.body` access pattern; `request.body` in App Router is a `ReadableStream` not a parsed object | Use `const { name, email, message } = await request.json()` to parse body |
| Google Gemini API | Hard-coded to `gemini-3-flash-preview` (preview/unstable model); preview models are deprecated with short notice | Make model name an env var: `process.env.GEMINI_MODEL ?? 'gemini-2.0-flash'`; upgrade to stable model before migration |
| Vercel Environment Variables | `VITE_` prefix exposes vars to browser; Next.js uses `NEXT_PUBLIC_` prefix | All browser-visible env vars must be renamed from `VITE_API_KEY` to `NEXT_PUBLIC_API_KEY`; server-only vars (Gemini key, SendGrid key) keep no prefix |
| Framer Motion + Next.js | Import `motion` in Server Components | Wrap in `"use client"` component or create a re-export file with `"use client"` at the top |
| next/font + Tailwind | Define font in layout.tsx with `next/font/google` but forget to register the CSS variable with Tailwind | The `next/font` declaration must expose a CSS variable (`variable: '--font-inter'`) and Tailwind's config must reference it: `fontFamily: { sans: ['var(--font-inter)'] }` |

---

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Chat history sent in full with every message | Gemini API latency increases per conversation; eventual 4.5 MB Vercel payload limit error | Implement sliding window — send only last 10 messages | ~50+ message conversations; immediately if message text is long |
| `unoptimized: true` in next.config.mjs | Images load at full Unsplash resolution (1200px source for 300px display) | Remove `unoptimized: true`; use Vercel's built-in image optimization (1,000 free image transformations/month on Hobby plan) | At any scale — it wastes bandwidth from the first request |
| MDX blog build time with dynamic imports | Long `next build` times as post count grows | Pre-generate all slugs with `generateStaticParams` returning an array from `fs.readdirSync('content/blog')` | Noticeable at ~50 posts; Vercel 45-minute build limit becomes risk at ~500+ posts |
| Scroll event re-renders in Nav without throttle | Nav component re-renders on every scroll pixel; jank on mobile | Add throttle (100ms) or use IntersectionObserver | Immediate on mobile devices; visible at any scale |

---

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| `console.error(mailErr)` logs full SendGrid error object | Partial API keys, request metadata may appear in Vercel function logs (retained 1 hour on Hobby plan, accessible in dashboard) | Log only `mailErr.message` or `mailErr.code`, never the full error object |
| No CORS headers on Route Handlers | Any origin can POST to `/api/chat` and exhaust Gemini quota | Add `Access-Control-Allow-Origin: https://axionlab.in` header in Route Handler responses; add OPTIONS handler |
| Gemini function call args used without validation | Malicious prompt injection could pass unexpected types to `sendEmailInquiry` args | Validate `args.userEmail` matches email regex before using; check `args.userName` length before interpolating into email |
| `NEXT_PUBLIC_` prefix on server-only keys | Any key prefixed with `NEXT_PUBLIC_` is embedded in the client bundle and visible in browser source | Gemini API key and SendGrid key must have NO prefix — they are server-only |
| MDX content from untrusted sources rendered via `next-mdx-remote` | Arbitrary JSX execution = XSS | For this project, content is file-based and committed to git, so risk is low; only becomes an issue if CMS/user-submitted MDX is added later |

---

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Hash URLs (`/#/philosophy`) not redirected to clean URLs (`/philosophy`) | Old links from bookmarks, social media, external sites go to 404 | Add Next.js middleware or a client-side redirect in `app/page.tsx` that detects hash routes and redirects; hash redirects cannot be done in `next.config.js` redirects because the hash is client-side only |
| Google Fonts CDN link in layout.tsx | ~200ms of network latency per page load for font resolution; FOUC on slow connections | Replace with `next/font/google` in layout.tsx; fonts are self-hosted and served with zero layout shift |
| Framer Motion page transitions cause double-render flash | Page content flickers before animation starts | Use `AnimatePresence` at the layout level, not per-page; ensure `initial={false}` on mount to prevent entry animation on first load |
| Blog listing with no fallback when zero posts exist | Empty `/insights` page with no content | Add explicit empty state ("Posts coming soon") before any MDX content is written |
| SEO metadata not exported from each page | All pages share the same title/description from layout.tsx | Every `page.tsx` must export its own `export const metadata: Metadata = { ... }` — the layout metadata is only a fallback |

---

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Tailwind PostCSS migration:** `globals.css` has `@tailwind base/components/utilities` directives — but verify `postcss.config.js` (or `postcss.config.mjs`) exists and has `tailwindcss` and `autoprefixer` plugins. Without `postcss.config.js`, Tailwind classes compile to nothing.
- [ ] **API routes migrated:** Files exist at `app/api/chat/route.ts` — but verify they use `export async function POST(request: Request)` signature, not the old `handler(req, res)` pattern. The file name alone doesn't guarantee correct behavior.
- [ ] **MDX blog infrastructure:** `.mdx` files render in development — but verify `generateStaticParams` returns all slugs and `dynamicParams = false` is set, or posts will 404 in production SSG builds.
- [ ] **vercel.json cleaned:** File no longer has `"framework": "vite"` — but also verify `"outputDirectory": "dist"` and the SPA catch-all rewrite are removed. Partial cleanup causes partial failures.
- [ ] **Hash URL redirects:** The `/` page exists and pages are accessible at clean URLs — but old `/#/work` links still 404 unless a client-side redirect component is added to the root page.
- [ ] **next/font declared correctly:** Inter font loads — but verify the CSS variable is exposed (`variable: '--font-inter'`) AND Tailwind config references it. A missing CSS variable means the font loads correctly in Next.js but Tailwind utility classes like `font-sans` use the system font.
- [ ] **Environment variables prefixed correctly:** API calls work in development — but verify server-only keys (Gemini, SendGrid) have NO `NEXT_PUBLIC_` prefix. Vercel env var panel and `.env.local` must both be consistent.
- [ ] **`mdx-components.tsx` at root:** MDX renders — but verify it exports `useMDXComponents`, not a default export. Wrong export shape silently disables custom components.

---

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| vercel.json mismatch discovered post-deploy | LOW | Edit `vercel.json` → push → Vercel redeploys automatically; no downtime |
| Wrong Tailwind color values in production | LOW | Update `tailwind.config.js` → rebuild → redeploy; CDN-cached CSS purges within seconds on Vercel |
| API routes not working (wrong signature) | LOW | Correct Route Handler signature → redeploy; no data loss |
| Framer Motion crashing build | LOW | Add `"use client"` to affected components → rebuild |
| MDX posts 404 in production but work in dev | MEDIUM | Verify `generateStaticParams` returns all slugs; check for slug/filename mismatch; rebuild |
| Gemini model deprecated mid-operation | MEDIUM | Update model string in env var (if configured as env var) → redeploy; if hard-coded, requires code change + deploy |
| Full migration revert needed (like the last attempt) | HIGH | Git revert to pre-migration commit; restart migration from scratch with this pitfalls document; estimated 1-2 days lost |

---

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| vercel.json framework field still "vite" | Phase 1: Initial Setup | `cat vercel.json` has no `framework` field; `vercel build` locally produces `.next/` not `dist/` |
| Dual Tailwind color divergence | Phase 1: Initial Setup | Visual comparison screenshot of nav/hero before and after migration; verify `#080808` background in DevTools |
| API handler signature mismatch | Phase 1: API Migration | `curl -X POST /api/chat` returns JSON, not 500; check Vercel function logs show no `TypeError` |
| Framer Motion Server Component error | Phase 1: Initial Setup | `next build` completes without "Server Component" errors in output |
| `@next/mdx` missing frontmatter support | Phase 2: MDX Infrastructure | Blog listing shows correct title/date from frontmatter; `console.log(metadata)` in page.tsx shows parsed values |
| `mdx-components.tsx` missing | Phase 2: MDX Infrastructure | `next build` completes; rendered MDX uses custom heading styles, not browser defaults |
| Google Fonts CDN not replaced | Phase 1: Initial Setup | Network tab shows zero requests to `fonts.googleapis.com`; fonts still render correctly |
| Hash URLs not redirected | Phase 3: SEO Polish | Navigate to `axionlab.in/#/work` in browser → redirects to `axionlab.in/work` |
| SEO metadata missing per-page | Phase 3: SEO Polish | `curl axionlab.in/philosophy` contains `<title>AXIONLAB | Philosophy...</title>`, not the generic layout title |
| Chat history payload hitting 4.5MB Vercel limit | Phase 1: API Migration | Add sliding window (last 10 messages) to `Chatbot.tsx` before migration; test with long conversation in dev |

---

## Sources

- [Next.js official migration guide: Vite to Next.js](https://nextjs.org/docs/app/guides/migrating/from-vite) — verified 2026-02-27
- [Next.js Route Handlers documentation](https://nextjs.org/docs/app/getting-started/route-handlers) — verified 2026-02-27
- [Next.js MDX guide](https://nextjs.org/docs/app/guides/mdx) — verified 2026-02-27
- [Vercel Function Limits](https://vercel.com/docs/functions/limitations) — verified 2026-03-07
- [Vercel Hobby Plan Limits](https://vercel.com/docs/limits) — verified 2026-03-07
- [App Router pitfalls community roundup](https://imidef.com/en/2026-02-11-app-router-pitfalls) — verified 2026-02-11
- [Framer Motion + Next.js "use client" issue tracker](https://github.com/motiondivision/motion/issues/2054)
- [Tailwind v3/v4 PostCSS conflict GitHub discussion](https://github.com/tailwindlabs/tailwindcss/issues/15735)
- Project codebase direct inspection: `index.html`, `tailwind.config.js`, `api/chat.js`, `vercel.json`, `next.config.mjs`, `app/layout.tsx` — 2026-03-07
- `.planning/codebase/CONCERNS.md` — 2026-03-07

---
*Pitfalls research for: Vite SPA → Next.js App Router migration + MDX blog (AXIONLAB)*
*Researched: 2026-03-07*
