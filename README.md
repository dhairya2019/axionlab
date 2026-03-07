# AXIONLAB

Independent systems engineering lab. Commerce infrastructure, AI agent orchestration, and high-performance applications.

**Live:** [axionlab.in](https://axionlab.in)

## Stack

- **Framework:** Next.js 16 (App Router, SSG)
- **Styling:** Tailwind CSS v4 via PostCSS
- **Blog:** MDX with rehype-pretty-code syntax highlighting
- **Fonts:** Inter + Inter Tight via next/font
- **Animation:** Framer Motion v12
- **AI Chatbot:** Gemini API (serverless function)
- **Deployment:** Vercel (free plan, static export)

## Project Structure

```
app/                    # Next.js App Router pages
  api/chat/             # Gemini AI chatbot endpoint
  api/send-email/       # SendGrid contact form endpoint
  insights/             # Blog listing + [slug] post pages
  philosophy/           # Static marketing pages
  capabilities/
  work/
  careers/
  initiate/             # Contact/project initiation form
components/
  blog/                 # PostCard, TagFilter, CopyButton, PostNavigation, callouts
  motion/               # Framer Motion wrapper (use client boundary)
content/blog/           # MDX blog posts (drop files here to publish)
lib/blog.ts             # Post metadata, sorting, adjacent post utilities
mdx-components.tsx      # Global MDX component overrides
```

## Development

```bash
npm install
npm run dev          # starts Next.js dev server (webpack mode)
npm run build        # production build
```

**Environment variables** (set in `.env.local` for dev, Vercel dashboard for prod):

```
GEMINI_API_KEY=      # Google Gemini API key for chatbot
SENDGRID_API_KEY=    # SendGrid API key for contact form
GEMINI_MODEL=        # Optional, defaults to gemini-2.0-flash
```

## Writing Blog Posts

Create an `.mdx` file in `content/blog/`:

```mdx
---
title: "Your Post Title"
date: "2026-03-08"
description: "Brief description for SEO and listing cards."
tags: ["systems", "performance"]
author: "AXIONLAB"
---

Your markdown content here. Supports:
- Syntax-highlighted code blocks (copy-to-clipboard built in)
- Custom callouts: <Info>, <Warning>, <Tip>
- GFM tables, links, images
```

Commit and push. Vercel auto-deploys.

## Design System

| Token | Value |
|-------|-------|
| Background | `#080808` |
| Accent | `#ff1f3d` |
| Surface | `#111111` |
| Muted | `#666666` |
| Border radius | `0px` (enforced) |
| Box shadow | None (enforced) |
| Headings | Uppercase, tight tracking |
