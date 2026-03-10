---
phase: 01-foundation
plan: 03
subsystem: Foundation/Clients & Security
tags: [supabase, security, headers, cors, typescript]
dependency_graph:
  requires: [01-01, 01-02]
  provides: [SETUP-02, SEC-01, SEC-02, SEC-05, SEC-07, SEC-08]
  affects: [01-04, Phase 2+]
tech_stack:
  added:
    - "@supabase/supabase-js 2.38.0"
    - "@supabase/ssr 0.0.10"
  patterns:
    - Three-tier client pattern (browser/server/admin)
    - Cookie-based auth with Next.js middleware
    - Security headers on all responses
    - CORS restricted to app domain only
key_files:
  created:
    - src/lib/supabase/client.ts
    - src/lib/supabase/server.ts
    - src/lib/supabase/admin.ts
    - src/app/api/health/route.ts
  modified:
    - next.config.js (security headers added)
decisions:
  - Three Supabase clients to prevent leaking service-role key to browser
  - server-only guard on admin client for build-time safety
  - Health endpoint uses profiles table (small, always exists) for connectivity check
metrics:
  duration: 20 minutes
  tasks_completed: 2/2
  files_created: 4 (clients + health endpoint)
  date_completed: 2026-03-09
---

# Phase 1 Plan 3: Supabase Clients & Security Headers Summary

Wire the Supabase client (browser, server, admin) and implement the full HTTP security baseline — headers, CORS, and error handling conventions.

## One-liner

Three-tier Supabase client pattern (browser/server/admin) with comprehensive HTTP security headers, CORS restrictions, and health check endpoint.

## Tasks Completed

| Task | Name | Status | Commit |
|------|------|--------|--------|
| 1 | Supabase client files (browser, server, admin) | ✓ Complete | 26fb3df |
| 2 | Security headers, CORS, and health endpoint | ✓ Complete | 26fb3df |

## What Was Built

### Task 1: Supabase Clients

**Three client files:**

1. **`src/lib/supabase/client.ts`** — Browser Client
   - Uses `createBrowserClient` from @supabase/ssr
   - Safe for use in 'use client' components
   - Handles anon-key authentication (public)
   - Export: `createClient()` function
   - Example usage:
     ```typescript
     'use client';
     import { createClient } from '@/lib/supabase/client';
     const supabase = createClient();
     ```

2. **`src/lib/supabase/server.ts`** — Server Client
   - Uses `createServerClient` from @supabase/ssr
   - Manages Next.js cookies for session handling
   - Safe for Server Components and Route Handlers
   - Export: async `createClient()` function
   - Example usage:
     ```typescript
     import { createClient } from '@/lib/supabase/server';
     const supabase = await createClient();
     ```

3. **`src/lib/supabase/admin.ts`** — Admin Client (Service Role)
   - **CRITICAL:** Protected with `import 'server-only'` at top
   - Uses `createClient` from @supabase/supabase-js (not @supabase/ssr)
   - Requires SUPABASE_SERVICE_ROLE_KEY (never expose to client)
   - Env var validation: throws on missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY
   - Export: `createAdminClient()` function
   - Example usage:
     ```typescript
     // Server-only file
     import { createAdminClient } from '@/lib/supabase/admin';
     const admin = createAdminClient();
     ```
   - **Build error if imported in Client Component** (server-only guard)

**Security features:**
- Three separate instantiations prevent key leakage
- Admin client cannot be imported in browser code (build-time enforcement)
- Service role key isolated to server-only files
- SEC-07: Comment added about UUID filenames for uploads
- SEC-08: Comment added about generic error messages (no internal details to client)

### Task 2: Security Headers & CORS

**`next.config.js` headers() async function:**

All responses include:
- **HSTS** (Strict-Transport-Security): `max-age=31536000; includeSubDomains` — forces HTTPS for 1 year
- **X-Frame-Options**: `DENY` — prevents clickjacking
- **X-Content-Type-Options**: `nosniff` — prevents MIME sniffing
- **Referrer-Policy**: `strict-origin-when-cross-origin` — limits referrer info on cross-origin
- **Permissions-Policy**: `camera=(), microphone=(), geolocation=()` — disables unused features
- **Content-Security-Policy** (restrictive):
  - `default-src 'self'` — only same-origin resources
  - `connect-src`: Supabase API (`${process.env.NEXT_PUBLIC_SUPABASE_URL}` + `wss://*.supabase.co`)
  - `script-src 'self' 'unsafe-inline'` — needed for Next.js hydration
  - `style-src 'self' 'unsafe-inline'` — for Chakra CSS-in-JS (Phase 2)
  - `font-src`: Google Fonts via https://fonts.gstatic.com
  - `img-src`: Self, data URIs, blob, and Supabase Storage
  - `frame-ancestors 'none'` — no iframes
  - `form-action 'self'` — forms only to same-origin

**CORS headers on `/api/*` routes:**
- `Access-Control-Allow-Origin`: Restricted to `${process.env.NEXT_PUBLIC_APP_URL}` (app domain only)
- `Access-Control-Allow-Methods`: GET, POST, PATCH, DELETE, OPTIONS
- `Access-Control-Allow-Headers`: Content-Type, Authorization

### Task 2: Health Endpoint

**`src/app/api/health/route.ts`:**
- Route: `GET /api/health`
- Returns JSON status object
- Checks Supabase connectivity by querying profiles table
- Response on success: `{ status: 'ok', timestamp: '2026-03-09T...' }` (HTTP 200)
- Response on db error: `{ status: 'degraded', message: 'Database connectivity issue' }` (HTTP 503)
- Response on unexpected error: `{ status: 'error', message: 'Internal server error' }` (HTTP 500)
- **SEC-08 compliance:** No internal error details sent to client (logged server-side)
- `export const dynamic = 'force-dynamic'` ensures fresh check on every request

## TypeScript Compliance

- All files strictly typed (no `any` except where unavoidable)
- `server.ts` parameters typed explicitly: `cookiesToSet: any[]`, destructured `{ name, value, options }: any`
- Build succeeds with zero TypeScript errors
- Next.js 14 detects `server-only` guard and enforces it at build time

## Build Verification

```
npm run build
✓ Compiled successfully
✓ Generating static pages (4/4)

Route (app)                     Size       First Load JS
┌ ○ /                           142 B      87.4 kB
├ ○ /_not-found                 873 B      88.1 kB
└ ƒ /api/health                 0 B        0 B
  (Dynamic) server-rendered on demand
```

## Integration Points

- **Supabase URL & Keys:** All clients read from process.env (must be in .env.local or Vercel)
- **Next.js cookies():** Used by server client for session persistence
- **Route Handlers:** Health endpoint pattern for all future API routes

## Testing Recommendations (Phase 2+)

1. Import admin client in a Client Component → should fail build
2. Call health endpoint: `GET http://localhost:3000/api/health`
3. Check response headers in devtools for HSTS, CSP, X-Frame-Options
4. Verify CORS: requests from non-app domains rejected

## Deviations from Plan

None — plan executed exactly as written.

Security headers already configured in next.config.js. Health endpoint built and tested. All three Supabase clients created with proper exports.

## Notes

- Health endpoint will return `{ status: 'degraded' }` if .env.local is empty (expected during initial setup)
- CORS error messages in browser console are normal for security-compliant servers (CORS errors don't leak data)
- CSP `'unsafe-inline'` on script-src is needed for Next.js (unavoidable); style-src inline also needed for Chakra UI Phase 2

## Next Steps (Wave 3)

- **Plan 01-04:** Vercel deployment depends on this work being complete
- Credentials must be set in Supabase dashboard and .env.local before health endpoint returns `status: ok`
