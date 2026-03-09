# Blog CACIC — UTFPR Santa Helena

## What This Is

Blog oficial do Centro Acadêmico de Ciências da Computação da UTFPR-SH (CACIC) — hub de informações de tecnologia, vitrine de trabalhos acadêmicos, central de eventos e ponto de conexão entre os estudantes do curso. Construído com Next.js 14+, TypeScript e Supabase, seguindo o plano `Plano_Blog_CA_CC_UFPR.md`.

## Core Value

Ser o ponto de referência digital dos estudantes de CC da UTFPR-SH: um lugar onde podem encontrar eventos, publicar trabalhos acadêmicos e ler conteúdo técnico relevante ao curso.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Página Home com hero, posts recentes e próximos eventos
- [ ] Blog com posts em MDX (artigos técnicos e notícias)
- [ ] Listagem e página de detalhe de eventos (Supabase)
- [ ] Vitrine de trabalhos acadêmicos com upload de PDF (Supabase Storage)
- [ ] Página de membros da diretoria (Supabase)
- [ ] Formulário de contato com rate limiting (Upstash Redis)
- [ ] Página "Sobre" o CA
- [ ] Autenticação via Magic Link restrita a e-mail institucional (@ufpr.br)
- [ ] Dashboard privado para membros autenticados (criar eventos, submeter trabalhos)
- [ ] Sistema de roles: admin / editor / member
- [ ] Dark mode com identidade visual CACIC/UTFPR (amarelo #F5B800, preto, branco)
- [ ] SEO completo: meta tags, Open Graph, sitemap automático
- [ ] Security headers, RLS, validação Zod, proteção CORS

### Out of Scope

- Comentários em posts — complexidade extra sem valor claro na v1
- OAuth (Google, GitHub) — Magic Link com @ufpr.br é suficiente e mais seguro
- Busca full-text no frontend — deixar para v2 após validar necessidade
- Notificações por e-mail — fora do escopo do MVP

## Context

- Documento de referência completo em `Plano_Blog_CA_CC_UFPR.md` — cobre stack, schema SQL, RLS, segurança, design e estrutura de rotas
- Identidade visual baseada na logo do CACIC: amarelo UTFPR (#F5B800), preto (#0A0A0A), branco
- Conteúdo editorial (posts, notícias) em MDX — deploy estático via git push
- Dados dinâmicos (eventos, trabalhos, membros) no Supabase/PostgreSQL
- Supabase MCP Server disponível para criação de tabelas e RLS via linguagem natural
- Mobile-first: >60% dos leitores acessam por celular

## Constraints

- **Tech Stack**: Next.js 14+ App Router + TypeScript + Supabase + Chakra UI v3 — fixado pelo plano, não negociável
- **Auth**: Magic Link restrito a @ufpr.br — restrição institucional intencional
- **Deploy**: Vercel — integração nativa com Next.js
- **Segurança**: RLS obrigatório em todas as tabelas, service_role_key nunca no client
- **Performance**: <3s de carregamento (TTFB) — SSG/ISR para páginas públicas
- **Budget**: Tier gratuito do Supabase e Vercel — projeto sem fins lucrativos

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| MDX para posts/notícias | Zero custo de servidor, versionado no Git, simples de editar | — Pending |
| Supabase para dados dinâmicos | PostgreSQL real, Auth integrado, Storage, MCP Server | — Pending |
| Chakra UI v3 | Design system com dark mode nativo, tokens semânticos, acessibilidade | — Pending |
| Magic Link only (sem senha) | Sem risco de senha fraca, restrito a domínio institucional | — Pending |
| Upstash Redis para rate limiting | Edge-compatible, sem servidor dedicado, free tier generoso | — Pending |

---
*Last updated: 2026-03-09 after initialization*
