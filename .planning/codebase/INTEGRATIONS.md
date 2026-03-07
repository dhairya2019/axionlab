# External Integrations

**Analysis Date:** 2026-03-07

## APIs & External Services

**AI/LLM:**
- Google Gemini AI (via @google/genai)
  - Model: `gemini-3-flash-preview`
  - SDK: `@google/genai` v1.41.0
  - Auth: Environment variable `API_KEY`
  - Purpose: Powers the AXION_AI_Concierge chatbot with function calling capabilities
  - Implementation: `/api/chat.js` lines 16-62

**Email:**
- SendGrid
  - SDK: `@sendgrid/mail` v8.1.6
  - Auth: Environment variable `SENDGRID_API_KEY`
  - Purpose: Sends transactional emails for contact form submissions and chatbot inquiry dispatches
  - From address: `support@axionlab.in`

## Data Storage

**Databases:**
- None detected - Application is stateless frontend with serverless API handlers

**File Storage:**
- Local filesystem only (static assets served from Vercel)

**Caching:**
- None configured - Vite handles static asset caching via build output

## Authentication & Identity

**Auth Provider:**
- None configured
- Contact form uses email validation only (client-side)
- Chatbot collects user email for inquiry submissions

**Form Validation:**
- Client-side email validation in `components/Contact.tsx`
- No server-side authentication or user sessions

## Monitoring & Observability

**Error Tracking:**
- Not integrated - Basic console logging only

**Logs:**
- Console logging in API handlers:
  - `/api/send-email.js` line 14-15: SendGrid errors
  - `/api/chat.js` line 112: Gemini API errors and mail relay errors

**Response Tracking:**
- Error states logged in browser console via `components/Chatbot.tsx` line 74

## CI/CD & Deployment

**Hosting:**
- Vercel (indicated by `vercel.json` v2)

**CI Pipeline:**
- Vercel auto-deployment on git push
- Build command: `npm run build`
- Output directory: `dist`

**Vercel Configuration:**
- Framework: Vite
- Rewrites configured for API routes and SPA fallback to `index.html`
- API route pattern: `/api/(.*)` → `/api/$1`

## Environment Configuration

**Required env vars (Production):**
- `SENDGRID_API_KEY` - SendGrid API authentication key
- `API_KEY` - Google Gemini AI API key

**Optional:**
- None

**Secrets location:**
- Managed through Vercel environment variables dashboard
- Not committed to repository

## Webhooks & Callbacks

**Incoming:**
- POST `/api/send-email` - Contact form submission
  - Body: `{ email: string, message: string }`
  - Response: `{ success: boolean, message: string }` or `{ error: string }`

- POST `/api/chat` - Chatbot message submission
  - Body: `{ message: string, history: Array<{ role, text }> }`
  - Response: `{ text: string, isSystem?: boolean }` or `{ error: string }`

**Outgoing:**
- SendGrid SMTP (outbound email delivery)
  - Sends two emails per contact form submission:
    1. To agency: `support@axionlab.in` (with user reply-to)
    2. To user: confirmation of receipt
  - Sends one email per chatbot inquiry dispatch:
    1. To agency: `support@axionlab.in` with structured inquiry data

## API Response Handling

**Chat API (`/api/chat`):**
- Accepts user messages with conversation history
- Processes through Gemini 3 Flash model
- Detects function calls for email dispatch
- Returns text response and optional system flag

**Email API (`/api/send-email`):**
- Accepts form submission with email and message
- Validates required fields
- Sends dual-copy emails (agency + user)
- Returns success/error status

## Rate Limiting & Quotas

**Not configured:**
- No rate limiting on API endpoints
- Relies on platform (Vercel) and service provider quotas
- Gemini API subject to Google Cloud quotas
- SendGrid subject to SendGrid account limits

## Error Handling

**API Errors:**
- SendGrid configuration missing: Returns 500 with "Mail server is currently unconfigured"
- Gemini API key missing: Returns 500 with "SYSTEM_FAULT: Gemini API Key missing"
- Network timeout (chat): 15-second timeout in `components/Chatbot.tsx` line 36
- Method validation: 405 error for non-POST requests

**Client-Side Fallbacks:**
- Mail service unavailable: Directs users to `support@axionlab.in`
- API unreachable: Generic error message with manual contact instructions

---

*Integration audit: 2026-03-07*
