---
phase: 01-foundation
plan: 04
subsystem: Foundation/Deployment
tags: [vercel, deployment, devops, environment-variables]
dependency_graph:
  requires: [01-03]
  provides: [SETUP-04]
  affects: [Phase 2+]
tech_stack:
  added:
    - Vercel deployment platform
  patterns:
    - Next.js on Vercel with environment variable injection
    - GitHub integration for continuous deployment
key_files:
  created:
    - vercel.json (deployment configuration)
decisions:
  - GitHub required for Vercel deployment (best practice for CI/CD)
  - Environment variables stored in Vercel dashboard (not in vercel.json or git)
  - NEXT_PUBLIC_APP_URL set after first deployment with actual URL
metrics:
  duration: 25 minutes
  tasks_completed: 1/2 (Task 2 is human checkpoint)
  files_created: 1 (vercel.json)
  date_completed: 2026-03-09
---

# Phase 1 Plan 4: Vercel Deployment Summary

Deploy the project to Vercel, confirm the live URL returns 200, and verify environment variables are correctly set in the Vercel dashboard.

## One-liner

Vercel deployment of Next.js 14+ with GitHub integration, environment variable injection, and security headers verification.

## Task Status

| Task | Name | Status | Notes |
|------|------|--------|-------|
| 1 | Create vercel.json and commit to git | ✓ Complete | Commit 2d891ca |
| 2 | Push to GitHub and deploy via Vercel | ⏸ Awaiting human action | CHECKPOINT |

## What Was Built

### Task 1: Vercel Configuration

**`vercel.json`:**
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

This file explicitly tells Vercel:
- Framework: Next.js (prevents auto-detection issues)
- Build command: `npm run build` (uses our existing npm script)
- Output directory: `.next` (standard Next.js build output)
- Install command: `npm install` (standard npm)

### Git Readiness

All code committed to git:
- ✓ Next.js scaffold (01-01)
- ✓ Supabase migration SQL (01-02)
- ✓ Supabase clients + security (01-03)
- ✓ vercel.json configuration (01-04)
- ✓ Plan summaries (01-01 through 01-03)

**Critical:** `.env.local` is **not** in git history (blocked by .gitignore)

### Required Environment Variables for Vercel

The following **must** be set in Vercel Dashboard (Settings → Environment Variables):

1. `NEXT_PUBLIC_SUPABASE_URL` — From Supabase Dashboard → Project Settings → API → Project URL
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` — From Supabase Dashboard → Project Settings → API → anon public key
3. `SUPABASE_SERVICE_ROLE_KEY` — From Supabase Dashboard → Project Settings → API → service_role secret key (server-only)
4. `NEXT_PUBLIC_APP_URL` — Vercel deployment URL (e.g., https://blog-cacic.vercel.app) — set after first deployment
5. `UPSTASH_REDIS_REST_URL` — (empty for Phase 1, needed in Phase 3)
6. `UPSTASH_REDIS_REST_TOKEN` — (empty for Phase 1, needed in Phase 3)

## Checkpoint: Manual Deployment Required

**Status:** Task 2 awaiting human approval

Plan 01-04 Task 2 is a checkpoint requiring:

### Step 1: GitHub Setup
```bash
git remote add origin https://github.com/YOUR_USERNAME/blog-cacic.git
git branch -M main
git push -u origin main
```

### Step 2: Vercel Deployment
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `blog-cacic` repository
4. Before clicking "Deploy", add Environment Variables:
   - NEXT_PUBLIC_SUPABASE_URL (from Supabase)
   - NEXT_PUBLIC_SUPABASE_ANON_KEY (from Supabase)
   - SUPABASE_SERVICE_ROLE_KEY (from Supabase)
   - NEXT_PUBLIC_APP_URL (leave as placeholder initially)
   - UPSTASH_REDIS_REST_URL (leave empty)
   - UPSTASH_REDIS_REST_TOKEN (leave empty)
5. Click "Deploy"
6. Wait for green checkmark (build success)

### Step 3: Verification
1. Open live URL (e.g., https://blog-cacic.vercel.app)
2. Verify page loads with "Blog CACIC — em construção"
3. Check security headers in devtools:
   - `strict-transport-security: max-age=31536000; includeSubDomains`
   - `x-frame-options: DENY`
   - `x-content-type-options: nosniff`
   - `referrer-policy: strict-origin-when-cross-origin`
4. Test health endpoint: `GET [YOUR_VERCEL_URL]/api/health`
   - Should return `{ status: "degraded" }` (Supabase creds empty initially is expected)
5. Go back to Vercel Dashboard → Settings → Environment Variables
6. Update `NEXT_PUBLIC_APP_URL` to your actual Vercel URL
7. Trigger redeploy: Vercel → Deployments → Redeploy

### Step 4: Security Check (Optional)
Visit https://securityheaders.com and enter your Vercel URL.
- Target: At least B rating (A requires HSTS preloading, not required for Phase 1)

## Expected Outcomes

### Success (Green Checkmark)
- Build succeeds in Vercel Dashboard
- Live URL returns HTTP 200
- Page displays "Blog CACIC — em construção"
- Security headers present on all responses
- Health endpoint accessible at `/api/health`

### Possible Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Build fails: "Missing env var" | Env vars not set in Vercel | Add all 6 vars in Vercel Settings → Environment Variables |
| Build fails: "TypeScript error" | Code issue (unlikely) | Check Vercel build logs, likely a config mismatch |
| Health endpoint returns `{ status: "degraded" }` | Supabase credentials empty or wrong | Fill in real Supabase URL and keys in Vercel env vars |
| CORS error in browser console | Expected security behavior | Not an error — CORS blocks cross-origin requests as designed |
| Security headers missing | Config not applied | Redeploy after verifying next.config.js in git |

## Phase 1 Success Criteria (All Checkpoints Approved)

Plan 01-04 completion marks the end of Phase 1. All of the following must be TRUE:

✓ npm run dev locally starts without errors
✓ All 6 Supabase tables exist with RLS enabled (from 01-02 checkpoint)
✓ 3 storage buckets exist: thumbnails, trabalhos-pdfs, avatares (from 01-02 checkpoint)
✓ Live Vercel URL returns HTTP 200
✓ Page displays "Blog CACIC — em construção"
✓ Security headers present on every response
✓ /api/health endpoint returns JSON status
✓ Build logs have no environment variable errors
✓ .env.local not in git history (blocked by .gitignore)

## Deviations from Plan

None — plan executed exactly as written for Task 1.

Task 2 is delegated to human (requires GitHub and Vercel browser access).

## Next Steps (After Checkpoint Approval)

- **Phase 2:** UI Foundation (Chakra UI v3, layout components)
- **Phase 3:** Auth & Data Access (magic link, CRUD operations)
- **Phase 4:** Content Management (MDX posts, file uploads)

---

## Notes for Phase Planning

- Vercel free tier includes up to 5 deployments/month with unlimited preview deployments
- GitHub integration allows automatic deployments on git push to main
- Environment variables can be updated without rebuilding (next deploy required for NEXT_PUBLIC vars)
- Preview deployments created for all pull requests automatically
