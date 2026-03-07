# Requirements: AXIONLAB SEO & Discoverability

**Defined:** 2026-03-08
**Core Value:** AXIONLAB must rank on the first page of Google for its brand name and target service keywords.

## v1.0 Requirements (Complete)

All v1.0 requirements shipped. See MILESTONES.md for details.

- ✓ MIG-01 through MIG-05: Next.js migration foundation
- ✓ RTG-01 through RTG-05: Page routing
- ✓ RND-01 through RND-04: Page rendering
- ✓ SEO-01 through SEO-04: Basic SEO metadata
- ✓ API-01 through API-03: API routes
- ✓ BLG-01 through BLG-10: Blog infrastructure
- ✓ BLE-01 through BLE-03: Blog enhancements

## v2.0 Requirements

Requirements for SEO & Discoverability milestone. Each maps to roadmap phases.

### Technical SEO

- [ ] **TSEO-01**: Every page has JSON-LD structured data (Organization on homepage, Article on blog posts, WebSite with SearchAction)
- [ ] **TSEO-02**: Every page has exactly one H1 tag that contains the primary keyword for that page
- [ ] **TSEO-03**: Every page has a canonical URL meta tag pointing to its canonical https://axionlab.in/... URL
- [ ] **TSEO-04**: Every page has an OG image meta tag with a branded social sharing image
- [ ] **TSEO-05**: Homepage meta description contains primary brand keywords ("systems engineering", "commerce infrastructure", "AI agent systems")
- [ ] **TSEO-06**: All internal links use descriptive anchor text (not "click here" or "read more")
- [ ] **TSEO-07**: All images have descriptive alt text containing relevant keywords

### Content SEO

- [ ] **CSEO-01**: At least 10 blog posts published, each targeting a specific long-tail keyword
- [ ] **CSEO-02**: Each blog post is 1000+ words with proper heading hierarchy (H2, H3)
- [ ] **CSEO-03**: Each blog post has a unique meta description under 160 characters containing the target keyword
- [ ] **CSEO-04**: Each blog post internally links to at least one service page (/capabilities, /work, /philosophy)
- [ ] **CSEO-05**: Each service page links to at least 2 related blog posts
- [ ] **CSEO-06**: Blog posts target these keyword clusters: commerce infrastructure, AI agent development, high-performance APIs, systems architecture consulting, Next.js development, software engineering India

### Indexing & Crawling

- [ ] **INDX-01**: Google Search Console verification instructions documented for site owner
- [ ] **INDX-02**: Sitemap.xml includes all pages with accurate lastModified dates
- [ ] **INDX-03**: Robots.txt correctly allows all crawlers and references sitemap
- [ ] **INDX-04**: No orphan pages (every page reachable within 3 clicks from homepage)

### Performance SEO

- [ ] **PERF-01**: Largest Contentful Paint (LCP) under 2.5 seconds on mobile
- [ ] **PERF-02**: Cumulative Layout Shift (CLS) under 0.1
- [ ] **PERF-03**: No render-blocking resources that delay First Contentful Paint
- [ ] **PERF-04**: All images use next/image with proper sizing and lazy loading

## v2.1 Requirements (Future)

### Authority Building

- **AUTH-01**: Company profiles on GitHub, LinkedIn, Twitter/X with links back to axionlab.in
- **AUTH-02**: Cross-posting summaries on Medium/Dev.to with canonical URLs
- **AUTH-03**: Directory listings on Clutch.co, GoodFirms, TopDevelopers

### Advanced SEO

- **ASEO-01**: RSS feed at /feed.xml for content syndication
- **ASEO-02**: Table of contents component for long blog posts
- **ASEO-03**: Related posts component at bottom of each blog post
- **ASEO-04**: Google Analytics 4 integration for traffic monitoring

## Out of Scope

| Feature | Reason |
|---------|--------|
| Paid advertising | Organic-only strategy for v2.0 |
| Link building outreach | Focus on-site SEO first, authority building in v2.1 |
| Multilingual content | English only, single market |
| AMP pages | Deprecated by Google, not needed |
| Schema.org FAQ/HowTo | Overkill for current content type |
| Video SEO | No video content planned |
| CMS integration | File-based MDX is sufficient |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| TSEO-01 | Phase 5 | Pending |
| TSEO-02 | Phase 5 | Pending |
| TSEO-03 | Phase 5 | Pending |
| TSEO-04 | Phase 5 | Pending |
| TSEO-05 | Phase 5 | Pending |
| TSEO-06 | Phase 6 | Pending |
| TSEO-07 | Phase 6 | Pending |
| CSEO-01 | Phase 6 | Pending |
| CSEO-02 | Phase 6 | Pending |
| CSEO-03 | Phase 6 | Pending |
| CSEO-04 | Phase 6 | Pending |
| CSEO-05 | Phase 6 | Pending |
| CSEO-06 | Phase 6 | Pending |
| INDX-01 | Phase 5 | Pending |
| INDX-02 | Phase 5 | Pending |
| INDX-03 | Phase 5 | Pending |
| INDX-04 | Phase 6 | Pending |
| PERF-01 | Phase 7 | Pending |
| PERF-02 | Phase 7 | Pending |
| PERF-03 | Phase 7 | Pending |
| PERF-04 | Phase 7 | Pending |

**Coverage:**
- v2.0 requirements: 21 total
- Mapped to phases: 21
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-08*
*Last updated: 2026-03-08 after initial definition*
