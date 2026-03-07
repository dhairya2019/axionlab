# Technology Stack

**Analysis Date:** 2026-03-07

## Languages

**Primary:**
- TypeScript 5.5.4 - Frontend application code, type safety
- JavaScript - API handlers in `/api/`

**Secondary:**
- HTML5 - Static markup in `index.html`
- CSS3 - Tailwind and inline styles

## Runtime

**Environment:**
- Node.js (inferred from package.json) - For development and API execution

**Package Manager:**
- npm - Specified in `package.json` (version 1.0.0)
- Lockfile: Not detected in analysis

## Frameworks

**Core:**
- React 19.0.0 - Frontend UI library
- Vite 7.3.1 - Build tool and development server

**Styling:**
- Tailwind CSS 3.4.7 - Utility-first CSS framework
- PostCSS 8.4.40 - CSS processor with autoprefixer
- Autoprefixer 10.4.20 - Vendor prefix automation

**UI/Animation:**
- Framer Motion 12.34.0 - React animation library
- Lucide React 0.424.0 - Icon library component set

**Type System:**
- TypeScript 5.5.4 - Static type checking
- @types/react 18.3.3 - React type definitions
- @types/react-dom 18.3.0 - React DOM type definitions
- @types/node 20.14.12 - Node.js type definitions

**Build/Dev:**
- @vitejs/plugin-react 5.1.4 - Vite React plugin for JSX processing

## Key Dependencies

**Critical:**
- React - Core rendering engine
- React DOM - DOM rendering for React applications
- Vite - Modern bundler and development server

**Utilities:**
- clsx 2.1.1 - Conditional CSS class concatenation
- tailwind-merge 2.4.0 - Merge Tailwind CSS classes intelligently

**External Services:**
- @google/genai 1.41.0 - Google Gemini AI API SDK
- @sendgrid/mail 8.1.6 - SendGrid email delivery SDK

## Configuration

**Environment:**
- Variables required: `SENDGRID_API_KEY`, `API_KEY` (for Gemini)
- Documented in `/api/chat.js` and `/api/send-email.js`

**Build:**
- `vite.config.ts` - Build configuration with React plugin
- `tsconfig.json` - TypeScript compiler options
- `tailwind.config.js` - Tailwind CSS customization (dark theme with accent colors)
- `index.html` - Entry point with Tailwind CDN (cdn.tailwindcss.com) and import map

**Vite Configuration:**
- Output directory: `dist`
- Source maps: disabled in production
- Minification: esbuild
- Dev server port: 3000
- Manual vendor chunking for react/react-dom

## Platform Requirements

**Development:**
- Node.js runtime
- npm package manager
- Browser with ES2020+ support

**Production:**
- Vercel deployment (as indicated by `vercel.json`)
- Node.js runtime for API handlers
- Environment variables: `SENDGRID_API_KEY`, `API_KEY`

**Deployment Configuration:**
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Framework auto-detect by Vercel

## Scripts

```bash
npm run dev      # Start development server on port 3000
npm run build    # Build for production (Vite)
npm run preview  # Preview production build locally
```

---

*Stack analysis: 2026-03-07*
