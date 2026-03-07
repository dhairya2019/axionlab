# Phase 4: Blog Enhancements - Research

**Researched:** 2026-03-08
**Domain:** MDX blog UX polish — copy-to-clipboard code buttons, custom callout components, post-to-post navigation
**Confidence:** HIGH

---

## Summary

Phase 4 adds three reader-experience features on top of the working blog infrastructure from Phases 2–3. All three are additive — they extend existing files without architectural change. No new dependencies are required. The existing stack (`@next/mdx`, `unist-util-visit` already in node_modules, `lucide-react` already installed, `lib/blog.ts` with sorted posts, `mdx-components.tsx` registry) covers everything needed.

**BLE-01 (copy-to-clipboard)** requires two custom rehype plugins that bracket `rehype-pretty-code` in `next.config.mjs`: a `preProcess` plugin that extracts raw code text from `<code>` nodes before syntax highlighting, and a `postProcess` plugin that promotes that raw text to a property on the `<pre>` node after highlighting. The `pre` override in `mdx-components.tsx` then receives `raw` as a prop and renders a `'use client'` `CopyButton` component using `navigator.clipboard.writeText()`. `unist-util-visit` is already installed (it is a transitive dependency of the rehype ecosystem). No new packages needed.

**BLE-02 (callout components)** requires creating three named React components — `Info`, `Warning`, `Tip` — and registering them in `mdx-components.tsx` under the same names. MDX files can then use `<Info>`, `<Warning>`, `<Tip>` as JSX tags directly. This is pure React component work: no plugins, no packages, no config changes. The AXIONLAB design constraints (no border-radius, no box-shadow, #ff1f3d accent, #111111 surface, uppercase labels) are applied via Tailwind utility classes.

**BLE-03 (prev/next navigation)** requires adding a `getAdjacentPosts(slug)` function to `lib/blog.ts` that returns `{ prev, next }` from the sorted-by-date post list. The `app/insights/[slug]/page.tsx` Server Component calls this function and renders a `PostNavigation` Server Component with `next/link` anchors at the bottom of each post. No client JS needed — all server-side.

**Primary recommendation:** Implement in three independent tasks. All changes are isolated additions: one new file for `CopyButton`, two rehype plugins inlined in `next.config.mjs`, callout components in `components/blog/callouts.tsx` registered in `mdx-components.tsx`, `getAdjacentPosts` added to `lib/blog.ts`, and `PostNavigation` added to `components/blog/PostNavigation.tsx`.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| BLE-01 | Code block copy-to-clipboard button on all code blocks | Two-plugin rehype strategy: `preProcess` (before rehype-pretty-code) extracts raw text from `<code>` node and stores on `pre` node; `postProcess` (after rehype-pretty-code) promotes `node.raw` to `node.properties['raw']` so it appears as a React prop. Custom `pre` in `mdx-components.tsx` receives `raw` prop and renders `CopyButton`. `unist-util-visit` is already installed. |
| BLE-02 | Custom MDX callout components (Info, Warning, Tip) in AXIONLAB design language | Named React components registered in `useMDXComponents()` in `mdx-components.tsx`. MDX files use them as JSX tags. No plugins or config changes needed. AXIONLAB styling: no border-radius, left border accent, surface background, uppercase label. |
| BLE-03 | Post-to-post navigation (prev/next links at bottom of each post) when 3+ posts exist | `getAdjacentPosts(slug)` added to `lib/blog.ts` — uses the existing sorted array. Server Component `PostNavigation` renders next/link anchors. Called from `app/insights/[slug]/page.tsx`. Conditional rendering only when adjacent post exists. |
</phase_requirements>

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `unist-util-visit` | already installed | Traverse hast/mdast AST in rehype plugins | Transitive dependency of rehype ecosystem — already in node_modules. The canonical visitor utility for the unified/rehype ecosystem. |
| `lucide-react` | `^0.424.0` (already installed) | Copy/check icons for the CopyButton | Already in package.json. Use `Copy` and `Check` icons for copy-to-clipboard visual feedback. No new install. |
| `mdx-components.tsx` | project file | MDX component registry — already exists | Registration point for callout components. `useMDXComponents` already has `pre` override that will be extended for BLE-01. |
| `lib/blog.ts` | project file | Server-side post utility — already exists | `getAllPosts()` already returns sorted-by-date posts. Extend with `getAdjacentPosts(slug)`. |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `navigator.clipboard.writeText` | Web API | Copy code text to system clipboard | Built-in browser API. Must be called from a `'use client'` component. Use `async/await` with error handling. No package needed. |
| `useState` + `setTimeout` | React built-in | "Copied!" confirmation state with 2s auto-reset | Standard React pattern. `isCopied` boolean state — true for 2000ms after successful copy. |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Two-plugin rehype strategy (preProcess + postProcess) | Extract raw text in the custom `pre` component via `ref.current.innerText` | DOM-based extraction runs client-side; requires `'use client'` on the `pre` wrapper, pushing more code to the browser. The rehype plugin strategy keeps extraction server-side and passes only the string as a prop — zero extra client JS. |
| `navigator.clipboard.writeText` | `document.execCommand('copy')` (deprecated) | `execCommand` is deprecated and unreliable in modern browsers. `navigator.clipboard` is the current standard. Only add a fallback if supporting very old browsers, which is out of scope here. |
| Server Component for callouts | Inline MDX `<div>` with classes | Custom components make the authoring intent explicit (`<Warning>` is unambiguous), enforce design consistency, and are reusable. Raw `<div className="...">` in MDX is fragile and verbose. |
| `getAdjacentPosts` in `lib/blog.ts` | Derive prev/next in the page component directly | Utility function is testable, reusable, and keeps the page component clean. Pattern matches how `getPostBySlug` is already structured. |

**Installation:**

```bash
# No new packages required — all dependencies are already installed
# unist-util-visit is a transitive dep of rehype-pretty-code (already in node_modules)
# lucide-react, mdx-components.tsx, lib/blog.ts all exist
```

---

## Architecture Patterns

### Recommended Project Structure

```
axionlab/
├── app/
│   └── insights/
│       └── [slug]/
│           └── page.tsx          # Add: import getAdjacentPosts, render PostNavigation
├── components/
│   └── blog/
│       ├── PostCard.tsx          # Unchanged
│       ├── PostNavigation.tsx    # NEW: Server Component — prev/next links (BLE-03)
│       ├── TagFilter.tsx         # Unchanged
│       ├── callouts.tsx          # NEW: Info, Warning, Tip components (BLE-02)
│       └── CopyButton.tsx        # NEW: 'use client' — clipboard + icon state (BLE-01)
├── lib/
│   └── blog.ts                   # EXTEND: add getAdjacentPosts(slug)
├── next.config.mjs               # EXTEND: add preProcess/postProcess rehype plugins
└── mdx-components.tsx            # EXTEND: update pre override, register callouts
```

### Pattern 1: Two-Plugin Raw Code Extraction (BLE-01)

**What:** Two inline rehype plugins wrap `rehype-pretty-code` in `next.config.mjs`. `preProcess` runs before highlighting and stores raw code text on the AST node. `postProcess` runs after highlighting and promotes the stored value to an HTML property so React receives it as a prop.

**When to use:** Any time you need to pass the unprocessed code string to a React component — the highlighted output has the original text tokenized into `<span>` elements, making it impossible to extract cleanly at the DOM level without `innerText` tricks.

**Example:**
```typescript
// Source: ClarityDev blog (verified pattern) + tybarho.com (verified)
// next.config.mjs — add before and after rehypePrettyCode in the rehypePlugins array
import { visit } from 'unist-util-visit'

const preProcess = () => (tree) => {
  visit(tree, (node) => {
    if (node?.type === 'element' && node?.tagName === 'pre') {
      const [codeEl] = node.children
      if (codeEl?.tagName !== 'code') return
      // Store raw text before rehype-pretty-code tokenizes it into <span>s
      node.raw = codeEl.children?.[0]?.value ?? ''
    }
  })
}

const postProcess = () => (tree) => {
  visit(tree, 'element', (node) => {
    if (node?.type === 'element' && node?.tagName === 'pre') {
      // Promote stored raw text to HTML property — React receives it as a prop
      node.properties['raw'] = node.raw
    }
  })
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm, remarkFrontmatter],
    rehypePlugins: [
      rehypeSlug,
      preProcess,          // Must be BEFORE rehype-pretty-code
      [rehypePrettyCode, { theme: 'github-dark', keepBackground: false }],
      postProcess,         // Must be AFTER rehype-pretty-code
    ],
  },
})
```

### Pattern 2: CopyButton Client Component (BLE-01)

**What:** A minimal `'use client'` component that calls `navigator.clipboard.writeText()` and shows a 2-second confirmation state. Receives the raw code string as a prop.

**When to use:** Any clipboard interaction — must be a Client Component because `navigator` is browser-only.

**Example:**
```typescript
// components/blog/CopyButton.tsx
'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API unavailable (non-HTTPS dev or permission denied) — silent fail
    }
  }

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? 'Copied' : 'Copy code'}
      className="absolute top-3 right-3 p-1.5 text-muted hover:text-white transition-colors opacity-0 group-hover:opacity-100"
    >
      {copied
        ? <Check size={14} className="text-accent" />
        : <Copy size={14} />
      }
    </button>
  )
}
```

### Pattern 3: Custom `pre` Override with `raw` Prop (BLE-01)

**What:** The existing `pre` override in `mdx-components.tsx` is extended to accept the `raw` prop (added by `postProcess`), wrap the pre in a `relative group` div, and render `CopyButton` positioned absolutely inside.

**Example:**
```typescript
// mdx-components.tsx — replace existing pre override
import { CopyButton } from '@/components/blog/CopyButton'

// In useMDXComponents():
pre: ({ children, raw, ...props }: React.ComponentPropsWithoutRef<'pre'> & { raw?: string }) => (
  <div className="relative group my-6">
    <pre className="bg-surface p-4 overflow-x-auto text-sm" {...props}>
      {children}
    </pre>
    {raw && <CopyButton text={raw} />}
  </div>
),
```

> Note: TypeScript requires the custom `raw` prop to be typed explicitly since it is not a standard HTML `pre` attribute. Use an intersection type as shown.

### Pattern 4: Callout Components in AXIONLAB Design Language (BLE-02)

**What:** Three named React Server Components exported from `components/blog/callouts.tsx`. Each applies AXIONLAB design tokens: no border-radius, left border in appropriate color, `#111111` surface background, uppercase label text.

**When to use:** MDX files use them as JSX tags — `<Info>`, `<Warning>`, `<Tip>`. Registration in `mdx-components.tsx` makes them available in all MDX files without explicit imports.

**Example:**
```typescript
// components/blog/callouts.tsx
import type { ReactNode } from 'react'

function Callout({
  children,
  label,
  borderColor,
  labelColor,
}: {
  children: ReactNode
  label: string
  borderColor: string
  labelColor: string
}) {
  return (
    <div className={`border-l-2 ${borderColor} bg-surface px-5 py-4 my-6`}>
      <p className={`text-[9px] font-black uppercase tracking-[0.4em] ${labelColor} mb-3`}>
        {label}
      </p>
      <div className="text-sm text-white/80 leading-relaxed [&>p]:m-0">
        {children}
      </div>
    </div>
  )
}

export function Info({ children }: { children: ReactNode }) {
  return (
    <Callout label="Info" borderColor="border-white/40" labelColor="text-white/60">
      {children}
    </Callout>
  )
}

export function Warning({ children }: { children: ReactNode }) {
  return (
    <Callout label="Warning" borderColor="border-accent" labelColor="text-accent">
      {children}
    </Callout>
  )
}

export function Tip({ children }: { children: ReactNode }) {
  return (
    <Callout label="Tip" borderColor="border-white/20" labelColor="text-muted">
      {children}
    </Callout>
  )
}
```

**Registration in `mdx-components.tsx`:**
```typescript
import { Info, Warning, Tip } from '@/components/blog/callouts'

// In useMDXComponents():
Info,
Warning,
Tip,
```

### Pattern 5: `getAdjacentPosts` Utility (BLE-03)

**What:** Added to `lib/blog.ts`. Calls `getAllPosts()` (already sorted newest-first) to get the full list, finds the current post's index, and returns the previous (older) and next (newer) post metadata, or `null` for either boundary. The naming convention follows `getPreviousPost` = older (higher index in newest-first sort) and `getNextPost` = newer (lower index).

**When to use:** Rendered in the individual post page Server Component. BLE-03 requires the navigation to appear only when 3+ posts exist — implement this as a conditional at the call site.

**Example:**
```typescript
// lib/blog.ts — add this function
export function getAdjacentPosts(slug: string): {
  prev: PostMeta | null
  next: PostMeta | null
} {
  const posts = getAllPosts() // sorted newest-first
  const index = posts.findIndex(p => p.slug === slug)

  if (index === -1) return { prev: null, next: null }

  // In newest-first order:
  // posts[index - 1] is newer (next to read)
  // posts[index + 1] is older (previous to read)
  return {
    next: index > 0 ? posts[index - 1] : null,        // newer post
    prev: index < posts.length - 1 ? posts[index + 1] : null, // older post
  }
}
```

### Pattern 6: PostNavigation Server Component (BLE-03)

**What:** A Server Component that renders prev/next links using `next/link`. Matches AXIONLAB design language: no box-shadow, border-top separator, uppercase muted labels. Conditionally rendered from the slug page only when `getAllPosts().length >= 3`.

**Example:**
```typescript
// components/blog/PostNavigation.tsx
import Link from 'next/link'
import type { PostMeta } from '@/lib/blog'

export function PostNavigation({
  prev,
  next,
}: {
  prev: PostMeta | null
  next: PostMeta | null
}) {
  if (!prev && !next) return null

  return (
    <nav className="border-t border-white/10 pt-12 mt-16 grid grid-cols-2 gap-8" aria-label="Post navigation">
      <div>
        {prev && (
          <Link href={`/insights/${prev.slug}`} className="group block">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted mb-2">
              Previous
            </p>
            <p className="text-sm font-black uppercase tracking-tight group-hover:text-accent transition-colors leading-tight">
              {prev.title}
            </p>
          </Link>
        )}
      </div>
      <div className="text-right">
        {next && (
          <Link href={`/insights/${next.slug}`} className="group block">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted mb-2">
              Next
            </p>
            <p className="text-sm font-black uppercase tracking-tight group-hover:text-accent transition-colors leading-tight">
              {next.title}
            </p>
          </Link>
        )}
      </div>
    </nav>
  )
}
```

**Usage in `app/insights/[slug]/page.tsx`:**
```typescript
import { getAllPosts, getPostBySlug, getAdjacentPosts } from '@/lib/blog'
import { PostNavigation } from '@/components/blog/PostNavigation'

export default async function BlogPost({ params }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  const allPosts = getAllPosts()
  const { default: Post } = await import(`@/content/blog/${slug}.mdx`)

  // BLE-03: only show navigation when 3+ posts exist
  const adjacent = allPosts.length >= 3 ? getAdjacentPosts(slug) : { prev: null, next: null }

  return (
    <article className="max-w-3xl mx-auto px-6 pt-40 pb-40">
      {/* ... existing header ... */}
      <div className="prose prose-invert max-w-none">
        <Post />
      </div>
      <PostNavigation prev={adjacent.prev} next={adjacent.next} />
    </article>
  )
}
```

### Anti-Patterns to Avoid

- **Extracting raw code from `innerText` in the `pre` component:** Requires `useRef` + `useEffect` making the entire `<pre>` a Client Component. This ships the raw code extraction logic as client JS and increases the bundle. Use the rehype plugin strategy instead.
- **Importing callout components directly inside MDX files:** MDX authors would need to add `import { Info } from '@/components/blog/callouts'` at the top of every file that uses them. Registering in `mdx-components.tsx` makes them globally available — no per-file import needed.
- **Making PostNavigation a Client Component:** No interactivity is needed. `next/link` works in Server Components. Keeping it as a Server Component avoids unnecessary hydration.
- **Hardcoding prev/next in the MDX frontmatter:** Manual links go stale when posts are reordered or deleted. Derive navigation dynamically from `getAllPosts()` at build time.
- **Calling `getAllPosts()` twice in the page component** (once for adjacent, once for generating all posts): `getAllPosts()` reads the filesystem on every call. Store the result once: `const allPosts = getAllPosts()` and pass it to `getAdjacentPosts` instead of having `getAdjacentPosts` call `getAllPosts()` internally.

> Revised pattern for BLE-03: `getAdjacentPosts` should accept the pre-fetched posts array as a parameter to avoid double filesystem reads, OR `getAllPosts()` results should be cached. The simplest approach: call `getAllPosts()` once in the page and pass the array to a modified `getAdjacentPosts(slug, posts)` signature.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| AST traversal in rehype plugins | Custom tree walker | `visit` from `unist-util-visit` | The unist AST is recursive and type-heterogeneous. `visit` handles depth, type filtering, and parent tracking correctly. Already installed — no cost. |
| Clipboard copy with manual DOM selection | `document.createRange()` + `window.getSelection()` | `navigator.clipboard.writeText()` | The selection-based approach is deprecated and fails in many contexts. Clipboard API is the W3C standard, async, and permission-model-aware. |
| Icon SVGs for copy/check states | Inline SVG strings | `Copy` and `Check` from `lucide-react` | `lucide-react` is already installed. Icons are sized correctly with `size` prop. No SVG hand-coding. |
| Prev/next ordering logic | Custom date comparison | `getAllPosts()` (already sorted) | `lib/blog.ts` already returns posts sorted by date descending. `getAdjacentPosts` only needs `findIndex` on the pre-sorted array — no re-sorting. |

**Key insight:** All three features in this phase compose existing infrastructure. The pattern is: extend what exists (add functions to `lib/blog.ts`, add components to `mdx-components.tsx`, add plugins to `next.config.mjs`) rather than introduce new systems.

---

## Common Pitfalls

### Pitfall 1: `raw` Prop Not Appearing on `pre` Element

**What goes wrong:** The custom `pre` component in `mdx-components.tsx` receives `raw` as `undefined` even though `postProcess` was added. The `CopyButton` renders nothing (the `{raw && <CopyButton>}` guard silently prevents rendering).

**Why it happens:** The plugin ordering in `rehypePlugins` is wrong — `postProcess` runs before `rehype-pretty-code` instead of after, so it promotes `node.raw` before it was set by `preProcess`. OR `preProcess` runs after `rehype-pretty-code` when the tokenized `<span>` children make `codeEl.children?.[0]?.value` undefined.

**How to avoid:** The required order is `[preProcess, [rehypePrettyCode, opts], postProcess]`. `preProcess` must be first (to capture raw text before tokenization), `postProcess` must be last (to promote after tokenization is done).

**Warning signs:** CopyButton never renders (check if `raw` prop is undefined via a debug `console.log` in the `pre` component during dev). No copy button visible on any code block.

### Pitfall 2: TypeScript Error on `raw` Prop in `pre` Override

**What goes wrong:** TypeScript complains that `raw` is not a valid property of `React.ComponentPropsWithoutRef<'pre'>`. The build fails.

**Why it happens:** `raw` is a custom prop injected by the rehype plugin — it is not part of the HTML `<pre>` element spec, so the standard React type definition does not include it.

**How to avoid:** Type the `pre` override function signature explicitly with an intersection type:
```typescript
pre: ({ children, raw, ...props }: React.ComponentPropsWithoutRef<'pre'> & { raw?: string }) => (...)
```
The `?` makes it optional — required because code blocks generated by content that does NOT go through `rehype-pretty-code` (inline code) will not have `raw`.

**Warning signs:** TypeScript error during `next build --webpack` referencing `raw` property not existing on HTMLPreElement type.

### Pitfall 3: Callout Content Inherits Unwanted Prose Styles

**What goes wrong:** Content inside `<Info>` / `<Warning>` / `<Tip>` is wrapped by the `prose prose-invert` container from the post page. Prose adds margins to `<p>` tags inside the callout, causing unintended spacing.

**Why it happens:** The `@tailwindcss/typography` `prose` class applies `margin-top` and `margin-bottom` to all `p` descendants, including those inside callout components.

**How to avoid:** Apply `[&>p]:m-0` or `[&>p]:my-0` to the inner content div of callout components to reset prose-applied margins. Alternatively, wrap the callout component div with the `not-prose` class to opt out of typography styles entirely. Recommendation: use `not-prose` on the outer callout wrapper for clean isolation.

**Warning signs:** Excessive vertical space inside callout boxes; first and last `<p>` inside the callout have extra top/bottom margins inconsistent with the callout's padding.

### Pitfall 4: Double Filesystem Read for Adjacent Posts

**What goes wrong:** `getAdjacentPosts(slug)` internally calls `getAllPosts()`, which reads the filesystem. The page component also called `getAllPosts()` to check `allPosts.length >= 3`. Two filesystem reads per page render at build time — not a runtime error but an unnecessary performance cost.

**Why it happens:** `getAllPosts()` is not memoized or cached. Each call reads all `.mdx` files from disk.

**How to avoid:** In the page component, call `getAllPosts()` once. Pass the pre-fetched array to `getAdjacentPosts(slug, posts)`:
```typescript
// lib/blog.ts — preferred signature
export function getAdjacentPosts(slug: string, posts: PostMeta[]): { prev: PostMeta | null; next: PostMeta | null }
```
Or, if the function signature cannot change, accept the overhead since it is build-time-only (not server runtime per-request).

**Warning signs:** Slightly slower builds when many `.mdx` files exist. Not a user-visible bug.

### Pitfall 5: Navigation Appears When Fewer Than 3 Posts Exist

**What goes wrong:** Prev/next navigation appears when only 1 or 2 posts exist — one-sided navigation (e.g., only a "Next" link with no "Prev"). This satisfies BLE-03's condition mechanically but the success criterion states navigation appears only when 3 or more posts exist.

**Why it happens:** The `allPosts.length >= 3` gate was placed in the page component but `PostNavigation` does not enforce it — it just renders whatever `prev`/`next` it receives.

**How to avoid:** Apply the guard in the page component: `const adjacent = allPosts.length >= 3 ? getAdjacentPosts(slug) : { prev: null, next: null }`. When `PostNavigation` receives both as `null`, it returns `null` (no render).

**Warning signs:** Navigation appears on a blog with 2 posts; one direction is empty/broken.

---

## Code Examples

Verified patterns from official and community sources:

### Complete `preProcess` + `postProcess` Plugins

```typescript
// Source: ClarityDev blog (claritydev.net/blog/copy-to-clipboard-button-nextjs-mdx-rehype)
// Source: tybarho.com/articles/adding-a-copy-button-mdx-code-snippets
// next.config.mjs — import visit at top level
import { visit } from 'unist-util-visit'

const preProcess = () => (tree) => {
  visit(tree, (node) => {
    if (node?.type === 'element' && node?.tagName === 'pre') {
      const [codeEl] = node.children
      if (codeEl?.tagName !== 'code') return
      node.raw = codeEl.children?.[0]?.value ?? ''
    }
  })
}

const postProcess = () => (tree) => {
  visit(tree, 'element', (node) => {
    if (node?.type === 'element' && node?.tagName === 'pre') {
      node.properties['raw'] = node.raw
    }
  })
}
```

### Complete `CopyButton` Component

```typescript
// components/blog/CopyButton.tsx
'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable (non-HTTPS, iframe restriction, permission denied)
    }
  }

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
      className="absolute top-3 right-3 p-1.5 text-muted hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
    >
      {copied
        ? <Check size={14} className="text-accent" />
        : <Copy size={14} />
      }
    </button>
  )
}
```

### Updated `pre` Override in `mdx-components.tsx`

```typescript
// mdx-components.tsx — replace existing pre override
import { CopyButton } from '@/components/blog/CopyButton'

// Inside useMDXComponents():
pre: ({ children, raw, ...props }: React.ComponentPropsWithoutRef<'pre'> & { raw?: string }) => (
  <div className="relative group my-6">
    <pre className="bg-surface p-4 overflow-x-auto text-sm" {...props}>
      {children}
    </pre>
    {raw != null && <CopyButton text={raw} />}
  </div>
),
```

### Complete Callout Components

```typescript
// components/blog/callouts.tsx
import type { ReactNode } from 'react'

interface CalloutProps {
  children: ReactNode
  label: string
  borderColor: string
  labelColor: string
}

function Callout({ children, label, borderColor, labelColor }: CalloutProps) {
  return (
    <div className={`not-prose border-l-2 ${borderColor} bg-surface px-5 py-4 my-6`}>
      <p className={`text-[9px] font-black uppercase tracking-[0.4em] ${labelColor} mb-3`}>
        {label}
      </p>
      <div className="text-sm text-white/80 leading-relaxed">
        {children}
      </div>
    </div>
  )
}

export function Info({ children }: { children: ReactNode }) {
  return <Callout label="Info" borderColor="border-white/30" labelColor="text-white/50">{children}</Callout>
}

export function Warning({ children }: { children: ReactNode }) {
  return <Callout label="Warning" borderColor="border-accent" labelColor="text-accent">{children}</Callout>
}

export function Tip({ children }: { children: ReactNode }) {
  return <Callout label="Tip" borderColor="border-white/15" labelColor="text-muted">{children}</Callout>
}
```

### `getAdjacentPosts` Function for `lib/blog.ts`

```typescript
// lib/blog.ts — add after getPostBySlug
export function getAdjacentPosts(
  slug: string,
  posts?: PostMeta[]
): { prev: PostMeta | null; next: PostMeta | null } {
  const allPosts = posts ?? getAllPosts() // reuse pre-fetched if available
  const index = allPosts.findIndex(p => p.slug === slug)

  if (index === -1) return { prev: null, next: null }

  // allPosts is newest-first. index+1 is older (prev); index-1 is newer (next).
  return {
    prev: index < allPosts.length - 1 ? allPosts[index + 1] : null, // older post
    next: index > 0 ? allPosts[index - 1] : null,                    // newer post
  }
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `document.execCommand('copy')` | `navigator.clipboard.writeText()` | ~2020 (Clipboard API standardized) | `execCommand` is deprecated in all major browsers. `clipboard.writeText` is async, permission-model-aware, and works in all modern contexts. |
| Copy button via `innerText` extraction in `useEffect` | Server-side raw text extraction via rehype plugin | 2022-2023 (community best practice) | Plugin approach ships less client JS and correctly extracts the pre-highlight text (not the tokenized span content). Preferred when using rehype-pretty-code. |
| Callout components as `remark-directive` plugins | Named JSX components in `mdx-components.tsx` | N/A for this stack — `@next/mdx` does not bundle directive support by default | Direct JSX components are simpler to implement and debug for a project of this size. `remark-directive` adds another plugin to the pipeline unnecessarily. |

**Deprecated/outdated:**
- `@rehype-pretty/transformers` copy button: Listed in rehype-pretty-code docs as experimental. Adds a dependency; the two-plugin custom approach is equally simple and gives more control over styling.
- `react-copy-to-clipboard` package: Unmaintained wrapper around deprecated `execCommand`. Never use for new projects.

---

## Open Questions

1. **Will `preProcess` capture code from all code blocks, including those without a language specifier?**
   - What we know: The `preProcess` plugin visits all `<pre>` nodes regardless of the language attribute. `rehype-pretty-code` wraps both language-specified and plain code blocks.
   - What's unclear: Whether plain `\`\`\`` code blocks (no language) are processed differently by rehype-pretty-code in a way that changes the node structure.
   - Recommendation: Test with both `\`\`\`typescript` and plain `\`\`\`` in the seed post. If plain blocks produce `undefined` raw, add a fallback `?? ''` guard (already included in the pattern above).

2. **Does the `not-prose` class work correctly in Tailwind v4?**
   - What we know: `@tailwindcss/typography` provides a `not-prose` utility to opt children out of prose styling. This exists in v3.
   - What's unclear: Whether `not-prose` is implemented as a CSS class or a `@utility` in the Tailwind v4 typography plugin version (`^0.5.19`).
   - Recommendation: Test by rendering a callout component inside a prose block. If `not-prose` does not prevent margin inheritance, use `[&>p]:m-0` on the callout's inner div as a fallback.

3. **Are there MDX files with multi-line code that `codeEl.children?.[0]?.value` does not capture completely?**
   - What we know: For single-language, multi-line code blocks, the entire raw content is in `codeEl.children[0].value` as a single text string.
   - What's unclear: Whether any remark plugin earlier in the pipeline (e.g., `remark-gfm`) transforms code node children into multiple text nodes.
   - Recommendation: Verify by logging `node.raw` in `preProcess` during a dev build on the existing seed post (which has multi-line TypeScript code blocks).

---

## Sources

### Primary (HIGH confidence)
- [ClarityDev blog: Copy to Clipboard Button In MDX with Next.js and Rehype Pretty Code](https://claritydev.net/blog/copy-to-clipboard-button-nextjs-mdx-rehype) — two-plugin preProcess/postProcess pattern with verified code, custom pre component approach
- [tybarho.com: Add a copy button to your Rehype (NextJS / MDX) code snippets](https://www.tybarho.com/articles/adding-a-copy-button-mdx-code-snippets) — full implementation code verified against the ClarityDev approach, confirms plugin ordering requirement
- [rehype-pretty.pages.dev official docs](https://rehype-pretty.pages.dev/) — confirmed `data-rehype-pretty-code-figure` attribute structure, transformers API
- Phase 2 Research doc (`.planning/phases/02-blog-infrastructure/02-RESEARCH.md`) — existing stack, unist-util-visit already installed, `--webpack` build requirement, `mdx-components.tsx` pattern
- Codebase inspection: `mdx-components.tsx`, `lib/blog.ts`, `next.config.mjs`, `app/insights/[slug]/page.tsx`, `components/blog/PostCard.tsx`, `components/blog/TagFilter.tsx`, `package.json` — verified all dependencies present, existing component patterns, AXIONLAB design conventions

### Secondary (MEDIUM confidence)
- [easonchang.com: Adding Copy Button to Code Blocks](https://easonchang.com/posts/code-copy-button) — alternative DOM-based approach (via `pre.innerText`); confirmed the plugin approach is superior for this codebase
- [WebSearch: navigator.clipboard in Next.js 2025](https://sniplates.nakobase.com/en/recipes/next-js/copy-to-clipboard) — confirms `'use client'` requirement, `async/await` pattern, error handling for non-HTTPS contexts
- [WebSearch: MDX prev/next blog navigation patterns](https://www.yourtechpilot.com/blog/building-mdx-blog-nextjs) — confirms Server Component pattern for navigation using `next/link`

### Tertiary (LOW confidence)
- WebSearch: `remark-directive` as callout alternative — not used; confirmed direct JSX component approach is simpler for this stack

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies; all existing packages verified in node_modules and package.json
- Architecture: HIGH — two-plugin rehype pattern is verified across multiple independent sources; callout and nav patterns are straightforward React
- Pitfalls: HIGH — TypeScript typing of `raw` prop, plugin ordering, and prose inheritance are all verified failure modes from community sources

**Research date:** 2026-03-08
**Valid until:** 2026-06-08 (stable patterns — rehype-pretty-code at 0.14.3 has not changed significantly; Clipboard API is a W3C standard)
