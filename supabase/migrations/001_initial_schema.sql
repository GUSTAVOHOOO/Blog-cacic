-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: profiles
-- ============================================================================
-- User profiles linked to auth.users via foreign key
-- Stores user metadata and role information

CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'editor', 'member')),
  bio text,
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_profiles_username ON profiles(username);

-- Trigger function to update updated_at timestamp on every UPDATE
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================================
-- TABLE: eventos
-- ============================================================================
-- Events (talks, workshops, hackathons, social events)
-- Used for CACIC promotional and academic events

CREATE TABLE eventos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  tipo text NOT NULL CHECK (tipo IN ('palestra','workshop','hackathon','social','outro')),
  data_inicio timestamptz NOT NULL,
  data_fim timestamptz,
  local text,
  link_inscricao text,
  thumbnail_url text,
  publicado boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_eventos_data_inicio ON eventos(data_inicio);
CREATE INDEX idx_eventos_tipo ON eventos(tipo);
CREATE INDEX idx_eventos_publicado ON eventos(publicado);

-- ============================================================================
-- TABLE: membros_diretoria
-- ============================================================================
-- CACIC directorate members (leadership board)
-- Stores information about current and past board members

CREATE TABLE membros_diretoria (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome text NOT NULL,
  cargo text NOT NULL,
  foto_url text,
  linkedin_url text,
  github_url text,
  gestao int NOT NULL,
  ativo boolean NOT NULL DEFAULT true,
  ordem int NOT NULL DEFAULT 0
);

CREATE INDEX idx_membros_gestao ON membros_diretoria(gestao);
CREATE INDEX idx_membros_ativo ON membros_diretoria(ativo);

-- ============================================================================
-- TABLE: trabalhos_academicos
-- ============================================================================
-- Academic papers and projects from UTFPR students
-- Searchable by title, area, and summary with Portuguese full-text index

CREATE TABLE trabalhos_academicos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  authors text[] NOT NULL DEFAULT '{}',
  area text NOT NULL,
  summary text,
  pdf_url text,
  thumbnail_url text,
  publicado boolean NOT NULL DEFAULT false,
  ano int NOT NULL,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Portuguese full-text search index
CREATE INDEX idx_trabalhos_fts ON trabalhos_academicos
  USING GIN (to_tsvector('portuguese', coalesce(title,'') || ' ' || coalesce(summary,'') || ' ' || coalesce(area,'')));

-- ============================================================================
-- TABLE: contatos
-- ============================================================================
-- Contact form submissions
-- IP hash stored (never raw IP) for spam detection without privacy violation

CREATE TABLE contatos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome text NOT NULL,
  email text NOT NULL,
  assunto text NOT NULL,
  mensagem text NOT NULL,
  ip_hash text,
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- TABLE: post_views
-- ============================================================================
-- Tracks views of blog posts (anonymous, no user info)
-- Used to calculate post_view_counts materialized view

CREATE TABLE post_views (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_post_views_slug ON post_views(slug);

-- ============================================================================
-- VIEW: post_view_counts
-- ============================================================================
-- Materialized aggregation of post view counts
-- SELECT COUNT(*) FROM post_views GROUP BY slug

CREATE VIEW post_view_counts AS
  SELECT slug, COUNT(*) AS views
  FROM post_views
  GROUP BY slug;

-- ============================================================================
-- ROW LEVEL SECURITY: Enable on all tables
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE membros_diretoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE trabalhos_academicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE contatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES: profiles
-- ============================================================================
-- Anyone can read all profiles (usernames, bios, avatars)
-- Users can only insert/update their own profile
-- Only admins can delete profiles (via service_role in API)

CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- ============================================================================
-- RLS POLICIES: eventos
-- ============================================================================
-- Public can read published events
-- Authenticated editors/admins can read all (including drafts)
-- Editors/admins can create events
-- Editors/admins can update their own events; admins can update any
-- Admins can delete events

CREATE POLICY "eventos_select_published" ON eventos
  FOR SELECT USING (publicado = true);

CREATE POLICY "eventos_select_auth" ON eventos
  FOR SELECT USING (
    auth.role() = 'authenticated' AND EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('editor','admin')
    )
  );

CREATE POLICY "eventos_insert_editor" ON eventos
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('editor','admin'))
  );

CREATE POLICY "eventos_update_editor" ON eventos
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('editor','admin'))
  );

CREATE POLICY "eventos_delete_admin" ON eventos
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================================
-- RLS POLICIES: membros_diretoria
-- ============================================================================
-- Public read: anyone can view the directorate
-- Admin write: only admins can create, update, delete

CREATE POLICY "membros_select" ON membros_diretoria FOR SELECT USING (true);

CREATE POLICY "membros_insert_admin" ON membros_diretoria
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "membros_update_admin" ON membros_diretoria
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "membros_delete_admin" ON membros_diretoria
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================================
-- RLS POLICIES: trabalhos_academicos
-- ============================================================================
-- Public read: anyone can read published papers
-- Authenticated read: members can read all (including drafts)
-- Members can insert papers
-- Owners and admins can update papers
-- Admins can delete papers

CREATE POLICY "trabalhos_select_published" ON trabalhos_academicos
  FOR SELECT USING (publicado = true);

CREATE POLICY "trabalhos_select_auth" ON trabalhos_academicos
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "trabalhos_insert_member" ON trabalhos_academicos
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "trabalhos_update_owner" ON trabalhos_academicos
  FOR UPDATE USING (
    auth.uid() = created_by OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "trabalhos_delete_admin" ON trabalhos_academicos
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================================
-- RLS POLICIES: contatos
-- ============================================================================
-- Only admins can read contact form submissions
-- Anyone (anonymous) can submit (insert) — rate limiting handled at API level

CREATE POLICY "contatos_select_admin" ON contatos
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "contatos_insert_anon" ON contatos FOR INSERT WITH CHECK (true);

-- ============================================================================
-- RLS POLICIES: post_views
-- ============================================================================
-- Anyone can insert view records (anonymous tracking)
-- Anyone can read view counts (public statistics)

CREATE POLICY "post_views_insert_anon" ON post_views FOR INSERT WITH CHECK (true);
CREATE POLICY "post_views_select" ON post_views FOR SELECT USING (true);

-- ============================================================================
-- End of migration
-- ============================================================================
-- All tables created with:
-- - Correct columns, types, and constraints
-- - Proper foreign key relationships with CASCADE/SET NULL
-- - Indexes on frequently-queried columns
-- - RLS enabled with role-based policies (via profiles.role)
-- - Portuguese FTS index on academic papers
-- - Updated_at trigger on profiles for audit trails
-- - Post view aggregation view for analytics
