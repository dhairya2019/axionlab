# Testing Patterns

**Analysis Date:** 2026-03-07

## Test Framework

**Runner:**
- Not detected. No test runner configured (Jest, Vitest, etc.)
- No test configuration files (`jest.config.*`, `vitest.config.*`) present

**Assertion Library:**
- No assertion library detected (Chai, Vitest expect, Jest, etc.)

**Run Commands:**
- No test scripts in `package.json`
- Only available scripts: `dev`, `build`, `preview`
- Testing infrastructure: Not implemented

## Test File Organization

**Location:**
- No test files detected in codebase
- Glob search for `*.test.*` and `*.spec.*` returned zero results

**Naming:**
- No test file naming convention present
- Standard would be `ComponentName.test.tsx` or `ComponentName.spec.ts`

**Structure:**
- No test directory structure (`__tests__`, `tests`, `test`) present

## Test Structure

**Suite Organization:**
- Not applicable - no test files present

**Patterns:**
- No setup/teardown patterns observed
- No test utilities or helpers
- No fixture files

## Mocking

**Framework:**
- No mocking library configured (Jest Mock, Vitest Mock, MSW, etc.)

**Patterns:**
- Not applicable - no tests present

**What to Mock:**
- Would typically include: API fetch calls, browser APIs, external services (SendGrid, Google Gemini)
- Currently no mocking infrastructure

**What NOT to Mock:**
- Would typically include: React components, UI logic, local utilities

## Fixtures and Factories

**Test Data:**
- No test fixtures or data factories present
- `SERVICE_ITEMS` and `LINKS` constants in components serve as static data but not test fixtures

**Location:**
- Not applicable

## Coverage

**Requirements:**
- No coverage configured or enforced
- No coverage threshold targets defined

**View Coverage:**
- Not applicable

## Manual Testing Evidence

**Observable Testable Areas (Currently Manual):**

**1. Component Rendering - `components/Hero.tsx`:**
- Component exports without errors
- Smooth scroll functionality implemented
- Button click handlers for navigation

**2. Form Validation - `components/Contact.tsx`:**
- Email and message required fields
- Form submission via fetch to `/api/send-email`
- Status state transitions: `idle` → `sending` → `success` | `error`
- Success overlay display after 6 seconds

**3. Async API Handling - `components/Chatbot.tsx`:**
- Message input validation: `trimmedInput && !isLoading`
- Timeout handling: 15-second AbortController timeout
- Error differentiation: `AbortError` vs connection errors
- Response parsing with fallback messages

**4. State Management - `components/Nav.tsx`:**
- Hash-based routing state synchronization
- Window scroll event listener for navbar styling
- Mobile menu toggle state management

**5. API Endpoints:**

**Chat API (`api/chat.js`):**
- POST-only validation
- Environment variable checks for API keys
- Google Gemini API integration with tool calls
- SendGrid email integration with error handling
- Response always returns text (fallback patterns)

**Email API (`api/send-email.js`):**
- POST-only validation
- Required field validation (email, message)
- Environment variable checks for SendGrid
- Parallel email sends to support and user
- HTML email formatting

## Type Safety

**TypeScript Strict Mode:**
- `tsconfig.json` has `"strict": true` enabled
- Type annotations used throughout components
- Interface definitions for props:
  - `NavbarProps` with `scrolled: boolean` and `onStartProject: () => void`
  - `Message` interface with `role: 'user' | 'model'` and `text: string`

**Type Usage Examples:**

```typescript
// Functional component typing
export const Hero: React.FC = () => { ... }

// Props interface
interface NavbarProps {
  scrolled: boolean;
  onStartProject: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ scrolled, onStartProject }) => { ... }

// State typing with union types
const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

// Interface for data structures
interface Message {
  role: 'user' | 'model';
  text: string;
  isSystem?: boolean;
}

// Typed event handlers
const handleSend = async () => { ... }
const handleSubmit = async (e: React.FormEvent) => { ... }
const handleGlobalClick = (e: MouseEvent) => { ... }
```

## Current Testing Limitations

**Coverage Gaps:**

1. **No Unit Tests** - Components have complex logic without test coverage:
   - `Chatbot.tsx` - Message handling, API integration, error recovery
   - `Contact.tsx` - Form validation, email submission, state transitions
   - `index.tsx` - Client-side routing logic with hash-based navigation

2. **No Integration Tests** - API interactions untested:
   - Google Gemini API integration flow
   - SendGrid email dispatch
   - Tool calling mechanism in chat API

3. **No E2E Tests** - User flows not automated:
   - Chat conversation flow
   - Form submission and confirmation
   - Navigation between routes

4. **No API Tests** - Endpoint behavior unverified:
   - Request validation
   - Error response handling
   - Timeout behavior

## Recommended Testing Setup

**For Frontend Components:**
- Framework: Vitest + React Testing Library
- Config: `vitest.config.ts`
- Location: Co-locate test files with components: `Hero.test.tsx`

**For API Routes:**
- Framework: Vitest + Supertest or Node Test Runner
- Config: Same `vitest.config.ts`
- Location: `api/__tests__/chat.test.js`, `api/__tests__/send-email.test.js`

**For E2E:**
- Framework: Playwright or Cypress
- Location: `e2e/` directory
- Scenarios: Chat flow, form submission, navigation

## Browser API Testing

**APIs Used (Requires Mocking):**
- `window.location.hash` - Hash-based routing
- `window.scrollTo()` - Smooth scrolling
- `document.getElementById()` - DOM queries
- `fetch()` - HTTP requests
- `AbortController` - Request cancellation
- `console.error()` - Error logging

---

*Testing analysis: 2026-03-07*
