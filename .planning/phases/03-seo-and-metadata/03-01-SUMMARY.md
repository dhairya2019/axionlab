# Summary: 03-01 — Root Layout Metadata + robots.ts + Static Page Metadata

## What was done

1. **Root layout metadata** (`app/layout.tsx`): Added `metadataBase: new URL('https://axionlab.in')`, title template `'%s | AXIONLAB'`, default description, OpenGraph (`siteName`, `type: 'website'`, `locale: 'en_US'`), and Twitter card defaults.

2. **robots.ts** (`app/robots.ts`): Created programmatic robots.txt — allows all user agents, references sitemap at `https://axionlab.in/sitemap.xml`.

3. **5 Server Component page metadata exports**: Added unique `metadata` exports with title, description, full OpenGraph (title, description, url, type), and Twitter card to:
   - `app/philosophy/page.tsx` — "Philosophy | AXIONLAB"
   - `app/capabilities/page.tsx` — "Capabilities | AXIONLAB"
   - `app/work/page.tsx` — "Work | AXIONLAB"
   - `app/insights/page.tsx` — "Insights | AXIONLAB"
   - `app/careers/page.tsx` — "Careers | AXIONLAB"

## Key decisions

- Each page's `openGraph` is self-contained (not relying on root layout merge) because Next.js shallow-merges OG objects — child replaces parent entirely.
- Title template handles the "| AXIONLAB" suffix automatically for child pages.

## Commit

`2311f6a` — feat: add per-page SEO metadata, metadataBase, title template, and robots.ts
