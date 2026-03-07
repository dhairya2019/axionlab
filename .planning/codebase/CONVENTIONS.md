# Coding Conventions

**Analysis Date:** 2026-03-07

## Naming Patterns

**Files:**
- PascalCase for components: `Hero.tsx`, `Navbar.tsx`, `Contact.tsx`, `Services.tsx`, `Chatbot.tsx`
- camelCase for utilities/helpers: `vite.config.ts`, `tailwind.config.js`
- kebab-case for API routes: `send-email.js`, `chat.js`

**Functions:**
- camelCase for regular functions: `handleSend`, `handleSubmit`, `scrollToSection`, `renderPage`
- PascalCase for React components: `Hero`, `Navbar`, `Services`, `Contact`
- PascalCase for exported component constants: `LINKS`, `SERVICE_ITEMS`

**Variables:**
- camelCase for local variables and state: `isOpen`, `messages`, `input`, `isLoading`, `scrolled`, `mobileMenuOpen`, `errorMessage`
- SCREAMING_SNAKE_CASE for constants arrays: `LINKS`, `SERVICE_ITEMS`
- camelCase for object properties: `userName`, `userEmail`, `company`, `scope`, `priority`

**Types:**
- PascalCase for interfaces: `NavbarProps`, `Message`
- Use React.FC for functional component typing
- Explicit type unions: `'idle' | 'sending' | 'success' | 'error'`

**CSS Classes:**
- Tailwind utility-first throughout. No custom CSS class definitions observed except in `globals.css`
- Custom CSS classes follow kebab-case in style blocks: `chatEnter`, `scrollbar-hide`
- Theme colors use semantic naming: `background`, `accent`, `muted`, `surface`

## Code Style

**Formatting:**
- No ESLint or Prettier config files detected
- 2-space indentation (inferred from package.json structure)
- Semicolons used consistently throughout
- Double quotes for strings

**Linting:**
- No eslintrc or formatting config detected
- Code follows consistent patterns but no enforced linter

**TypeScript Configuration:**
- `tsconfig.json` with strict mode enabled: `"strict": true`
- JSX mode: `"jsx": "react-jsx"`
- ES modules: `"module": "ESNext"`
- Source maps disabled in production build

## Import Organization

**Order:**
1. React imports: `import React from 'react'`
2. Third-party library imports: `import { component } from 'library'`
3. Local component imports: `import ComponentName from '@/components/ComponentName'`
4. Type imports (if separated)

**Examples from codebase:**
- `components/Chatbot.tsx`: React first, then lucide-react icons, then local state
- `app/page.tsx`: React, then motion, then ArrowRight
- `index.tsx`: React hooks first, then page imports, then component imports

**Path Aliases:**
- Not used in current codebase. All imports use relative or absolute paths.
- TypeScript `tsconfig.json` configured but no path aliases defined.

## Error Handling

**Patterns:**
- Try-catch blocks with `error: any` type annotation: `catch (error: any) { ... }`
- Explicit error message extraction: `error.message || 'fallback message'`
- Specific error classification: `error.name === 'AbortError'` vs generic errors
- Status state management for async operations: `'idle' | 'sending' | 'success' | 'error'`
- User-friendly error messages displayed to UI
- Console.error for server-side logging: `console.error("Chat Fault:", error)`

**Examples:**
- `Chatbot.tsx`: Timeout handling with AbortController, distinguishes abort errors from connection errors
- `Contact.tsx`: Try-catch with specific error message handling and UI state feedback
- `api/chat.js`: Validates missing API keys, handles SendGrid failures gracefully
- `api/send-email.js`: Returns structured error objects to frontend

## Logging

**Framework:** console (browser console for frontend, Node.js console for API)

**Patterns:**
- Prefixed console errors: `console.error("Chat Fault:", error)`, `console.error("Transmission Error:", error)`
- Server-side prefixed logs: `console.error('Logic Error:', error)`, `console.error('SendGrid Error:', error.response?.body || error)`
- No structured logging framework (Pino, Winston, etc.) detected
- Errors logged with context labels for easier debugging

## Comments

**When to Comment:**
- Minimal comments in codebase
- Comments used only for critical logic or deprecation notices
- Example: `// Deprecated. Unified entry point is now index.tsx.` in `App.tsx`
- Complex calculations have inline variable explanations (e.g., offset calculation in scroll functions)

**JSDoc/TSDoc:**
- Not extensively used
- No JSDoc blocks observed in components
- Interface descriptions are inline: `interface NavbarProps { ... }`

## Function Design

**Size:**
- Functions range from 10-50 lines
- Complex components (Chatbot, Contact) up to 180+ lines including JSX
- Smaller utility functions for scroll handling, status management

**Parameters:**
- Prefer object destructuring for component props: `{ scrolled, onStartProject }`
- Callbacks passed as props: `onStartProject: () => void`
- Simple event handlers use event parameter: `(e: React.FormEvent)`, `(e: MouseEvent)`

**Return Values:**
- React components return JSX directly
- Event handlers typically return void or implicitly return undefined
- Async functions return Promises with explicit typing
- Early returns for guard clauses: `if (!trimmedInput || isLoading) return;`

## Module Design

**Exports:**
- Named exports for components: `export const Hero: React.FC = () => { ... }`
- Default exports for page components: `export default function Home() { ... }`
- Both patterns used interchangeably depending on context
- API route handlers use `export default async function handler(req, res) { ... }`

**Barrel Files:**
- Not used in current structure
- Each component file stands alone
- No index.ts files for grouped exports

## Component Architecture Patterns

**Functional Components:**
- All components are functional (no class components)
- Use React hooks: `useState`, `useRef`, `useEffect`, `useCallback`
- Props typed with interfaces: `React.FC<ComponentProps>`

**State Management:**
- Local component state with `useState`
- No Redux, Zustand, or Context API detected
- Form state managed per component: email, message, input, status

**Data Flow:**
- Props passed top-down from pages to components
- Callback functions for parent communication: `onStartProject`, `onClick`
- Event handlers manage local state changes

**Custom Hooks:**
- No custom hooks detected
- Hooks used directly from React library

## Tailwind CSS Conventions

**Theme Integration:**
- Custom colors in `tailwind.config.js`: `background`, `accent`, `muted`, `surface`
- Font family extension: `sans: ["Inter", "sans-serif"]`, `condensed: ["Inter Tight", "sans-serif"]`
- Custom letter spacing: `letterSpacing: { tighter: "-0.04em" }`
- Border radius forced to 0 by default: `borderRadius: { none: "0px" }`

**Utility Class Patterns:**
- Gradient text used extensively: `text-gradient-title`
- Glass morphism classes: `glass-panel`, `glass-sphere`
- Shadow utilities for depth: `shadow-neon`, `shadow-[...]`
- Animation utilities: `animate-ping`, `animate-spin`, `animate-float`, `animate-bounce`
- Responsive prefixes used: `md:`, `lg:`, `sm:`, `xl:`

## Async/Await Patterns

**Fetch Operations:**
- Fetch API with explicit error handling
- AbortController for request timeouts: `new AbortController()` with timeout
- Response validation: `if (!response.ok) { throw new Error(...) }`
- JSON parsing with fallback: `await response.json().catch(() => ({}))`

**Promise Handling:**
- `Promise.all([...])` for parallel operations: `sgMail.send(agencyMsg), sgMail.send(userMsg)`
- Async function declarations with clear try-catch-finally blocks
- `setTimeout` for delayed state resets (form validation, UI feedback)

---

*Convention analysis: 2026-03-07*
