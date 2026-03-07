# Codebase Concerns

**Analysis Date:** 2026-03-07

## Tech Debt

**Architectural Inconsistency - Dual Build Systems:**
- Issue: Project uses both Vite and Next.js configuration, creating confusion about the actual build system and deployment target.
- Files: `vite.config.ts`, `vite.config.js`, `next.config.mjs`
- Impact: Unclear build process, potential for incorrect tooling decisions, wasted time figuring out which config is active.
- Fix approach: Consolidate to single build system. Delete unused config (likely Next.js is unused) and remove its dependencies from `package.json` if not required.

**Client-Side Routing Implementation:**
- Issue: Manual hash-based routing using window.location.hash instead of a routing library. Requires custom event listeners for navigation, in-page anchors, and external links.
- Files: `index.tsx` (lines 16-103), `components/Nav.tsx` (lines 18-33)
- Impact: Complex, error-prone navigation logic. Difficulty adding routes, broken deep linking scenarios, SEO limitations. Each new page route requires a new case in the switch statement.
- Fix approach: Implement proper client-side router (React Router v6+). Handles hash routing, nested routes, and standardizes navigation patterns.

**Mixed TypeScript/JavaScript with Incomplete Type Coverage:**
- Issue: API endpoints are `.js` files with no type checking. Frontend is TypeScript but API layer lacks types for request/response structures.
- Files: `api/send-email.js`, `api/chat.js`
- Impact: Type errors only caught at runtime. Difficult to refactor APIs safely. Client-server contract is implicit.
- Fix approach: Convert API files to TypeScript with proper request/response interfaces. Use shared types package for client-server contract.

**No Testing Infrastructure:**
- Issue: Zero tests, no test runner configured (no Jest, Vitest, etc.).
- Files: Entire codebase
- Impact: Regression risk on changes. Difficult to refactor with confidence. API changes could break chatbot/email flows undetected.
- Fix approach: Set up Vitest for unit tests. Add React Testing Library for component tests. Start with critical paths (API handlers, routing logic).

**Deprecated Entry Point Not Cleaned:**
- Issue: `App.tsx` is marked as deprecated but still exists and contains brief comment.
- Files: `App.tsx`
- Impact: Confusion about which file is the actual entry point. Wastes developer time navigating codebase.
- Fix approach: Delete deprecated file or clarify in comments why it's still present.

**Dual Routing Components:**
- Issue: Both `Nav.tsx` and `Navbar.tsx` exist; unclear which is actively used.
- Files: `components/Nav.tsx`, `components/Navbar.tsx`
- Impact: Dead code, maintainability confusion.
- Fix approach: Audit actual usage in page files. Remove the unused component.

---

## Known Bugs

**Chatbot Timeout Not Fully Handled:**
- Symptoms: If fetch request times out after 15 seconds, AbortError is caught but the timeoutId is cleared after 15s regardless of fetch completion state.
- Files: `components/Chatbot.tsx` (lines 35-48)
- Trigger: Slow network or unresponsive API server
- Issue: Race condition if response arrives between timeout firing and clearTimeout. The abort signal and timer cleanup are not perfectly synchronized.
- Workaround: Relies on `isLoading` state preventing double submissions; user sees timeout error after 15s.

**Email Form Lacks Input Validation:**
- Symptoms: Email field accepts any string, missing domain validation beyond HTML5 `type="email"`.
- Files: `components/Contact.tsx` (line 79)
- Trigger: User enters malformed email (e.g., "test@localhost")
- Issue: SendGrid API will reject invalid emails server-side, but user only sees generic error message.
- Workaround: HTML5 email validation provides basic protection in modern browsers.

**Hard-Coded Email Addresses:**
- Symptoms: Support email `support@axionlab.in` is duplicated across multiple files.
- Files: `api/send-email.js` (lines 23, 24, 43), `api/chat.js` (line 78), `components/Contact.tsx` (line 63), `components/Nav.tsx` (line 122)
- Trigger: Email domain change requires updating 4+ locations
- Issue: Brittle to email domain changes; risk of missing updates.
- Workaround: None currently; requires manual coordination.

**No Error Recovery in Chat API:**
- Symptoms: If Gemini API call fails, error message is generic. No retry logic or fallback.
- Files: `api/chat.js` (lines 111-114)
- Trigger: Google API rate limit, service outage, network failure
- Issue: Users see error without context. No exponential backoff or retry mechanism.
- Workaround: User must manually retry by sending another message.

---

## Security Considerations

**API Keys Exposed in Error Logs:**
- Risk: `console.error()` statements in API handlers could leak sensitive information. SendGrid error responses might contain partial API key data.
- Files: `api/send-email.js` (line 77), `api/chat.js` (lines 93, 112)
- Current mitigation: Error messages are generic in responses sent to client, console logs only appear in server logs.
- Recommendations:
  - Sanitize error logs to exclude any sensitive data; log only error codes/messages, not full error objects
  - Implement centralized error logging service (e.g., Sentry) with PII filtering
  - Never log `error.response` objects which may contain API responses with secrets

**Environment Variable Handling:**
- Risk: API keys are read from `process.env` on every request. No validation of key format or age. Missing key handling is inconsistent (send-email checks, chat.js returns error).
- Files: `api/send-email.js` (lines 14-17), `api/chat.js` (lines 12-14)
- Current mitigation: Keys are not exposed in client-side code; only used server-side.
- Recommendations:
  - Validate API key format on startup (before accepting requests)
  - Consider using API key rotation/expiration mechanism
  - Implement request signing for additional security layer
  - Add monitoring/alerting if key becomes invalid

**Email Parameter Not Validated for Injection:**
- Risk: User-provided email address is directly inserted into HTML email template without escaping.
- Files: `api/send-email.js` (lines 31, 57)
- Current mitigation: SendGrid handles some sanitization; user email is used in `replyTo` field (safer than body)
- Recommendations:
  - Validate email format strictly before using in templates
  - HTML-escape user input in email bodies: `email.replace(/</g, '&lt;').replace(/>/g, '&gt;')`
  - Use SendGrid template system instead of manual HTML generation

**Message Content Not Sanitized:**
- Risk: User message content is inserted directly into HTML email and displayed in chatbot without escaping.
- Files: `api/send-email.js` (lines 33, 57), `api/chat.js` (line 82), `components/Chatbot.tsx` (line 132)
- Current mitigation: Message is sent as `<pre>` tag which prevents HTML interpretation; chatbot UI displays as text.
- Recommendations:
  - Implement strict input sanitization using DOMPurify or similar
  - Validate message length (DoS protection): reject messages >10KB
  - Rate-limit email submissions by IP to prevent spam

**No CORS Protection:**
- Risk: API endpoints do not set CORS headers. Depends on hosting platform default behavior.
- Files: `api/send-email.js`, `api/chat.js` (both lack CORS headers)
- Current mitigation: Requests are POST-only (GET requests ignored).
- Recommendations:
  - Explicitly set CORS headers: `Access-Control-Allow-Origin: https://axionlab.in`
  - Restrict to production domain only; do not use `*`
  - Add CSRF protection if cookies are used for auth

**Gemini Function Tool Call Not Validated:**
- Risk: Function call arguments from Gemini API are used directly without validation. Malicious model response could contain unexpected data types.
- Files: `api/chat.js` (lines 70-99)
- Current mitigation: Function is sandboxed to only sendEmailInquiry; missing args are handled gracefully.
- Recommendations:
  - Validate function call args match declared schema before using
  - Whitelist allowed field names and types: `const schema = { userName: 'string', userEmail: 'email', company: 'string', scope: 'string', priority: 'enum' }`
  - Implement timeout on Gemini API calls (currently none)

---

## Performance Bottlenecks

**Large Component Bundle Size:**
- Problem: `Chatbot.tsx` (182 lines) and `Portfolio.tsx` (178 lines) are tightly coupled UI + logic, no code splitting.
- Files: `components/Chatbot.tsx`, `components/Portfolio.tsx`
- Cause: No lazy loading of modal content in Portfolio; Chatbot always loaded even if rarely used.
- Improvement path:
  - Extract modal content to separate lazy-loaded component using `React.lazy()`
  - Move portfolio data to external JSON file to cache separately
  - Defer Chatbot component loading until first user interaction with button

**No Image Optimization:**
- Problem: Portfolio images loaded from Unsplash with no optimization (600x400 displayed as 1200px source).
- Files: `components/Portfolio.tsx` (lines 99, 135)
- Cause: Direct image URLs without resizing/format conversion.
- Improvement path:
  - Use image optimization service (Vercel Image Optimization, imgix, or Cloudflare Image Resizing)
  - Serve WebP format with fallback to JPEG
  - Implement lazy loading with IntersectionObserver for below-fold images

**Synchronous API Calls in Chat History:**
- Problem: Chat history is passed in full with every message request; no pagination or truncation.
- Files: `components/Chatbot.tsx` (line 43), `api/chat.js` (lines 45-53)
- Cause: History could grow to 100s of KB for long conversations.
- Improvement path:
  - Implement sliding window: only send last 10 messages to API
  - Truncate old messages after conversation reaches 50+ messages
  - Implement server-side session storage for conversation state

**Re-rendering on Every Scroll Event:**
- Problem: `Nav.tsx` updates state on scroll, causing re-render of entire navigation component.
- Files: `components/Nav.tsx` (lines 23-25)
- Cause: No throttling/debouncing of scroll listener.
- Improvement path:
  - Use `throttle()` from lodash or custom hook: max 1 update per 200ms
  - Consider using Intersection Observer API for better performance

---

## Fragile Areas

**Routing Logic is Error-Prone:**
- Files: `index.tsx` (lines 47-91), `components/Nav.tsx` (lines 18-32)
- Why fragile: Multiple event listeners (hashchange, click, scroll) all manipulating route state. Race conditions possible if hash changes during navigation handler execution. Edge cases for in-page anchors vs route navigation.
- Safe modification:
  1. Write tests for all routing scenarios before modifying
  2. Use routing library instead of manual implementation
  3. Avoid modifying click handler; rely on href attributes
- Test coverage: None - no tests exist for navigation behavior

**Chatbot State Management is Scattered:**
- Files: `components/Chatbot.tsx` (lines 11-23, 25-83)
- Why fragile: Multiple useState hooks manage UI state, loading state, and message history. Refactoring message format requires changes in 3+ places (send, fetch, display, history).
- Safe modification:
  1. Extract state into custom hook (`useChatbot()`)
  2. Use useReducer for complex state transitions
  3. Add tests for state transitions before refactoring
- Test coverage: None

**Email Handler Relies on External Service Availability:**
- Files: `api/send-email.js`, `api/chat.js` (mail section)
- Why fragile: SendGrid API key validation only happens at send time. If key becomes invalid, all requests fail. No retry or queue mechanism.
- Safe modification:
  1. Validate key format on server startup
  2. Implement exponential backoff with retry queue
  3. Add monitoring for failed email sends
- Test coverage: None - API handlers are untested

**Gemini API Integration Depends on Specific Response Format:**
- Files: `api/chat.js` (lines 55-99)
- Why fragile: Code assumes specific structure of response object and function call data. Model version upgrade could change response format unexpectedly.
- Safe modification:
  1. Add response validation before accessing nested fields
  2. Add version pinning in comments: `gemini-3-flash-preview` - track deprecation timeline
  3. Test with mock responses to verify all paths handle edge cases
- Test coverage: None

---

## Scaling Limits

**In-Memory Chat History:**
- Current capacity: Limited by available browser memory (50-100MB typical); no server-side persistence.
- Limit: Chat history lost on page refresh. Multiple browser tabs have separate histories. No cross-device sync.
- Scaling path:
  1. Implement server-side session storage (Redis or database)
  2. Persist conversation to database with user identification
  3. Add conversation listing/search UI
  4. Implement rate limiting per user/IP

**No Request Rate Limiting:**
- Current capacity: Depends on API provider limits (SendGrid: 100 requests/second; Gemini: quota-based)
- Limit: Single client can exhaust quota by spamming requests
- Scaling path:
  1. Implement IP-based rate limiting in API handlers (5 requests/minute per IP for emails, 10/minute for chat)
  2. Add user authentication to track per-user quotas
  3. Use Redis for distributed rate limit tracking if multi-server

**Single Region Deployment:**
- Current capacity: Depends on hosting provider's region capacity
- Limit: High latency for users outside US/EU regions; no redundancy
- Scaling path:
  1. Set up CDN (Cloudflare, Vercel Edge Network) for static assets
  2. Deploy API to multiple regions with geographic routing
  3. Implement database read replicas for multi-region consistency

**No Caching Strategy:**
- Current capacity: Every page load fetches all CSS/JS/images
- Limit: Slow repeat visits; redundant API calls
- Scaling path:
  1. Enable HTTP caching headers (Cache-Control: max-age for assets)
  2. Implement service worker for offline support and asset caching
  3. Add API response caching (e.g., portfolio data doesn't change frequently)

---

## Dependencies at Risk

**Google Gemini API Model Version:**
- Risk: Hard-coded to `gemini-3-flash-preview` (preview/unstable version). Preview models can be deprecated with short notice.
- Files: `api/chat.js` (line 56)
- Impact: If model is deprecated, API calls will fail with no fallback. Requires immediate code change to continue operating.
- Migration plan:
  1. Track Google's model lifecycle announcements
  2. Test against newer stable models (e.g., `gemini-2.0-flash`) on staging before production deployment
  3. Make model name configurable via environment variable
  4. Implement fallback model in config

**@sendgrid/mail Package:**
- Risk: External SMTP service dependency. SendGrid service outage breaks all email functionality.
- Files: `api/send-email.js`, `api/chat.js`
- Impact: Users cannot receive confirmation emails or AI inquiry dispatches. No email contact method available.
- Migration plan:
  1. Consider backup email provider (AWS SES, Mailgun) as fallback
  2. Implement email queue with retry logic
  3. Add email delivery monitoring/alerting
  4. Document manual inquiry process as fallback (form submission logs to database for manual review)

**Next.js Configuration Artifact:**
- Risk: `next.config.mjs` exists but appears unused. If referenced by build process, could cause unexpected behavior.
- Files: `next.config.mjs`, dependencies include Next.js
- Impact: Confusion about build system. Potential for config conflicts if build system accidentally switches to Next.js.
- Migration plan:
  1. Remove `next.config.mjs` and Next.js from dependencies if Vite is the actual build system
  2. Or commit to Next.js and remove Vite config if planning to use Next.js

---

## Missing Critical Features

**No Error Boundary Component:**
- Problem: JavaScript errors in React components will crash entire application with blank screen. No user-friendly error message.
- Blocks: Production reliability. Silent failures in components.
- Fix approach:
  1. Implement React Error Boundary wrapper in `index.tsx`
  2. Graceful fallback UI showing error report form
  3. Send error logs to monitoring service (Sentry)

**No Loading States for Slow API Calls:**
- Problem: If API is slow, chatbot appears frozen. Contact form submission may show delayed response.
- Blocks: User feedback. Appears broken.
- Fix approach:
  1. Add explicit loading spinner states (already done for chatbot, missing for contact form initial click)
  2. Add timeout indicators showing elapsed time
  3. Implement optimistic UI updates where appropriate

**No Offline Support:**
- Problem: App is completely non-functional without internet.
- Blocks: Viewing portfolio/capabilities offline.
- Fix approach:
  1. Implement service worker for offline asset caching
  2. Cache portfolio data in localStorage
  3. Queue emails for sending when connection restored

**No Input Sanitization Library:**
- Problem: User inputs (email, message) are validated but not sanitized against XSS or injection attacks.
- Blocks: Potential for malicious payloads in stored data (emails).
- Fix approach:
  1. Install DOMPurify library
  2. Sanitize all user inputs before processing or storing
  3. Add Content Security Policy (CSP) headers to prevent XSS execution

**No Monitoring/Analytics:**
- Problem: No visibility into user behavior, API errors, or performance issues.
- Blocks: Unable to identify bottlenecks or user pain points.
- Fix approach:
  1. Integrate Sentry for error tracking
  2. Add Google Analytics or Plausible for usage metrics
  3. Implement structured logging for API errors

---

## Test Coverage Gaps

**API Endpoints Untested:**
- What's not tested: Happy path and error paths for `/api/send-email` and `/api/chat`
- Files: `api/send-email.js`, `api/chat.js`
- Risk: Email sending could silently fail (e.g., malformed SendGrid config). Chat API response parsing could break on model updates.
- Priority: **High** - critical user-facing functionality

**Routing Logic Untested:**
- What's not tested: Navigation between routes, hash change handling, in-page anchor scrolling, external link opening
- Files: `index.tsx`, `components/Nav.tsx`
- Risk: Routing could break on refactoring. Edge cases (rapid navigation, invalid routes) not covered.
- Priority: **High** - affects all page navigation

**Chatbot Component Untested:**
- What's not tested: Message sending, loading state, error handling, timeout scenarios, message history rendering
- Files: `components/Chatbot.tsx`
- Risk: Chat functionality could break silently. Error recovery untested.
- Priority: **High** - primary user engagement feature

**Contact Form Untested:**
- What's not tested: Form validation, submission success/error states, email validation
- Files: `components/Contact.tsx`
- Risk: Form submission could fail without proper error feedback. Validation edge cases missed.
- Priority: **Medium** - lead capture critical but less complex

**Navigation State Untested:**
- What's not tested: Active route highlighting in nav, mobile menu open/close, responsive behavior
- Files: `components/Nav.tsx`
- Risk: Navigation could visually break on refactoring. Mobile UX regressions possible.
- Priority: **Medium** - UX important but not business-critical

**Component Props Untested:**
- What's not tested: Portfolio modal open/close, Project data rendering
- Files: `components/Portfolio.tsx`
- Risk: Modal could break or show incorrect data on refactoring.
- Priority: **Low** - mostly presentational, visual regression unlikely

---

*Concerns audit: 2026-03-07*
