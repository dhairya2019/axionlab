# Architecture

**Analysis Date:** 2026-03-07

## Pattern Overview

**Overall:** Single-Page Application (SPA) with Client-Side Hash Routing

**Key Characteristics:**
- Hash-based routing (#/) for seamless navigation without page reloads
- React 19 with TSX components for UI
- Serverless API endpoints (Vercel) for email and AI chat
- Centralized navigation state managed at application root
- Global event delegation for link handling

## Layers

**Presentation Layer:**
- Purpose: Renders UI components and manages view state
- Location: `src/components/`, `src/app/`
- Contains: React components, page layouts, UI sections
- Depends on: No business logic, only styling via Tailwind
- Used by: App root component (`index.tsx`)

**Routing Layer:**
- Purpose: Manages client-side navigation via hash URLs
- Location: `index.tsx` (App component)
- Contains: Route mapping, hash change listeners, global click handlers
- Depends on: Window location object, React state
- Used by: All components that need navigation

**API Integration Layer:**
- Purpose: Handles communication with external services
- Location: `api/chat.js`, `api/send-email.js`
- Contains: Gemini AI client integration, SendGrid email dispatch
- Depends on: Google Generative AI SDK, SendGrid SDK, environment variables
- Used by: Chatbot component, form submissions

**Component Layer:**
- Purpose: Encapsulates feature-specific UI and logic
- Location: `components/`
- Contains: Chatbot, Navigation, Footer, Contact forms, Portfolio sections
- Depends on: Framer Motion for animations, Lucide React for icons
- Used by: Page components

**Page Layer:**
- Purpose: Assembles components into full-page views
- Location: `app/*/page.tsx`
- Contains: Home, Philosophy, Capabilities, Work, Insights, Careers, Initiate pages
- Depends on: Component layer, external data (systems classification)
- Used by: Routing layer for rendering

## Data Flow

**Chat Request Flow:**

1. User enters message in Chatbot component (`components/Chatbot.tsx`)
2. Chatbot sends POST to `/api/chat` with message and history
3. API endpoint (`api/chat.js`) calls Google Gemini API with system instruction
4. Gemini returns response, optionally triggering `sendEmailInquiry` tool
5. If tool called, API dispatches email via SendGrid to support and user
6. Response returned to Chatbot with `isSystem` flag for special rendering
7. Message appended to chat history in state

**Form Submission Flow:**

1. User fills initiate form on `/initiate` page (`app/initiate/page.tsx`)
2. Form data formatted into structured message string
3. POST to `/api/send-email` with email and message
4. API calls SendGrid to send to both support and user email addresses
5. Success state displayed with next-step CTA (Calendly)

**Page Navigation Flow:**

1. User clicks link with href `#/philosophy` or `#/capabilities`
2. Global click handler in `index.tsx` intercepts click
3. Handler extracts path from href, normalizes it
4. Updates window.location.hash and React state (currentPath)
5. Router switch statement in renderPage() returns correct component
6. Window scrolls to top, page unmounts old component and mounts new

**State Management:**
- Centralized in App component (`index.tsx`) via `currentPath` state
- Navigation via `navigate()` callback
- Component-level state for forms, modals, loading states
- No global state management library (Redux, Zustand)

## Key Abstractions

**NavLink Routing:**
- Purpose: Unified link handling across hash routes, anchors, and external links
- Examples: `href="#/work"`, `href="#systems"`, `href="https://..."`, `href="mailto:..."`
- Pattern: Event delegation in global click handler with href prefix detection

**Chatbot Agent:**
- Purpose: Represents AI concierge integrated with Gemini and email dispatch
- Examples: `components/Chatbot.tsx`
- Pattern: Tool-calling paradigm where AI can invoke `sendEmailInquiry` function

**Form Components:**
- Purpose: Controlled inputs with submission to serverless APIs
- Examples: `components/Contact.tsx`, `app/initiate/page.tsx`
- Pattern: Local state tracking, error handling, status states (idle/sending/success/error)

**Page Components:**
- Purpose: Full-screen views with branding, hero sections, content grids
- Examples: `app/page.tsx`, `app/work/page.tsx`
- Pattern: Use Framer Motion for entrance animations, static content with interactive CTAs

## Entry Points

**Browser Entry:**
- Location: `index.tsx`
- Triggers: App load, user opens URL
- Responsibilities: Root component, routing logic, event listeners, layout scaffolding

**API Endpoints:**

**`/api/chat`** (`api/chat.js`):
- Location: `api/chat.js`
- Triggers: POST from Chatbot component
- Responsibilities: Gemini AI inference, tool execution, email dispatch

**`/api/send-email`** (`api/send-email.js`):
- Location: `api/send-email.js`
- Triggers: POST from Contact form or Initiate form
- Responsibilities: Email transmission via SendGrid to support and user

## Error Handling

**Strategy:** Graceful degradation with user-facing status messages

**Patterns:**
- Network errors: Catch blocks in async/await with error message display
- API failures: Component state transitions to `error` state, user sees retry message
- Chat timeout: 15-second AbortController timeout with "TIMEOUT_ERROR" message
- Mail service unavailable: Fallback messaging directing user to email support directly
- Missing environment variables: JSON error responses at API layer

**Examples:**
- Chatbot (`components/Chatbot.tsx` lines 34-82): Timeout handling with AbortController
- API (`api/chat.js` lines 12-14, 73-98): Environment variable checks, try-catch wrapping

## Cross-Cutting Concerns

**Logging:**
- Console logging for debugging (error catches log to console)
- No structured logging framework
- API errors logged with error details

**Validation:**
- Form validation: HTML5 `required` attributes and input `type` checks
- Email format validation via `type="email"`
- No explicit validation library (Zod, Yup)

**Authentication:**
- No user authentication
- Email used as identifier for support inquiries
- API calls have no auth headers (public endpoints)

**Styling:**
- Tailwind CSS for responsive design
- Custom theme colors via `tailwind.config.js`: background (#0e0e0e), accent (#ff1f3d)
- Dark mode default, no light mode toggle
- No component-scoped styling (global Tailwind)

**Performance:**
- Code splitting: Vendor chunk separation (React/React-DOM) in build config
- Lazy component mounting: Only active page rendered at a time
- No image optimization framework
- Vite for fast dev server and optimized builds

---

*Architecture analysis: 2026-03-07*
