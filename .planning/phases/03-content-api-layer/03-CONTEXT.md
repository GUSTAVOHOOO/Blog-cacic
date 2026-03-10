# Phase 3: Content & API Layer - Context

**Gathered:** 2026-03-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Entregar o pipeline MDX operacional (posts e notícias via arquivos `.mdx` no repositório) e todas as Route Handlers + DAL para que as páginas públicas da Phase 4 possam buscar dados reais. Nenhuma página pública é construída nesta fase — só a infraestrutura de conteúdo e API.

</domain>

<decisions>
## Implementation Decisions

### Estilo dos Posts MDX

- **Syntax highlighting**: tema escuro sempre (fundo #0A0A0A ou similar), independente do tema claro/escuro do site. Padrão visual consistente para código.
- **Callouts**: incluir componentes MDX customizados para pelo menos `::note` (Nota) e `::warning` (Aviso) — caixas de destaque estilizadas com Chakra UI.
- **Imagens**: componente MDX `Image` customizado com suporte a caption opcional — renderiza `<figure>` + `<figcaption>` quando caption presente, `next/image` simples quando não.
- **Tabelas**: estilizadas com zebra striping (linhas alternadas) e scroll horizontal em mobile — padrão para conteúdo técnico.
- **Elementos base obrigatórios**: headings (h1-h4), `code` inline, blocos de código, `blockquote`, links, listas ordenadas e não ordenadas.

### Formulário de Contato (API-01)

- **Campos**: Nome (obrigatório), Email (obrigatório), Assunto (select predefinido, obrigatório), Mensagem (obrigatório).
- **Opções de Assunto**: "Dúvida", "Sugestão", "Parceria", "Outro" — lista predefinida via select.
- **Após envio bem-sucedido**: formulário desaparece e mensagem de sucesso aparece no lugar ("Mensagem enviada com sucesso!"). Sem redirecionamento de página.
- **Destino das mensagens**: salvo na tabela `contatos` do Supabase apenas. Sem disparo de email. Admins leem no dashboard (Phase 5).

### Visibilidade das Views (API-04)

- **Exibição pública**: sim — contagem visível ao leitor na página do post.
- **Localização**: header do post, ao lado da data e autor (padrão Dev.to/Hashnode).
- **Formato exibido**: sufixo formatado — "1.2k leituras" para números grandes, número exato abaixo de 1000.
- **Contabilização**: uma vez por visita à página — `POST /api/views` chamado no carregamento do componente client-side. Sem deduplicação por sessão.

### Claude's Discretion

- **Slug dos posts**: planner decide a abordagem (gerado do título ou campo manual no frontmatter). Recomendado: campo `slug` explícito no frontmatter para controle editorial.
- **Biblioteca MDX**: planner escolhe entre `next-mdx-remote` e `@next/mdx` baseado em compatibilidade com App Router e RSC.
- **Linguagens de highlight**: planner define quais linguagens incluir (JavaScript, TypeScript, Python, SQL, Bash são as mais prováveis para um blog de CC).

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/supabase/server.ts` — cliente Supabase server-side, pronto para usar em Route Handlers e Server Components
- `src/lib/supabase/client.ts` — cliente browser, para componentes client que precisam de dados em tempo real
- `src/lib/supabase/admin.ts` — cliente admin com service_role_key, para operações privilegiadas
- `src/lib/validations/auth.ts` — padrão de validação Zod + schema existente para replicar nas novas validações
- `zod` v4 instalado — usar para todos os schemas de validação das Route Handlers
- `react-hook-form` v7 instalado — usar no formulário de contato (Phase 4, mas schema validado aqui)

### Established Patterns
- Chakra UI v3 com tokens semânticos (`bg.canvas`, `bg.card`, `text.primary`, `border.brand`) — componentes MDX devem usar esses tokens para respeitar dark mode
- Supabase clients já configurados (browser/server/admin) — DAL em `src/lib/services/` só importa esses clientes
- `server-only` já em uso — importar em todos os arquivos de serviço com chaves privadas (SEC-05)
- Validações ficam em `src/lib/validations/` — criar arquivos separados por entidade (contato.ts, upload.ts, etc.)

### Integration Points
- `src/lib/services/` — diretório vazio (`.gitkeep`) aguardando o DAL. Criar um arquivo por entidade: `posts.ts`, `eventos.ts`, `trabalhos.ts`, `membros.ts`, `contatos.ts`, `views.ts`
- `src/app/api/` — só existe `/api/health`. Criar: `/api/contato`, `/api/eventos`, `/api/trabalhos`, `/api/views`, `/api/upload`
- `content/` — diretório não existe ainda. Criar `content/posts/` e `content/noticias/` com arquivos MDX de exemplo
- `next.config.js` — já tem configuração de CSP; pode precisar de ajuste para imagens MDX (remotePatterns)

</code_context>

<specifics>
## Specific Ideas

- Callouts com visual similar a `::note` do GitHub Docs — borda esquerda colorida + ícone + fundo suave
- Views exibidas no header do post próximas à data: `03 Mar 2026 · 4 min · 1.2k leituras`
- Formulário de contato: após sucesso, exibir algo como "Mensagem enviada! O CACIC entrará em contato em breve."

</specifics>

<deferred>
## Deferred Ideas

- Nenhuma ideia fora do escopo surgiu durante a discussão — conversa ficou dentro da Phase 3.

</deferred>

---

*Phase: 03-content-api-layer*
*Context gathered: 2026-03-10*
