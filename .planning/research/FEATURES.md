# Feature Research

**Domain:** MDX-based blog system for a systems engineering services company website (Next.js App Router)
**Researched:** 2026-03-07
**Confidence:** HIGH — core MDX/Next.js features verified against official docs; differentiator assessments MEDIUM (industry pattern analysis)

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist on any professional engineering blog. Missing any of these makes the site feel unfinished or amateur.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Syntax-highlighted code blocks | Technical readers judge credibility by code quality; unhighlighted code is hard to read | MEDIUM | Use `rehype-pretty-code` + Shiki — server-side at build time, no runtime cost. Verified against official Next.js MDX docs and community 2025 usage. |
| Readable prose typography | Markdown dumps unstyled HTML; walls of text drive bounce | LOW | `@tailwindcss/typography` with `prose` class is the standard pattern — official Next.js docs recommend it explicitly. Override with AXIONLAB's Inter/Inter Tight fonts and `#ff1f3d` accent. |
| Frontmatter metadata per post | Listing pages, SEO, and date display all depend on structured metadata | LOW | `@next/mdx` does NOT support frontmatter natively — use `gray-matter` or `remark-frontmatter`. This is a known sharp edge. |
| Post listing page with cards | Index page is how readers discover content; without it posts are orphaned | LOW | `/insights` page renders cards from filesystem scan using `fs` + `gray-matter`. SSG via `generateStaticParams`. |
| Per-post page with SSG | Slow page loads = readers leave. Static generation is the right default for this content type. | LOW | `generateStaticParams` + `dynamicParams = false` — this is the standard Next.js App Router pattern. |
| Per-page SEO metadata | Title, description, OG tags are expected by search engines and social sharing platforms | LOW | Next.js metadata API (`export const metadata`) handles this declaratively. Must set `metadataBase` in root layout or OG images become relative URLs social platforms cannot fetch. |
| Sitemap including blog posts | Without sitemap.xml, search engines may miss or deprioritize new posts | LOW | `sitemap.ts` file — auto-served at `/sitemap.xml`. Blog posts must be included dynamically by reading frontmatter dates. |
| robots.txt | Required for crawlers; missing it can cause indexing issues | LOW | `robots.ts` file in app root — one-liner. |
| Mobile-readable layout | Mobile accounts for ~60% of article reads; must not break on phone | LOW | Tailwind responsive classes — straightforward given existing responsive design system. |
| Readable publish date | Readers orient to content by recency; undated posts feel untrustworthy | LOW | ISO date in frontmatter, formatted for display. |

### Differentiators (Competitive Advantage)

Features that distinguish AXIONLAB's Insights section from a generic blog. These are not universally expected but signal craft and authority for a services company audience.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Reading time estimate | Sets expectations; signals respect for reader's time — used by every major engineering blog (Stripe, Linear, etc.) | LOW | `reading-time` npm package. Takes word count from compiled MDX content. Add to frontmatter processing pipeline. |
| Tag-based filtering on listing page | Lets readers self-select content relevant to them (e.g., "systems", "AI", "process") | MEDIUM | Client-side filter on pre-rendered tag list, or static pages per tag. Client-side is simpler and sufficient at small content volume. |
| Dynamic OG image generation per post | Social shares look branded and specific rather than using the site's generic OG image — massive difference for LinkedIn/X sharing | MEDIUM | Next.js `/app/blog/[slug]/opengraph-image.tsx` using `ImageResponse` from `next/og`. Include post title, AXIONLAB branding. Must set `metadataBase`. |
| Table of contents for long posts | Long technical articles (2000+ words) become navigable; signals the post has depth | MEDIUM | `remark-toc` plugin generates TOC from headings, or parse headings client-side with `rehype-slug` + `rehype-autolink-headings`. Floating sticky sidebar on desktop. |
| Code block copy-to-clipboard button | Reduces friction for developers trying the code — used on every major developer-facing blog | LOW | Custom component registered in `mdx-components.tsx` to override the `pre` element. Client component with `navigator.clipboard.writeText`. |
| Custom MDX components (callouts, warnings, tips) | Enables richer content than plain markdown; signals custom craft vs template blog | LOW | Callout box (Info, Warning, Tip variants) registered globally in `mdx-components.tsx`. AXIONLAB's accent color applied to border/icon. No runtime cost — pure RSC. |
| Post-to-post navigation (prev/next) | Keeps readers in the ecosystem; reduces bounce after finishing a post | LOW | Derive from sorted post list; render previous/next links in post layout. |
| `next/image` for post images | Automatic optimization, lazy loading, correct sizing — meaningful performance difference vs raw `<img>` | LOW | Register `img` override in `mdx-components.tsx` to use `next/image`. Official Next.js MDX docs show this exact pattern. |
| Canonical URL in metadata | Protects against duplicate content penalties if posts are ever syndicated | LOW | Single field in frontmatter + metadata export. Two lines of code but signals professionalism. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem like good ideas but add complexity, cost, or distraction without meaningful benefit for AXIONLAB's stage and goals.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Comments section | Looks like "community" and engagement | Requires moderation time AXIONLAB doesn't have. Spam magnets. Adds backend complexity (Disqus = third-party tracker, self-hosted = infra). Most services company readers never comment. | None — use a "contact us" CTA at post bottom. Serious readers email. |
| Search functionality | Looks useful on listing page | Low post volume (< 50 posts) makes search unnecessary — filtering + pagination covers it. Adding search means either client-side Fuse.js (works poorly on few results) or Algolia DocSearch (overkill, free tier has limits). | Tag filtering covers the real use case. Add search in a future milestone when post count justifies it. |
| RSS feed | Developer audience often uses RSS | Adds a build step (XML generation), needs to stay in sync with sitemap, and can break on MDX content serialization. Low ROI for an early-stage blog. | Out of scope for this milestone per PROJECT.md — add in future. |
| View counts / analytics on posts | Signals popular content | Requires persistent storage (database or external service). Vercel free plan has no KV or Postgres included. Adds latency to page loads if not cached. | Defer to when there's meaningful traffic. Use Vercel Analytics (passive) instead. |
| Like / reaction buttons | Engagement metric | Same storage problem as view counts. Adds interactivity that requires hydration, hurting Core Web Vitals. No business value for a services company — clients don't choose vendors by blog likes. | None. Remove entirely. |
| Newsletter signup embedded in posts | List building | Requires a third-party service (Mailchimp/ConvertKit), adds a form with validation, and complicates the CTA hierarchy (contact form already exists). | Keep the existing "Initiate" contact flow as the single conversion action. |
| Dark/light mode toggle for blog | User preference | AXIONLAB's design system is dark-only (#080808 background, defined in brand). A toggle would require a parallel light theme that doesn't exist and contradicts the visual identity. | Dark mode permanently — it's a brand decision, not a missing feature. |
| ISR (Incremental Static Regeneration) | "Fresh content without rebuilds" | Vercel free plan doesn't support ISR. Rebuilding on every deploy is correct for AXIONLAB's publish frequency (< 1 post/week). | SSG + full rebuild on deploy. Zero config, zero cost. |
| CMS integration (Contentful, Sanity, etc.) | Non-technical editors could publish | Overkill when the team is technical. Adds external dependency, API rate limits, vendor lock-in, and monthly cost. MDX in git is faster for developer content. | File-based MDX in `content/blog/` — explicitly in PROJECT.md as the decision. |
| Pagination | Looks "complete" | At < 20 posts at launch, pagination adds navigation friction without helping anything. Listing all posts in one page performs better and is simpler. | Defer pagination until post count exceeds ~30. |

---

## Feature Dependencies

```
Frontmatter (gray-matter)
    └──required by──> Post listing page (reads metadata to render cards)
    └──required by──> Sitemap generation (reads dates for lastmod)
    └──required by──> Per-page SEO metadata (reads title/description)
    └──required by──> Reading time display (reads word count or precomputed field)
    └──required by──> Tag filtering (reads tags array)

generateStaticParams
    └──required by──> Individual post pages (SSG)
    └──required by──> Dynamic OG image routes (must know all slugs at build)

rehype-pretty-code + Shiki
    └──required by──> Code block copy button (must have pre element to override)

rehype-slug
    └──required by──> rehype-autolink-headings (headings need IDs before links are attached)
    └──required by──> Table of contents (anchors must exist before linking to them)

mdx-components.tsx (global component registry)
    └──required by──> Custom callout components (registered here)
    └──required by──> next/image override for MDX images (registered here)
    └──required by──> Code block copy button (pre element override registered here)

metadataBase in root layout
    └──required by──> Dynamic OG images (relative URLs won't resolve without it)
    └──required by──> Twitter card metadata (same issue)
```

### Dependency Notes

- **Frontmatter requires a plugin:** `@next/mdx` does not parse frontmatter natively. `gray-matter` must be used in the filesystem scan layer (listing page), not inside MDX files. For per-post metadata use exported `const metadata` OR parse with `remark-frontmatter` + `remark-mdx-frontmatter` in the remark pipeline — pick one approach and be consistent.
- **rehype-slug before rehype-autolink-headings:** Order of rehype plugins matters in `next.config.mjs`. Slug must run first.
- **Turbopack + remark/rehype plugin limitation:** Turbopack currently requires plugins to be specified as strings (not function references) when they have no serializable options. This affects dev server performance vs plugin compatibility — test carefully if using `next dev --turbopack`.

---

## MVP Definition

### Launch With (v1 — this milestone)

Minimum to ship a credible Insights section that serves AXIONLAB's SEO and authority goals.

- [ ] Frontmatter parsing with `gray-matter` — title, description, date, tags, author, readingTime fields
- [ ] Post listing page (`/insights`) with cards showing title, date, tags, reading time
- [ ] Individual post pages (`/insights/[slug]`) with SSG via `generateStaticParams`
- [ ] Tailwind typography (`@tailwindcss/typography`) with prose override for AXIONLAB design system
- [ ] Syntax highlighting via `rehype-pretty-code` + Shiki — dark theme matching `#080808` background
- [ ] Code block copy-to-clipboard button (custom `pre` override in `mdx-components.tsx`)
- [ ] Per-page metadata (title, description, OG, Twitter) via Next.js metadata API
- [ ] `metadataBase` set in root layout — required for OG images and social sharing
- [ ] Sitemap including blog post URLs with `lastmod` from frontmatter
- [ ] robots.txt via `robots.ts`
- [ ] Tag-based filtering on listing page (client-side, no separate static pages)
- [ ] Reading time estimate displayed on cards and post header
- [ ] Custom callout components (Info, Warning, Tip) registered in `mdx-components.tsx`
- [ ] `next/image` override for MDX images
- [ ] Custom 404 page matching design system (already in PROJECT.md)

### Add After Validation (v1.x)

Add once the blog infrastructure is confirmed working and first posts are published.

- [ ] Dynamic OG image generation per post — trigger: first external post share on LinkedIn/X
- [ ] Table of contents for long posts — trigger: first post exceeding 2000 words
- [ ] Prev/next post navigation — trigger: when >= 3 posts exist
- [ ] `rehype-slug` + `rehype-autolink-headings` for deep-link headings — trigger: alongside TOC

### Future Consideration (v2+)

Features to defer until post volume and audience justify the investment.

- [ ] RSS feed — defer per PROJECT.md; add when recurring readers exist
- [ ] Search — defer until > 30 posts
- [ ] Pagination — defer until > 30 posts
- [ ] View counts / engagement metrics — defer until analytics show meaningful traffic
- [ ] CMS integration — defer until non-technical team members need to publish

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Frontmatter + listing page | HIGH | LOW | P1 |
| SSG per-post pages | HIGH | LOW | P1 |
| Syntax highlighting | HIGH | MEDIUM | P1 |
| SEO metadata per post | HIGH | LOW | P1 |
| Sitemap + robots.txt | HIGH | LOW | P1 |
| Prose typography (Tailwind) | HIGH | LOW | P1 |
| Reading time estimate | MEDIUM | LOW | P1 |
| Code copy button | MEDIUM | LOW | P1 |
| Tag filtering | MEDIUM | MEDIUM | P1 |
| Custom callout components | MEDIUM | LOW | P1 |
| next/image override | MEDIUM | LOW | P1 |
| Dynamic OG image per post | HIGH | MEDIUM | P2 |
| Table of contents | MEDIUM | MEDIUM | P2 |
| Prev/next navigation | MEDIUM | LOW | P2 |
| Heading deep-link anchors | LOW | LOW | P2 |
| RSS feed | LOW | MEDIUM | P3 |
| Search | LOW | HIGH | P3 |
| Pagination | LOW | LOW | P3 |

**Priority key:**
- P1: Must have for this milestone launch
- P2: Add in v1.x when first posts are live
- P3: Future milestone, defer explicitly

---

## Competitor Feature Analysis

Reference blogs studied: Stripe Engineering, Vercel Blog, Linear Changelog, Josh Comeau's blog, smaller systems/consulting firms.

| Feature | Stripe Engineering | Vercel Blog | Independent Dev Blogs | Our Approach |
|---------|-------------------|--------------|-----------------------|--------------|
| Syntax highlighting | Yes, custom theme | Yes, dark theme | Yes, Shiki/Prism | rehype-pretty-code + Shiki dark theme |
| Reading time | Yes | Yes | Most have it | Yes — `reading-time` package |
| Table of contents | On long posts | Sometimes | Varies | v1.x (after first long post) |
| Tag/category filtering | Category pages | Tag pages | Varies | Client-side filter on listing page |
| OG images | Branded per post | Dynamic per post | Sometimes | Dynamic generation in v1.x |
| Copy button on code | Yes | Yes | Most have it | Yes — custom `pre` component |
| Comments | No | No | Rare on eng blogs | Explicitly excluded |
| Search | Yes (Algolia) | Yes | Varies | Excluded until > 30 posts |
| Newsletter | Email signup | Yes | Varies | Excluded — use "Initiate" CTA instead |
| Dark mode | Permanent dark | Toggle | Varies | Permanent dark — AXIONLAB brand decision |
| RSS | Yes | Yes | Most have it | Deferred to future milestone |

**Key takeaway:** Stripe and Vercel both skip comments on engineering blogs. The pattern is: excellent typography + syntax highlighting + clear metadata + minimal chrome. AXIONLAB should follow this pattern exactly — authority comes from content quality, not engagement features.

---

## Sources

- [Next.js MDX Official Docs](https://nextjs.org/docs/app/guides/mdx) — confirmed frontmatter limitation, mdx-components.tsx requirement, Tailwind typography integration, remark/rehype plugin usage. Version 16.1.6, updated 2026-02-27. **HIGH confidence.**
- [Next.js Metadata and OG Images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) — `metadataBase` requirement, `opengraph-image.tsx` convention. **HIGH confidence.**
- [rehype-pretty-code](https://rehype-pretty.pages.dev/) — Shiki-powered syntax highlighting, ESM-only, build-time execution. **HIGH confidence.**
- [Building a Modern Blog with MDX and Next.js 16](https://www.yourtechpilot.com/blog/building-mdx-blog-nextjs) — reading time, TOC, SEO frontmatter fields pattern. **MEDIUM confidence (community source).**
- [Building an SEO-Optimized Blog with Next.js and MDX](https://dev.to/pavel_buyeu/building-an-seo-optimized-blog-with-nextjs-and-mdx-from-routing-to-rendering-2h72) — frontmatter structure, sitemap integration. **MEDIUM confidence (community source).**
- [Josh W. Comeau — How I Built My Blog](https://www.joshwcomeau.com/blog/how-i-built-my-blog/) — differentiating features (interactive components, database for likes), difficulty of bespoke components and bundle size. **MEDIUM confidence (practitioner analysis).**
- [Shiki + rehype-slug patterns](https://shiki.matsu.io/packages/rehype) — plugin ordering for heading anchors. **HIGH confidence (official Shiki docs).**
- AXIONLAB PROJECT.md — explicit out-of-scope decisions (comments, RSS, search, CMS, analytics) adopted directly as anti-features rationale.

---

*Feature research for: MDX blog system — AXIONLAB engineering lab website*
*Researched: 2026-03-07*
