# Roadmap: Blog CACIC — UTFPR Santa Helena

## Overview

The blog is built in six phases, each delivering a coherent capability. Foundation first (scaffolding, database, security baseline), then auth and the design system, then the MDX content pipeline with its API/DAL layer, then all public pages assembled from those parts, then the private dashboard for members, and finally SEO and performance polish that make the site production-ready. Every phase is independently verifiable before the next begins.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Project scaffolding, Supabase schema, storage buckets, security baseline
- [ ] **Phase 2: Auth & Design System** - Magic Link auth pipeline + Chakra UI theme + layout shell
- [ ] **Phase 3: Content & API Layer** - MDX pipeline, Data Access Layer, all Route Handlers
- [ ] **Phase 4: Public Pages** - All 12 public-facing pages wired to content and Supabase data
- [ ] **Phase 5: Dashboard** - Private member area for events, academic works, and contact management
- [ ] **Phase 6: SEO & Polish** - Metadata, sitemap, ISR/SSG strategy, image optimization

## Phase Details

### Phase 1: Foundation
**Goal**: The project runs locally and on Vercel, the database is fully provisioned with all tables and RLS, storage buckets exist, and the security baseline is in place before any feature is built.
**Depends on**: Nothing (first phase)
**Requirements**: SETUP-01, SETUP-02, SETUP-03, SETUP-04, SETUP-05, DB-01, DB-02, DB-03, DB-04, DB-05, DB-06, DB-07, DB-08, DB-09, SEC-01, SEC-02, SEC-05, SEC-07, SEC-08
**Success Criteria** (what must be TRUE):
  1. Running `npm run dev` starts the app locally with no errors and the Supabase client connects successfully.
  2. All 6 database tables exist in Supabase with correct columns, indexes, and RLS policies enabled — verifiable in the Supabase dashboard.
  3. The three storage buckets (`thumbnails`, `trabalhos-pdfs`, `avatares`) exist and accept test uploads via the Supabase dashboard.
  4. Deploying to Vercel succeeds and the live URL returns a 200 with no environment variable errors in logs.
  5. HTTP security headers (HSTS, CSP, X-Frame-Options) are present on every response, verifiable via browser devtools or securityheaders.com.
**Plans**: 4 plans

Plans:
- [x] 01-01-PLAN.md — Next.js scaffold, folder structure, .gitignore, env template
- [x] 01-02-PLAN.md — Supabase schema: all 6 tables, RLS policies, storage buckets
- [x] 01-03-PLAN.md — Supabase clients (browser/server/admin) + security headers + CORS
- [x] 01-04-PLAN.md — Vercel deployment + live URL verification

### Phase 2: Auth & Design System
**Goal**: Members can authenticate via Magic Link restricted to @ufpr.br, and every page has the correct CACIC visual identity with dark mode support — so the rest of the site can be built on a stable shell.
**Depends on**: Phase 1
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06, UI-01, UI-02, UI-03, UI-04, UI-05, UI-06, UI-07, UI-08, UI-09, UI-10, UI-11, UI-12, UI-13
**Success Criteria** (what must be TRUE):
  1. A visitor entering a non-@ufpr.br email on the login page sees a clear error and no magic link is sent.
  2. A valid @ufpr.br member receives a magic link, clicks it, and lands on `/dashboard` with their session persisted across browser refreshes.
  3. Navigating to `/dashboard` while unauthenticated redirects to `/login` immediately.
  4. The dark mode toggle switches the site between light and dark themes; the CACIC yellow (#F5B800) brand color is visible in both modes.
  5. The Navbar, Footer, PostCard, EventCard, WorkCard, MemberCard, and Hero components render correctly on mobile (375px) and desktop (1280px).
**Plans**: 6 plans

Plans:
- [x] 02-01-PLAN.md — Chakra UI v3 setup, theme config, semantic tokens, Google Fonts
- [x] 02-02-PLAN.md — Magic Link auth pipeline (login form, callback, middleware)
- [ ] 02-03-PLAN.md — Navbar and Footer (responsive layout shell)
- [ ] 02-04-PLAN.md — Card components (PostCard, EventCard, WorkCard, MemberCard)
- [ ] 02-05-PLAN.md — Hero section with SplitText animation
- [ ] 02-06-PLAN.md — Layout integration and Phase 2 verification checkpoint

### Phase 3: Content & API Layer
**Goal**: The MDX pipeline is operational so editors can publish posts and news by adding `.mdx` files to the repo, and all backend Route Handlers and the Data Access Layer are in place so pages can fetch live data safely.
**Depends on**: Phase 2
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, API-01, API-02, API-03, API-04, API-05, API-06, SEC-03, SEC-04, SEC-06, SEC-09
**Success Criteria** (what must be TRUE):
  1. Adding a new `.mdx` file with valid frontmatter to `content/posts/` and redeploying causes the post to appear at `/blog/[slug]` with correct styling (headings, code blocks, blockquotes).
  2. `POST /api/contato` rejects requests beyond 5 per 10 minutes from the same IP with a 429 response.
  3. `POST /api/upload` rejects files exceeding size limits or invalid types with a descriptive error, and accepted files are stored in Supabase Storage with a UUID filename.
  4. Client components never import from `src/lib/services/` directly — all data access goes through server components or Route Handlers (verifiable by code review / lint rule).
  5. `POST /api/views` increments the view count for a post slug without requiring authentication.
**Plans**: TBD

### Phase 4: Public Pages
**Goal**: Every public page of the blog is live, navigable, and populated with real content — visitors can browse posts, events, academic works, and member info without logging in.
**Depends on**: Phase 3
**Requirements**: PAGE-01, PAGE-02, PAGE-03, PAGE-04, PAGE-05, PAGE-06, PAGE-07, PAGE-08, PAGE-09, PAGE-10, PAGE-11, PAGE-12
**Success Criteria** (what must be TRUE):
  1. The Home page (`/`) displays the hero, at least one recent post, and at least one upcoming event fetched from Supabase.
  2. The Blog listing (`/blog`) shows all published posts with category filter working; clicking a post opens its full MDX content at `/blog/[slug]`.
  3. The Events listing (`/eventos`) shows upcoming events from Supabase; clicking one opens its detail page at `/eventos/[slug]`.
  4. The Works listing (`/trabalhos`) shows academic works; clicking one opens the detail page with a working PDF download link.
  5. The Members (`/membros`), About (`/sobre`), and Contact (`/contato`) pages load with content and the contact form submits successfully.
**Plans**: TBD

### Phase 5: Dashboard
**Goal**: Authenticated members can access a private dashboard where editors/admins can create and edit events, members can submit academic works with PDF uploads, and admins can read contact messages.
**Depends on**: Phase 4
**Requirements**: DASH-01, DASH-02, DASH-03, DASH-04
**Success Criteria** (what must be TRUE):
  1. A logged-in member lands on `/dashboard` and sees a summary of their account and site activity.
  2. A logged-in editor or admin can create a new event via the dashboard form and the event appears on `/eventos` after submission.
  3. A logged-in member can submit an academic work with a PDF attachment and the work appears on `/trabalhos` after submission.
  4. Only admin-role users can view the contact messages list; editor and member roles are denied access with a clear error.
**Plans**: TBD

### Phase 6: SEO & Polish
**Goal**: The site is fully indexed by search engines, pages load under 3 seconds, and images are served in the optimal format — making the blog production-ready for public launch.
**Depends on**: Phase 5
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04
**Success Criteria** (what must be TRUE):
  1. Every public page has unique `<title>`, `<meta description>`, Open Graph, and Twitter card tags — verifiable with a browser head inspector.
  2. `GET /sitemap.xml` returns a valid sitemap listing all public pages and published posts.
  3. MDX post pages use SSG (no network calls at request time) and Supabase-backed pages use ISR with a 60-second revalidation — verifiable in Next.js build output.
  4. All images on public pages are served via `next/image` with correct `width`/`height` attributes and no layout shift on load.
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 4/4 | All plans executed, awaiting checkpoints | 2026-03-09 |
| 2. Auth & Design System | 2/6 | Plans 02-01, 02-02 complete (theme + auth), proceeding to 02-03 | 2026-03-10 |
| 3. Content & API Layer | 0/TBD | Not started | - |
| 4. Public Pages | 0/TBD | Not started | - |
| 5. Dashboard | 0/TBD | Not started | - |
| 6. SEO & Polish | 0/TBD | Not started | - |
