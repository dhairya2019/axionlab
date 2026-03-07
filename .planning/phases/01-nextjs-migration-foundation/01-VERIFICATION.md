---
phase: 01-nextjs-migration-foundation
verified: 2026-03-08T00:00:00Z
status: human_needed
score: 16/17 must-haves verified
re_verification: false
human_verification:
  - test: "Open browser to http://localhost:3000 and DevTools Network tab; reload page — filter by 'font'"
    expected: "Zero requests to fonts.googleapis.com. All font requests should be to /_next/ static asset paths."
    why_human: "next/font loads Inter/Inter_Tight from Next.js asset pipeline; cannot confirm zero CDN requests programmatically without a live browser session"
  - test: "Navigate to http://localhost:3000/#/work in browser address bar"
    expected: "Browser immediately redirects to http://localhost:3000/work — the hash URL disappears from the address bar"
    why_human: "The hash redirect uses a synchronous inline script with window.location.replace; behavior can only be confirmed in an actual browser since it fires before React hydration"
  - test: "Open DevTools on any page; inspect body element computed styles"
    expected: "background-color: rgb(8, 8, 8) — which is #080808. NOT rgb(14, 14, 14) / #0e0e0e"
    why_human: "Tailwind v4 @theme maps --color-background: #080808 to the bg-background class; actual CSS resolution requires a running browser to confirm the PostCSS pipeline is producing the correct computed value"
  - test: "Open chatbot widget; type a message; submit"
    expected: "Gemini AI responds with a message in the terminal-style chat interface"
    why_human: "API call to /api/chat requires a valid GEMINI_API_KEY environment variable and live network access; cannot be verified programmatically without those credentials"
  - test: "Navigate to http://localhost:3000/initiate; fill in email and message fields; submit the form"
    expected: "Form submits without error; success confirmation appears"
    why_human: "API call to /api/send-email requires a valid SENDGRID_API_KEY; integration test needs live credentials"
---

# Phase 1: Next.js Migration Foundation Verification Report

**Phase Goal:** The existing AXIONLAB site runs on Next.js App Router with all pages accessible at clean URLs, API routes working, Framer Motion animations intact, and no visual regression from the current dark theme
**Verified:** 2026-03-08
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `next build` completes without errors; all 7 pages + 2 API routes accessible at clean URLs | VERIFIED | Build output confirms: /, /philosophy, /capabilities, /work, /insights, /careers, /initiate (static), /api/chat, /api/send-email (dynamic), /_not-found |
| 2 | Site background renders as #080808 (not #0e0e0e) | VERIFIED (code) / ? (runtime) | `globals.css` @theme has `--color-background: #080808`; `layout.tsx` body uses `bg-background`; runtime CSS resolution needs human browser check |
| 3 | AI chatbot sends messages / Gemini responds; Initiate contact form submits without error | VERIFIED (code) / ? (integration) | `app/api/chat/route.ts` and `app/api/send-email/route.ts` are substantive, wired Route Handlers with correct POST export, request.json(), Response.json() patterns, and full business logic preserved; live API test needs human |
| 4 | Framer Motion animations play on all pages; zero requests to fonts.googleapis.com | VERIFIED (code) / ? (browser) | MotionWrapper 'use client' re-export exists; app/page.tsx imports from MotionWrapper; no `fonts.googleapis.com` in layout.tsx or globals.css; next/font configured — needs browser Network tab confirmation |
| 5 | /#/work redirects to /work; custom 404 appears for invalid paths | VERIFIED (code) / ? (browser redirect) | Hash redirect inline script present in layout.tsx body before Nav; app/not-found.tsx has "Signal Lost." heading; redirect behavior needs browser confirmation |

**Score:** 5/5 truths pass code-level verification; 3 truths have browser-runtime components requiring human testing

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `vercel.json` | Minimal Vercel config for Next.js auto-detection | VERIFIED | Contains only `{ "version": 2 }` — no framework, buildCommand, outputDirectory, rewrites |
| `package.json` | Next.js scripts and dependencies | VERIFIED | Scripts: next dev/build/start/lint; next@^16.1.6 in dependencies; vite, @vitejs/plugin-react, autoprefixer absent |
| `tsconfig.json` | Next.js-compatible TypeScript config with path aliases | VERIFIED (partial) | Has `@/*` path alias, `moduleResolution: "bundler"`, `plugins: [{ name: "next" }]`, `include` has next-env.d.ts — **DEVIATION: `jsx` is `"react-jsx"` not `"preserve"` as plan specified; build succeeds regardless** |
| `postcss.config.mjs` | Tailwind v4 PostCSS plugin config | VERIFIED | `@tailwindcss/postcss: {}` plugin; old `postcss.config.js` absent |
| `next.config.mjs` | Clean Next.js config without Vite artifacts | VERIFIED | `transpilePackages: ['framer-motion']` (added in Plan 05 for framer-motion v12 compatibility); no `output: 'export'`, no `images.unoptimized` |
| `app/globals.css` | Tailwind v4 @import + @theme block with canonical CDN colors | VERIFIED | `@import "tailwindcss"` on line 1; @theme has `--color-background: #080808`, `--color-accent: #ff1f3d`, `--color-muted: #666666`, `--color-surface: #111111`; font vars wired; no Google Fonts CDN import |
| `app/layout.tsx` | Root layout with next/font, Nav, Footer, Chatbot, hash redirect script | VERIFIED | Inter + Inter_Tight from `next/font/google`; Nav, Footer, Chatbot mounted; hash redirect inline script present; no Google Fonts CDN link |
| `app/api/chat/route.ts` | Chat Route Handler — Gemini AI inference | VERIFIED | `export async function POST(request: Request)`; `await request.json()`; `Response.json()`; GoogleGenAI and sgMail wired; `GEMINI_MODEL ?? 'gemini-2.0-flash'` configurable |
| `app/api/send-email/route.ts` | Email Route Handler — SendGrid email dispatch | VERIFIED | `export async function POST(request: Request)`; dual-recipient SendGrid dispatch; `Promise.all`; `Response.json()` with correct status codes |
| `components/motion/MotionWrapper.tsx` | 'use client' re-export of motion and AnimatePresence | VERIFIED | `'use client'` on line 1; `export { motion, AnimatePresence } from 'framer-motion'` |
| `components/Nav.tsx` | Navigation with usePathname, next/link, 'use client' | VERIFIED | `'use client'`; `usePathname` from `next/navigation`; `Link` from `next/link`; LINKS array uses clean paths (no `#/` prefixes); scroll listener preserved; mobile menu closes on pathname change |
| `components/Footer.tsx` | Footer with next/link clean URLs | VERIFIED | `import Link from "next/link"`; all internal links use `<Link href="/...">` with clean paths; no 'use client' (Server Component) |
| `components/Chatbot.tsx` | Chat widget with 'use client' directive | VERIFIED | `'use client'` on line 1; named export `export const Chatbot: React.FC` — matches layout.tsx `import { Chatbot }` |
| `app/not-found.tsx` | Custom 404 page in dark theme | VERIFIED | "Signal Lost." heading; `bg-background`, `text-accent`, `text-muted` design tokens; `Link` to `"/"` for return |
| `app/page.tsx` | Home page — 'use client' + MotionWrapper | VERIFIED | `'use client'` on line 1; `import { motion } from "@/components/motion/MotionWrapper"` |
| `app/initiate/page.tsx` | Initiate page — 'use client' for form state | VERIFIED | `"use client"` on line 1 |
| `app/philosophy/page.tsx` (and capabilities, work, insights, careers) | Static pages — Server Components without 'use client' | VERIFIED | First line is `import React from "react"` — no 'use client' directive on any of the 5 static pages |
| `.next/` | Successful Next.js build output directory | VERIFIED | `.next/` directory exists with build output; `next build` runs in ~1s (cached) with zero errors |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `package.json` | `next.config.mjs` | next CLI reads next.config.mjs | WIRED | `next build` script in package.json; next.config.mjs present and clean |
| `postcss.config.mjs` | `package.json` | @tailwindcss/postcss installed as devDependency | WIRED | `@tailwindcss/postcss@^4.2.1` in devDependencies |
| `app/layout.tsx` | `app/globals.css` | `import './globals.css'` | WIRED | Line 2 of layout.tsx |
| `app/layout.tsx` | `components/Nav.tsx` | `import Nav from '@/components/Nav'` | WIRED | Line 4 of layout.tsx; Nav rendered in body |
| `app/layout.tsx` | `components/Chatbot.tsx` | `import { Chatbot } from '@/components/Chatbot'` | WIRED | Line 6 of layout.tsx; Chatbot rendered after Footer |
| `app/globals.css` | CSS variable chain | `--font-sans: var(--font-inter)` references `--font-inter` set by next/font on `<html>` | WIRED | @theme in globals.css references `var(--font-inter)` and `var(--font-inter-tight)`; layout.tsx sets those variables via `className={...inter.variable...}` on `<html>` |
| `app/page.tsx` | `components/motion/MotionWrapper.tsx` | `import { motion } from '@/components/motion/MotionWrapper'` | WIRED | Line 3 of app/page.tsx |
| `components/Nav.tsx` | `next/navigation` | `usePathname()` for active route detection | WIRED | Line 4 of Nav.tsx; used on line 15 |
| `components/Nav.tsx` | `next/link` | `import Link from 'next/link'` | WIRED | Line 3 of Nav.tsx; all internal nav links use `<Link>` |
| `components/Footer.tsx` | `next/link` | `import Link from 'next/link'` | WIRED | Line 2 of Footer.tsx; all internal footer links use `<Link>` |
| `app/api/chat/route.ts` | `@google/genai` | GoogleGenAI SDK for Gemini inference | WIRED | `import { GoogleGenAI, Type } from "@google/genai"` on line 2; `ai.models.generateContent()` called with full config |
| `app/api/chat/route.ts` | `@sendgrid/mail` | sgMail.send for email dispatch within chat | WIRED | `import sgMail from '@sendgrid/mail'`; `sgMail.send(mailPayload)` invoked on function call trigger |
| `app/api/send-email/route.ts` | `@sendgrid/mail` | sgMail.send for contact form | WIRED | `import sgMail from '@sendgrid/mail'`; `Promise.all([sgMail.send(agencyMsg), sgMail.send(userMsg)])` |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| MIG-01 | 01-01 | Site builds and runs on Next.js App Router | SATISFIED | next build succeeds; 7 pages + 2 API routes; `next dev` script in package.json |
| MIG-02 | 01-02 | Tailwind CSS processes via PostCSS with unified color config (#080808 background) | SATISFIED | postcss.config.mjs with @tailwindcss/postcss; globals.css @theme has #080808 |
| MIG-03 | 01-02 | Fonts load via next/font (Inter + Inter Tight) with zero layout shift | SATISFIED (code) | Inter and Inter_Tight from next/font/google with `display: 'swap'`; no Google Fonts CDN in layout.tsx or globals.css |
| MIG-04 | 01-01 | vercel.json updated for Next.js framework (not Vite) | SATISFIED | vercel.json contains only `{ "version": 2 }` — no framework, buildCommand, outputDirectory, rewrites |
| MIG-05 | 01-05 | Legacy files cleaned up (index.html, index.tsx, vite configs, unused components) | SATISFIED | All 13 legacy files confirmed absent: index.html, index.tsx, App.tsx, vite.config.ts, vite.config.js, tailwind.config.js, Navbar.tsx, Hero.tsx, Services.tsx, Technologies.tsx, Portfolio.tsx, Clients.tsx, Process.tsx |
| RTG-01 | 01-04 | All 7 pages accessible at clean URLs | SATISFIED | next build output confirms: /, /philosophy, /capabilities, /work, /insights, /careers, /initiate |
| RTG-02 | 01-04 | Navigation uses next/link with usePathname for active state | SATISFIED | Nav.tsx uses usePathname() from next/navigation; Link from next/link; LINKS array has clean paths |
| RTG-03 | 01-04 | Footer uses next/link for internal navigation | SATISFIED | Footer.tsx imports and uses Link from next/link for all internal routes |
| RTG-04 | 01-02 | Old hash URLs (/#/work) redirect to clean URLs (/work) via client-side script | SATISFIED (code) | Inline script in layout.tsx body fires synchronously on window.location.hash starting with '#/'; runtime behavior needs browser confirmation |
| RTG-05 | 01-04 | Custom 404 page in AXIONLAB design language | SATISFIED | app/not-found.tsx exists with "Signal Lost." heading, bg-background, text-accent, text-muted classes |
| RND-01 | 01-04 | Static pages (Philosophy, Capabilities, Work, Careers) render as Server Components | SATISFIED | None of philosophy, capabilities, work, careers, insights page files have 'use client' directive |
| RND-02 | 01-04 | Interactive pages (Home, Initiate) use "use client" with Framer Motion wrappers | SATISFIED | app/page.tsx has 'use client' on line 1 + MotionWrapper import; app/initiate/page.tsx has "use client" on line 1 |
| RND-03 | 01-04 | Chatbot component works as client component with existing /api/chat endpoint | SATISFIED (code) | Chatbot.tsx has 'use client'; fetches /api/chat; route.ts handles POST — live test needs API key |
| RND-04 | 01-02 | Root layout (app/layout.tsx) wraps all pages with Nav, Chatbot, Footer | SATISFIED | layout.tsx renders `<Nav />`, `<Footer />`, `<Chatbot />` within root body; confirmed by next build (all pages pass through layout) |
| API-01 | 01-03 | /api/chat migrated to Next.js Route Handler | SATISFIED | app/api/chat/route.ts exports `POST(request: Request)` with Web API Request/Response |
| API-02 | 01-03 | /api/send-email migrated to Next.js Route Handler | SATISFIED | app/api/send-email/route.ts exports `POST(request: Request)` with Web API Request/Response |
| API-03 | 01-03 | Client-side fetch URLs unchanged — chatbot and contact form work without frontend changes | SATISFIED | Routes are at /api/chat and /api/send-email — matching Vite-era URLs; no frontend fetch URL changes needed |

**Orphaned requirements:** None. All 17 Phase 1 requirements accounted for across the 5 plans.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `app/initiate/page.tsx` | 109, 120, 134, 160, 174, 187 | `placeholder="..."` HTML input attributes | Info | These are legitimate HTML form placeholders (COMPANY_NAME, HTTPS://, etc.) — NOT code placeholders. Zero impact. |
| `components/Contact.tsx` | 84, 95 | `placeholder="..."` HTML input attributes | Info | Legitimate form input placeholders. Zero impact. |
| `components/Chatbot.tsx` | 156 | `placeholder="COMMAND..."` | Info | Legitimate input placeholder in terminal-style chat. Zero impact. |
| `tsconfig.json` | 19 | `"jsx": "react-jsx"` vs plan-specified `"preserve"` | Info | Plan 01-01 stated `jsx: "preserve"` but actual value is `"react-jsx"`. Both are valid for Next.js App Router. Build succeeds. No functional impact. |

No blockers or warnings found.

### Human Verification Required

#### 1. Zero Google Fonts CDN Requests

**Test:** Run `npm run dev`, open browser to http://localhost:3000, open DevTools Network tab, filter by "font", do a hard reload (Cmd+Shift+R)
**Expected:** No requests to `fonts.googleapis.com`. All font requests should be to `/_next/static/media/` paths (e.g., `/_next/static/media/inter-latin.woff2`)
**Why human:** The next/font wiring is correct in code, but actual CDN traffic suppression can only be confirmed by inspecting live browser network activity

#### 2. Hash URL Redirect in Browser

**Test:** Navigate to `http://localhost:3000/#/work` in the browser address bar (must type it directly, not click a link)
**Expected:** Browser redirects to `http://localhost:3000/work` before the page finishes loading — the hash URL disappears from the address bar and the Work page content appears
**Why human:** The inline script uses `window.location.replace()` synchronously before React hydration — this pre-hydration behavior cannot be verified without a live browser session

#### 3. Background Color Confirmation

**Test:** Visit any page, open DevTools, inspect the `<body>` element, check Computed > background-color
**Expected:** `rgb(8, 8, 8)` which equals `#080808`. Must NOT be `rgb(14, 14, 14)` / `#0e0e0e`
**Why human:** Tailwind v4 PostCSS pipeline converts `@theme --color-background: #080808` to the `bg-background` class at build time — the actual CSS output needs a running dev server to confirm

#### 4. Chatbot API Integration

**Test:** Start the dev server with valid `API_KEY` (Gemini) and `SENDGRID_API_KEY` environment variables set; open the chatbot widget; type a message; submit
**Expected:** The AI responds with a contextual reply. If you provide name/company/email/project scope, it should trigger the email dispatch tool and confirm "The synchronization brief has been dispatched"
**Why human:** Requires live Gemini API key and network access; cannot be verified programmatically

#### 5. Contact Form Submission

**Test:** Navigate to http://localhost:3000/initiate with valid `SENDGRID_API_KEY` set; fill in email and message fields; submit the form
**Expected:** Success confirmation appears; both the agency (support@axionlab.in) and the submitting user receive emails
**Why human:** Requires live SendGrid API key and network access

### Notable Deviation

**tsconfig.json jsx value:** Plan 01-01 specified `jsx: "preserve"` as a must-have truth, but the actual file has `"jsx": "react-jsx"`. This is a minor deviation — both values are supported by Next.js, and `next build` succeeds without issue. The SUMMARY.md did not document this deviation. Functionally equivalent for the migration goal.

---

_Verified: 2026-03-08_
_Verifier: Claude (gsd-verifier)_
