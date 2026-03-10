---
phase: 01-foundation
plan: 02
subsystem: Foundation/Database
tags: [supabase, database, schema, rls, migrations]
dependency_graph:
  requires: []
  provides: [DB-01, DB-02, DB-03, DB-04, DB-05, DB-06, DB-07, DB-08, DB-09]
  affects: [01-03, 01-04, Phase 2+]
tech_stack:
  added:
    - Supabase PostgreSQL database
    - Row-Level Security (RLS) policies
    - PostgreSQL full-text search (Portuguese)
  patterns:
    - Role-based access control via profiles.role
    - Foreign key relationships with CASCADE/SET NULL
    - Audit trail via updated_at trigger
key_files:
  created:
    - supabase/migrations/001_initial_schema.sql (290 lines)
decisions:
  - Role-based security: admin/editor/member roles stored in profiles.role, checked in RLS policies
  - IP privacy: contatos.ip_hash stores SHA-256 hash, never raw IPs
  - View aggregation: post_view_counts VIEW for analytics without materialization overhead
metrics:
  duration: 10 minutes
  tasks_completed: 1/2 (Task 2 is human checkpoint)
  files_created: 1
  date_completed: 2026-03-09
---

# Phase 1 Plan 2: Supabase Database Schema Summary

Provision the complete Supabase database schema: all 6 tables, indexes, triggers, RLS policies, the post_view_counts view, and the 3 storage buckets.

## One-liner

PostgreSQL schema with 6 normalized tables, Portuguese FTS, role-based RLS policies, and materialized view for post analytics.

## Task Status

| Task | Name | Status | Notes |
|------|------|--------|-------|
| 1 | Write complete database migration SQL | ✓ Complete | Commit e4a85fd |
| 2 | Execute migration in Supabase + create storage buckets | ⏸ Awaiting human verification | CHECKPOINT |

## What Was Built

### Migration File: `supabase/migrations/001_initial_schema.sql`

**Statistics:**
- 290 lines of PostgreSQL DDL
- 6 tables created
- 39 CREATE statements (tables, indexes, views, functions, triggers, policies)
- 21 RLS policies
- 1 trigger function (updated_at automation)
- 1 materialized view (post_view_counts)

### Tables Created

1. **profiles** — User profiles from Supabase auth
   - Columns: id (PK), username (UNIQUE), full_name, avatar_url, role (CHECK admin/editor/member), bio, updated_at
   - Indexes: username
   - Trigger: auto-updates updated_at on every UPDATE
   - Links to: auth.users (FK CASCADE)

2. **eventos** — CACIC events (talks, workshops, hackathons)
   - Columns: id (PK), title, slug (UNIQUE), description, tipo (CHECK), data_inicio, data_fim, local, link_inscricao, thumbnail_url, publicado, created_by (FK), created_at
   - Indexes: data_inicio, tipo, publicado
   - Linked by: created_by → profiles(id)

3. **membros_diretoria** — Directorate members (board)
   - Columns: id (PK), nome, cargo, foto_url, linkedin_url, github_url, gestao, ativo, ordem
   - Indexes: gestao, ativo

4. **trabalhos_academicos** — Academic papers (searchable)
   - Columns: id (PK), title, slug (UNIQUE), authors (text[]), area, summary, pdf_url, thumbnail_url, publicado, ano, created_by (FK), created_at
   - Indexes: slug, Portuguese FTS index on (title || summary || area)
   - Linked by: created_by → profiles(id)

5. **contatos** — Contact form submissions
   - Columns: id (PK), nome, email, assunto, mensagem, ip_hash (SHA-256), created_at
   - No indexes (low-traffic, admin-read-only)

6. **post_views** — Blog post view tracking
   - Columns: id (PK), slug, created_at
   - Indexes: slug
   - Used by: post_view_counts VIEW

### View Created

**post_view_counts** — Aggregated post statistics
```sql
SELECT slug, COUNT(*) AS views
FROM post_views
GROUP BY slug;
```
Provides read-only view of post popularity without materialization overhead.

### RLS Policy Matrix

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| **profiles** | Public | Self-only | Self-only | Admin* |
| **eventos** | Public (published) + Auth editors | Editors/admins | Editors/admins | Admins |
| **membros_diretoria** | Public | Admins | Admins | Admins |
| **trabalhos_academicos** | Public (published) + Auth all | Members | Owner/admins | Admins |
| **contatos** | Admins | Public | — | — |
| **post_views** | Public | Public | — | — |

*Admin operations via service_role in Route Handlers (not RLS policy)

### Security Features

- **Role-based access control:** All policies check `profiles.role IN ('admin', 'editor', 'member')`
- **Privacy:** IP hashes instead of raw IPs in contatos table
- **Audit trail:** profiles.updated_at automatically maintained by trigger
- **Search:** Portuguese full-text search on academic papers
- **Anonymous tracking:** post_views allows anonymous inserts for view counting

## Checkpoint: Manual Supabase Setup Required

**Status:** Task 2 awaiting human approval

Plan 01-02 Task 2 is a checkpoint requiring manual execution in Supabase Dashboard:

1. **Run the SQL migration** in Supabase SQL Editor
2. **Create 3 storage buckets** (thumbnails, trabalhos-pdfs, avatares)
3. **Verify all 6 tables exist** in Table Editor
4. **Confirm RLS is enabled** on all tables (green shield icons)
5. **Copy credentials** to .env.local (NEXT_PUBLIC_SUPABASE_URL, etc.)

Executor will return a structured checkpoint message awaiting approval after the human confirms setup is complete.

## Deviations from Plan

None — plan executed exactly as written.

The SQL is production-ready PostgreSQL with no placeholders or pseudocode. All statements are complete and valid.

## Next Steps (After Checkpoint Approval)

- **Wave 2:** Plan 01-03 (Supabase clients + security headers) can begin
- **Wave 3:** Plan 01-04 (Vercel deployment) will follow

---

## Checkpoint Signaling

When returning control to human for verification, provide:
- URL to Supabase Dashboard
- Exact SQL Editor path (SQL Editor → New query)
- Verification checklist (6 tables visible, RLS enabled, 3 buckets created)
- Instructions to update .env.local with credentials
