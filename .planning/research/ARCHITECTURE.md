# Architecture Research

**Domain:** Marketing/portfolio website with MDX blog — Next.js App Router migration
**Researched:** 2026-03-07
**Confidence:** HIGH (official Next.js docs, direct codebase analysis)

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js App Router (SSG/SSR)                  │
├─────────────────────────────────────────────────────────────────┤
│  app/layout.tsx [SERVER]                                         │
│  ┌──────────┐  ┌───────────────────────────────────────────┐    │
│  │ Nav.tsx  │  │              {children}                    │    │
│  │[CLIENT]  │  │  (page.tsx files — SERVER by default)     │    │
│  └──────────┘  └───────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Footer.tsx [SERVER — no state or browser APIs needed]   │    │
│  └─────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Chatbot.tsx [CLIENT — useState, fetch, AbortController] │    │
│  └─────────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────┤
│                      Page Layer (SERVER)                         │
│  ┌──────┐ ┌────────────┐ ┌──────┐ ┌──────┐ ┌─────┐ ┌──────┐   │
│  │ /    │ │/philosophy │ │/work │ │/caps │ │/ins │ │/init │   │
│  │(SC)  │ │   (SC)     │ │(SC)  │ │(SC)  │ │(SC) │ │(CC)  │   │
│  └──────┘ └────────────┘ └──────┘ └──────┘ └─────┘ └──────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │   /insights/[slug]/page.tsx (SC — reads MDX file, SSG)  │   │
│  └──────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                    Content Layer                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  content/blog/*.mdx  (static files, read at build time)  │   │
│  └──────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                    API Layer (Route Handlers)                     │
│  ┌─────────────────────────┐  ┌──────────────────────────┐      │
│  │ app/api/chat/route.ts   │  │ app/api/send-email/       │      │
│  │ (Gemini + SendGrid)     │  │ route.ts (SendGrid)       │      │
│  └─────────────────────────┘  └──────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

Legend: SC = Server Component, CC = Client Component (requires 'use client')

### Component Responsibilities

| Component | Type | Responsibility | Communicates With |
|-----------|------|---------------|-------------------|
| `app/layout.tsx` | Server | Root HTML shell, metadata, global layout | Nav, Footer, Chatbot as children/siblings |
| `components/Nav.tsx` | **Client** | Scroll state detection, mobile menu toggle, active path tracking via `usePathname()` | `next/navigation` usePathname hook |
| `components/Footer.tsx` | Server | Static links and copyright — no interactivity | None (update hrefs from `#/philosophy` to `/philosophy`) |
| `components/Chatbot.tsx` | **Client** | AI chat UI, state, fetch to `/api/chat` | `/api/chat` Route Handler |
| `app/page.tsx` | Server | Home page, static system classifications grid | Framer Motion wrapper (Client) |
| `app/philosophy/page.tsx` | Server | Philosophy static content | Framer Motion wrapper (Client) |
| `app/capabilities/page.tsx` | Server | Capabilities static content | Framer Motion wrapper (Client) |
| `app/work/page.tsx` | Server | Portfolio/work grid | Framer Motion wrapper (Client) |
| `app/careers/page.tsx` | Server | Careers static content | None |
| `app/insights/page.tsx` | Server | Blog listing — reads MDX frontmatter via `fs` at build time | `content/blog/*.mdx` |
| `app/insights/[slug]/page.tsx` | Server | Individual blog post — dynamic import of MDX | `content/blog/[slug].mdx` via `@next/mdx` |
| `app/initiate/page.tsx` | **Client** | Contact form with `useState`, fetch to `/api/send-email` | `/api/send-email` Route Handler |
| `app/api/chat/route.ts` | Route Handler | Gemini AI inference + SendGrid dispatch | Gemini API, SendGrid API |
| `app/api/send-email/route.ts` | Route Handler | SendGrid email dispatch | SendGrid API |
| `app/not-found.tsx` | Server | Custom 404 matching design system | None |
| `app/sitemap.ts` | Server | Auto-generated sitemap.xml | `content/blog/*.mdx` frontmatter |

## Recommended Project Structure

```
axionlab/
├── app/
│   ├── layout.tsx              # Root layout (Server) — Nav, Footer, Chatbot, metadata
│   ├── page.tsx                # Home (Server) — static + MotionWrapper client island
│   ├── not-found.tsx           # 404 page (Server)
│   ├── sitemap.ts              # Auto-generates sitemap.xml (Server)
│   ├── robots.ts               # robots.txt (Server)
│   ├── philosophy/
│   │   └── page.tsx            # Server Component
│   ├── capabilities/
│   │   └── page.tsx            # Server Component
│   ├── work/
│   │   └── page.tsx            # Server Component
│   ├── careers/
│   │   └── page.tsx            # Server Component
│   ├── insights/
│   │   ├── page.tsx            # Blog listing (Server) — reads MDX frontmatter
│   │   └── [slug]/
│   │       └── page.tsx        # Blog post (Server) — generateStaticParams + MDX import
│   ├── initiate/
│   │   └── page.tsx            # Client Component (form state)
│   └── api/
│       ├── chat/
│       │   └── route.ts        # Route Handler replacing api/chat.js
│       └── send-email/
│           └── route.ts        # Route Handler replacing api/send-email.js
├── components/
│   ├── Nav.tsx                 # Client Component (scroll, mobile menu, usePathname)
│   ├── Footer.tsx              # Server Component (static links, no state)
│   ├── Chatbot.tsx             # Client Component (chat state, fetch)
│   └── motion/
│       └── MotionWrapper.tsx   # Client Component — wraps Framer Motion for use in Server pages
├── content/
│   └── blog/
│       ├── post-one.mdx        # MDX blog posts with frontmatter
│       └── post-two.mdx
├── lib/
│   └── blog.ts                 # Server-only: reads MDX files, extracts frontmatter (gray-matter)
├── mdx-components.tsx          # Required by @next/mdx for App Router — global MDX component overrides
├── next.config.mjs             # withMDX wrapper, pageExtensions, redirects for /#/ URLs
├── tailwind.config.js          # PostCSS-based (no CDN)
└── postcss.config.js           # Required by Tailwind PostCSS integration
```

### Structure Rationale

- **`app/` top-level:** Next.js App Router convention. All route segments live here. Chatbot rendered once in layout — available on all pages globally.
- **`components/motion/`:** Isolates Framer Motion behind a 'use client' boundary. Server pages import `MotionWrapper` instead of `motion` directly — keeps page components as Server Components while enabling animations.
- **`content/blog/`:** MDX files outside `app/` — they are data, not routes. Imported dynamically in `app/insights/[slug]/page.tsx` via `await import('@/content/blog/${slug}.mdx')`.
- **`lib/blog.ts`:** Server-only utility using `fs` and `gray-matter` to enumerate blog posts for the listing page and sitemap. Never imported in client components.
- **`mdx-components.tsx`:** Required file at project root — mandatory for `@next/mdx` with App Router. Maps markdown elements to AXIONLAB-styled Tailwind components.
- **`app/api/`:** Next.js Route Handlers replace `api/chat.js` and `api/send-email.js`. Same file paths under `/api/chat` and `/api/send-email` so Chatbot/form fetch calls need no URL changes.

## Architectural Patterns

### Pattern 1: Client Island in Server Page

**What:** Pages default to Server Components. Interactive sections extracted into 'use client' wrapper components. Server renders static content + injects Client islands.

**When to use:** Any page with Framer Motion `motion.*` components, `useState`, `useEffect`, or event handlers.

**Trade-offs:** Slightly more file count. Massive benefit: Server Component pages get SSG, metadata API, zero client JS for static content.

**Example:**
```typescript
// components/motion/MotionWrapper.tsx
'use client'
import { motion } from 'framer-motion'

export function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

// app/page.tsx — stays a Server Component
import { FadeIn } from '@/components/motion/MotionWrapper'

export default function Home() {
  return (
    <FadeIn>
      <h1>Engineering for the obsessed.</h1>
    </FadeIn>
  )
}
```

### Pattern 2: MDX Blog with generateStaticParams

**What:** Blog posts live as `.mdx` files in `content/blog/`. `generateStaticParams` enumerates them at build time for SSG. Dynamic import loads each post's MDX module.

**When to use:** Any file-based content system where slugs are known at build time.

**Trade-offs:** Full rebuild required for new posts (fine for Vercel free plan). Zero database dependency. Posts are version-controlled.

**Example:**
```typescript
// app/insights/[slug]/page.tsx
import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/blog'

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map(post => ({ slug: post.slug }))
}

export const dynamicParams = false // 404 for unknown slugs

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { default: Post } = await import(`@/content/blog/${slug}.mdx`)
  return (
    <article className="max-w-3xl mx-auto px-6 pt-40 pb-40">
      <Post />
    </article>
  )
}
```

### Pattern 3: Route Handler Migration from Vercel Serverless

**What:** Existing `api/chat.js` and `api/send-email.js` (Vercel serverless function format with `req`/`res`) migrate to Next.js Route Handlers (Web API `Request`/`Response`).

**When to use:** Any API endpoint in the project.

**Trade-offs:** Different API shape — `req.body` becomes `await request.json()`, `res.status(200).json()` becomes `Response.json()`. Logic is identical.

**Example:**
```typescript
// app/api/send-email/route.ts — replaces api/send-email.js
import sgMail from '@sendgrid/mail'

export async function POST(request: Request) {
  const { email, message } = await request.json()

  if (!email || !message) {
    return Response.json({ error: 'Email and message required' }, { status: 400 })
  }
  // ... SendGrid logic unchanged
  return Response.json({ success: true })
}
```

### Pattern 4: Per-Page Metadata via Metadata API

**What:** Next.js App Router's `generateMetadata` function or static `metadata` export replaces the single `<title>` in `index.html`. Each page exports its own metadata.

**When to use:** Every page.tsx file. Blog posts use `generateMetadata` to pull frontmatter dynamically.

**Example:**
```typescript
// app/philosophy/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Philosophy | AXIONLAB',
  description: 'The operating principles behind AXIONLAB systems engineering.',
  openGraph: {
    title: 'Philosophy | AXIONLAB',
    description: '...',
  },
}

export default function Philosophy() { /* ... */ }

// app/insights/[slug]/page.tsx — dynamic metadata from frontmatter
export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug) // from lib/blog.ts
  return {
    title: `${post.title} | AXIONLAB Insights`,
    description: post.description,
  }
}
```

### Pattern 5: Hash-to-Pathname Redirect

**What:** Old `/#/philosophy` URLs redirect to `/philosophy` via `next.config.mjs`. Hash fragments cannot be redirected server-side (browsers strip them before sending requests), so a client-side script in the root layout handles the edge case.

**When to use:** Any migration from hash-based routing to file-system routing.

**Trade-offs:** Server-side `redirects` in `next.config.mjs` cannot catch hash-only URLs because the browser never sends the hash to the server. A lightweight client script in layout is required for users arriving via old bookmarks.

**Example:**
```typescript
// next.config.mjs — handles /#/ if somehow server sees it (proxies, etc.)
const nextConfig = {
  async redirects() {
    return [
      { source: '/', has: [{ type: 'query', key: '_escaped_fragment_', value: '/(.*)', }], destination: '/:path*', permanent: true },
    ]
  },
}

// app/layout.tsx — inline script for browser-side hash migration
// Add a small <Script> that checks window.location.hash on load
// and calls window.location.replace() to the clean URL
```

## Data Flow

### Request Flow: Blog Post Page

```
User visits /insights/my-post
    |
    v
Next.js matches app/insights/[slug]/page.tsx
    |
    v (build time, SSG)
generateStaticParams() → lib/blog.ts → fs.readdir('content/blog/')
    |
    v
page.tsx → await import('@/content/blog/my-post.mdx')
    |
    v
MDX compiled to React component tree (by @next/mdx at build time)
    |
    v
mdx-components.tsx overrides applied (custom h1, h2, code blocks)
    |
    v
Server renders HTML + RSC payload → sent to browser
    |
    v (browser)
Static HTML displayed instantly — no client JS required for blog content
```

### Request Flow: Chat API

```
User types in Chatbot (Client Component)
    |
    v
handleSend() → fetch('/api/chat', { method: 'POST', body: { message, history } })
    |
    v
app/api/chat/route.ts → export async function POST(request: Request)
    |
    v
await request.json() → { message, history }
    |
    v
GoogleGenAI({ apiKey: process.env.API_KEY })
    |  (process.env.API_KEY never leaves server — not prefixed NEXT_PUBLIC_)
    v
ai.models.generateContent() → checks for functionCall (sendEmailInquiry)
    |
    v (if tool called)
sgMail.send() → SendGrid API
    |
    v
Response.json({ text, isSystem }) → Chatbot updates messages state
```

### Request Flow: Form Submission

```
User fills initiate form → submit
    |
    v (Client Component — app/initiate/page.tsx)
handleSubmit() → fetch('/api/send-email', { method: 'POST', body: { email, message } })
    |
    v
app/api/send-email/route.ts
    |
    v
sgMail.send() × 2 (agency + user copy)
    |
    v
Response.json({ success: true }) → setStatus('success') → success UI shown
```

### State Management

```
No global state needed — site is read-only except for:

  Chatbot (Client Component):
    useState: messages[], input, isLoading, isOpen
    Isolated — no sharing needed outside component

  Initiate form (Client Component):
    useState: formData{}, status
    Isolated — no sharing needed

  Nav (Client Component):
    usePathname() from next/navigation — reads current URL automatically
    useState: scrolled, mobileMenuOpen
    No prop drilling needed — usePathname is automatic
```

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-10k users | Current SSG approach is ideal. No changes needed. Vercel CDN serves pre-built pages globally. |
| 10k-100k users | Blog content may need ISR if publishing frequency increases. Move to paid Vercel plan. |
| 100k+ users | Not a concern for a marketing/portfolio site. If traffic explodes: add ISR, consider image CDN for blog. |

### Scaling Priorities

1. **First bottleneck:** API routes (chat, send-email) under Vercel free plan have 10s timeout. Gemini calls occasionally approach this. Solution: optimize system instruction length; move to Edge runtime if needed.
2. **Second bottleneck:** Blog rebuild time if 100s of posts. Solution: ISR (`revalidate: 3600`) when graduating from free plan.

## Anti-Patterns

### Anti-Pattern 1: Making All Components 'use client'

**What people do:** Add `'use client'` to every component to avoid Server Component constraints (especially when migrating from a Vite SPA where everything was client-side).

**Why it's wrong:** Eliminates all SSR/SSG benefits. Pages lose the metadata API. Bundle size balloons. This is the primary risk during this migration.

**Do this instead:** Default to Server Components. Only add `'use client'` when the component genuinely needs: `useState`, `useEffect`, browser APIs (`window`, `document`), or event handlers like `onClick`. The list for this project is: Nav, Chatbot, Initiate form, and any Framer Motion wrapper components.

### Anti-Pattern 2: Importing Framer Motion Directly in Server Pages

**What people do:** Import `motion` from `framer-motion` directly inside `app/page.tsx` or other Server Component pages.

**Why it's wrong:** Build error. Framer Motion uses browser DOM APIs. Server Components cannot run browser code. The build will fail with a "You're importing a component that needs useState" error.

**Do this instead:** Create thin wrapper components in `components/motion/` with `'use client'` at the top. Import those wrappers in Server pages. The wrapper accepts `children` and handles the animation — Server page provides the content.

### Anti-Pattern 3: Using `window.location.hash` in Nav Component

**What people do:** Carry over the hash-change pattern from `Nav.tsx` which currently reads `window.location.hash.replace(/^#/, '')` to track active route.

**Why it's wrong:** After migration, routing is file-system based. Next.js provides `usePathname()` from `next/navigation` which returns the current pathname automatically. Hash-based path detection is completely unnecessary and won't work correctly.

**Do this instead:** Replace all `window.location.hash` usage in Nav with `const pathname = usePathname()` from `next/navigation`. Active link detection becomes `pathname === link.href`.

### Anti-Pattern 4: Keeping `api/chat.js` Pattern (req/res) Instead of Route Handlers

**What people do:** Try to keep the existing Vercel serverless function signature (`handler(req, res)`) inside `app/api/`.

**Why it's wrong:** Next.js App Router Route Handlers use the Web API `Request`/`Response` pattern — not the Node.js `req`/`res` pattern. The old `res.status(200).json()` calls will throw errors.

**Do this instead:** Migrate to `export async function POST(request: Request)` with `await request.json()` for body parsing and `return Response.json(data)` for responses. The business logic (Gemini/SendGrid calls) is identical.

### Anti-Pattern 5: Keeping Tailwind CDN

**What people do:** Leave `<script src="https://cdn.tailwindcss.com">` in a root layout since it "works."

**Why it's wrong:** CDN Tailwind is a development convenience — it cannot purge unused classes, runs in the browser at runtime (performance penalty), and lacks PostCSS plugin support. Also causes the exact dual-config conflict that previously triggered the revert (`6e78273` → `b4f41ef`). Next.js requires PostCSS-based Tailwind.

**Do this instead:** Install `tailwindcss`, `postcss`, `autoprefixer` as devDependencies. Create `postcss.config.js`. Remove the CDN script tag from any layout. Reconcile the two competing theme configs (CDN used `#080808`, `tailwind.config.js` uses `#0e0e0e`) — choose one canonical background color before proceeding.

### Anti-Pattern 6: Using `next.config.mjs` `images.unoptimized: true` for Production

**What people do:** Keep the `images: { unoptimized: true }` flag that was added "for static export on some platforms."

**Why it's wrong:** This disables Next.js's built-in image optimization entirely, losing automatic WebP conversion, responsive sizing, and lazy loading. The site currently uses external Unsplash URLs — these benefit most from optimization.

**Do this instead:** Remove `unoptimized: true`. Add Unsplash to `images.remotePatterns` in `next.config.mjs`. Replace `<img>` tags with `next/image` `<Image>` components.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Google Gemini | Server-only via `app/api/chat/route.ts` using `@google/genai` | API key in `process.env.API_KEY` (no `NEXT_PUBLIC_` prefix — stays server-only) |
| SendGrid | Server-only via `app/api/chat/route.ts` and `app/api/send-email/route.ts` | API key in `process.env.SENDGRID_API_KEY` |
| Vercel | Auto-detected Next.js project, no `vercel.json` configuration needed for routing | `vercel.json` currently present — can be simplified or removed |
| Unsplash (images) | Static URLs in page components — should migrate to `next/image` + `remotePatterns` config | Currently `<img>` tags with external URLs |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Server pages ↔ Client islands | Props only (must be serializable) | Framer Motion wrappers accept `children` — clean boundary |
| Client Components ↔ API routes | `fetch()` POST requests from browser | Chatbot and Initiate form — paths `/api/chat` and `/api/send-email` unchanged |
| Blog listing ↔ MDX files | `lib/blog.ts` reads `content/blog/` via Node.js `fs` at build time | `lib/blog.ts` must never be imported in Client Components (server-only) |
| MDX posts ↔ page renderer | `await import('@/content/blog/${slug}.mdx')` in Server Component | MDX compiled at build time by `@next/mdx` — zero runtime cost |
| Nav ↔ current route | `usePathname()` from `next/navigation` — zero props needed | Nav must be 'use client' to use this hook |

## Build Order for Migration

The components have dependencies that dictate a safe migration sequence:

```
Step 1: Foundation (blocks everything else)
  package.json → add next, remove vite
  tailwind.config.js + postcss.config.js → PostCSS setup
  next.config.mjs → @next/mdx + redirects
  mdx-components.tsx → required before any MDX works
  tsconfig.json → update paths for Next.js

Step 2: Layout Layer (blocks all pages)
  app/globals.css → Tailwind directives (@tailwind base/components/utilities)
  app/layout.tsx → update to use next/font, remove CDN script tag
  components/Nav.tsx → replace window.location.hash with usePathname()
  components/Footer.tsx → replace #/ hrefs with clean /path hrefs

Step 3: Static Pages (independent of each other)
  app/page.tsx
  app/philosophy/page.tsx
  app/capabilities/page.tsx
  app/work/page.tsx
  app/careers/page.tsx
  → Each needs: hash hrefs fixed, Framer Motion wrapped, metadata added

Step 4: API Routes (independent of pages)
  app/api/chat/route.ts → migrate from api/chat.js
  app/api/send-email/route.ts → migrate from api/send-email.js
  → Test: Chatbot and Initiate form still work

Step 5: Blog System (depends on Step 1 + Step 2)
  lib/blog.ts → frontmatter extraction utility
  content/blog/ → first MDX post (validates pipeline)
  app/insights/page.tsx → listing page using lib/blog.ts
  app/insights/[slug]/page.tsx → post page with generateStaticParams

Step 6: SEO Infrastructure (depends on all pages)
  app/sitemap.ts → reads lib/blog.ts + static pages
  app/robots.ts → static robots.txt
  app/not-found.tsx → custom 404

Step 7: Cleanup (last — removes old SPA infrastructure)
  Delete: index.tsx, App.tsx, vite.config.js, vite.config.ts
  Delete: index.html (replaced by app/layout.tsx)
  Delete: metadata.json (replaced by Next.js Metadata API)
  Remove: Tailwind CDN script reference
  Verify: vercel.json is minimal or removed
```

## Sources

- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) — official docs, version 16.1.6, last updated 2026-02-27 (HIGH confidence)
- [Next.js MDX Integration Guide](https://nextjs.org/docs/app/guides/mdx) — official docs, version 16.1.6, last updated 2026-02-27 (HIGH confidence)
- [Next.js Route Handlers API Reference](https://nextjs.org/docs/app/api-reference/file-conventions/route) — official docs, version 16.1.6, last updated 2026-02-27 (HIGH confidence)
- [Next.js Redirecting Guide](https://nextjs.org/docs/app/guides/redirecting) — official docs, version 16.1.6, last updated 2026-02-27 (HIGH confidence)
- [Framer Motion + Next.js App Router community patterns](https://www.hemantasundaray.com/blog/use-framer-motion-with-nextjs-server-components) — MEDIUM confidence (multiple sources agree on 'use client' wrapper pattern)
- Codebase direct analysis: `app/layout.tsx`, `components/Nav.tsx`, `components/Chatbot.tsx`, `app/initiate/page.tsx`, `api/chat.js`, `api/send-email.js`, `package.json`

---
*Architecture research for: Vite SPA to Next.js App Router migration with MDX blog*
*Researched: 2026-03-07*
