# AXIONLAB Website Migration

## What This Is

AXIONLAB is an independent systems engineering lab website currently running as a React 19 + Vite SPA with hash-based client-side routing. The site showcases services, portfolio, philosophy, and provides AI-powered chat and contact forms. This project migrates it to Next.js App Router for SEO-friendly multi-page routing and adds an MDX-based blogging system.

## Core Value

Every page must be server-rendered with proper meta tags and crawlable URLs so search engines can discover and index AXIONLAB's content.

## Requirements

### Validated

- ✓ 7-page website (Home, Philosophy, Capabilities, Work, Insights, Careers, Initiate) — existing
- ✓ Dark theme design system (#080808 bg, #ff1f3d accent, Inter/Inter Tight fonts, no border-radius) — existing
- ✓ AI chatbot widget powered by Google Gemini with email dispatch via SendGrid — existing
- ✓ Contact/initiate form with email notifications — existing
- ✓ Responsive design with mobile navigation — existing
- ✓ Framer Motion page animations — existing
- ✓ Vercel deployment with serverless API routes — existing

### Active

- [ ] Migrate from Vite + hash routing to Next.js App Router with file-system routing
- [ ] Server-side rendering / static generation for all pages
- [ ] Per-page SEO metadata (title, description, OpenGraph, Twitter cards)
- [ ] Auto-generated sitemap.xml and robots.txt
- [ ] MDX-based blog system under /insights with frontmatter support
- [ ] Blog listing page with cards in AXIONLAB design language
- [ ] Individual blog post pages with SSG (generateStaticParams)
- [ ] Tag-based filtering on blog listing
- [ ] Reading time estimate per post
- [ ] Blog posts auto-included in sitemap
- [ ] Custom 404 page matching design system
- [ ] Backward compatibility for old /#/ hash URLs (redirect to clean URLs)

### Out of Scope

- Visual redesign — keep existing design system intact
- CMS integration — use file-based MDX for now, CMS can come later
- Comments on blog posts — not needed for initial launch
- RSS feed — can add in future milestone
- Search functionality — not needed with small initial content
- User authentication — site is public-facing only
- Analytics integration — separate concern
- ISR (Incremental Static Regeneration) — rebuild on deploy is fine for Vercel free plan

## Context

- **Current state:** React 19 SPA, Vite 7.3.1 build, custom hash-based routing in `index.tsx`, Tailwind via CDN script in `index.html`
- **Directory structure already matches Next.js conventions:** `app/page.tsx`, `app/philosophy/page.tsx`, `app/work/page.tsx`, etc.
- **Previous migration attempt reverted:** Commit `6e78273` tried React Router, was reverted in `b4f41ef` — likely due to Tailwind CDN vs PostCSS conflict
- **Dual Tailwind config:** CDN in `index.html` uses `#080808` background, `tailwind.config.js` uses `#0e0e0e` — CDN values are what users currently see
- **Legacy files to clean up:** `App.tsx`, `vite.config.js`, `metadata.json`, unused components (Hero.tsx, Navbar.tsx, Portfolio.tsx, Contact.tsx, Clients.tsx, CTA.tsx)
- **API routes:** `api/chat.js` (Gemini + SendGrid) and `api/send-email.js` (SendGrid) — need migration to Next.js Route Handlers
- **Blog content:** Mixed — technical articles + company updates + industry commentary
- **No seed content needed** — build infrastructure first, add posts later
- **Codebase map available:** `.planning/codebase/` has full analysis

## Constraints

- **Hosting:** Vercel free plan — 100GB bandwidth, 10s serverless timeout, no ISR (use SSG instead)
- **Tech stack:** Next.js App Router (decision made) — leverages existing `app/` directory structure
- **Design:** Must preserve existing dark theme, typography, animations, and layout exactly
- **Blog format:** MDX files in `content/blog/` — file-based, no database or CMS
- **Deployment:** Zero-downtime migration — Vercel auto-detects Next.js

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js over React Router | SSR/SSG built-in, metadata API, existing app/ structure matches, native Vercel support | — Pending |
| MDX over CMS for blog | Simpler, no external dependencies, version-controlled content, free | — Pending |
| SSG over ISR for blog | Vercel free plan limitations, rebuild-on-deploy sufficient for low publish frequency | — Pending |
| Tailwind via PostCSS over CDN | Required for Next.js, eliminates dual config, proper build-time processing | — Pending |
| next/font over Google Fonts CDN | Self-hosted, zero layout shift, better performance | — Pending |

---
*Last updated: 2026-03-07 after initialization*
