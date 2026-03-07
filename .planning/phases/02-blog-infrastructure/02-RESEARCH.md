# Phase 2: Blog Infrastructure - Research

**Researched:** 2026-03-08
**Domain:** MDX blog system — Next.js 16 App Router, @next/mdx, gray-matter, rehype-pretty-code, @tailwindcss/typography
**Confidence:** HIGH

---

## Summary

Phase 2 builds a functional MDX blog at `/insights` on top of the Next.js 16 App Router foundation completed in Phase 1. The core stack is well-established: `@next/mdx` for MDX compilation, `gray-matter` for frontmatter parsing, `rehype-pretty-code` + Shiki for build-time syntax highlighting, and `@tailwindcss/typography` for prose styling. All of these are verified against official Next.js v16.1.6 documentation (updated 2026-02-27).

The one significant risk requiring early attention is Turbopack compatibility. Next.js 16 now uses Turbopack by default for **both** `next dev` and `next build`. Plugins that pass JavaScript functions as options — specifically `rehype-pretty-code` with its Shiki theme object — cannot be used with Turbopack because functions cannot be serialized to Rust. The official Next.js MDX guide documents this limitation explicitly and recommends either the `--webpack` flag on `next build` or restricting syntax highlighting to Turbopack-compatible string-based plugin syntax. Using `npm run build -- --webpack` is the clean resolution: it opts out of Turbopack for production builds while keeping Turbopack for development via `next dev`.

The second key architectural point is the **two-pass frontmatter approach**: `gray-matter` reads raw `.mdx` files via Node.js `fs` in a server-side `lib/blog.ts` utility for the listing page and sitemap, while `@next/mdx` compiles the full MDX content for individual post pages via dynamic import. This two-pass pattern avoids the need for `remark-frontmatter` + `remark-mdx-frontmatter` plugins, simplifies the listing page code, and is the pattern recommended by the official Next.js MDX guide.

**Primary recommendation:** Install `@next/mdx @mdx-js/loader @mdx-js/react @types/mdx gray-matter reading-time remark-gfm rehype-pretty-code shiki @tailwindcss/typography`. Add `pageExtensions` to `next.config.mjs`, configure rehype-pretty-code via the webpack MDX path, use `--webpack` in the `build` script, and create `lib/blog.ts` as the single server-side frontmatter utility.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| BLG-01 | MDX files in `content/blog/` with frontmatter (title, date, description, tags, author) | `gray-matter` two-pass approach: `lib/blog.ts` reads `.mdx` files via `fs`, parses YAML frontmatter without MDX compilation. Pattern verified in official Next.js MDX docs (nextjs.org/docs/app/guides/mdx). |
| BLG-02 | Blog listing page at `/insights` renders post cards from filesystem scan | Server Component `app/insights/page.tsx` calls `getAllPosts()` from `lib/blog.ts` at build time; returns array of post metadata. Cards rendered as static HTML. No client JS needed. |
| BLG-03 | Individual post pages at `/insights/[slug]` with SSG via `generateStaticParams` | `generateStaticParams` reads slugs from `lib/blog.ts`; dynamic import `await import('@/content/blog/${slug}.mdx')` loads compiled MDX. `dynamicParams = false` enforces 404 on unknown slugs. Verified against official docs. |
| BLG-04 | Prose typography via `@tailwindcss/typography` with AXIONLAB theme overrides | In Tailwind v4, add `@plugin "@tailwindcss/typography"` to `globals.css`. Apply `prose prose-invert` classes. Override `--tw-prose-*` CSS variables in `@theme` block to match AXIONLAB design tokens. |
| BLG-05 | Syntax-highlighted code blocks via `rehype-pretty-code` + Shiki | Configure `rehype-pretty-code` in `next.config.mjs` `withMDX` options. Use `npm run build -- --webpack` to bypass Turbopack's non-serializable function restriction. Dark Shiki theme (e.g. `github-dark`, `one-dark-pro`) aligns with `#080808` background. Zero client JS shipped. |
| BLG-06 | Reading time estimate displayed per post | `reading-time` package (`^1.5.0`) computes estimate from raw MDX content string in `lib/blog.ts` during frontmatter pass. Returns `{ text: "5 min read", minutes: 5, words: 1200 }`. |
| BLG-07 | Tag-based filtering on listing page (client-side) | Listing page (`app/insights/page.tsx`) is a Server Component; extract interactive filter into a `'use client'` child component. Pass the pre-rendered post list as props. Filter state managed via `useState`. No page reload, no separate static routes per tag. |
| BLG-08 | Per-post SEO metadata from frontmatter | `generateMetadata` in `app/insights/[slug]/page.tsx` reads post via `lib/blog.ts` and returns `{ title, description, openGraph, twitter }`. Fully async per Next.js 16 requirements (`params` is now a `Promise`). |
| BLG-09 | Blog posts auto-included in sitemap.ts | `app/sitemap.ts` calls `getAllPosts()` from `lib/blog.ts` and maps to `{ url, lastModified }` entries. Built-in Next.js file convention; no `next-sitemap` package needed. |
| BLG-10 | `mdx-components.tsx` at project root for global MDX component registry | Required by `@next/mdx` with App Router — build will warn without it. Must export `useMDXComponents()` function (not a default export). Registers custom `h1`, `h2`, `code`, `pre`, `a`, and `img` (with `next/image`) overrides. |
</phase_requirements>

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@next/mdx` | `latest` | Official MDX integration — compiles `.mdx` files via webpack/Turbopack MDX loader | Vercel-maintained, RSC-stable, Turbopack-compatible, mandatory for `mdx-components.tsx` convention. Only option without RSC instability (next-mdx-remote) or maintenance abandonment (Contentlayer). |
| `@mdx-js/loader` | `latest` | Webpack/Turbopack MDX loader (peer dep of @next/mdx) | Required peer dependency. |
| `@mdx-js/react` | `latest` | React context provider for MDX component mapping | Required for `mdx-components.tsx` component registry to function. |
| `@types/mdx` | `latest` | TypeScript types for `.mdx` file imports | Required for type-safe `await import('...mdx')` calls. |
| `gray-matter` | `^4.0.3` | Parse YAML frontmatter from raw `.mdx` file contents | Industry standard (used by Gatsby, Astro, Vitepress, Netlify). Stable — last release 5 years ago is a feature, not a risk. No compilation step. Fast `fs` + `gray-matter` pass for the listing index. |
| `reading-time` | `^1.5.0` | Compute "X min read" estimate from text content | Stable mature library. Called in `lib/blog.ts` on raw MDX content string. |
| `remark-gfm` | `latest` | GitHub Flavored Markdown (tables, strikethrough, autolinks, task lists) | Required for any technical writing. Turbopack-compatible via string syntax: `'remark-gfm'`. |
| `rehype-pretty-code` | `latest` | Build-time syntax highlighting via Shiki | Official docs reference it directly (nextjs.org/docs/app/guides/mdx). Zero client JS. Cannot use with Turbopack — requires `--webpack` build flag. |
| `shiki` | `^1.x` | Syntax highlighter engine (peer dep of rehype-pretty-code) | Required peer dependency. `rehype-pretty-code` supports `shiki ^1.0.0`. |
| `@tailwindcss/typography` | `latest` | Prose styling for MDX-rendered HTML | Official Next.js docs recommend it explicitly. In Tailwind v4: add via `@plugin "@tailwindcss/typography"` in `globals.css` (not `tailwind.config.js`). |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `remark-frontmatter` | `latest` | Strip YAML frontmatter blocks from compiled MDX output | Optional — only needed if raw `---` YAML blocks appear verbatim in rendered post content. `gray-matter` handles the listing page; this handles ensuring MDX compiler doesn't choke on frontmatter syntax inside MDX files. Install if rendering artifacts appear. |
| `rehype-slug` | `latest` | Auto-add `id` attributes to headings | Needed for deep-link heading anchors (Phase 4 prerequisite). Turbopack-compatible via string syntax `'rehype-slug'`. Install now since it's free to add to the rehype pipeline. |
| `next/image` | built-in | Optimized image rendering in MDX content | Register in `mdx-components.tsx` as `img` override. No separate install. |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@next/mdx` | `next-mdx-remote` | next-mdx-remote is officially unstable with RSC (Hashicorp's own warning in README as of 2025). Not appropriate. |
| `@next/mdx` | Contentlayer | Abandoned (last commit 2023, incompatible with Next.js 13.3+). Never use for new projects. |
| `gray-matter` (two-pass) | `remark-frontmatter` + `remark-mdx-frontmatter` | Plugin pair exposes frontmatter as named JS exports from MDX files, enabling `import { metadata } from './post.mdx'`. More elegant but adds two remark plugins to the compilation pipeline and makes the listing page code more complex. The `gray-matter` two-pass is simpler and is what official Next.js docs illustrate. |
| `rehype-pretty-code` | `@shikijs/rehype` directly | Both work. `rehype-pretty-code` provides better API: line numbers, word highlighting, copy button hooks via CSS data attributes. Use `rehype-pretty-code`. |
| `@tailwindcss/typography` | Custom CSS prose styles | Custom styles require significant effort to match the quality of the typography plugin's defaults. Typography plugin is zero-config for base styles + easy to override. |

**Installation:**

```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
npm install gray-matter reading-time
npm install remark-gfm rehype-pretty-code shiki rehype-slug
npm install @tailwindcss/typography
```

---

## Architecture Patterns

### Recommended Project Structure

```
axionlab/
├── app/
│   ├── insights/
│   │   ├── page.tsx              # Blog listing — Server Component wrapping 'use client' filter
│   │   └── [slug]/
│   │       └── page.tsx          # Individual post — generateStaticParams + MDX dynamic import
│   └── sitemap.ts                # Auto-generated sitemap.xml — reads lib/blog.ts
├── components/
│   └── blog/
│       ├── PostCard.tsx          # Server Component: renders a single post card
│       └── TagFilter.tsx         # 'use client': tag filter state, receives posts as props
├── content/
│   └── blog/
│       ├── example-post.mdx      # MDX post with YAML frontmatter
│       └── ...
├── lib/
│   └── blog.ts                   # Server-only: fs + gray-matter frontmatter utility
├── mdx-components.tsx            # Required @next/mdx file — global component overrides
├── next.config.mjs               # withMDX config, pageExtensions, rehype-pretty-code
└── package.json                  # build script: "next build --webpack"
```

### Pattern 1: Two-Pass Frontmatter Strategy

**What:** `lib/blog.ts` reads raw `.mdx` file bytes via `fs.readdirSync` + `fs.readFileSync`, parses YAML frontmatter with `gray-matter`, and computes reading time — all without importing or compiling MDX. Individual post pages use `await import('@/content/blog/${slug}.mdx')` to get the compiled MDX React component.

**When to use:** Always — this is the recommended approach per official Next.js MDX docs.

**Example:**
```typescript
// Source: nextjs.org/docs/app/guides/mdx (v16.1.6, 2026-02-27)
// lib/blog.ts — server-only, never import in client components
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

export interface PostMeta {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  author: string
  readingTime: string
}

export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'))

  return files
    .map(filename => {
      const slug = filename.replace(/\.mdx$/, '')
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8')
      const { data, content } = matter(raw)
      const { text: readingTimeText } = readingTime(content)

      return {
        slug,
        title: data.title ?? 'Untitled',
        date: data.date ?? '',
        description: data.description ?? '',
        tags: data.tags ?? [],
        author: data.author ?? 'AXIONLAB',
        readingTime: readingTimeText,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): PostMeta {
  const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), 'utf-8')
  const { data, content } = matter(raw)
  const { text: readingTimeText } = readingTime(content)

  return {
    slug,
    title: data.title ?? 'Untitled',
    date: data.date ?? '',
    description: data.description ?? '',
    tags: data.tags ?? [],
    author: data.author ?? 'AXIONLAB',
    readingTime: readingTimeText,
  }
}
```

### Pattern 2: Individual Post Page with generateStaticParams

**What:** `app/insights/[slug]/page.tsx` uses `generateStaticParams` to enumerate all post slugs from `lib/blog.ts` at build time. Posts are loaded via dynamic MDX import. `dynamicParams = false` causes unknown slugs to 404.

**When to use:** All file-based content systems where slugs are known at build time.

**Example:**
```typescript
// Source: nextjs.org/docs/app/guides/mdx (v16.1.6, 2026-02-27) — dynamic MDX imports
import type { Metadata } from 'next'
import { getAllPosts, getPostBySlug } from '@/lib/blog'

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map(post => ({ slug: post.slug }))
}

export const dynamicParams = false // 404 for unknown slugs

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  // Next.js 16: params is now a Promise (breaking change)
  const { slug } = await params
  const post = getPostBySlug(slug)
  return {
    title: `${post.title} | AXIONLAB Insights`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
  }
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  const { default: Post } = await import(`@/content/blog/${slug}.mdx`)

  return (
    <article className="max-w-3xl mx-auto px-6 pt-40 pb-40">
      {/* Post header: title, date, reading time, tags */}
      <header className="mb-16 border-t border-white/10 pt-8">
        <p className="text-[10px] text-accent font-black uppercase tracking-[0.6em] mb-6">
          {post.date} — {post.readingTime}
        </p>
        <h1 className="font-condensed text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8">
          {post.title}
        </h1>
        <div className="flex gap-3 flex-wrap">
          {post.tags.map(tag => (
            <span key={tag} className="text-[9px] font-black uppercase tracking-[0.4em] text-muted border border-white/10 px-3 py-1">
              {tag}
            </span>
          ))}
        </div>
      </header>
      {/* MDX prose content */}
      <div className="prose prose-invert max-w-none">
        <Post />
      </div>
    </article>
  )
}
```

### Pattern 3: Tag Filtering with Client Island

**What:** The listing page (`app/insights/page.tsx`) is a Server Component — it calls `getAllPosts()` at build time and passes the full posts array as props to a `'use client'` child component `TagFilter`. The filter component owns its own state and renders the filtered subset.

**When to use:** Any interactive UI element embedded inside a Server Component page.

**Example:**
```typescript
// app/insights/page.tsx — Server Component
import { getAllPosts } from '@/lib/blog'
import { TagFilter } from '@/components/blog/TagFilter'

export default function InsightsPage() {
  const posts = getAllPosts()
  return (
    <div className="pt-40 px-6 md:px-12 max-w-7xl mx-auto min-h-screen pb-40">
      <div className="border-t border-white/10 pt-24 max-w-4xl mb-16">
        <h1 className="text-[10px] text-accent font-black uppercase tracking-[0.6em] mb-12">
          Research & Briefings
        </h1>
        <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
          Insights.
        </h2>
      </div>
      {/* Client island receives serializable props */}
      <TagFilter posts={posts} />
    </div>
  )
}

// components/blog/TagFilter.tsx — Client Component
'use client'
import { useState } from 'react'
import type { PostMeta } from '@/lib/blog'
import { PostCard } from './PostCard'

export function TagFilter({ posts }: { posts: PostMeta[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const allTags = Array.from(new Set(posts.flatMap(p => p.tags))).sort()
  const filtered = activeTag ? posts.filter(p => p.tags.includes(activeTag)) : posts

  return (
    <div>
      {/* Tag buttons */}
      <div className="flex gap-3 flex-wrap mb-16">
        <button
          onClick={() => setActiveTag(null)}
          className={`text-[9px] font-black uppercase tracking-[0.4em] px-3 py-1 border ${!activeTag ? 'border-accent text-accent' : 'border-white/10 text-muted'}`}
        >
          All
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`text-[9px] font-black uppercase tracking-[0.4em] px-3 py-1 border ${activeTag === tag ? 'border-accent text-accent' : 'border-white/10 text-muted'}`}
          >
            {tag}
          </button>
        ))}
      </div>
      {/* Post grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.map(post => (
          <PostCard key={post.slug} post={post} />
        ))}
        {filtered.length === 0 && (
          <p className="text-muted font-mono text-sm uppercase tracking-widest">
            No posts found.
          </p>
        )}
      </div>
    </div>
  )
}
```

### Pattern 4: next.config.mjs MDX Configuration with Turbopack Escape Hatch

**What:** `@next/mdx` wraps the Next.js config. `rehype-pretty-code` is passed as a JavaScript function with options — this requires `--webpack` build flag because Turbopack cannot serialize JS functions to Rust.

**When to use:** Always when `rehype-pretty-code` is in the rehype pipeline.

**Example:**
```javascript
// Source: nextjs.org/docs/app/guides/mdx (v16.1.6) + rehype-pretty.pages.dev
// next.config.mjs
import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add .md and .mdx as page extensions
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  transpilePackages: ['framer-motion'],
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      // rehype-pretty-code requires a JS function (Shiki options) — not Turbopack-compatible
      // This is why we use --webpack in the build script
      [rehypePrettyCode, {
        theme: 'github-dark', // or 'one-dark-pro' — dark theme matching #080808 bg
        keepBackground: false, // Use our own bg-surface / bg-background via prose overrides
      }],
    ],
  },
})

export default withMDX(nextConfig)
```

**package.json build script:**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build --webpack",
    "start": "next start"
  }
}
```

> The `--webpack` flag opts out of Turbopack for production builds. `next dev` still uses Turbopack (fast HMR). This is the official documented escape hatch per the Next.js 16 upgrade guide.

### Pattern 5: mdx-components.tsx for AXIONLAB Design System

**What:** Required file at project root. Maps HTML elements generated by MDX to styled React components using AXIONLAB design tokens.

**Example:**
```typescript
// Source: nextjs.org/docs/app/guides/mdx (v16.1.6) — mdx-components convention
// mdx-components.tsx
import type { MDXComponents } from 'mdx/types'
import Image, { type ImageProps } from 'next/image'
import Link from 'next/link'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Headings — AXIONLAB style: Inter Tight, uppercase, tight tracking
    h1: ({ children }) => (
      <h1 className="font-condensed text-5xl font-black uppercase tracking-tighter leading-none mt-16 mb-8">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-condensed text-3xl font-black uppercase tracking-tighter leading-none mt-12 mb-6">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-condensed text-xl font-black uppercase tracking-tight mt-8 mb-4">
        {children}
      </h3>
    ),
    // Inline code — accent color, surface background
    code: ({ children }) => (
      <code className="bg-surface text-accent font-mono text-sm px-1.5 py-0.5">
        {children}
      </code>
    ),
    // Links — accent color on hover
    a: ({ href, children }) => (
      <Link href={href ?? '#'} className="text-accent underline underline-offset-2 hover:text-white transition-colors">
        {children}
      </Link>
    ),
    // Images — use next/image for optimization
    img: (props) => (
      <Image
        sizes="(max-width: 768px) 100vw, 720px"
        className="w-full"
        {...(props as ImageProps)}
        alt={props.alt ?? ''}
      />
    ),
    ...components,
  }
}
```

### Pattern 6: Tailwind v4 Typography Integration

**What:** In Tailwind v4, the typography plugin is added via `@plugin` directive in CSS — not in `tailwind.config.js`. Prose colors are overridden via CSS variables in `@theme` block.

**Example:**
```css
/* app/globals.css — add to existing file */
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  /* ... existing theme vars ... */

  /* Override prose colors for AXIONLAB dark theme */
  --tw-prose-body: #cccccc;
  --tw-prose-headings: #ffffff;
  --tw-prose-lead: #999999;
  --tw-prose-links: #ff1f3d;
  --tw-prose-bold: #ffffff;
  --tw-prose-counters: #666666;
  --tw-prose-bullets: #666666;
  --tw-prose-hr: rgba(255,255,255,0.1);
  --tw-prose-quotes: #ffffff;
  --tw-prose-quote-borders: #ff1f3d;
  --tw-prose-captions: #666666;
  --tw-prose-code: #ff1f3d;
  --tw-prose-pre-code: #cccccc;
  --tw-prose-pre-bg: #111111;
  --tw-prose-th-borders: rgba(255,255,255,0.1);
  --tw-prose-td-borders: rgba(255,255,255,0.08);
}
```

Apply to post content: `<div className="prose prose-invert max-w-none">`. The `prose-invert` class activates dark mode defaults; the `@theme` overrides fine-tune to AXIONLAB's exact colors.

### Pattern 7: MDX Frontmatter Convention

**What:** YAML frontmatter block at the top of each `.mdx` file. `gray-matter` parses this without importing the MDX compiler.

**Example:**
```yaml
---
title: "Building Resilient Distributed Systems"
date: "2026-03-01"
description: "How AXIONLAB approaches fault isolation, circuit breakers, and graceful degradation in production systems."
tags: ["systems", "distributed", "reliability"]
author: "AXIONLAB"
---

Content begins here...
```

> `@next/mdx` does NOT parse YAML frontmatter natively. The `---` block is read only by `gray-matter` in `lib/blog.ts`. Inside the MDX compilation pipeline, if the `---` block causes rendering artifacts, add `remark-frontmatter` to strip it.

### Anti-Patterns to Avoid

- **Importing `lib/blog.ts` in a Client Component:** `lib/blog.ts` uses Node.js `fs` — importing it in a `'use client'` component causes a build error. Mark `lib/blog.ts` with `import 'server-only'` if the codebase grows.
- **Using `dynamicParams = true` (the default):** Without `dynamicParams = false`, accessing `/insights/a-nonexistent-slug` will attempt on-demand rendering and fail at runtime instead of returning a 404 immediately. Always set `dynamicParams = false` for file-based content.
- **Using `export const metadata = {...}` inside MDX files for the listing page:** This requires compiling each MDX file to extract metadata, which is far slower than `gray-matter` on raw text. Only use this pattern for per-post metadata, not the listing index.
- **Passing the full `Post` MDX component as a prop across the Server/Client boundary:** MDX components are React components — they cannot be serialized. The `TagFilter` client component must receive plain serializable data (`PostMeta[]`), not MDX component references.
- **Using `mdxRs: true` (experimental Rust compiler):** Officially documented as experimental and not recommended for production. Avoid.
- **Forgetting `pageExtensions` in `next.config.mjs`:** Without adding `'md'` and `'mdx'` to `pageExtensions`, the App Router ignores `.mdx` files for file-based routing. Required even when using dynamic imports (it affects the webpack loader configuration).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Frontmatter parsing | Custom YAML parser with regex | `gray-matter` | Handles multiline values, nested objects, TOML, JSON frontmatter, edge cases in YAML. Battle-tested in Gatsby, Astro, Vitepress. |
| Syntax highlighting | Custom code tokenizer with `highlight.js` | `rehype-pretty-code` + Shiki | Shiki uses the same TextMate grammars as VS Code; 200+ languages; zero client JS; accurate token coloring. Manual tokenizers are unmaintainable. |
| Reading time estimate | Word count divided by 200 | `reading-time` | Handles CJK characters, code blocks (counted differently), punctuation edge cases. |
| Prose typography | Manual CSS for `p`, `h1`, `blockquote`, `table` | `@tailwindcss/typography` | The `prose` class covers 50+ HTML elements with carefully tuned vertical rhythm and scale. Manual recreation takes days; plugin is fully customizable via CSS variables. |
| Slug generation from filename | `file.split('.')[0]` | `filename.replace(/\.mdx$/, '')` | The `split` approach breaks on filenames with multiple dots (e.g., `v1.2.3-release.mdx` → `v1`). The regex approach is correct and explicit. |

**Key insight:** The remark/rehype ecosystem solves deeply complex text transformation problems (AST manipulation, Unicode handling, plugin ordering) that look trivial but have many edge cases. Never build custom solutions in this domain.

---

## Common Pitfalls

### Pitfall 1: Turbopack Fails on rehype-pretty-code with Function Options

**What goes wrong:** `next build` (which uses Turbopack by default in v16) fails with an error about non-serializable plugin options when `rehype-pretty-code` is configured with a Shiki theme object.

**Why it happens:** Turbopack requires all MDX plugin options to be JSON-serializable so they can be passed to its Rust implementation. JavaScript functions and complex objects like Shiki theme configurations cannot be serialized.

**How to avoid:** Change the `build` script in `package.json` to `next build --webpack`. This opts out of Turbopack for production builds while keeping Turbopack for `next dev`. The `--webpack` flag is officially documented in the Next.js 16 upgrade guide as the escape hatch for projects with custom webpack configurations or non-serializable plugin options.

**Warning signs:**
- `next build` fails with `TypeError: Cannot serialize function` or similar
- Build works in dev (`next dev`) but fails on `next build`
- Error message references Turbopack configuration

### Pitfall 2: mdx-components.tsx Missing or Wrong Export Shape

**What goes wrong:** Build warns "mdx-components file is missing" or MDX renders without any custom styling. Headings appear with browser-default sizes instead of AXIONLAB design system styles.

**Why it happens:** `@next/mdx` with App Router requires `mdx-components.tsx` at the project root (not in `app/` or `components/`). Wrong export shape — a default export instead of named `useMDXComponents` — silently disables the component registry.

**How to avoid:** Create `mdx-components.tsx` immediately when setting up `@next/mdx`. Verify the file exports `export function useMDXComponents(components: MDXComponents): MDXComponents` (named export, not `export default`).

**Warning signs:**
- MDX headings use default browser font size
- Code blocks show unstyled monospace instead of AXIONLAB `bg-surface text-accent` styling
- Build warning about missing mdx-components file

### Pitfall 3: params is a Promise in Next.js 16 (Breaking Change)

**What goes wrong:** `generateMetadata` and the page component receive `params` as a `Promise<{ slug: string }>`, not a plain object. Accessing `params.slug` directly (without `await`) returns `undefined`, causing metadata to be empty and the dynamic import to fail.

**Why it happens:** Next.js 16 fully removed synchronous access to dynamic APIs including `params`. This was a breaking change from v15 where synchronous access was temporarily supported.

**How to avoid:** Always destructure params with `await`:
```typescript
export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  // ...
}
```

**Warning signs:**
- Post page shows empty title/description in metadata
- Dynamic import fails with "Cannot find module undefined.mdx"
- TypeScript shows type mismatch on `params.slug`

### Pitfall 4: Frontmatter YAML Block Renders Verbatim in Post Content

**What goes wrong:** The `---\ntitle: My Post\n---` block at the top of MDX files appears as literal text in the rendered post body.

**Why it happens:** `@next/mdx` does not strip frontmatter by default. The `---` YAML block is valid Markdown content and is treated as a thematic break (`<hr>`) followed by text.

**How to avoid:** Two options:
1. Add `remark-frontmatter` to the remark plugins in `next.config.mjs` — this plugin strips the frontmatter block before MDX compilation.
2. Rely on `gray-matter` in `lib/blog.ts` to extract frontmatter separately (two-pass approach) and pass only the `content` string (everything after the frontmatter) — but `@next/mdx` still compiles the full file. Option 1 is the clean fix.

**Warning signs:**
- Blog posts show a horizontal rule and raw YAML text at the top
- `title: "My Post"` text appears above the actual post content

### Pitfall 5: lib/blog.ts Imported in a Client Component

**What goes wrong:** Build error: "Module not found: Can't resolve 'fs'" in a Client Component. `fs` is a Node.js built-in that doesn't exist in the browser.

**Why it happens:** `lib/blog.ts` uses `import fs from 'fs'`. If any Client Component anywhere in the tree imports from `lib/blog.ts`, the entire module graph including `fs` is included in the client bundle.

**How to avoid:** Never import `lib/blog.ts` in any `'use client'` component. Only import it in Server Components (`app/insights/page.tsx`, `app/insights/[slug]/page.tsx`, `app/sitemap.ts`). Pass extracted data as props to Client Components. Optionally add `import 'server-only'` at the top of `lib/blog.ts` to get a build-time error instead of a silent bundle issue.

**Warning signs:**
- Build error mentioning `fs` or `path` in a client bundle
- Error traceback pointing to `lib/blog.ts` being used in a component with `'use client'`

### Pitfall 6: Empty /insights Page When No Posts Exist Yet

**What goes wrong:** The `/insights` listing page renders with no cards and no explanation, looking broken before any blog posts are written.

**Why it happens:** `getAllPosts()` returns an empty array when `content/blog/` is empty or doesn't exist. The `map()` renders nothing.

**How to avoid:** Add an explicit empty state check in `TagFilter`. Create a seed post immediately during Phase 2 development to validate the full pipeline. Seed post doubles as an integration test for frontmatter parsing, syntax highlighting, and prose typography.

**Warning signs:**
- `/insights` page loads but shows nothing below the heading
- No posts in the filter grid with no feedback to the user

---

## Code Examples

Verified patterns from official sources:

### MDX Frontmatter File Structure
```mdx
---
title: "Engineering for Reliability"
date: "2026-03-01"
description: "How AXIONLAB approaches fault isolation and circuit breakers."
tags: ["systems", "reliability", "distributed"]
author: "AXIONLAB"
---

# Engineering for Reliability

Content with **bold text**, `inline code`, and [links](https://axionlab.in).

## Code Example

```typescript
const result = await circuit.execute(async () => {
  return await externalService.call()
})
```

```

### sitemap.ts with Blog Posts
```typescript
// Source: nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap (v16.1.6)
// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'

const BASE_URL = 'https://axionlab.in'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE_URL}/philosophy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.8 },
    { url: `${BASE_URL}/capabilities`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/work`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/insights`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/careers`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/initiate`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.6 },
  ]

  const blogPages: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${BASE_URL}/insights/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'yearly',
    priority: 0.8,
  }))

  return [...staticPages, ...blogPages]
}
```

### useMDXComponents Minimum Viable Structure
```typescript
// Source: nextjs.org/docs/app/guides/mdx — required file
// mdx-components.tsx
import type { MDXComponents } from 'mdx/types'

// Note: Named export, NOT default export — wrong shape silently disables component registry
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  }
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Contentlayer for typed MDX content | `@next/mdx` + `gray-matter` | 2023 (Contentlayer abandoned) | Contentlayer incompatible with Next.js 13.3+. All new projects must use alternatives. |
| `next-mdx-remote` for remote/local MDX | `@next/mdx` for local files | 2025 (RSC instability warning) | Hashicorp officially warns against using next-mdx-remote with RSC. Avoid for new projects. |
| Prism.js for syntax highlighting | `rehype-pretty-code` + Shiki | ~2023 | Shiki uses VS Code's TextMate grammar engine — superior accuracy. Zero client JS. Prism requires client-side execution. |
| `tailwind.config.js` plugins: `[require('@tailwindcss/typography')]` | `@plugin "@tailwindcss/typography"` in CSS | Tailwind v4 (2025) | JavaScript config is deprecated in v4. CSS-based `@plugin` directive is the new canonical approach. |
| Turbopack opt-in (`--turbopack` flag) | Turbopack default for both `next dev` and `next build` | Next.js 16 | `--webpack` flag now required to opt OUT of Turbopack. Projects with non-serializable plugins must use `--webpack` for builds. |
| Synchronous `params` access in page components | `const { slug } = await params` | Next.js 16 (breaking change) | Fully async — synchronous compatibility removed. All dynamic segment access requires `await`. |

**Deprecated/outdated:**
- `mdxRs: true` (experimental Rust MDX compiler): Not recommended for production, docs warn against it
- `next-sitemap` package: Stale (4.2.3, 3 years since last publish). Native `app/sitemap.ts` covers all use cases.
- `images.domains` config: Deprecated in v16. Use `images.remotePatterns` for any external images in blog posts.

---

## Open Questions

1. **Does remark-frontmatter need to be added to the pipeline?**
   - What we know: `@next/mdx` does not strip YAML frontmatter by default. `gray-matter` handles listing page metadata. But the MDX compiler still sees the raw `---` block.
   - What's unclear: Whether `@next/mdx` silently ignores the frontmatter block (treating `---` as a thematic break) or whether it causes a rendering artifact (visible `---` or YAML text in the compiled output).
   - Recommendation: Write the seed blog post with frontmatter and render it early in Phase 2 Wave 1. If YAML appears in the rendered output, add `remark-frontmatter` to the pipeline. Do NOT preemptively add it — verify first.

2. **Will next build --webpack pass on Vercel's build environment?**
   - What we know: The `--webpack` flag is officially documented in the Next.js 16 upgrade guide. Vercel runs the project's `npm run build` script, which will be `next build --webpack`.
   - What's unclear: Whether Vercel's Next.js 16 build environment handles the `--webpack` flag correctly or if it overrides the script in any way.
   - Recommendation: Test with a `vercel build` locally before the first deploy (or note this as a deploy-phase verification step). If Vercel overrides the flag, alternative is to pass a webpack config function to `next.config.mjs` which forces Turbopack off without the flag.

3. **What Shiki theme best matches the AXIONLAB design?**
   - What we know: `github-dark` and `one-dark-pro` are popular dark themes. `keepBackground: false` in rehype-pretty-code options lets our CSS control the code block background color instead of Shiki's theme.
   - What's unclear: Which specific theme tokens look best against `#111111` surface / `#080808` background.
   - Recommendation: Use `github-dark` as the default. Set `keepBackground: false` and apply `bg-surface` to `pre` elements via `mdx-components.tsx`. Adjust in a later task if the color rendering looks off.

---

## Sources

### Primary (HIGH confidence)
- [Next.js MDX Guide](https://nextjs.org/docs/app/guides/mdx) (v16.1.6, updated 2026-02-27) — @next/mdx installation, next.config.mjs setup, mdx-components.tsx requirement, frontmatter limitation, generateStaticParams pattern, dynamicParams usage, Turbopack plugin string syntax, Tailwind typography integration
- [Next.js Upgrade Guide v16](https://nextjs.org/docs/app/guides/upgrading/version-16) (v16.1.6, updated 2026-02-27) — Turbopack now default for next build, --webpack escape hatch, params now async (breaking change), turbopack config location
- [rehype-pretty-code official docs](https://rehype-pretty.pages.dev/) — Installation, Next.js integration, Shiki theme configuration, line/word highlighting, keepBackground option, build-time execution confirmed
- [Tailwind CSS Typography GitHub README](https://github.com/tailwindlabs/tailwindcss-typography) — v4 `@plugin "@tailwindcss/typography"` CSS directive, `prose-invert` dark mode, `@utility` for custom themes

### Secondary (MEDIUM confidence)
- [Next.js MDX + Turbopack GitHub Issue #74424](https://github.com/vercel/next.js/issues/74424) — Plugin string syntax workaround confirmed; issue closed Jan 2025 as resolved for serializable-options plugins; non-serializable function options (rehype-pretty-code with Shiki) remain a Turbopack limitation
- [Next.js v16 Turbopack Announcement](https://nextjs.org/blog/next-16) — Confirms Turbopack stable and default for next dev and next build starting v16

### Tertiary (LOW confidence)
- WebSearch results confirming gray-matter@4.0.3 and reading-time@1.5.0 as current stable versions — these are mature libraries whose stability is confirmed by their wide ecosystem adoption (gray-matter used by Gatsby, Astro, Vitepress per their own READMEs)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified against official Next.js v16.1.6 docs and official package READMEs
- Architecture: HIGH — patterns derived from official Next.js MDX guide and codebase analysis; two-pass frontmatter is explicitly illustrated in official docs
- Pitfalls: HIGH — Turbopack limitation is officially documented; params async change is a documented breaking change; other pitfalls are officially documented sharp edges

**Research date:** 2026-03-08
**Valid until:** 2026-06-08 (90 days — Next.js release cadence is roughly quarterly; @next/mdx and Turbopack compatibility evolve)
