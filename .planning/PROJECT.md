# AXIONLAB Website

## What This Is

AXIONLAB is an independent systems engineering lab website built on Next.js 16 App Router with an MDX-based blog system. The site showcases services, portfolio, philosophy, and provides AI-powered chat and contact forms. It serves as the primary digital presence for attracting engineering clients and establishing thought leadership.

## Core Value

AXIONLAB must rank on the first page of Google for its brand name and target service keywords so potential clients can discover and engage with the lab.

## Current Milestone: v2.0 SEO & Discoverability

**Goal:** Take axionlab.in from zero Google indexing to first-page ranking for brand and niche service keywords.

**Target features:**
- JSON-LD structured data (Organization, WebSite, Article schemas)
- Technical SEO fixes (H1 hierarchy, canonical URLs, OG images)
- SEO-optimised content targeting long-tail keywords
- Internal linking strategy across service and blog pages
- Authority signals (meta authorship, social profiles linking)

## Requirements

### Validated

- ✓ Next.js 16 App Router with SSG — v1.0 Phase 1
- ✓ Per-page SEO metadata (title, description, OG, Twitter) — v1.0 Phase 3
- ✓ Auto-generated sitemap.xml and robots.txt — v1.0 Phase 3
- ✓ MDX blog system with 3 posts, tag filtering, reading time — v1.0 Phase 2
- ✓ Copy-to-clipboard, callout components, post navigation — v1.0 Phase 4
- ✓ Dark theme design system (#080808 bg, #ff1f3d accent) — v1.0 inherited
- ✓ AI chatbot + contact form with email notifications — v1.0 inherited
- ✓ Hash URL backward compatibility — v1.0 Phase 1
- ✓ Custom 404 page — v1.0 Phase 1

### Active

- [ ] JSON-LD structured data on all pages
- [ ] Single H1 per page (currently 3 on homepage)
- [ ] Canonical URLs on all pages
- [ ] OG image for social sharing
- [ ] SEO-optimised blog content (10+ posts targeting niche keywords)
- [ ] Internal linking between blog posts and service pages
- [ ] Google Search Console verification setup instructions
- [ ] Core Web Vitals optimisation

### Out of Scope

- Paid advertising (Google Ads, social ads) — organic only for now
- Link building outreach — focus on on-site SEO first
- CMS integration — file-based MDX is sufficient
- Analytics integration (GA4) — separate concern, not SEO-blocking
- Multilingual support — English only
- AMP pages — not needed for modern SEO

## Context

- **SEO audit (2026-03-08):** Google has indexed ZERO pages. `site:axionlab.in` returns empty.
- **Competitors:** axionlab.ai, axionlab.org, axionlabs.com occupy search results for "axionlab"
- **Technical SEO baseline:** sitemap.xml working (10 URLs), robots.txt correct, meta tags present on all pages
- **Missing:** JSON-LD structured data, canonical tags, OG images, proper H1 hierarchy
- **Content gap:** Only 3 blog posts, all generic technical topics competing with AWS/Netflix engineering blogs
- **Keyword opportunity:** Niche India-specific long-tail keywords have low competition (e.g., "systems engineering consulting India", "commerce infrastructure development")
- **Domain authority:** Brand new domain, zero backlinks, no Google Search Console setup

## Constraints

- **Hosting:** Vercel free plan — SSG only, no ISR
- **Budget:** Zero — no paid tools, no paid ads
- **Design:** Must preserve existing AXIONLAB dark theme exactly
- **Content format:** MDX files in content/blog/ — no CMS
- **Timeline:** Indexing takes 2-8 weeks after GSC submission; rankings take 3-6 months for competitive terms

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js over React Router | SSR/SSG, metadata API, Vercel native | ✓ Good |
| MDX over CMS for blog | Simpler, free, version-controlled | ✓ Good |
| SSG over ISR | Vercel free plan, rebuild-on-deploy sufficient | ✓ Good |
| Tailwind v4 PostCSS over CDN | Eliminates dual config, proper build-time | ✓ Good |
| next/font over Google Fonts CDN | Self-hosted, zero CLS | ✓ Good |
| Target niche long-tail keywords over head terms | Zero DA site can't compete with AWS/Netflix on "distributed systems" — India-specific service keywords have low competition | — Pending |
| JSON-LD over microdata | Industry standard, easier to maintain, Google recommended | — Pending |

---
*Last updated: 2026-03-08 after v2.0 milestone start*
