# Codebase Structure

**Analysis Date:** 2026-03-07

## Directory Layout

```
axionlab/
├── index.tsx                    # Entry point, root routing logic
├── App.tsx                      # Deprecated, see index.tsx
├── app/                         # Page components (file-based organization)
│   ├── page.tsx                 # Home page
│   ├── layout.tsx               # Root layout wrapper (legacy Next.js style)
│   ├── globals.css              # Global styles and Tailwind imports
│   ├── capabilities/page.tsx     # Services page
│   ├── careers/page.tsx          # Careers page
│   ├── insights/page.tsx         # Blog/insights page
│   ├── philosophy/page.tsx       # Company philosophy page
│   ├── work/page.tsx             # Portfolio/case studies page
│   └── initiate/page.tsx         # Contact/onboarding form page
├── components/                  # Reusable UI components
│   ├── Nav.tsx                  # Navigation bar (desktop + mobile)
│   ├── Navbar.tsx               # Deprecated nav variant
│   ├── Footer.tsx               # Footer with links
│   ├── Chatbot.tsx              # AI chat widget
│   ├── Contact.tsx              # Contact form component
│   ├── Hero.tsx                 # Hero section (unused currently)
│   ├── CTA.tsx                  # Call-to-action component
│   ├── Services.tsx             # Services list (unused)
│   ├── Technologies.tsx         # Tech stack display (unused)
│   ├── Portfolio.tsx            # Portfolio grid (unused)
│   ├── Clients.tsx              # Client logos (unused)
│   └── Process.tsx              # Process steps (unused)
├── api/                         # Serverless API endpoints (Vercel)
│   ├── chat.js                  # POST endpoint for AI chat
│   └── send-email.js            # POST endpoint for email dispatch
├── public/                      # Static assets
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS theme configuration
├── vite.config.ts               # Vite build configuration
├── vite.config.js               # Alternative Vite config (duplicate)
├── vercel.json                  # Vercel deployment config
├── postcss.config.js            # PostCSS config for Tailwind
└── .planning/                   # GSD planning documents
    └── codebase/                # This directory
```

## Directory Purposes

**`app/`:**
- Purpose: Page components representing routes accessible via hash navigation
- Contains: TSX page files, globals.css with Tailwind imports, layout wrapper
- Key files: `page.tsx` (all routes), `globals.css` (styling), `layout.tsx` (legacy)

**`components/`:**
- Purpose: Reusable UI components and sections
- Contains: React components with animation, form handling, navigation
- Key files: `Nav.tsx` (navigation), `Chatbot.tsx` (AI widget), `Footer.tsx`, `Contact.tsx`

**`api/`:**
- Purpose: Serverless API endpoints running on Vercel
- Contains: JavaScript handler functions for external service integration
- Key files: `chat.js` (Gemini + email), `send-email.js` (SendGrid)

**`public/`:**
- Purpose: Static assets served directly
- Contains: Images, favicons, other public files
- Key files: favicon, logos (if any)

## Key File Locations

**Entry Points:**
- `index.tsx`: Main React entry point, root App component, routing logic
- `vite.config.ts` / `vite.config.js`: Build configuration
- `vercel.json`: Deployment routing and rewrites

**Configuration:**
- `tsconfig.json`: TypeScript compiler options, React JSX
- `package.json`: Dependencies, build/dev scripts
- `tailwind.config.js`: Custom colors (background, accent, muted, surface)
- `vite.config.ts`: Dev server port (3000), build output (dist), vendor chunking
- `postcss.config.js`: PostCSS processing for Tailwind

**Core Logic:**
- `index.tsx`: Hash routing, event delegation for links, currentPath state
- `api/chat.js`: Gemini API calls, tool execution, email dispatch via SendGrid
- `api/send-email.js`: Email sending to support and user via SendGrid

**Styling:**
- `app/globals.css`: Tailwind imports, custom font loading, root CSS variables
- `tailwind.config.js`: Theme colors and custom utilities

**Navigation:**
- `components/Nav.tsx`: Sticky navigation bar with mobile menu, active route highlighting

## Naming Conventions

**Files:**
- Page components: `app/[route]/page.tsx` (e.g., `app/work/page.tsx`)
- React components: PascalCase `components/ComponentName.tsx`
- API endpoints: camelCase with hyphens `api/endpoint-name.js`
- Configuration: lowercase `tailwind.config.js`, `vite.config.ts`

**Directories:**
- Feature folders: lowercase `app/capabilities/`, `app/philosophy/`
- Component folder: lowercase `components/`
- API folder: lowercase `api/`

**Exports:**
- Named exports: Most components use `export default function ComponentName()`
- Chatbot: Named export `export const Chatbot: React.FC`
- Contact: Named export `export const Contact: React.FC`

## Where to Add New Code

**New Feature:**
- Primary code: `app/[feature]/page.tsx` for new page routes
- Shared UI: `components/SharedComponent.tsx` for reusable sections
- Tests: No test directory; add alongside component if needed

**New Component/Module:**
- Implementation: `components/ComponentName.tsx`
- If section-specific: Place in `app/[section]/components/` subdirectory
- Export pattern: `export default function ComponentName()` or `export const ComponentName`

**Utilities:**
- Shared helpers: Create `lib/` or `utils/` directory at project root
- API helpers: Add to `api/` directory as new `.js` files

**New API Endpoint:**
- Location: `api/endpoint-name.js`
- Pattern: Default export async function `handler(req, res)`
- Framework: Vercel serverless functions (Node.js)

**Styling:**
- Global styles: Add to `app/globals.css`
- Component styles: Use Tailwind className in TSX (no CSS-in-JS)
- Theme colors: Reference in `tailwind.config.js` (background, accent, muted, surface)

## Special Directories

**`api/`:**
- Purpose: Serverless endpoint handlers
- Generated: No (manually written)
- Committed: Yes
- Runtime: Node.js on Vercel
- Pattern: `export default async function handler(req, res)`

**`dist/`:**
- Purpose: Built/compiled output
- Generated: Yes (via `npm run build`)
- Committed: No (in .gitignore)

**`node_modules/`:**
- Purpose: Installed dependencies
- Generated: Yes (via `npm install`)
- Committed: No (in .gitignore)

**`.next/`:**
- Purpose: Next.js build cache (if Next.js used)
- Generated: Yes
- Committed: No

**`.planning/`:**
- Purpose: GSD codebase analysis and planning documents
- Generated: Yes (via GSD agent)
- Committed: Yes

## Routing Structure

**Hash-Based Routes:**
- `/` → `app/page.tsx` (Home)
- `/philosophy` → `app/philosophy/page.tsx`
- `/capabilities` → `app/capabilities/page.tsx`
- `/work` → `app/work/page.tsx`
- `/insights` → `app/insights/page.tsx`
- `/careers` → `app/careers/page.tsx`
- `/initiate` → `app/initiate/page.tsx`

**Anchor Routes (In-Page):**
- `#systems` → Scroll to element with id="systems" on home page
- `#contact` → Scroll to contact section

**External/API Routes:**
- `mailto:support@axionlab.in` → Email client
- `https://calendly.com/axionlab-session` → External Calendly page

**API Routes:**
- `POST /api/chat` → AI chat endpoint
- `POST /api/send-email` → Email dispatch endpoint

## Import Path Conventions

**Absolute paths (via Vite):**
- `import Home from './app/page'` (within project)
- `import { Chatbot } from './components/Chatbot'` (component exports)
- `import { GoogleGenAI } from '@google/genai'` (external packages)
- `import sgMail from '@sendgrid/mail'` (external packages)

**No path aliases configured** - uses relative imports throughout

## Deprecated Code

**`App.tsx`:**
- Marked with comment: "Deprecated. Unified entry point is now index.tsx."
- Can be removed in cleanup phase

**`components/Navbar.tsx`:**
- Alternative nav variant, replaced by `components/Nav.tsx`
- Likely candidate for removal

**Page components with no visible usage:**
- `components/Hero.tsx`
- `components/Services.tsx`
- `components/Technologies.tsx`
- `components/Portfolio.tsx`
- `components/Clients.tsx`
- `components/Process.tsx`
- `app/layout.tsx` (legacy Next.js pattern, not active)

---

*Structure analysis: 2026-03-07*
