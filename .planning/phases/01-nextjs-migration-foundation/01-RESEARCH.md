# Phase 1: Next.js Migration Foundation - Research

**Researched:** 2026-03-07
**Domain:** Vite SPA to Next.js App Router migration — framework swap, routing, Tailwind, fonts, API routes, Framer Motion
**Confidence:** HIGH (all critical findings verified against official Next.js v16.1.6 docs and direct codebase inspection)

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| MIG-01 | Site builds and runs on Next.js App Router (replaces Vite + hash routing) | npm install next@latest; update package.json scripts; next.config.mjs already exists but needs cleanup |
| MIG-02 | Tailwind CSS processes via PostCSS with unified color config (#080808 background) | Tailwind v4 via @tailwindcss/postcss; CDN colors (index.html) are canonical, not tailwind.config.js |
| MIG-03 | Fonts load via next/font (Inter + Inter Tight) with zero layout shift | next/font/google; Inter + Inter_Tight; CSS variables wired into Tailwind @theme block |
| MIG-04 | vercel.json updated for Next.js framework (not Vite) | Remove "framework", "buildCommand", "outputDirectory", and SPA catch-all rewrite from vercel.json |
| MIG-05 | Legacy files cleaned up (index.html, index.tsx, vite configs, unused components) | Delete after Next.js build verified; App.tsx, Navbar.tsx, 6 unused components also candidates |
| RTG-01 | All 7 pages accessible at clean URLs (/philosophy, /capabilities, /work, /insights, /careers, /initiate) | app/ directory already has all 7 page.tsx files; Next.js App Router file-system routing is automatic |
| RTG-02 | Navigation (Nav component) uses next/link with usePathname for active state | Replace window.location.hash with usePathname() from next/navigation; replace <a href="#/..."> with <Link href="/..."> |
| RTG-03 | Footer uses next/link for internal navigation | Replace all href="#/path" with href="/path" in Footer.tsx; use next/link |
| RTG-04 | Old hash URLs (/#/work) redirect to clean URLs (/work) via client-side script | Hash is stripped by browser before server receives request; must use client-side window.location.hash check in root layout |
| RTG-05 | Custom 404 page in AXIONLAB design language | Create app/not-found.tsx as Server Component; match dark theme |
| RND-01 | Static pages (Philosophy, Capabilities, Work, Careers) render as Server Components | Default in App Router; only requirement is to NOT add "use client" and to wrap Framer Motion in MotionWrapper |
| RND-02 | Interactive pages (Home, Initiate) use "use client" with Framer Motion wrappers | Home uses motion.div directly — needs MotionWrapper; Initiate has form state — needs "use client" |
| RND-03 | Chatbot component works as client component with existing /api/chat endpoint | Chatbot already has full client state; add "use client"; fetch URL /api/chat unchanged |
| RND-04 | Root layout (app/layout.tsx) wraps all pages with Nav, Chatbot, Footer | layout.tsx already has Nav and Footer; Chatbot needs to be added; Google Fonts CDN import must be removed |
| API-01 | /api/chat migrated to Next.js Route Handler (app/api/chat/route.ts) | api/chat.js uses handler(req, res) — must convert to export async function POST(request: Request) |
| API-02 | /api/send-email migrated to Next.js Route Handler (app/api/send-email/route.ts) | api/send-email.js uses handler(req, res) — same conversion required |
| API-03 | Client-side fetch URLs unchanged — chatbot and contact form work without frontend changes | Route Handlers at app/api/chat/route.ts respond at /api/chat — same URL path as before |
</phase_requirements>

---

## Summary

Phase 1 is a pure migration — no new features, no visual changes. The goal is to take a working Vite SPA and make it a working Next.js App Router app with identical output. The codebase is already partially structured for Next.js (app/ directory, page.tsx files, layout.tsx exists), which reduces the scope significantly. The primary blockers are four things that must be fixed before a single `next build` can succeed: (1) vercel.json must lose its "framework": "vite" declaration, (2) Tailwind must switch from CDN to PostCSS with the correct color values (#080808 not #0e0e0e), (3) Framer Motion must be wrapped in a "use client" boundary before it crashes Server Component pages, and (4) the two API handlers must convert from Vercel serverless format (req/res) to Next.js Route Handler format (Request/Response).

The color divergence is the most subtle risk. The CDN config in index.html uses `background: #080808`, `muted: #666666`, `surface: #111111`. The tailwind.config.js uses `background: #0e0e0e`, `muted: #888888`, `surface: #1a1a1a`. The CDN values are what users see today — using the tailwind.config.js values is the likely cause of the previous revert (commit b4f41ef). The fix is to use Tailwind v4 via @tailwindcss/postcss and define an @theme block in globals.css using the CDN values as canonical.

The app/ directory already contains all 7 page.tsx files, app/layout.tsx, app/globals.css, and next.config.mjs. The migration work is largely about wiring things correctly rather than creating from scratch. Nav.tsx needs `usePathname()` substituted for the hash-change listeners. Footer.tsx needs `#/path` hrefs replaced with `/path`. The Chatbot component needs `"use client"` added and mounting in layout.tsx. Then package.json scripts must be updated from vite to next, and the legacy files cleaned up.

**Primary recommendation:** Fix vercel.json first, then Tailwind color config, then run `next build` early and iterate. Do not attempt to clean up legacy files (index.html, index.tsx, vite.config) until `next build` succeeds.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | latest (16.x) | App Router framework, file-based routing, SSG/SSR, metadata API | Official; Turbopack is default in v16; Vercel auto-detects from next.config.mjs |
| react | latest (19.x) | Already in use; stay at 19 | Next.js 16 requires React 19 |
| react-dom | latest (19.x) | Already in use | Must match React version |
| @types/react | latest | TypeScript types | Must match React 19; current devDependency is @types/react@18.3.3 — must upgrade |
| @types/react-dom | latest | TypeScript types | Must match React 19 |
| @types/node | latest | Node.js types for Route Handlers | Already installed |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| tailwindcss | latest (v4.x) | Replaces Tailwind v3 CDN + PostCSS setup | Required — CDN cannot work in Next.js build pipeline |
| @tailwindcss/postcss | latest | PostCSS plugin for Tailwind v4 | Required alongside tailwindcss v4 — replaces autoprefixer in postcss config |
| postcss | latest | CSS processing | Already installed (8.4.40) — may need update for v4 |
| next/font | built-in | Self-hosted Inter and Inter Tight | Replaces Google Fonts CDN link in globals.css and index.html |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Tailwind v4 | Stay on Tailwind v3 | v3 works but requires keeping tailwind.config.js AND reconciling color divergence manually; v4 @theme block is the cleanest solution |
| @tailwindcss/postcss | autoprefixer + tailwindcss/plugin | autoprefixer is not needed with Tailwind v4 — it handles vendor prefixes internally |
| next/font | Keep Google Fonts CDN link | CDN link causes external network request on every page load and FOUC; success criterion 4 explicitly requires zero fonts.googleapis.com requests |

**Installation:**
```bash
# Install Next.js and upgrade React types
npm install next@latest react@latest react-dom@latest
npm install -D @types/react@latest @types/react-dom@latest @types/node@latest

# Tailwind v4 (replaces tailwindcss@3 + autoprefixer)
npm install tailwindcss@latest @tailwindcss/postcss postcss

# Remove Vite
npm uninstall vite @vitejs/plugin-react autoprefixer
```

---

## Architecture Patterns

### Recommended Project Structure

After migration, the directory layout changes as follows. The app/ directory already exists and needs no structural changes — only content updates.

```
axionlab/
├── app/
│   ├── layout.tsx              # Update: add next/font, add Chatbot, remove CDN import
│   ├── globals.css             # Update: @import "tailwindcss" + @theme block (v4 syntax)
│   ├── page.tsx                # Update: wrap motion.div in MotionWrapper
│   ├── not-found.tsx           # NEW: custom 404 page
│   ├── philosophy/page.tsx     # Update: fix #/ hrefs, ensure no "use client"
│   ├── capabilities/page.tsx   # Update: same
│   ├── work/page.tsx           # Update: same
│   ├── careers/page.tsx        # Update: same
│   ├── insights/page.tsx       # Update: same (blog listing — Phase 2 scope for MDX)
│   ├── initiate/page.tsx       # Update: add "use client" (has form state)
│   └── api/
│       ├── chat/
│       │   └── route.ts        # NEW: migrated from api/chat.js
│       └── send-email/
│           └── route.ts        # NEW: migrated from api/send-email.js
├── components/
│   ├── Nav.tsx                 # Update: usePathname, next/link, remove hash listeners
│   ├── Footer.tsx              # Update: replace #/ hrefs with /path hrefs
│   ├── Chatbot.tsx             # Update: add "use client"
│   └── motion/
│       └── MotionWrapper.tsx   # NEW: "use client" wrapper for Framer Motion
├── next.config.mjs             # Update: remove images.unoptimized; add remotePatterns
├── postcss.config.mjs          # UPDATE/CREATE: @tailwindcss/postcss (not autoprefixer)
├── tsconfig.json               # Update: add paths alias @/* → ./*
└── vercel.json                 # UPDATE: remove framework/buildCommand/outputDirectory/rewrites
```

**Files to delete (after `next build` succeeds):**
- `index.html` — replaced by app/layout.tsx
- `index.tsx` — SPA entry point, not needed in App Router
- `App.tsx` — marked deprecated in codebase
- `vite.config.ts` and `vite.config.js` — replaced by next.config.mjs
- `components/Navbar.tsx` — deprecated nav variant
- All unused components: `Hero.tsx`, `Services.tsx`, `Technologies.tsx`, `Portfolio.tsx`, `Clients.tsx`, `Process.tsx`

### Pattern 1: vercel.json for Next.js

**What:** Remove all Vite-specific fields. Vercel auto-detects Next.js from next.config.mjs presence.

**Correct vercel.json after migration:**
```json
{
  "version": 2
}
```

Or simply delete vercel.json entirely — Vercel's auto-detection handles everything.

**What to remove:**
- `"framework": "vite"` — causes Vercel to run vite build even when next.config.mjs exists
- `"buildCommand": "npm run build"` — Vercel auto-generates this for Next.js
- `"outputDirectory": "dist"` — Next.js outputs to .next/, not dist/
- The SPA catch-all rewrite (`"source": "/(.*)", "destination": "/index.html"`) — this conflicts with Next.js page routing and will cause all pages to serve index.html instead of their server-rendered output

### Pattern 2: Tailwind v4 PostCSS Setup

**What:** Replace CDN script and tailwind.config.js with Tailwind v4 using @import syntax and @theme CSS block. The @theme block is where all custom design tokens live in v4.

**postcss.config.mjs:**
```javascript
// Source: https://tailwindcss.com/docs/guides/nextjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

Note: Use `.mjs` extension. The project uses `"type": "module"` in package.json. Remove `autoprefixer` — Tailwind v4 handles vendor prefixes internally.

**app/globals.css (full replacement):**
```css
@import "tailwindcss";

@theme {
  /* CANONICAL VALUES FROM index.html CDN CONFIG — not tailwind.config.js */
  --color-background: #080808;
  --color-accent: #ff1f3d;
  --color-muted: #666666;
  --color-surface: #111111;

  /* Font families — wired to CSS vars from next/font */
  --font-sans: var(--font-inter), sans-serif;
  --font-condensed: var(--font-inter-tight), sans-serif;

  /* Custom tokens */
  --letter-spacing-tighter: -0.04em;
  --radius-none: 0px;
}

/* Global resets from index.html <style> block — must be preserved */
* {
  border-radius: 0 !important;
  box-shadow: none !important;
}

::selection {
  background: #ff1f3d;
  color: #ffffff;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* glass-panel override from index.html — prevents gradient backgrounds */
.glass-panel,
.bg-gradient-to-br,
.bg-gradient-to-r,
.bg-gradient-to-t {
  background: #111111 !important;
  backdrop-filter: none !important;
}

/* fluid-heading from index.html */
.fluid-heading {
  font-size: clamp(2.5rem, 9vw, 10rem);
}
```

**CRITICAL COLOR DIVERGENCE — canonical values side by side:**

| Token | index.html CDN (canonical) | tailwind.config.js (WRONG) |
|-------|---------------------------|---------------------------|
| background | `#080808` | `#0e0e0e` |
| muted | `#666666` | `#888888` |
| surface | `#111111` | `#1a1a1a` |
| accent | `#ff1f3d` | `#ff1f3d` (matches) |

Use the index.html CDN values. The tailwind.config.js values were never what users saw — using them causes visible visual regression.

### Pattern 3: next/font Setup in layout.tsx

**What:** Replace the Google Fonts CDN `<link>` tags with next/font/google declarations. This eliminates external font requests and prevents layout shift.

**Current state in globals.css (line 1):**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Inter+Tight:wght@700;800;900&display=swap');
```
This must be removed.

**app/layout.tsx after migration:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/components/font
import { Inter, Inter_Tight } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { Chatbot } from '@/components/Chatbot'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-inter-tight',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AXIONLAB | Engineering for the obsessed.',
  description: 'Independent systems engineering lab designing commerce infrastructure and high-performance applications.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable}`}>
      <body className="bg-background text-white selection:bg-accent selection:text-white overflow-x-hidden">
        <Nav />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Chatbot />
      </body>
    </html>
  )
}
```

Note: The `variable` names (`--font-inter`, `--font-inter-tight`) must match the CSS variable references in the @theme block in globals.css (`--font-sans: var(--font-inter)`).

### Pattern 4: Framer Motion "use client" Wrapper

**What:** Framer Motion uses DOM APIs and React Context — it cannot run in Server Components. The existing page.tsx files import `motion` directly from `framer-motion`. This will cause build errors in App Router.

**Two valid approaches:**

**Approach A — Thin re-export wrapper (recommended for this project):**
```typescript
// components/motion/MotionWrapper.tsx
'use client'
export { motion, AnimatePresence } from 'framer-motion'
```

Then in app/page.tsx, change:
```typescript
// Before:
import { motion } from 'framer-motion'

// After:
import { motion } from '@/components/motion/MotionWrapper'
```

Page component stays a Server Component. This is surgical and minimally invasive.

**Approach B — Add "use client" to individual pages that use motion:**
```typescript
// app/page.tsx
'use client'
import { motion } from 'framer-motion'
```

This makes the whole page a Client Component, which works but loses SSG metadata API on that page. Acceptable for the Home page since it has inline metadata in layout.tsx. Not recommended for static pages.

**Recommendation:** Use Approach A (thin re-export). It is the minimal change and keeps pages as Server Components, which the success criterion for RND-01 requires.

**What currently uses Framer Motion (audit):**
- `app/page.tsx` line 3: `import { motion } from "framer-motion"` — uses `motion.div` for hero animation
- Other pages should be checked; if they don't use motion, they need no change

### Pattern 5: Nav.tsx Migration to usePathname

**What:** Nav currently uses `window.location.hash` to track the active route — this was the SPA routing mechanism. In Next.js, `usePathname()` from `next/navigation` provides the current pathname automatically.

**Before (current Nav.tsx):**
```typescript
const [pathname, setPathname] = useState(() => {
  return window.location.hash.replace(/^#/, '') || '/';
});

useEffect(() => {
  const handleHashChange = () => {
    setPathname(window.location.hash.replace(/^#/, '') || '/');
    setMobileMenuOpen(false);
  };
  window.addEventListener("hashchange", handleHashChange);
  return () => { window.removeEventListener("hashchange", handleHashChange); };
}, []);
```

**After:**
```typescript
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { name: "Philosophy", href: "/philosophy" },
  { name: "Capabilities", href: "/capabilities" },
  { name: "Work", href: "/work" },
  { name: "Insights", href: "/insights" },
];

export default function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // hashchange listener removed entirely — not needed
  // scroll listener stays — it controls nav background styling

  return (
    // ...
    // Active link detection changes from:
    //   pathname === link.href.replace(/^#/, '')
    // To:
    //   pathname === link.href
  )
}
```

Nav must have `"use client"` because it uses `useState`, `useEffect`, and `usePathname`. All three require a client component.

**Logo link:** Change `<a href="#/">` to `<Link href="/">`.
**Nav links:** Change `<a href="#/philosophy">` to `<Link href="/philosophy">`.
**Initiate CTA:** Change `<a href="#/initiate">` to `<Link href="/initiate">`.

### Pattern 6: API Route Handler Migration

**What:** The existing api/chat.js and api/send-email.js use Vercel/Pages Router serverless function signature (`handler(req, res)`). Next.js App Router uses named exports with Web API Request/Response.

**api/chat.js → app/api/chat/route.ts:**

```typescript
// app/api/chat/route.ts
import { GoogleGenAI, Type } from "@google/genai";
import sgMail from '@sendgrid/mail';

export async function POST(request: Request) {
  const { message, history } = await request.json()  // NOT req.body

  if (!process.env.API_KEY) {
    return Response.json({ error: 'SYSTEM_FAULT: Gemini API Key missing.' }, { status: 500 })
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY })
    // ... (Gemini logic is IDENTICAL — no changes needed)

    return Response.json({ text: finalResponseText, isSystem: emailSent })
    // NOT: res.status(200).json(...)

  } catch (error) {
    return Response.json({ error: 'CORE_EXCEPTION: Backend processing timed out or failed.' }, { status: 500 })
  }
}
```

**Key signature changes:**
| Before (Vercel serverless) | After (Route Handler) |
|---------------------------|----------------------|
| `export default async function handler(req, res)` | `export async function POST(request: Request)` |
| `req.method !== 'POST'` check | Not needed — named export `POST` only responds to POST |
| `const { message, history } = req.body` | `const { message, history } = await request.json()` |
| `return res.status(200).json({...})` | `return Response.json({...})` |
| `return res.status(500).json({...})` | `return Response.json({...}, { status: 500 })` |

**IMPORTANT:** The Gemini model in api/chat.js is `'gemini-3-flash-preview'` — a preview/unstable model. This should be changed to a stable model during migration. Recommended: `process.env.GEMINI_MODEL ?? 'gemini-2.0-flash'`. This prevents silent API breakage if the preview model is deprecated.

**api/send-email.js → app/api/send-email/route.ts:**

```typescript
// app/api/send-email/route.ts
import sgMail from '@sendgrid/mail';

export async function POST(request: Request) {
  const { email, message } = await request.json()

  if (!email || !message) {
    return Response.json({ error: 'Email and message are required.' }, { status: 400 })
  }
  // ... (SendGrid logic is IDENTICAL)
  return Response.json({ success: true, message: 'Emails dispatched successfully' })
}
```

### Pattern 7: Hash URL Backward Compatibility (RTG-04)

**What:** Users with old bookmarks or links pointing to `/#/work` must be redirected to `/work`. This cannot be done server-side because HTTP clients strip hash fragments before sending the request — the server never sees `/#/work`, it only sees `/`.

**Solution:** A small inline script in app/layout.tsx that checks `window.location.hash` on load and redirects to the clean path if a hash route is detected.

```typescript
// app/layout.tsx — inside <body>, before Nav
// This script runs synchronously to avoid flash of wrong content
<script dangerouslySetInnerHTML={{
  __html: `
    (function() {
      var hash = window.location.hash;
      if (hash.startsWith('#/') && hash.length > 2) {
        var path = hash.slice(1); // '#/work' → '/work'
        window.location.replace(path + window.location.search);
      }
    })();
  `
}} />
```

This must be a synchronous script (not `next/script` with `strategy="afterInteractive"`) because it must run before React hydration to avoid showing the wrong page. `dangerouslySetInnerHTML` on a `<script>` tag in a Server Component is the correct approach.

**What this handles:** Any user who navigates to `https://axionlab.in/#/work` gets immediately redirected to `https://axionlab.in/work` by the browser, before any React rendering occurs.

**What this does NOT handle:** This requires JavaScript. If a user has JS disabled, they will see the home page content instead of the target page — acceptable edge case for a marketing site.

### Pattern 8: Custom 404 Page (RTG-05)

```typescript
// app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-xl">
        <span className="font-mono text-accent text-[10px] tracking-[0.4em] uppercase font-black">
          404 — Node Not Found
        </span>
        <h1 className="text-8xl font-black uppercase tracking-tighter text-white mt-4 mb-8">
          Signal Lost.
        </h1>
        <p className="text-muted uppercase tracking-tight font-bold mb-12">
          The path you requested does not exist in this system.
        </p>
        <Link
          href="/"
          className="px-10 h-14 bg-accent text-white inline-flex items-center justify-center text-[12px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all"
        >
          Return to Base
        </Link>
      </div>
    </div>
  )
}
```

### Anti-Patterns to Avoid

- **Adding "use client" to all components:** The entire point of Next.js App Router is Server Components by default. Only Nav, Chatbot, Initiate form, and MotionWrapper need it. Adding it everywhere eliminates SSG benefits.
- **Keeping tailwind.config.js color values (#0e0e0e):** These are NOT what users see. The CDN config (#080808) is canonical.
- **Using Tailwind CDN script in layout.tsx:** Cannot work in Next.js build pipeline. Must use PostCSS.
- **Copying api/chat.js verbatim into app/api/chat/route.ts:** The handler(req, res) signature will throw `TypeError: res.status is not a function` at runtime.
- **Keeping vercel.json "framework": "vite":** Deployment will run `vite build` and output to `dist/` even when next.config.mjs exists.
- **Using `output: 'export'` in next.config.mjs:** This disables API Route Handlers. Vercel handles Next.js server output natively — do not force static export.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Current pathname detection in Nav | `window.location.hash` custom listeners | `usePathname()` from `next/navigation` | Next.js built-in; updates automatically on route change; no event listeners needed |
| Self-hosted fonts | Google Fonts CDN link | `next/font/google` | Built into Next.js; fonts served from Vercel CDN at build time; zero layout shift; no external requests |
| API response construction | Custom Response objects | `Response.json()` | Web standard built into Route Handlers; no NextResponse import needed for basic cases |
| Page-to-page links | `<a href="/path">` | `next/link` `<Link href="/path">` | Client-side navigation with prefetching; prevents full page reloads |
| Hash URL redirect | Server-side redirect in next.config | Inline `<script>` in layout.tsx | Hash fragments are client-only; server never sees them; must be client-side |

**Key insight:** Most of what was hand-rolled in the Vite SPA (routing, hash detection, page linking) has a direct Next.js built-in replacement. The migration is largely substituting these built-ins.

---

## Common Pitfalls

### Pitfall 1: vercel.json Vite Fields Not Fully Removed

**What goes wrong:** Build fails or deploys to wrong output directory.

**Why it happens:** Partial cleanup leaves `"outputDirectory": "dist"` or the SPA catch-all rewrite even after removing `"framework": "vite"`.

**How to avoid:** Remove ALL four fields: `framework`, `buildCommand`, `outputDirectory`, and the `/(.*) → /index.html` rewrite. The safest approach is to reduce vercel.json to `{"version": 2}` only.

**Warning signs:**
- `vercel build` locally outputs to `dist/` instead of `.next/`
- Deployment shows old SPA content on all URLs
- Vercel build logs show "Running vite..." instead of "Running next build..."

### Pitfall 2: Tailwind Color Values — Wrong Source

**What goes wrong:** Background renders as `#0e0e0e` (lighter) instead of `#080808`. Muted text changes from `#666666` to `#888888`. Surface elements shift from `#111111` to `#1a1a1a`. This is exactly what caused the previous revert.

**Why it happens:** Developer uses the values from tailwind.config.js instead of index.html CDN config. The CDN config was the active source for the site; tailwind.config.js was never applied.

**How to avoid:** Hardcode the CDN values into the @theme block. Do a visual comparison screenshot before and after migration. Check computed background-color in DevTools — must be `rgb(8, 8, 8)` (which is `#080808`), not `rgb(14, 14, 14)` (which is `#0e0e0e`).

**Exact canonical values from index.html:**
- background: `#080808` (NOT `#0e0e0e`)
- muted: `#666666` (NOT `#888888`)
- surface: `#111111` (NOT `#1a1a1a`)
- accent: `#ff1f3d` (same in both)

### Pitfall 3: Framer Motion Crashes Build Before Pages Can Be Tested

**What goes wrong:** `next build` fails immediately with: "You're importing a component that needs useState. It only works in a Client Component but none of its parents are marked with 'use client'."

**Why it happens:** app/page.tsx imports `{ motion }` from `'framer-motion'` directly (line 3). In App Router, all page.tsx files are Server Components by default. Framer Motion is a client-only library.

**How to avoid:** Create `components/motion/MotionWrapper.tsx` with `'use client'` BEFORE running `next build`. Update app/page.tsx to import from MotionWrapper. Check all other pages for direct framer-motion imports.

**Warning signs:** Build fails immediately with React hook or DOM API errors before any pages render.

### Pitfall 4: API Handler Signature Not Fully Converted

**What goes wrong:** API routes exist at the right paths but return 500 errors on every request with `TypeError: res.status is not a function`.

**Why it happens:** Developer copies api/chat.js to app/api/chat/route.ts without changing the function signature or body access pattern. The file compiles but crashes at runtime.

**How to avoid:** Three specific things must change: (1) function name from `handler(req, res)` to `POST(request: Request)`, (2) body access from `req.body` to `await request.json()`, (3) response from `res.status(200).json(...)` to `Response.json(..., { status: 200 })`. The business logic (Gemini calls, SendGrid calls) is identical and needs no changes.

**Warning signs:** Chatbot shows error messages; Vercel function logs show "TypeError: res.status is not a function"; form submission always fails.

### Pitfall 5: globals.css Google Fonts Import Not Removed

**What goes wrong:** Success criterion 4 fails — browser network tab still shows requests to fonts.googleapis.com even though next/font is configured.

**Why it happens:** The `@import url('https://fonts.googleapis.com/...')` at line 1 of globals.css is not removed when next/font is added to layout.tsx. Both load — the CDN link fires even though next/font also loads the fonts self-hosted.

**How to avoid:** When adding next/font declarations to layout.tsx, simultaneously remove line 1 from globals.css.

**Warning signs:** Network tab shows requests to fonts.googleapis.com; Font loads correctly because CDN is still active, masking that next/font may not be working.

### Pitfall 6: next/font CSS Variables Not Wired to Tailwind @theme

**What goes wrong:** Fonts load correctly via next/font, but Tailwind utility classes like `font-sans` and `font-condensed` use system fonts instead of Inter and Inter Tight.

**Why it happens:** next/font exposes fonts via CSS variables (`--font-inter`, `--font-inter-tight`) but Tailwind's @theme block doesn't know about them unless explicitly referenced.

**How to avoid:** The chain must be complete:
1. `next/font/google` declaration: `Inter({ variable: '--font-inter' })`
2. HTML class: `<html className={inter.variable}>` (adds `--font-inter` CSS var to the DOM)
3. Tailwind @theme: `--font-sans: var(--font-inter), sans-serif;`
4. Component usage: `className="font-sans"` → resolves to Inter

All four steps are required. Missing any one breaks the chain.

### Pitfall 7: package.json Scripts Not Updated

**What goes wrong:** `npm run dev` still runs `vite` after Next.js is installed; `npm run build` still runs `vite build`.

**How to avoid:** Update package.json scripts:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### Pitfall 8: tsconfig.json Missing Next.js Paths Alias

**What goes wrong:** Import `@/components/Nav` fails with module not found.

**How to avoid:** Ensure tsconfig.json includes:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

The existing layout.tsx already uses `@/components/Nav` and `@/components/Footer` — these will break if the path alias is not configured.

---

## Code Examples

Verified patterns from official sources:

### Route Handler (next.config.mjs-independent)

```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/route (v16.1.6)
// app/api/chat/route.ts

export async function POST(request: Request) {
  const body = await request.json()
  // process...
  return Response.json({ result: 'ok' })
}

// For error responses:
return Response.json({ error: 'message' }, { status: 500 })

// For 405 Method Not Allowed — not needed in Route Handlers
// Named exports (POST, GET, PUT) automatically restrict to their HTTP method
// A POST handler file does not respond to GET requests
```

### next/link for Navigation

```typescript
// Source: https://nextjs.org/docs/app/api-reference/components/link (v16.1.6)
import Link from 'next/link'

// Basic navigation
<Link href="/philosophy">Philosophy</Link>

// With active state using usePathname (requires "use client")
const pathname = usePathname()
<Link
  href="/philosophy"
  className={pathname === '/philosophy' ? 'text-white' : 'text-muted'}
>
  Philosophy
</Link>
```

### Tailwind v4 @theme

```css
/* Source: https://tailwindcss.com/docs/guides/nextjs (v4.2) */
@import "tailwindcss";

@theme {
  --color-background: #080808;
  --color-accent: #ff1f3d;
  --font-sans: var(--font-inter), sans-serif;
}
```

### next/font

```typescript
// Source: https://nextjs.org/docs/app/api-reference/components/font (v16.1.6)
import { Inter, Inter_Tight } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// In the HTML element:
<html className={`${inter.variable} ${interTight.variable}`}>
```

### Custom 404

```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/not-found (v16.1.6)
// app/not-found.tsx — automatically used for 404 responses
export default function NotFound() {
  return <div>Not found</div>
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `export default async function handler(req, res)` | `export async function POST(request: Request)` | Next.js 13 App Router (2022) | Body parsed via `await request.json()`, response via `Response.json()` |
| Tailwind v3 `tailwind.config.js` + `@tailwind base/components/utilities` | Tailwind v4 `@import "tailwindcss"` + `@theme {}` | Tailwind v4.0 (Jan 2025) | No more tailwind.config.js needed; CSS-first configuration |
| `autoprefixer` in postcss config | Not needed | Tailwind v4 | Tailwind v4 handles vendor prefixes internally |
| `tailwindcss/postcss` | `@tailwindcss/postcss` | Tailwind v4 | Separate package for the PostCSS plugin |
| Google Fonts CDN `<link>` | `next/font/google` | Next.js 13 (2022) | Zero external font requests; self-hosted on Vercel's CDN |
| `useRouter().pathname` from Pages Router | `usePathname()` from `next/navigation` | Next.js 13 App Router | Separate hook; requires `"use client"` |

**Deprecated/outdated:**
- `tailwind.config.js` with `theme.extend.colors`: Not needed in Tailwind v4 — use @theme block in CSS instead. The file can be deleted.
- `postcss.config.js` with `tailwindcss` and `autoprefixer` plugins: Replace with `@tailwindcss/postcss` only.
- `window.location.hash` route tracking in Nav: Replace with `usePathname()`.
- `export default async function handler(req, res)` Vercel serverless format: Replace with Route Handler named exports.

---

## Open Questions

1. **Chatbot mounting strategy in layout.tsx**
   - What we know: Chatbot.tsx has full client state (useState, useEffect, fetch). It needs to be rendered in layout.tsx so it's global across all pages.
   - What's unclear: Whether Chatbot should be rendered as a direct child of the body in layout.tsx (Server Component layout renders a Client Component child — this is valid) or whether it needs its own suspense boundary.
   - Recommendation: Add `<Chatbot />` directly in layout.tsx. Server Component layouts can render Client Component children without issues. This is standard Next.js App Router pattern.

2. **Gemini model update**
   - What we know: api/chat.js uses `gemini-3-flash-preview` (preview/unstable). This must be updated during API migration.
   - What's unclear: The exact current stable Gemini model identifier.
   - Recommendation: Use `process.env.GEMINI_MODEL ?? 'gemini-2.0-flash'` to make it configurable. Document in STATE.md that the Gemini model was updated.

3. **insights/page.tsx scope in Phase 1**
   - What we know: app/insights/page.tsx exists. Phase 1 success criterion 1 says all 7 pages must be accessible. Phase 2 handles MDX blog infrastructure.
   - What's unclear: Whether insights/page.tsx needs any changes for Phase 1, or if it just needs to render without errors.
   - Recommendation: Phase 1 only needs insights/page.tsx to render at /insights without errors. The current content (static placeholder or existing content) is fine. Do not add MDX pipeline in Phase 1 — that is Phase 2 scope.

4. **Chatbot named vs default export**
   - What we know: components/Chatbot.tsx uses `export const Chatbot: React.FC` (named export per CONVENTIONS.md).
   - What's unclear: layout.tsx will need to import it as `import { Chatbot } from '@/components/Chatbot'` — confirm the import matches.
   - Recommendation: Keep named export. Use `import { Chatbot } from '@/components/Chatbot'` in layout.tsx.

---

## Sources

### Primary (HIGH confidence)

- [Next.js App Router - Route Handlers (v16.1.6, 2026-02-27)](https://nextjs.org/docs/app/api-reference/file-conventions/route) — POST(request: Request) signature, Response.json() pattern
- [Next.js App Router - Migrating from Vite (v16.1.6, 2026-02-27)](https://nextjs.org/docs/app/guides/migrating/from-vite) — step-by-step migration, tsconfig changes
- [Next.js App Router - not-found.tsx convention (v16.1.6)](https://nextjs.org/docs/app/api-reference/file-conventions/not-found) — custom 404 page
- [Next.js App Router - Link component (v16.1.6)](https://nextjs.org/docs/app/api-reference/components/link) — next/link usage
- [Next.js App Router - Font optimization (v16.1.6)](https://nextjs.org/docs/app/api-reference/components/font) — next/font/google, CSS variable pattern
- [Next.js App Router - usePathname (v16.1.6)](https://nextjs.org/docs/app/api-reference/functions/use-pathname) — pathname detection in Client Components
- [Tailwind CSS v4 Next.js guide (v4.2, current)](https://tailwindcss.com/docs/guides/nextjs) — @tailwindcss/postcss setup, @import "tailwindcss" syntax
- [Tailwind CSS v4 Upgrade Guide (v4.2, current)](https://tailwindcss.com/docs/upgrade-guide) — @theme block, no tailwind.config.js needed
- Direct codebase inspection (2026-03-07):
  - `vercel.json` — confirmed "framework": "vite", SPA catch-all rewrite
  - `index.html` — canonical CDN color values (#080808, #666666, #111111)
  - `tailwind.config.js` — divergent color values (#0e0e0e, #888888, #1a1a1a)
  - `app/globals.css` — confirmed Google Fonts CDN @import on line 1
  - `app/page.tsx` — confirmed `import { motion } from "framer-motion"` (line 3)
  - `components/Nav.tsx` — confirmed hash-based routing with window.location.hash
  - `components/Footer.tsx` — confirmed all hrefs use #/path format
  - `api/chat.js` — confirmed handler(req, res) signature, gemini-3-flash-preview model
  - `api/send-email.js` — confirmed handler(req, res) signature
  - `app/layout.tsx` — confirmed Nav and Footer present, Chatbot absent, Google Fonts not removed
  - `package.json` — confirmed scripts still reference vite; devDependencies include vite

### Secondary (MEDIUM confidence)

- [Framer Motion + Next.js App Router pattern](https://www.hemantasundaray.com/blog/use-framer-motion-with-nextjs-server-components) — "use client" re-export wrapper pattern; corroborated by multiple community sources

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Next.js v16.1.6 docs verified 2026-02-27; Tailwind v4 docs current
- Architecture patterns: HIGH — all patterns verified against official docs and direct codebase inspection
- Pitfalls: HIGH — six pitfalls derived directly from codebase file inspection; color divergence confirmed by diff between index.html and tailwind.config.js; API signature mismatch confirmed by reading api/chat.js

**Research date:** 2026-03-07
**Valid until:** 2026-04-07 (stable libraries; Next.js 16 is current stable)
