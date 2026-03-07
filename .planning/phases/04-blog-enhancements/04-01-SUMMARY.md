# Summary: 04-01 — Copy-to-Clipboard + Callout Components

## What was done

1. **CopyButton client component** (`components/blog/CopyButton.tsx`): `'use client'` component using `navigator.clipboard.writeText()` with Copy/Check icon toggle (lucide-react). Hidden by default, appears on hover via `opacity-0 group-hover:opacity-100`.

2. **Rehype raw-code extraction** (`next.config.mjs`): Single `addRawToCodeBlocks` plugin runs AFTER rehype-pretty-code. Reconstructs raw text from tokenized `<span>` children using recursive `extractText()`. Sets `raw` property on `<pre>` node.

3. **Updated pre override** (`mdx-components.tsx`): Wraps `<pre>` in `relative group` div, renders `CopyButton` when `raw` prop exists. TypeScript intersection type for custom `raw` prop.

4. **Callout components** (`components/blog/callouts.tsx`): `Info`, `Warning`, `Tip` — private `Callout` base with AXIONLAB styling (no border-radius, left border, surface bg, uppercase label). Registered globally in `useMDXComponents()`.

## Key decisions

- **Single post-RPC plugin instead of pre/post pattern**: rehype-pretty-code v0.14+ wraps in `<figure>` and replaces node properties, causing the documented preProcess/postProcess pattern to lose the stored raw text. The `extractText()` approach reconstructs raw code from tokenized spans after RPC runs — simpler and more robust.
- **`not-prose` on callout wrapper**: Isolates from `@tailwindcss/typography` prose margins.

## Commit

`2013a0c` — feat: add copy-to-clipboard, callout components, and post navigation
