# Debug Log — Blog CACIC

**Data:** 2026-03-10  
**Ambiente:** Next.js 14 + Supabase Auth + Vercel

---

## ✅ O que foi feito e funcionou
pode 
### 1. Botão de Login na Navbar
- **Arquivo:** `src/components/layout/navbar.tsx`
- **Situação:** O botão não existia no código. Foi adicionado.
- **O que foi feito:** Adicionado um `ChakraLink` estilizado como botão amarelo no canto superior direito do Desktop e uma entrada "Login" no menu hambúrguer do mobile.
- **Resultado:** ✅ Botão aparece corretamente em Desktop e Mobile.

---

### 2. Domínio de e-mail alterado de @ufpr.br para @alunos.utfpr.edu.br
- **Arquivos:** `src/app/login/actions.ts`, `src/app/login/page.tsx`
- **O que foi feito:** Corrigido o domínio de validação do e-mail institucional.
- **Resultado:** ✅ E-mails fora do domínio `@alunos.utfpr.edu.br` mostram erro correto.

---

### 3. Erro 500 na Server Action de login
- **Causa:** O `redirect()` do Next.js lança uma exceção interna (`NEXT_REDIRECT`) que estava sendo capturada pelo bloco `try/catch` da Server Action, corrompendo o fluxo.
- **Arquivos:** `src/app/login/actions.ts`, `src/app/login/page.tsx`
- **O que foi feito:**
  - A `actions.ts` foi reescrita para retornar `{ success: boolean; error?: string }` ao invés de lançar exceções.
  - A `page.tsx` foi reescrita para usar `useRouter().push()` para redirecionar.
- **Resultado:** ✅ Erro 500 resolvido. O Magic Link é enviado com sucesso.

---

### 4. Configuração do Supabase — Auth → URL Configuration
- **Problema:** O Supabase rejeitava o envio do Magic Link pois nenhuma Redirect URL estava na whitelist.
- **Site URL estava:** `http://localhost:3000` (errado para produção)
- **O que foi feito (via painel do Supabase):**
  - Site URL alterado para: `https://blog-cacic.vercel.app`
  - Redirect URLs adicionadas:
    - `https://blog-cacic.vercel.app/auth/callback`
    - `http://localhost:3000/auth/callback`
    - `http://localhost:3001/auth/callback`
  - "Confirm email" desligado (estava impedindo uso simples de Magic Link)
- **Resultado:** ✅ Supabase aceita o envio de Magic Link para `@alunos.utfpr.edu.br`.

---

### 5. Variáveis de ambiente na Vercel
- **Problema:** A Vercel não tinha as variáveis do `.env.local`, então `NEXT_PUBLIC_APP_URL` retornava `undefined` no servidor, corrompendo o link do e-mail.
- **O que foi feito:** Configuradas no painel da Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_APP_URL` = `https://blog-cacic.vercel.app`
  - `UPSTASH_REDIS_REST_URL`
  - `UPSTASH_REDIS_REST_TOKEN`
- **Resultado:** ✅ Vercel faz deploy e funciona corretamente.

---

### 6. Callback de auth atualizado para suportar dois formatos
- **Arquivo:** `src/app/auth/callback/route.ts`
- **Problema:** O callback só aceitava `?code=` (PKCE) mas o Supabase envia `?token_hash=&type=` nos e-mails.
- **O que foi feito:** Suporte adicionado para os dois formatos:
  - `token_hash + type` → usa `supabase.auth.verifyOtp()`
  - `code` → usa `supabase.auth.exchangeCodeForSession()`
- **Resultado:** ✅ Código do callback mais robusto.

---

## ❌ O que ainda NÃO está funcionando

### Problema principal: Magic Link redireciona de volta para o /login com erro PKCE

**URL de erro observada:**
```
https://blog-cacic.vercel.app/login?error=exchange_failed&details=PKCE%20code%20verifier%20not%20found%20in%20storage
```

**Link enviado no e-mail (testado):**
```
https://yfsbjtuoyhlbynfibqfg.supabase.co/auth/v1/verify
  ?token=pkce_1025e70d68fc6a43a052a8fe81a7fafbaeb51ee720852ae50c79eecb
  &type=magiclink
  &redirect_to=https://blog-cacic.vercel.app/auth/callback
```

**Explicação técnica do problema:**
- O fluxo PKCE (Proof Key for Code Exchange) do Supabase requer que um "code verifier" seja gerado no navegador quando `signInWithOtp()` é chamado e armazenado em cookies no domínio `blog-cacic.vercel.app`.
- Quando o usuário clica no link do e-mail, o Supabase autentica e redireciona para `/auth/callback?code=xxx`.
- O callback tenta chamar `exchangeCodeForSession(code)` que precisa do code verifier nos cookies.
- O erro ocorre porque o code verifier não é encontrado.

**Tentativas realizadas e resultado:**

| Tentativa | O que foi feito | Resultado |
|---|---|---|
| ❌ 1 | Server Action com `redirect()` dentro de `try/catch` | Erro 500 |
| ❌ 2 | Server Action retornando objeto (sem redirect) | Corrigiu o 500, mas ainda erro PKCE |
| ❌ 3 | Usar `createBrowserClient()` no `page.tsx` para chamar `signInWithOtp` | Ainda erro PKCE |

**Hipóteses para explicar o erro persistente:**
1. O Gmail pode estar abrindo/pre-fetchando o link de segurança antes do usuário clicar (consumindo o token)
2. O `createBrowserClient` pode não estar armazenando o code verifier em cookies de forma compatível com o que o servidor lê em `request.cookies`
3. O Supabase email template está usando o formato `pkce_xxx` que exige o cookie - mudar o template para usar `{{ .TokenHash }}` eliminaria a dependência de PKCE

---

## 🔧 Próxima ação recomendada para resolver o problema

**Solução mais simples: Atualizar o template de e-mail no Supabase para usar `token_hash`**

1. Acesse: **Supabase → Auth → Email Templates → Magic Link**
2. Altere o link no template de:
   ```html
   <a href="{{ .ConfirmationURL }}">Log In</a>
   ```
   Para:
   ```html
   <a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=magiclink">Log In</a>
   ```
3. Salve o template.

Isso fará com que o e-mail envie um link no formato `https://blog-cacic.vercel.app/auth/callback?token_hash=xxx&type=magiclink`, que **não exige PKCE** e é processado pelo callback usando `supabase.auth.verifyOtp({ token_hash, type })` — sem cookies armazenados, sem problemas de sincronização.

O arquivo `src/app/auth/callback/route.ts` **já suporta esse formato** (foi atualizado anteriormente).

---

## 📁 Arquivos modificados nesta sessão

| Arquivo | O que foi modificado |
|---|---|
| `src/components/layout/navbar.tsx` | Adicionado botão Login |
| `src/app/login/page.tsx` | Reescrito para corrigir 500 e fluxo PKCE |
| `src/app/login/actions.ts` | Reescrito para retornar objeto (sem throw/redirect) |
| `src/app/auth/callback/route.ts` | Suporte a token_hash e code PKCE |
| `next.config.js` | CSP: unsafe-eval habilitado em desenvolvimento |

---

## 🔑 Configurações externas alteradas

| Serviço | O que foi alterado |
|---|---|
| **Supabase** | Site URL, Redirect URLs, Confirm email desligado |
| **Vercel** | Todas as variáveis de ambiente adicionadas |
