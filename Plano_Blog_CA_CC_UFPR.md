# PLANO DE DESENVOLVIMENTO
## Blog do Centro Acadêmico de Ciências da Computação — UFPR
**Next.js + React + Supabase · Guia completo para construção com Claude Code · Março de 2026**

---

## 1. Visão Geral do Projeto

Este documento é o guia de referência para o desenvolvimento do blog oficial do Centro Acadêmico de Ciências da Computação da UFPR usando o Claude Code. Cobre arquitetura, banco de dados, API, segurança, design e gestão de conteúdo.

> 🎯 **Objetivo Central**
> Criar um blog moderno, rápido e seguro para o CA de CC da UFPR — hub de informações de tecnologia, vitrine de trabalhos acadêmicos, central de eventos e ponto de conexão entre os estudantes do curso.

### 1.1 Referências de Mercado

A estrutura foi baseada em boas práticas de blogs universitários e plataformas técnicas em 2025/2026:

- Navegação clara com categorias bem definidas e página "Sobre"
- Conteúdo escaneável: títulos, subtítulos, imagens e parágrafos curtos
- Mobile-first: mais de 60% dos leitores acessam por celular
- Performance: sites com mais de 3s de carregamento perdem 53% dos visitantes
- SEO integrado: meta tags, Open Graph e sitemap automático
- Seção de destaque na home para posts recentes e eventos próximos

---

## 2. Stack Tecnológica Completa

| Camada | Tecnologia | Papel |
|---|---|---|
| Framework | Next.js 14+ (App Router) | Renderização, roteamento, SSG/SSR |
| Linguagem | TypeScript | Tipagem estática em todo o projeto |
| **Banco de Dados** | **Supabase (PostgreSQL)** | **Dados dinâmicos: eventos, membros, contatos** |
| **Autenticação** | **Supabase Auth** | **Login dos membros do CA** |
| **Storage** | **Supabase Storage** | **Upload de imagens, PDFs de trabalhos** |
| UI Components | Chakra UI v3 | Design system, acessibilidade, dark mode |
| Animações | React Bits + Framer Motion | Animações pontuais no Hero |
| Conteúdo estático | MDX + gray-matter | Posts e artigos |
| Formulários | React Hook Form + Zod | Validação client e server-side |
| Rate Limiting | Upstash Redis | Proteção de endpoints e formulários |
| Deploy | Vercel | Deploy automático via Git push |
| Controle de versão | Git + GitHub | Versionamento de código e conteúdo MDX |
| Analytics | Vercel Analytics | Métricas sem armazenar dados pessoais |

> 💡 **Divisão de responsabilidades: Supabase vs MDX**
>
> - **MDX** → conteúdo editorial estático (posts, artigos) — gerado em build time, zero custo de servidor
> - **Supabase** → dados dinâmicos que mudam com frequência (eventos, membros, formulários)

---

## 3. Backend — Supabase & PostgreSQL

### 3.1 Por que Supabase?

- **PostgreSQL real** — full-text search, triggers, funções, views e RLS
- **API automática** — PostgREST gera endpoints REST por tabela automaticamente
- **Auth integrado** — JWT, OAuth e magic links prontos
- **Storage** — bucket de arquivos com CDN global
- **MCP Server oficial** — Claude Code cria tabelas e configura RLS por linguagem natural
- **Gratuito para projetos pequenos** — tier free cobre as necessidades do blog

---

### 3.2 Supabase MCP Server

<https://supabase.com/docs/guides/getting-started/mcp>

MCP Server oficial conecta ao Claude Code — cria tabelas, configura RLS e roda migrations via linguagem natural.

#### Capacidades

- ✅ Criar e modificar tabelas com SQL natural
- ✅ Gerar e aplicar migrations automaticamente
- ✅ Configurar Row Level Security (RLS) policies
- ✅ Rodar queries SQL para consultar e testar dados
- ✅ Gerar tipos TypeScript baseados no schema atual
- ✅ Gerenciar branches de banco (ambientes dev/prod)

#### Configuração recomendada — OAuth (sem expor chaves)

```json
// .mcp.json — adicionar ao .gitignore!
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--project-ref", "<seu-project-ref>"
      ]
    }
  }
}
```

> ⚠️ Adicione `.mcp.json` ao `.gitignore` imediatamente. MCP deve ser usado **apenas em desenvolvimento**, nunca apontando para dados de produção.

#### Exemplos de uso

```
"Crie uma tabela 'eventos' com id, titulo, descricao, data, local, tipo e created_at"
"Habilite RLS na tabela eventos com policy de leitura pública apenas para publicados"
"Gere os tipos TypeScript do schema e salve em /src/types/supabase.ts"
```

---

### 3.3 Configuração Inicial

#### Instalação

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install @upstash/ratelimit @upstash/redis
npm install server-only
```

#### Variáveis de ambiente (`.env.local`)

```env
# Seguras para o client (prefixo NEXT_PUBLIC_)
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
NEXT_PUBLIC_SITE_URL=https://ca-cc-ufpr.vercel.app

# SOMENTE servidor — JAMAIS usar NEXT_PUBLIC_ aqui
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
UPSTASH_REDIS_REST_URL=<url>
UPSTASH_REDIS_REST_TOKEN=<token>
```

> 🔴 `SUPABASE_SERVICE_ROLE_KEY` bypassa RLS completamente. Jamais use com prefixo `NEXT_PUBLIC_`. Jamais retorne em respostas de API. Jamais importe em arquivos com `"use client"`.

#### Cliente servidor (`/src/lib/supabase/server.ts`)

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

#### Cliente browser (`/src/lib/supabase/client.ts`)

```ts
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

---

### 3.4 Schema do Banco de Dados

Todas as migrations ficam em `/supabase/migrations/` e são versionadas no Git.

#### Tabela: `profiles`

```sql
CREATE TABLE public.profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name    TEXT NOT NULL,
  username     TEXT UNIQUE NOT NULL,
  avatar_url   TEXT,
  bio          TEXT,
  role         TEXT NOT NULL DEFAULT 'member'
               CHECK (role IN ('admin', 'editor', 'member')),
  github_url   TEXT,
  linkedin_url TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_username ON public.profiles(username);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

#### Tabela: `eventos`

```sql
CREATE TABLE public.eventos (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo         TEXT NOT NULL,
  slug           TEXT UNIQUE NOT NULL,
  descricao      TEXT,
  data_inicio    TIMESTAMPTZ NOT NULL,
  data_fim       TIMESTAMPTZ,
  local          TEXT,
  tipo           TEXT NOT NULL DEFAULT 'outro'
                 CHECK (tipo IN ('palestra', 'workshop', 'hackathon', 'reuniao', 'social', 'outro')),
  link_inscricao TEXT,
  thumbnail_url  TEXT,
  publicado      BOOLEAN DEFAULT FALSE,
  autor_id       UUID REFERENCES public.profiles(id),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_eventos_data      ON public.eventos(data_inicio);
CREATE INDEX idx_eventos_tipo      ON public.eventos(tipo);
CREATE INDEX idx_eventos_publicado ON public.eventos(publicado);

CREATE TRIGGER eventos_updated_at
  BEFORE UPDATE ON public.eventos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

#### Tabela: `membros_diretoria`

```sql
CREATE TABLE public.membros_diretoria (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  cargo      TEXT NOT NULL,
  gestao     TEXT NOT NULL,
  ativo      BOOLEAN DEFAULT TRUE,
  ordem      INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_membros_gestao ON public.membros_diretoria(gestao);
CREATE INDEX idx_membros_ativo  ON public.membros_diretoria(ativo);
```

#### Tabela: `trabalhos_academicos`

```sql
CREATE TABLE public.trabalhos_academicos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo        TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  resumo        TEXT NOT NULL,
  autores       TEXT[] NOT NULL,
  ano           INTEGER NOT NULL,
  area          TEXT NOT NULL
                CHECK (area IN (
                  'algoritmos', 'ia_ml', 'sistemas_operacionais',
                  'redes', 'banco_de_dados', 'engenharia_software',
                  'computacao_grafica', 'seguranca', 'outro'
                )),
  disciplina    TEXT,
  orientador    TEXT,
  pdf_url       TEXT,
  thumbnail_url TEXT,
  publicado     BOOLEAN DEFAULT FALSE,
  submetido_por UUID REFERENCES public.profiles(id),
  views         INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trabalhos_area      ON public.trabalhos_academicos(area);
CREATE INDEX idx_trabalhos_ano       ON public.trabalhos_academicos(ano DESC);
CREATE INDEX idx_trabalhos_publicado ON public.trabalhos_academicos(publicado);

-- Full-text search em português
CREATE INDEX idx_trabalhos_fts ON public.trabalhos_academicos
  USING GIN(to_tsvector('portuguese', titulo || ' ' || resumo));

CREATE TRIGGER trabalhos_updated_at
  BEFORE UPDATE ON public.trabalhos_academicos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

#### Tabela: `contatos`

```sql
CREATE TABLE public.contatos (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome       TEXT NOT NULL,
  email      TEXT NOT NULL,
  assunto    TEXT NOT NULL,
  mensagem   TEXT NOT NULL,
  lido       BOOLEAN DEFAULT FALSE,
  ip_hash    TEXT,   -- SHA-256 do IP para auditoria, sem armazenar o IP real
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contatos_lido    ON public.contatos(lido);
CREATE INDEX idx_contatos_created ON public.contatos(created_at DESC);
```

#### Tabela: `post_views`

```sql
CREATE TABLE public.post_views (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_slug TEXT NOT NULL,
  post_type TEXT NOT NULL CHECK (post_type IN ('blog', 'noticia', 'trabalho')),
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_hash   TEXT
);

CREATE INDEX idx_views_slug ON public.post_views(post_slug);

CREATE VIEW public.post_view_counts AS
  SELECT post_slug, post_type, COUNT(*) AS total_views
  FROM public.post_views
  GROUP BY post_slug, post_type;
```

---

### 3.5 Row Level Security (RLS)

RLS é o mecanismo do PostgreSQL que define quem lê e escreve cada linha diretamente no banco — a última linha de defesa mesmo que a aplicação tenha um bug.

#### Habilitando em todas as tabelas

```sql
ALTER TABLE public.profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membros_diretoria     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trabalhos_academicos  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contatos              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_views            ENABLE ROW LEVEL SECURITY;
```

> Com RLS habilitado e sem nenhuma policy, a tabela fica **completamente inacessível** para todos — seguro por padrão.

#### Policies — `profiles`

```sql
CREATE POLICY "perfis_leitura_publica"
  ON public.profiles FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "perfis_edicao_proprio"
  ON public.profiles FOR UPDATE TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);
```

#### Policies — `eventos`

```sql
CREATE POLICY "eventos_leitura_publica"
  ON public.eventos FOR SELECT TO anon, authenticated
  USING (publicado = true);

CREATE POLICY "eventos_leitura_privilegiada"
  ON public.eventos FOR SELECT TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT id FROM public.profiles WHERE role IN ('admin', 'editor')
    )
  );

CREATE POLICY "eventos_insercao_editor"
  ON public.eventos FOR INSERT TO authenticated
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT id FROM public.profiles WHERE role IN ('admin', 'editor')
    )
  );

CREATE POLICY "eventos_edicao"
  ON public.eventos FOR UPDATE TO authenticated
  USING (
    (select auth.uid()) IN (SELECT id FROM public.profiles WHERE role = 'admin')
    OR autor_id = (select auth.uid())
  );

CREATE POLICY "eventos_delecao_admin"
  ON public.eventos FOR DELETE TO authenticated
  USING (
    (select auth.uid()) IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );
```

#### Policies — `trabalhos_academicos`

```sql
CREATE POLICY "trabalhos_leitura_publica"
  ON public.trabalhos_academicos FOR SELECT TO anon, authenticated
  USING (publicado = true);

CREATE POLICY "trabalhos_insercao_autenticado"
  ON public.trabalhos_academicos FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = submetido_por);

CREATE POLICY "trabalhos_edicao"
  ON public.trabalhos_academicos FOR UPDATE TO authenticated
  USING (
    (select auth.uid()) IN (SELECT id FROM public.profiles WHERE role = 'admin')
    OR submetido_por = (select auth.uid())
  );
```

#### Policies — `contatos`

```sql
CREATE POLICY "contatos_insercao_publica"
  ON public.contatos FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "contatos_leitura_admin"
  ON public.contatos FOR SELECT TO authenticated
  USING (
    (select auth.uid()) IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );
```

#### Policies — `post_views`

```sql
CREATE POLICY "views_insercao_publica"
  ON public.post_views FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "views_leitura_publica"
  ON public.post_views FOR SELECT TO anon, authenticated USING (true);
```

#### Tabela de permissões por papel

| Ação | `anon` | `member` | `editor` | `admin` |
|---|:---:|:---:|:---:|:---:|
| Ler posts publicados | ✅ | ✅ | ✅ | ✅ |
| Ler rascunhos | ❌ | ❌ | ✅ (próprios) | ✅ |
| Criar evento | ❌ | ❌ | ✅ | ✅ |
| Editar evento | ❌ | ❌ | ✅ (próprio) | ✅ |
| Deletar evento | ❌ | ❌ | ❌ | ✅ |
| Submeter trabalho | ❌ | ✅ | ✅ | ✅ |
| Aprovar trabalho | ❌ | ❌ | ❌ | ✅ |
| Ver mensagens de contato | ❌ | ❌ | ❌ | ✅ |
| Enviar mensagem | ✅ | ✅ | ✅ | ✅ |

---

### 3.6 Autenticação com Supabase Auth

Login **apenas para membros do CA** — publicar eventos, submeter trabalhos e acessar o painel.

#### Magic Link com restrição de domínio

```ts
// /src/app/login/actions.ts
'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function loginWithMagicLink(email: string) {
  // Aceita apenas e-mails da UFPR
  if (!email.endsWith('@ufpr.br')) {
    throw new Error('Use seu e-mail institucional da UFPR (@ufpr.br)')
  }

  const supabase = createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) throw error
  redirect('/login/verifique-seu-email')
}
```

#### Callback de autenticação

```ts
// /src/app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}
```

#### Middleware de proteção de rotas

```ts
// /src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { /* getAll/setAll */ } }
  )

  // getUser() valida o token no servidor — não confia apenas no cookie
  const { data: { user } } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
}
```

> ⚠️ Sempre use `getUser()` no servidor, nunca `getSession()` sozinho. O `getUser()` valida o JWT no servidor Supabase; o `getSession()` apenas lê o cookie sem revalidar — pode ser forjado.

---

### 3.7 Supabase Storage

#### Buckets

| Bucket | Tipo | Conteúdo |
|---|---|---|
| `thumbnails` | Público | Imagens de capa |
| `trabalhos-pdfs` | Público | PDFs para download |
| `avatares` | Público | Fotos de perfil |

```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('thumbnails', 'thumbnails', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('trabalhos-pdfs', 'trabalhos-pdfs', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatares', 'avatares', true);

CREATE POLICY "leitura_publica_thumbnails" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'thumbnails');
CREATE POLICY "upload_autenticado_thumbnails" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'thumbnails');
CREATE POLICY "leitura_publica_pdfs" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'trabalhos-pdfs');
CREATE POLICY "upload_autenticado_pdfs" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'trabalhos-pdfs');
```

---

### 3.8 Camada de Serviços (DAL)

```ts
// /src/lib/services/eventos.ts
import { createClient } from '../supabase/server'

export async function getEventosProximos(limite = 3) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('eventos')
    .select(`id, titulo, slug, descricao, data_inicio, data_fim, local, tipo,
             link_inscricao, thumbnail_url, profiles!autor_id(full_name, avatar_url)`)
    .eq('publicado', true)
    .gte('data_inicio', new Date().toISOString())
    .order('data_inicio', { ascending: true })
    .limit(limite)
  if (error) throw error
  return data
}

export async function getEventoBySlug(slug: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('eventos')
    .select('*, profiles!autor_id(*)')
    .eq('slug', slug)
    .eq('publicado', true)
    .single()
  if (error) throw error
  return data
}
```

---

### 3.9 Route Handlers

```
/src/app/api/
  ├── contato/route.ts           → POST com rate limit
  ├── eventos/route.ts           → GET / POST
  ├── eventos/[slug]/route.ts    → GET / PATCH / DELETE
  ├── trabalhos/route.ts         → GET / POST
  ├── trabalhos/[slug]/route.ts  → GET
  └── views/route.ts             → POST
```

```ts
// /src/app/api/contato/route.ts — exemplo com rate limit e validação
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { enviarMensagem } from '@/lib/services/contatos'
import { rateLimiters, checkRateLimit, getClientIp } from '@/lib/rate-limit'

const schema = z.object({
  nome:     z.string().min(2).max(100),
  email:    z.string().email(),
  assunto:  z.string().min(5).max(200),
  mensagem: z.string().min(10).max(2000),
})

export async function POST(request: Request) {
  const ip = getClientIp(request)
  const { allowed } = await checkRateLimit(rateLimiters.contato, ip)

  if (!allowed) {
    return NextResponse.json(
      { erro: 'Muitas tentativas. Aguarde alguns minutos.' },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const dados = schema.parse(body)
    await enviarMensagem(dados)
    return NextResponse.json({ mensagem: 'Mensagem enviada!' }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ erro: 'Dados inválidos' }, { status: 400 })
    }
    console.error('[API/contato]', error)
    return NextResponse.json({ erro: 'Erro interno' }, { status: 500 })
  }
}
```

---

### 3.10 Tipos TypeScript

```bash
npx supabase gen types typescript \
  --project-id <seu-project-ref> \
  --schema public \
  > src/types/supabase.ts
```

Com MCP ativo: `"Gere os tipos TypeScript do schema e salve em /src/types/supabase.ts"`

---

## 4. Segurança — Guia Completo

> 🔐 Esta seção cobre **todas as camadas de segurança** do projeto. Cada item deve estar implementado antes do deploy em produção. Segurança de uma aplicação web é como uma cebola: cada camada protege as demais.

---

### 4.1 Princípio Fundamental: Nunca Confie no Cliente

O browser é território inimigo. Qualquer coisa que o usuário pode ver, ele pode manipular: variáveis JavaScript, cookies, payloads de formulários, parâmetros de URL.

**Regra de ouro:** Toda validação crítica acontece no servidor. O client valida para UX; o servidor sempre revalida para segurança.

---

### 4.2 Gerenciamento de Chaves e Variáveis de Ambiente

A causa número um de vazamentos de dados em aplicações web é a exposição acidental de chaves.

#### O que é seguro expor ao client

| Variável | Segura no Client? | Motivo |
|---|:---:|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | URL pública, protegida pelo RLS |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Chave de leitura pública, RLS controla o acesso |
| `SUPABASE_SERVICE_ROLE_KEY` | 🔴 NUNCA | Bypassa RLS, acesso total ao banco |
| `UPSTASH_REDIS_REST_TOKEN` | 🔴 NUNCA | Acesso total ao Redis |
| Qualquer `*_SECRET_*` | 🔴 NUNCA | Por definição é um segredo |

#### Regras de ouro

```
✅  Variável no servidor = sem prefixo NEXT_PUBLIC_
✅  Variável no client = apenas com NEXT_PUBLIC_, e que seja realmente pública
🔴  Jamais colocar NEXT_PUBLIC_ em chaves privadas
🔴  Jamais retornar variáveis de ambiente em respostas de API
🔴  Jamais importar process.env.SUPABASE_SERVICE_ROLE_KEY em arquivos "use client"
```

#### `.gitignore` obrigatório

```gitignore
# Variáveis de ambiente — NUNCA commitar
.env
.env.local
.env.*.local
.env.production

# MCP e configs locais
.mcp.json
supabase/.temp/
```

#### Pacote `server-only` — proteção em tempo de build

Instale e importe em qualquer arquivo que usa chaves privadas. Se esse arquivo for importado num Client Component, o build **quebra com erro** — evitando vazamentos silenciosos.

```ts
// /src/lib/supabase/admin.ts
import 'server-only'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// Este cliente bypassa RLS — usar apenas para operações admin server-side
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

---

### 4.3 Data Access Layer (DAL)

Toda lógica de banco de dados fica em uma camada isolada. Client Components nunca acessam o banco diretamente.

#### Estrutura de pastas

```
src/lib/
  supabase/
    server.ts        → cliente SSR (anon key)
    client.ts        → cliente browser (anon key)
    admin.ts         → cliente admin (service role) — server-only!
  services/          → DAL: toda lógica de banco
    eventos.ts
    trabalhos.ts
    contatos.ts
    profiles.ts
  validations/       → schemas Zod compartilhados
    evento.ts
    trabalho.ts
    contato.ts
  rate-limit.ts      → configuração do rate limiter
  cors.ts            → headers CORS
  sanitize.ts        → sanitização de HTML
```

#### Client Components chamam Server Actions, nunca o banco diretamente

```ts
// ❌ ERRADO — Client Component acessando banco direto
'use client'
export function EventoForm() {
  const handleSubmit = async (data) => {
    const supabase = createClient()
    await supabase.from('eventos').insert(data) // sem validação server-side!
  }
}

// ✅ CORRETO — Client Component chamando Server Action
'use client'
import { criarEvento } from '@/lib/services/eventos'

export function EventoForm() {
  const handleSubmit = async (data) => {
    await criarEvento(data) // validação e autorização acontecem no servidor
  }
}
```

#### Server Actions com verificação dupla (autenticação + autorização)

```ts
// /src/lib/services/eventos.ts
'use server'
import 'server-only'
import { createClient } from '../supabase/server'
import { eventoSchema } from '../validations/evento'
import { redirect } from 'next/navigation'

export async function criarEvento(formData: unknown) {
  const supabase = createClient()

  // 1. Verificar autenticação no servidor
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Verificar role no banco (não confiar no JWT, que pode estar desatualizado)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'editor'].includes(profile.role)) {
    throw new Error('Acesso negado')
  }

  // 3. Validar dados com Zod no servidor
  const dados = eventoSchema.parse(formData)

  // 4. Inserir com autor_id do servidor (nunca aceitar autor_id do client)
  const { error } = await supabase
    .from('eventos')
    .insert({ ...dados, autor_id: user.id })

  if (error) throw error
}
```

---

### 4.4 HTTP Security Headers

Configurados em `next.config.ts`, valem para todas as páginas e são a primeira linha de defesa do browser.

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            // Força HTTPS por 1 ano, incluindo subdomínios
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            // Impede o browser de adivinhar o tipo do arquivo (bloqueia XSS via upload)
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            // Impede que o site seja embutido em iframes em outros domínios (anti-clickjacking)
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            // Controla quanto do Referer é enviado em links externos
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            // Desabilita recursos do browser que o site não usa
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
          },
          {
            // CSP: define de onde scripts, estilos e imagens podem ser carregados
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://cdn.vercel-insights.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://*.supabase.co",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
              "frame-ancestors 'none'",
              "object-src 'none'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
```

> 💡 Valide os headers em produção em **securityheaders.com** — objetivo: nota A ou A+.

#### O que cada header faz

| Header | Proteção |
|---|---|
| `Strict-Transport-Security` | Força HTTPS, impede downgrade para HTTP |
| `X-Content-Type-Options: nosniff` | Impede XSS via upload de arquivo com tipo falso |
| `X-Frame-Options: SAMEORIGIN` | Bloqueia clickjacking (site embutido em iframe alheio) |
| `Referrer-Policy` | Não vaza URL interna do site para sites externos |
| `Permissions-Policy` | Desativa câmera, microfone, geolocalização — recursos desnecessários |
| `Content-Security-Policy` | Bloqueia scripts e recursos de origens não autorizadas (principal defesa contra XSS) |

---

### 4.5 CORS — Cross-Origin Resource Sharing

Controla quais domínios externos podem chamar sua API. Por padrão Next.js não restringe — qualquer origem pode chamar seus endpoints.

```ts
// /src/lib/cors.ts
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SITE_URL!,
  'http://localhost:3000',
]

export function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0]

  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  }
}
```

```ts
// Aplicar em Route Handlers sensíveis
export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin')
  return new Response(null, { status: 204, headers: corsHeaders(origin) })
}
```

---

### 4.6 Rate Limiting

Impede que bots sobrecarreguem endpoints sensíveis. Usa **Upstash Redis** — funciona no Edge Runtime da Vercel sem servidor dedicado.

```ts
// /src/lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const rateLimiters = {
  // Formulário de contato: 5 envios por 10 minutos por IP
  contato: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '10m'),
    prefix: 'rl:contato',
  }),
  // Login: 10 tentativas por hora
  login: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1h'),
    prefix: 'rl:login',
  }),
  // API geral: 100 requisições por minuto
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1m'),
    prefix: 'rl:api',
  }),
}

export async function checkRateLimit(limiter: Ratelimit, identifier: string) {
  const { success, remaining, reset } = await limiter.limit(identifier)
  return { allowed: success, remaining, reset }
}

// Extrai IP real atrás do proxy da Vercel
export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'
  )
}
```

---

### 4.7 Validação de Inputs com Zod

Toda entrada de dados é tratada como potencialmente maliciosa.

```ts
// /src/lib/validations/contato.ts
import { z } from 'zod'

export const contatoSchema = z.object({
  nome: z.string()
    .min(2, 'Nome muito curto').max(100)
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Nome contém caracteres inválidos'),
  email: z.string().email('E-mail inválido').max(254).toLowerCase(),
  assunto: z.string().min(5).max(200).trim(),
  mensagem: z.string().min(10).max(2000).trim(),
})

// /src/lib/validations/evento.ts
export const eventoSchema = z.object({
  titulo: z.string().min(5).max(200).trim(),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug deve ter apenas letras minúsculas, números e hifens'),
  descricao: z.string().max(5000).optional(),
  data_inicio: z.string().datetime(),
  data_fim: z.string().datetime().optional(),
  local: z.string().max(200).optional(),
  tipo: z.enum(['palestra', 'workshop', 'hackathon', 'reuniao', 'social', 'outro']),
  link_inscricao: z.string().url().optional().or(z.literal('')),
})
```

#### Validação em dois níveis

```ts
// Client: feedback imediato para o usuário (UX apenas)
const { register, handleSubmit } = useForm({ resolver: zodResolver(contatoSchema) })

// Server: validação real que protege o banco
const result = contatoSchema.safeParse(body)
if (!result.success) {
  return NextResponse.json({ erro: 'Dados inválidos' }, { status: 400 })
  // Retorna mensagem genérica — não expõe detalhes do schema
}
const dados = result.data // dado limpo e tipado com segurança
```

---

### 4.8 Proteção Contra XSS

XSS é quando um atacante injeta JavaScript malicioso que roda no browser de outros usuários.

#### React protege por padrão

```tsx
// Seguro — React escapa automaticamente variáveis em JSX
<p>{post.titulo}</p>
<h1>{evento.descricao}</h1>
```

#### Quando usar `dangerouslySetInnerHTML` — sanitizar com DOMPurify

```ts
// /src/lib/sanitize.ts
import DOMPurify from 'isomorphic-dompurify'

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'strong', 'em', 'ul', 'ol', 'li', 'a',
                   'h2', 'h3', 'code', 'pre', 'blockquote'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  })
}
```

```tsx
// Uso correto
<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(conteudoHtml) }} />
```

#### URLs de links externos — sempre validar

```ts
function isSafeUrl(url: string): boolean {
  try {
    const { protocol } = new URL(url)
    return ['https:', 'http:'].includes(protocol)
  } catch { return false }
}

<a href={isSafeUrl(link) ? link : '#'} rel="noopener noreferrer" target="_blank">
  Link externo
</a>
```

---

### 4.9 Proteção Contra SQL Injection

**Boa notícia:** o cliente do Supabase usa queries parametrizadas por padrão. Os valores passados via `.eq()`, `.insert()` etc. nunca são interpretados como SQL.

```ts
// ✅ SEGURO — Supabase parametriza automaticamente
await supabase.from('eventos').select('*').eq('slug', userInput)

// ❌ PERIGOSO — interpolação direta em SQL raw (nunca fazer)
await supabase.rpc('exec', { sql: `SELECT * WHERE slug = '${userInput}'` })
```

Se precisar de SQL bruto em migrations, sempre use parâmetros `$1, $2`:

```sql
SELECT * FROM eventos WHERE slug = $1 AND publicado = $2;
```

---

### 4.10 Segurança de Uploads

Uploads são vetor de ataque frequente. Validar **tipo e tamanho no servidor** — nunca confiar no tipo declarado pelo browser.

```ts
// /src/app/api/upload/route.ts
import 'server-only'

const ALLOWED_MIME_TYPES = {
  imagens: ['image/jpeg', 'image/png', 'image/webp'],
  pdfs:    ['application/pdf'],
}
const MAX_SIZES = {
  imagens: 2 * 1024 * 1024,   // 2MB
  pdfs:    10 * 1024 * 1024,  // 10MB
}

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File
  const tipo = formData.get('tipo') as 'imagens' | 'pdfs'

  if (!ALLOWED_MIME_TYPES[tipo]?.includes(file.type)) {
    return NextResponse.json({ erro: 'Tipo de arquivo não permitido' }, { status: 400 })
  }
  if (file.size > MAX_SIZES[tipo]) {
    return NextResponse.json({ erro: 'Arquivo muito grande' }, { status: 400 })
  }

  // Nome aleatório — NUNCA usar o nome original do usuário (pode conter ../ ou scripts)
  const ext = file.type.split('/')[1]
  const nomeSeguro = `${user.id}/${crypto.randomUUID()}.${ext}`

  const bucket = tipo === 'pdfs' ? 'trabalhos-pdfs' : 'thumbnails'
  const { data, error } = await supabase.storage.from(bucket).upload(nomeSeguro, file)

  if (error) {
    console.error('[API/upload]', error)
    return NextResponse.json({ erro: 'Erro no upload' }, { status: 500 })
  }

  return NextResponse.json({ path: data.path })
}
```

---

### 4.11 Tratamento Seguro de Erros

Nunca expor detalhes internos ao usuário — isso revela a arquitetura para atacantes.

```ts
// ❌ ERRADO — expõe estrutura interna
catch (error) {
  return NextResponse.json({
    erro: error.message,   // pode revelar: "relation 'users' does not exist"
    stack: error.stack,    // revela arquitetura interna
  }, { status: 500 })
}

// ✅ CORRETO — mensagem genérica para o client, detalhes no log do servidor
catch (error) {
  console.error('[API/eventos POST]', {
    message: error instanceof Error ? error.message : 'Unknown',
    timestamp: new Date().toISOString(),
  })
  return NextResponse.json(
    { erro: 'Ocorreu um erro. Tente novamente.' },
    { status: 500 }
  )
}
```

---

### 4.12 Autenticação Segura — Boas Práticas

```ts
// Sempre verificar autorização nas Server Actions
export async function deletarEvento(id: string) {
  const supabase = createClient()

  // 1. Verificar autenticação
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  // 2. Verificar role NO BANCO (não no JWT — pode estar desatualizado)
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') throw new Error('Acesso negado')

  // 3. Executar operação
  await supabase.from('eventos').delete().eq('id', id)
}
```

#### Configurações no Dashboard do Supabase → Authentication → Settings

| Configuração | Valor recomendado | Motivo |
|---|---|---|
| JWT expiry | 3600s (1h) | Tokens de curta duração minimizam janela de ataque |
| Refresh token rotation | ✅ Habilitado | Invalida token antigo a cada renovação |
| Refresh token reuse interval | 10s | Detecta roubo de refresh token |
| Email confirmations | ✅ Habilitado | Confirma que o e-mail existe |
| Allowed domains (signup) | `ufpr.br` | Restringe cadastro a e-mails institucionais |

---

### 4.13 Checklist de Segurança — Antes do Deploy

#### Variáveis de Ambiente
- [ ] `.env.local` está no `.gitignore`
- [ ] `.mcp.json` está no `.gitignore`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` sem prefixo `NEXT_PUBLIC_`
- [ ] Todas as chaves configuradas no painel da Vercel (não em arquivos)
- [ ] Nenhuma chave hardcoded no código

#### Supabase & Banco
- [ ] RLS habilitado em **todas** as tabelas
- [ ] Todas as policies testadas com impersonação no Supabase Studio
- [ ] `service_role_key` usada apenas com `import 'server-only'`
- [ ] Magic Link restrito a `@ufpr.br`
- [ ] Middleware usa `getUser()` (não apenas `getSession()`)
- [ ] JWT expiry configurado para 1 hora

#### API & Validação
- [ ] Rate limiting nos endpoints de contato e login
- [ ] Validação Zod em **todos** os Route Handlers e Server Actions
- [ ] Erros internos não expostos nas respostas ao client
- [ ] CORS configurado apenas para domínios do projeto

#### Headers & Frontend
- [ ] Security headers configurados no `next.config.ts`
- [ ] Nota A ou A+ no **securityheaders.com**
- [ ] `dangerouslySetInnerHTML` usado apenas com `sanitizeHtml()`
- [ ] Uploads validam tipo e tamanho no servidor
- [ ] Nomes de arquivos gerados com `crypto.randomUUID()`

#### Código & Git
- [ ] Sem `console.log` expondo dados sensíveis em produção
- [ ] Histórico do Git sem chaves acidentais (`git log --all -p | grep -i "service_role"`)
- [ ] `npm audit` sem vulnerabilidades críticas
- [ ] `server-only` importado em todos os arquivos com chaves privadas

---

### 4.14 Diagrama das Camadas de Segurança

```
┌─────────────────────────────────────────────────────────────────┐
│  BROWSER / CLIENTE                                              │
│  • Validação Zod (UX apenas — não confiável)                    │
│  • NEXT_PUBLIC_ apenas para dados realmente públicos            │
│  • Nenhuma chave privada acessível                              │
├─────────────────────────────────────────────────────────────────┤
│  REDE / HTTP                                                    │
│  • HTTPS obrigatório (HSTS)                                     │
│  • CORS restritivo (apenas domínio do projeto)                  │
│  • Security Headers (CSP, X-Frame-Options, nosniff, etc.)      │
├─────────────────────────────────────────────────────────────────┤
│  NEXT.JS / SERVIDOR                                             │
│  • Rate Limiting via Upstash Redis                              │
│  • Validação Zod em todos os inputs                             │
│  • Verificação de autenticação: getUser() (valida no servidor)  │
│  • Verificação de autorização: role buscado do banco            │
│  • Erros genéricos ao client, detalhados no log interno         │
│  • server-only em todos os arquivos com chaves privadas         │
│  • Uploads validados: tipo, tamanho, nome aleatório             │
├─────────────────────────────────────────────────────────────────┤
│  SUPABASE / BANCO                                               │
│  • RLS em TODAS as tabelas (última linha de defesa)             │
│  • service_role somente server-side com server-only             │
│  • Queries parametrizadas (sem SQL injection possível)          │
│  • Magic Link restrito a @ufpr.br                               │
│  • JWT curta duração + refresh token rotation                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Design e Frontend

### 5.1 Identidade Visual — CACIC / UTFPR

A identidade do blog é derivada diretamente da logo do **CACIC (Centro Acadêmico de Ciências da Computação — UTFPR-SH)**. A logo usa três cores: amarelo dourado UTFPR, preto e branco — uma identidade forte, limpa e muito reconhecível.

#### Paleta de Cores Oficial

```
Amarelo UTFPR   #F5B800   → cor primária, identidade, CTAs, destaques
Preto           #0A0A0A   → textos, Navbar dark, fundos dark mode
Branco          #FFFFFF   → fundos, texto sobre amarelo/preto
Cinza escuro    #1A1A1A   → cards escuros, surfaces no dark mode
Cinza médio     #6B7280   → textos secundários, metadados
Cinza claro     #F4F4F5   → backgrounds alternados no light mode
```

#### Escala completa `brand` (amarelo UTFPR)

| Token | Hex | Uso |
|---|---|---|
| `brand.50`  | `#FFFBEB` | Background de alertas e badges suaves |
| `brand.100` | `#FEF3C7` | Backgrounds alternados, hover suave |
| `brand.200` | `#FDE68A` | Bordas decorativas, separadores |
| `brand.300` | `#FCD34D` | Badges, chips de categoria |
| `brand.400` | `#FBBF24` | Hover de botões |
| `brand.500` | `#F5B800` | **COR PRINCIPAL — botões, links, destaques** |
| `brand.600` | `#D97706` | Hover states, variante mais escura |
| `brand.700` | `#B45309` | Pressed states, texto sobre fundo amarelo claro |
| `brand.800` | `#92400E` | Texto enfatizado sobre amarelo pálido |
| `brand.900` | `#78350F` | Variante mais escura, contraste máximo |

> 💡 **Contraste e acessibilidade:** Texto preto (`#0A0A0A`) sobre amarelo `brand.500` tem ratio de contraste de **9.2:1** — bem acima do mínimo WCAG AA de 4.5:1. Nunca use texto amarelo sobre fundo branco (ratio insuficiente).

#### Regras de uso das cores

```
✅ Botão primário:   fundo brand.500 (#F5B800) + texto preto (#0A0A0A)
✅ Navbar light:     fundo branco + logo + links pretos + badge amarelo
✅ Navbar dark:      fundo preto (#0A0A0A) + logo + links brancos + badge amarelo
✅ Hero:             fundo preto + texto branco + CTA amarelo
✅ Cards:            borda esquerda brand.500 (light) / card escuro (dark)
✅ Links:            brand.600 (hover: brand.500) — nunca amarelo puro sobre branco
✅ Badges:           fundo brand.100 + texto brand.700 (light mode)
❌ Texto amarelo sobre fundo branco — contraste insuficiente
❌ Fundo amarelo em grandes áreas de texto corrido — cansa a leitura
```

#### Cores de Categorias (ajustadas à identidade)

| Categoria | Badge light | Badge dark |
|---|---|---|
| Tecnologia | `brand.100` / texto `brand.700` | `brand.900` / texto `brand.300` |
| IA & ML | fundo `#FEF3C7` / texto `#92400E` | fundo `#1C1710` / texto `#FCD34D` |
| Carreira | fundo `green.50` / texto `green.700` | fundo `green.950` / texto `green.300` |
| Vida Acadêmica | fundo `purple.50` / texto `purple.700` | fundo `purple.950` / texto `purple.300` |
| Projetos | fundo `orange.50` / texto `orange.700` | fundo `orange.950` / texto `orange.300` |
| Segurança | fundo `red.50` / texto `red.700` | fundo `red.950` / texto `red.300` |

---

### 5.2 Tipografia

A dupla de fontes reflete a identidade técnica do curso de CC: moderna, legível e com personalidade.

| Papel | Fonte | Peso | Uso |
|---|---|---|---|
| Headings | **Space Grotesk** | 600–700 | Títulos, hero, cards |
| Body | **Inter** | 400–500 | Parágrafos, UI, labels |
| Code | **JetBrains Mono** | 400 | Blocos de código nos posts |

```tsx
// src/app/layout.tsx — importar do Google Fonts
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
})

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
```

---

### 5.3 Chakra UI v3 — Tema CACIC

```bash
npm i @chakra-ui/react @emotion/react
```

```ts
// src/theme/index.ts — tema completo com identidade CACIC/UTFPR
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        // Paleta principal — Amarelo UTFPR
        brand: {
          50:  { value: "#FFFBEB" },
          100: { value: "#FEF3C7" },
          200: { value: "#FDE68A" },
          300: { value: "#FCD34D" },
          400: { value: "#FBBF24" },
          500: { value: "#F5B800" },  // COR PRINCIPAL
          600: { value: "#D97706" },
          700: { value: "#B45309" },
          800: { value: "#92400E" },
          900: { value: "#78350F" },
        },
        // Preto CACIC
        cacic: {
          black: { value: "#0A0A0A" },
          dark:  { value: "#1A1A1A" },
          card:  { value: "#242424" },
        },
      },
      fonts: {
        heading: { value: "'Space Grotesk', sans-serif" },
        body:    { value: "'Inter', sans-serif" },
        mono:    { value: "'JetBrains Mono', monospace" },
      },
      // Raios de borda — visual tech sem ser redondo demais
      radii: {
        card: { value: "8px" },
        badge: { value: "4px" },
        button: { value: "6px" },
      },
    },

    semanticTokens: {
      colors: {
        // Backgrounds
        "bg.canvas":  { value: { base: "#FFFFFF",  _dark: "#0A0A0A" } },
        "bg.surface": { value: { base: "#F4F4F5",  _dark: "#1A1A1A" } },
        "bg.card":    { value: { base: "#FFFFFF",  _dark: "#242424" } },
        "bg.overlay": { value: { base: "#F4F4F5",  _dark: "#2A2A2A" } },

        // Textos
        "text.primary":   { value: { base: "#0A0A0A", _dark: "#F4F4F5" } },
        "text.secondary": { value: { base: "#6B7280", _dark: "#9CA3AF" } },
        "text.muted":     { value: { base: "#9CA3AF", _dark: "#6B7280" } },
        "text.onBrand":   { value: "#0A0A0A" },  // texto sobre fundo amarelo (sempre preto)

        // Marca
        "brand.default":  { value: { base: "#F5B800", _dark: "#F5B800" } },
        "brand.hover":    { value: { base: "#D97706", _dark: "#FBBF24" } },
        "brand.subtle":   { value: { base: "#FEF3C7", _dark: "#1C1710" } },
        "brand.muted":    { value: { base: "#FDE68A", _dark: "#2A2010" } },

        // Bordas
        "border.default": { value: { base: "#E4E4E7", _dark: "#2A2A2A" } },
        "border.brand":   { value: { base: "#F5B800", _dark: "#F5B800" } },
        "border.subtle":  { value: { base: "#F4F4F5", _dark: "#1A1A1A" } },
      },
    },
  },
})

export const system = createSystem(defaultConfig, customConfig)
```

```tsx
// src/app/layout.tsx
import { Provider } from "@chakra-ui/react"
import { system } from "@/theme"

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Provider value={system}>{children}</Provider>
      </body>
    </html>
  )
}
```

```json
// .vscode/mcp.json — MCP do Chakra para o Claude Code
{
  "servers": {
    "chakra-ui": { "command": "npx", "args": ["-y", "@chakra-ui/react-mcp"] }
  }
}
```

#### Componentes Chakra por seção

| Seção | Componentes |
|---|---|
| Navbar | `HStack`, `Button`, `IconButton`, `Drawer` |
| Hero | `Box`, `VStack`, `Heading`, `Text`, `ButtonGroup` |
| Cards | `Card`, `Badge`, `Avatar`, `Separator` |
| Filtros | `Tabs`, `TabList`, `Tab` |
| Formulário | `Field`, `Input`, `Textarea`, `Button` |
| Dark mode | `ColorModeButton` (nativo v3) |

#### Exemplos de uso dos tokens no código

```tsx
// Botão primário — fundo amarelo CACIC + texto preto
<Button
  bg="brand.default"
  color="text.onBrand"
  _hover={{ bg: "brand.hover" }}
  borderRadius="button"
  fontFamily="heading"
  fontWeight="600"
>
  Ver Eventos
</Button>

// Card com borda esquerda amarela (identidade técnica)
<Box
  bg="bg.card"
  borderLeft="3px solid"
  borderColor="border.brand"
  borderRadius="card"
  p={6}
>
  {/* conteúdo */}
</Box>

// Badge de categoria
<Badge
  bg="brand.subtle"
  color="brand.hover"
  borderRadius="badge"
  px={2} py={0.5}
  fontSize="xs"
  fontWeight="600"
  textTransform="uppercase"
  letterSpacing="0.05em"
>
  Tecnologia
</Badge>

// Heading com fonte Space Grotesk
<Heading
  fontFamily="heading"
  fontWeight="700"
  color="text.primary"
>
  CACIC — Centro Acadêmico
</Heading>
```

---

### 5.4 React Bits — Animações Pontuais

```bash
npx jsrepo add https://reactbits.dev/ts/tailwind/TextAnimations/SplitText
```

| Componente | Onde usar | Observação |
|---|---|---|
| **SplitText** | Título do Hero | Letras entram uma a uma |
| **BlurText** | Subtítulo da Home | Desfoca e foca ao entrar na tela |
| **FadeContent** | Cards ao fazer scroll | Fade ao entrar na viewport |
| **CountUp** | Estatísticas do CA | Números contam de 0 ao valor |
| **AnimatedList** | Lista de próximos eventos | Itens entram em sequência |
| **TiltCard** | Cards de membros | Inclina ao passar o mouse |

> ⚠️ **Regra de ouro:** Animações apenas no Hero e elementos de destaque. Conteúdo de leitura deve ser estático. Lembre-se: usuários de CC vão ler código, artigos e eventos — clareza vale mais que efeito.

---

### 5.5 Padrões Visuais dos Componentes Principais

#### Navbar

```
Light mode: fundo branco | logo CACIC | links cinza escuro | badge "CA" amarelo | botão de contato (amarelo)
Dark mode:  fundo #0A0A0A | logo CACIC | links cinza claro | badge "CA" amarelo | botão de contato (amarelo)
```

- Borda inferior `border.default` (sem shadow pesado — design limpo)
- Logo CACIC à esquerda; links centralizados ou à direita; `ColorModeButton` no canto
- Menu hamburguer mobile com Drawer — fundo preto no dark, branco no light

#### Hero (página inicial)

```
Fundo: preto (#0A0A0A) — impactante, tecnológico
Texto principal: branco, Space Grotesk 700, grande
Subtítulo: cinza claro, Inter 400
CTA principal: botão amarelo brand.500 + texto preto — máximo contraste
CTA secundário: botão outline branco (ghost)
Detalhe: circuit pattern ou grid sutil ao fundo (referência à logo)
```

#### Cards de Post / Notícia

```
Light: card branco | borda esquerda 3px brand.500 | badge categoria | título Space Grotesk
Dark:  card #242424 | borda esquerda 3px brand.500 | badge escuro | título claro
Hover: elevação sutil + borda brand mais intensa
```

#### Cards de Evento

```
Ícone do tipo (palestra, workshop, etc.) em amarelo
Data em destaque com fundo brand.subtle
Local em texto secundário
Badge do tipo com cor brand
```

#### Footer

```
Fundo: preto (#0A0A0A) em ambos os modos
Logo CACIC em branco/amarelo
Links em cinza claro | hover amarelo
"Desenvolvido por membros do CACIC — UTFPR-SH"
Redes sociais: ícones em cinza | hover brand.500
```

---

## 6. Estrutura de Páginas

### 6.1 Arquitetura de Rotas

```
app/
  ├── page.tsx                      → Home
  ├── sobre/page.tsx                → Sobre o CA
  ├── blog/[slug]/page.tsx          → Posts (MDX)
  ├── noticias/[slug]/page.tsx      → Notícias (MDX)
  ├── eventos/[slug]/page.tsx       → Eventos (Supabase)
  ├── trabalhos/[slug]/page.tsx     → Trabalhos (Supabase)
  ├── membros/page.tsx              → Diretoria (Supabase)
  ├── contato/page.tsx              → Formulário
  ├── dashboard/                    → Área privada (middleware protege)
  │    ├── page.tsx
  │    ├── eventos/page.tsx
  │    └── trabalhos/page.tsx
  ├── login/page.tsx                → Magic Link
  └── api/
       ├── contato/route.ts         → Rate limited + Zod
       ├── eventos/route.ts
       ├── trabalhos/route.ts
       └── views/route.ts
```

### 6.2 Origem dos Dados por Página

| Página | Fonte | Estratégia |
|---|---|---|
| Home | MDX + Supabase | SSG + ISR |
| Blog / Notícias | MDX local | SSG puro |
| Eventos | Supabase | SSR / ISR 60s |
| Trabalhos | Supabase | SSR / ISR 60s |
| Membros | Supabase | SSG + revalidate |
| Dashboard | Supabase (autenticado) | SSR protegido |

---

## 7. Componentes Reutilizáveis

| Componente | Base | Responsabilidade |
|---|---|---|
| `Navbar` | Chakra `HStack`, `Drawer` | Logo, links, menu mobile, dark mode |
| `Footer` | Chakra `Box`, `SimpleGrid` | Links, redes, créditos UFPR |
| `PostCard` | Chakra `Card`, `Badge` | Thumbnail, categoria, título, resumo |
| `EventCard` | Chakra `Card`, `Badge` | Data, título, local, tipo |
| `WorkCard` | Chakra `Card`, `Button` | Área, título, autores, PDF |
| `MemberCard` | Chakra `Card` + `TiltCard` | Foto, nome, cargo |
| `CategoryBadge` | Chakra `Badge` | Pílula colorida por categoria |
| `SearchBar` | Chakra `InputGroup` | Busca com filtragem |
| `MDXComponents` | Chakra `Box`, `Code` | Estilização dos posts |
| `PageHero` | Chakra `Box` + `SplitText` | Hero reutilizável por seção |
| `ContactForm` | Chakra + React Hook Form + Zod | Validação client + POST com rate limit |

---

## 8. Gestão de Conteúdo

### 8.1 Estrutura de Arquivos MDX

```
content/
  ├── posts/       → Artigos do blog (.mdx)
  └── noticias/    → Notícias curadas (.mdx)
```

Eventos, trabalhos e membros são gerenciados pelo Supabase Dashboard.

### 8.2 Exemplo de Frontmatter

```yaml
---
title: 'Como funciona o algoritmo de compressão Huffman'
date: '2026-03-10'
author: 'Maria Silva'
category: 'Tecnologia'
tags: ['algoritmos', 'compressão', 'estruturas de dados']
summary: 'Uma explicação visual e didática...'
thumbnail: '/images/huffman-tree.png'
published: true
---
```

### 8.3 Fluxo de Publicação

| Tipo | Quem publica | Como |
|---|---|---|
| Post / Artigo | Membro com acesso ao GitHub | `.mdx` + `git push` → deploy automático |
| Notícia | Membro com acesso ao GitHub | `.mdx` + `git push` → deploy automático |
| Evento | Membro autenticado | Formulário no dashboard |
| Trabalho | Membro autenticado | Formulário + upload PDF |
| Membro da diretoria | Admin | Supabase Dashboard ou painel do CA |

---

*Bom desenvolvimento! Qualquer dúvida, é só chamar o Claude. 🚀*
