# Requirements — Blog CACIC UTFPR-SH

**Version:** v1
**Source:** `Plano_Blog_CA_CC_UFPR.md`
**Project:** Blog do Centro Acadêmico de Ciências da Computação — UTFPR Santa Helena

---

## v1 Requirements

### Setup & Infraestrutura

- [ ] **SETUP-01**: Projeto Next.js 14+ com App Router e TypeScript configurado
- [ ] **SETUP-02**: Supabase client configurado (server, browser e admin) com variáveis de ambiente seguras
- [ ] **SETUP-03**: `.gitignore` com `.env.local`, `.mcp.json` e `supabase/.temp/`
- [ ] **SETUP-04**: Deploy configurado na Vercel com variáveis de ambiente no painel (não em arquivos)
- [ ] **SETUP-05**: Estrutura de pastas `src/lib/` com supabase/, services/, validations/ e rate-limit.ts

### Banco de Dados & Supabase

- [ ] **DB-01**: Tabela `profiles` criada com trigger `update_updated_at` e índice em `username`
- [ ] **DB-02**: Tabela `eventos` criada com índices em `data_inicio`, `tipo` e `publicado`
- [ ] **DB-03**: Tabela `membros_diretoria` criada com índices em `gestao` e `ativo`
- [ ] **DB-04**: Tabela `trabalhos_academicos` criada com índice FTS em português (`to_tsvector`)
- [ ] **DB-05**: Tabela `contatos` criada com hash de IP para auditoria
- [ ] **DB-06**: Tabela `post_views` e view `post_view_counts` criadas
- [ ] **DB-07**: RLS habilitado em todas as 6 tabelas com policies corretas por papel
- [ ] **DB-08**: Storage buckets `thumbnails`, `trabalhos-pdfs` e `avatares` criados com policies públicas
- [ ] **DB-09**: Sistema de roles: `admin`, `editor`, `member` (CHECK constraint na tabela profiles)

### Autenticação

- [ ] **AUTH-01**: Magic Link restrito a e-mails `@ufpr.br` — erro claro para outros domínios
- [ ] **AUTH-02**: Callback de autenticação em `/auth/callback/route.ts` trocando code por sessão
- [ ] **AUTH-03**: Middleware protegendo `/dashboard/:path*` — redireciona para `/login` se não autenticado
- [ ] **AUTH-04**: Middleware usa `getUser()` no servidor (não `getSession()` sozinho)
- [ ] **AUTH-05**: Página de login com formulário de e-mail institucional
- [ ] **AUTH-06**: Página `/login/verifique-seu-email` após envio do magic link

### Design System & UI

- [ ] **UI-01**: Tema Chakra UI v3 com paleta CACIC/UTFPR (brand amarelo #F5B800, preto #0A0A0A, fundo logo CA #1E1E1E, branco)
- [ ] **UI-02**: Tokens semânticos configurados: `bg.canvas`, `bg.card`, `text.primary`, `border.brand`, etc.
- [ ] **UI-03**: Fontes Google: Space Grotesk (headings), Inter (body), JetBrains Mono (code)
- [ ] **UI-04**: Dark mode nativo com `ColorModeButton` do Chakra UI v3
- [ ] **UI-05**: `Navbar` responsiva com logo CACIC, links, badge "CA" amarelo, dark mode toggle
- [ ] **UI-06**: `Footer` com fundo preto, links, redes sociais e crédito UTFPR-SH
- [ ] **UI-07**: Componente `PostCard` com borda esquerda brand.500, badge de categoria, thumbnail
- [ ] **UI-08**: Componente `EventCard` com ícone do tipo, data em destaque, badge brand
- [ ] **UI-09**: Componente `WorkCard` com área, título, autores, botão de PDF
- [ ] **UI-10**: Componente `MemberCard` com foto, nome, cargo (TiltCard do React Bits)
- [ ] **UI-11**: Componente `CategoryBadge` com cores por categoria
- [ ] **UI-12**: Hero da Home com fundo preto, título animado (SplitText), CTA amarelo
- [ ] **UI-13**: Animações pontuais com React Bits: SplitText (hero), FadeContent (cards), CountUp (stats)

### Páginas Públicas

- [ ] **PAGE-01**: Home (`/`) com hero, posts recentes, próximos eventos e link para seções
- [ ] **PAGE-02**: Blog listing (`/blog`) com filtro por categoria e paginação
- [ ] **PAGE-03**: Post individual (`/blog/[slug]`) renderizando MDX com componentes Chakra
- [ ] **PAGE-04**: Notícias listing (`/noticias`) com posts em MDX
- [ ] **PAGE-05**: Notícia individual (`/noticias/[slug]`) renderizando MDX
- [ ] **PAGE-06**: Eventos listing (`/eventos`) com dados do Supabase, filtro por tipo
- [ ] **PAGE-07**: Evento individual (`/eventos/[slug]`) com dados completos do Supabase
- [ ] **PAGE-08**: Trabalhos listing (`/trabalhos`) com dados do Supabase, filtro por área
- [ ] **PAGE-09**: Trabalho individual (`/trabalhos/[slug]`) com resumo, autores e PDF para download
- [ ] **PAGE-10**: Membros (`/membros`) com diretoria atual do Supabase (TiltCard)
- [ ] **PAGE-11**: Sobre (`/sobre`) com informações do CA
- [ ] **PAGE-12**: Contato (`/contato`) com formulário validado (React Hook Form + Zod)

### Dashboard (Área Privada)

- [ ] **DASH-01**: Dashboard home (`/dashboard`) com resumo para membros autenticados
- [ ] **DASH-02**: Formulário de criação/edição de eventos no dashboard (editor/admin)
- [ ] **DASH-03**: Submissão de trabalhos acadêmicos com upload de PDF (member+)
- [ ] **DASH-04**: Listagem de mensagens de contato (admin only)

### API & Backend

- [ ] **API-01**: `POST /api/contato` com rate limiting (5/10min por IP) e validação Zod
- [ ] **API-02**: `GET/POST /api/eventos` e `GET/PATCH/DELETE /api/eventos/[slug]`
- [ ] **API-03**: `GET/POST /api/trabalhos` e `GET /api/trabalhos/[slug]`
- [ ] **API-04**: `POST /api/views` para contagem de visualizações (anônimo permitido)
- [ ] **API-05**: `POST /api/upload` com validação de tipo (JPEG/PNG/WebP/PDF) e tamanho (2MB/10MB)
- [ ] **API-06**: DAL (Data Access Layer) em `src/lib/services/` — client components nunca acessam banco diretamente

### Conteúdo MDX

- [ ] **CONT-01**: Estrutura `content/posts/` e `content/noticias/` com arquivos `.mdx`
- [ ] **CONT-02**: Frontmatter com `title`, `date`, `author`, `category`, `tags`, `summary`, `thumbnail`, `published`
- [ ] **CONT-03**: Componentes MDX customizados estilizados com Chakra (headings, code, blockquote, links)
- [ ] **CONT-04**: Geração estática de slugs para posts/notícias com `generateStaticParams`

### Segurança

- [ ] **SEC-01**: HTTP Security Headers configurados em `next.config.ts` (HSTS, CSP, X-Frame-Options, etc.)
- [ ] **SEC-02**: CORS restritivo — apenas domínio do projeto e localhost
- [ ] **SEC-03**: Rate limiting com Upstash Redis: contato (5/10min), login (10/1h), API (100/1min)
- [ ] **SEC-04**: Validação Zod em todos os Route Handlers e Server Actions
- [ ] **SEC-05**: `server-only` importado em todos arquivos com chaves privadas
- [ ] **SEC-06**: Sanitização HTML com DOMPurify nos campos que usam `dangerouslySetInnerHTML`
- [ ] **SEC-07**: Uploads com nome gerado por `crypto.randomUUID()` — nunca usar nome original do usuário
- [ ] **SEC-08**: Erros internos nunca expostos ao client — mensagem genérica + log detalhado no servidor
- [ ] **SEC-09**: Server Actions verificam autenticação + autorização no servidor (dupla verificação)

### SEO & Performance

- [ ] **SEO-01**: Metadata com `title`, `description`, `openGraph` e `twitter` por página
- [ ] **SEO-02**: `sitemap.xml` gerado automaticamente pelo Next.js
- [ ] **SEO-03**: Estratégia de cache: SSG puro para posts MDX, ISR (60s) para páginas Supabase
- [ ] **SEO-04**: Imagens otimizadas com `next/image` (WebP automático, lazy loading)

---

## v2 Requirements (Deferred)

- Busca full-text no frontend (Supabase FTS está no schema, falta expor na UI)
- Comentários em posts
- OAuth (Google/GitHub) além do Magic Link
- Notificações por e-mail para novos eventos
- PWA / notificações push
- Analytics avançado além do Vercel Analytics

---

## Out of Scope

- Comentários — complexidade sem valor claro no MVP
- OAuth social — Magic Link com @ufpr.br é suficiente para membros internos
- Notificações por e-mail — fora do escopo do blog
- Multi-tenancy / multi-campus — apenas UTFPR-SH na v1

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SETUP-01 | Phase 1 | Pending |
| SETUP-02 | Phase 1 | Pending |
| SETUP-03 | Phase 1 | Pending |
| SETUP-04 | Phase 1 | Pending |
| SETUP-05 | Phase 1 | Pending |
| DB-01 | Phase 1 | Pending |
| DB-02 | Phase 1 | Pending |
| DB-03 | Phase 1 | Pending |
| DB-04 | Phase 1 | Pending |
| DB-05 | Phase 1 | Pending |
| DB-06 | Phase 1 | Pending |
| DB-07 | Phase 1 | Pending |
| DB-08 | Phase 1 | Pending |
| DB-09 | Phase 1 | Pending |
| SEC-01 | Phase 1 | Pending |
| SEC-02 | Phase 1 | Pending |
| SEC-05 | Phase 1 | Pending |
| SEC-07 | Phase 1 | Pending |
| SEC-08 | Phase 1 | Pending |
| AUTH-01 | Phase 2 | Pending |
| AUTH-02 | Phase 2 | Pending |
| AUTH-03 | Phase 2 | Pending |
| AUTH-04 | Phase 2 | Pending |
| AUTH-05 | Phase 2 | Pending |
| AUTH-06 | Phase 2 | Pending |
| UI-01 | Phase 2 | Pending |
| UI-02 | Phase 2 | Pending |
| UI-03 | Phase 2 | Pending |
| UI-04 | Phase 2 | Pending |
| UI-05 | Phase 2 | Pending |
| UI-06 | Phase 2 | Pending |
| UI-07 | Phase 2 | Pending |
| UI-08 | Phase 2 | Pending |
| UI-09 | Phase 2 | Pending |
| UI-10 | Phase 2 | Pending |
| UI-11 | Phase 2 | Pending |
| UI-12 | Phase 2 | Pending |
| UI-13 | Phase 2 | Pending |
| CONT-01 | Phase 3 | Pending |
| CONT-02 | Phase 3 | Pending |
| CONT-03 | Phase 3 | Pending |
| API-01 | Phase 3 | Pending |
| API-02 | Phase 3 | Pending |
| API-03 | Phase 3 | Pending |
| API-04 | Phase 3 | Pending |
| API-05 | Phase 3 | Pending |
| API-06 | Phase 3 | Pending |
| SEC-03 | Phase 3 | Pending |
| SEC-04 | Phase 3 | Pending |
| SEC-06 | Phase 3 | Pending |
| SEC-09 | Phase 3 | Pending |
| CONT-04 | Phase 4 | Pending |
| PAGE-01 | Phase 4 | Pending |
| PAGE-02 | Phase 4 | Pending |
| PAGE-03 | Phase 4 | Pending |
| PAGE-04 | Phase 4 | Pending |
| PAGE-05 | Phase 4 | Pending |
| PAGE-06 | Phase 4 | Pending |
| PAGE-07 | Phase 4 | Pending |
| PAGE-08 | Phase 4 | Pending |
| PAGE-09 | Phase 4 | Pending |
| PAGE-10 | Phase 4 | Pending |
| PAGE-11 | Phase 4 | Pending |
| PAGE-12 | Phase 4 | Pending |
| DASH-01 | Phase 5 | Pending |
| DASH-02 | Phase 5 | Pending |
| DASH-03 | Phase 5 | Pending |
| DASH-04 | Phase 5 | Pending |
| SEO-01 | Phase 6 | Pending |
| SEO-02 | Phase 6 | Pending |
| SEO-03 | Phase 6 | Pending |
| SEO-04 | Phase 6 | Pending |

---

*Generated: 2026-03-09*
