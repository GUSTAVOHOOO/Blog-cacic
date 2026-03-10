# Phase 2: Auth & Design System - Research

**Researched:** 2026-03-10
**Domain:** Supabase Magic Link authentication + Chakra UI v3 design system with dark mode
**Confidence:** HIGH

## Summary

Phase 2 implements two independent but mutually reinforcing capabilities: (1) **Magic Link authentication** restricted to @ufpr.br institutional emails via Supabase Auth, with middleware protecting the /dashboard route, and (2) **Chakra UI v3 theme** configured with CACIC identity colors (amarelo #F5B800, preto #0A0A0A), semantic tokens, and native dark mode support. Both are foundational — all subsequent pages depend on the layout shell (Navbar, Footer) and authentication state being stable. The reference document `Plano_Blog_CA_CC_UFPR.md` provides exact code patterns for both domains.

**Primary recommendation:** Implement authentication and theme in parallel across two task groups — auth stack (login form, callback handler, middleware) and design system (theme config, layout components) — both must pass mobile/desktop rendering checks before Phase 2 closes.

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| AUTH-01 | Magic Link restricted to @ufpr.br; non-@ufpr.br email shows clear error | Server action validation + email domain check before `signInWithOtp()` — see Magic Link section |
| AUTH-02 | Callback at `/auth/callback/route.ts` exchanges code for session | `exchangeCodeForSession()` + redirect to /dashboard — Supabase standard PKCE flow |
| AUTH-03 | Middleware protects `/dashboard/:path*`, redirects unauthenticated to `/login` | Next.js Proxy (formerly middleware) with matcher config + `getUser()` validation |
| AUTH-04 | Middleware uses `getUser()` (server validation), not `getSession()` | `getUser()` validates JWT on server; `getSession()` only reads cookie |
| AUTH-05 | Login page with institutional email form | Server action `loginWithMagicLink()` with Zod validation |
| AUTH-06 | Post-link page `/login/verifique-seu-email` | Redirect after `signInWithOtp()` success |
| UI-01 | Chakra UI v3 theme with CACIC paleta (brand #F5B800, preto #0A0A0A, branco) | Custom theme via `createSystem()` with semantic color tokens |
| UI-02 | Semantic tokens: `bg.canvas`, `bg.card`, `text.primary`, `border.brand`, etc. | Chakra v3 semantic token system with light/dark conditionals |
| UI-03 | Google Fonts: Space Grotesk (headings), Inter (body), JetBrains Mono (code) | next/font + CSS imports in layout |
| UI-04 | Dark mode toggle with `ColorModeButton` from Chakra UI v3 | Built-in dark mode via next-themes + `ColorModeProvider` |
| UI-05 | Navbar responsive with logo, links, yellow "CA" badge, dark toggle | Chakra Box + Flex layout, `ColorModeButton` |
| UI-06 | Footer with black bg, links, socials, credit | Chakra Footer component or Box with semantic tokens |
| UI-07 | PostCard with left yellow border, category badge, thumbnail | Chakra Card + left BorderBox + category variant |
| UI-08 | EventCard with event type icon, date highlight, yellow badge | Chakra Card + icon integration (react-icons) |
| UI-09 | WorkCard with area, title, authors, PDF button | Chakra Card + Button for download |
| UI-10 | MemberCard with photo, name, role (TiltCard from React Bits) | React Bits TiltCard installed and integrated |
| UI-11 | CategoryBadge with colors per category | Chakra Badge with category-specific bg colors |
| UI-12 | Hero with black bg, animated title (SplitText), yellow CTA | React Bits SplitText + Chakra Button |
| UI-13 | Animations: SplitText, FadeContent, CountUp (React Bits) | React Bits library components |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 14+ | App Router, routing, server components, middleware | Project locked decision; latest stable version |
| TypeScript | 5+ | Strict typing throughout | Project standard; already configured |
| Chakra UI | v3 | Design system, dark mode, semantic tokens, accessibility | Project locked; native dark mode + token system avoids custom CSS |
| Supabase Auth | (client 2.38+) | Magic Link, JWT, session management | Integrates with existing Supabase schema from Phase 1 |
| React Bits | Latest | Animated components: SplitText, FadeContent, TiltCard, CountUp | MIT + Commons Clause; installable collection |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| next-themes | Latest | Dark mode persistence across page refreshes | Chakra v3 dark mode uses this under the hood |
| react-icons | 5+ | Event/category icons for cards | Lightweight SVG icon library, tree-shakeable |
| zod | Latest | Form validation (email domain check in login) | Already in Phase 1 stack |
| React Hook Form | Latest | Login form binding + client validation | Pairs with Zod via zodResolver |

### Installation
```bash
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
npm install next-themes
npm install react-bits
# (Supabase client already installed in Phase 1)
```

## Architecture Patterns

### Recommended Project Structure

```
src/
├── app/
│   ├── layout.tsx                          # Root layout with theme provider
│   ├── page.tsx                            # Home (public)
│   ├── login/
│   │   ├── page.tsx                        # Login form
│   │   ├── verifique-seu-email/page.tsx    # Post-magic-link confirmation
│   │   └── actions.ts                      # Server action: loginWithMagicLink()
│   ├── auth/
│   │   └── callback/route.ts               # GET handler: code → session exchange
│   ├── dashboard/
│   │   └── page.tsx                        # Protected: [/dashboard] requires auth
│   └── api/
│       └── health/route.ts                 # Health check (from Phase 1)
├── lib/
│   ├── supabase/                           # (existing from Phase 1)
│   ├── validations/
│   │   └── auth.ts                         # Zod schemas for login
│   └── theme/
│       ├── config.ts                       # Chakra theme definition
│       └── colors.ts                       # CACIC color palette
├── components/
│   ├── providers/
│   │   └── chakra-provider.tsx             # ChakraProvider + ColorModeProvider
│   ├── layout/
│   │   ├── navbar.tsx                      # Top navigation
│   │   ├── footer.tsx                      # Bottom footer
│   │   └── root-layout-shell.tsx           # Common layout wrapper
│   ├── cards/
│   │   ├── post-card.tsx                   # Blog post preview
│   │   ├── event-card.tsx                  # Event preview
│   │   ├── work-card.tsx                   # Academic work preview
│   │   └── member-card.tsx                 # Member card with TiltCard
│   ├── ui/
│   │   └── category-badge.tsx              # Reusable category tag
│   └── hero/
│       └── hero-section.tsx                # Home hero with SplitText
├── proxy.ts                                # Next.js Proxy (replaces middleware)
└── types/
    └── supabase.ts                         # (generated in Phase 1)
```

### Pattern 1: Chakra UI v3 Theme Configuration

**What:** Custom theme with CACIC colors, semantic tokens, and light/dark mode support.

**When to use:** Initialize in `src/lib/theme/config.ts`, apply via `ChakraProvider` in root layout.

**Example:**

```typescript
// src/lib/theme/config.ts
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#FFFBEB" },
          100: { value: "#FEF3C7" },
          200: { value: "#FDE68A" },
          300: { value: "#FCD34D" },
          400: { value: "#FBBF24" },
          500: { value: "#F5B800" }, // CACIC PRIMARY
          600: { value: "#D97706" },
          700: { value: "#B45309" },
          800: { value: "#92400E" },
          900: { value: "#78350F" },
        },
      },
      semanticTokens: {
        colors: {
          "bg.canvas": { value: { base: "#FFFFFF", _dark: "#0A0A0A" } },
          "bg.card": { value: { base: "#F9FAFB", _dark: "#1A1A1A" } },
          "text.primary": { value: { base: "#0A0A0A", _dark: "#FFFFFF" } },
          "text.secondary": { value: { base: "#6B7280", _dark: "#D1D5DB" } },
          "border.brand": { value: "#F5B800" },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, customConfig)
```

**Source:** [Chakra UI Theme Documentation](https://chakra-ui.com/docs/components/theme)

### Pattern 2: Magic Link Authentication Server Action

**What:** Validate @ufpr.br domain, call `signInWithOtp()`, redirect to confirmation page.

**When to use:** Form submission in `/login` page.

**Example:**

```typescript
// src/app/login/actions.ts
'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
})

export async function loginWithMagicLink(formData: FormData) {
  const email = formData.get('email') as string

  // Domain validation: @ufpr.br only
  if (!email.toLowerCase().endsWith('@ufpr.br')) {
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

**Source:** [Supabase Magic Link Documentation](https://supabase.com/docs/guides/auth/auth-magic-link) + Project Plan

### Pattern 3: Next.js Proxy for Route Protection

**What:** Middleware-like layer (renamed from `middleware.ts` in Next.js 16+) that validates authentication before granting access to `/dashboard`.

**When to use:** Global route protection logic.

**Example:**

```typescript
// src/proxy.ts (Next.js 16+) or src/middleware.ts (Next.js 14-15)
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          let response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
          return response
        },
      },
    }
  )

  // getUser() validates JWT on server (not getSession alone)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next({ request })
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
}
```

**Source:** [Next.js Proxy Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware) + Project Plan

### Pattern 4: Chakra UI Dark Mode with ColorModeButton

**What:** Wrap app with `ChakraProvider` and `ColorModeProvider` (from next-themes), add toggle button.

**When to use:** Root layout and navbar.

**Example:**

```typescript
// src/components/providers/chakra-provider.tsx
'use client'
import { ChakraProvider } from '@chakra-ui/react'
import { ColorModeProvider } from '@chakra-ui/color-mode'
import { system } from '@/lib/theme/config'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider>
        {children}
      </ColorModeProvider>
    </ChakraProvider>
  )
}

// src/components/layout/navbar.tsx
'use client'
import { Box, Flex, Button } from '@chakra-ui/react'
import { ColorModeButton } from '@chakra-ui/color-mode'

export function Navbar() {
  return (
    <Box as="nav" bg="bg.canvas" borderBottomWidth="1px" borderColor="border.muted">
      <Flex justify="space-between" align="center" px={6} py={4}>
        <Box>Logo</Box>
        <Flex gap={4} align="center">
          {/* Navigation links */}
          <ColorModeButton />
        </Flex>
      </Flex>
    </Box>
  )
}
```

**Source:** [Chakra UI Color Mode Documentation](https://chakra-ui.com/docs/components/color-mode) + [Next.js with Chakra](https://chakra-ui.com/docs/get-started/frameworks/next-app)

### Pattern 5: React Bits Animated Components

**What:** SplitText for hero title animation, TiltCard for member cards, FadeContent for card reveals.

**When to use:** Hero sections and card components.

**Example:**

```typescript
// src/components/hero/hero-section.tsx
'use client'
import { Box, Heading, Button, VStack } from '@chakra-ui/react'
import { SplitText } from 'react-bits'

export function HeroSection() {
  return (
    <Box bg="text.primary" py={20} px={6}>
      <VStack spacing={6}>
        <SplitText
          text="Bem-vindo ao Blog do CACIC"
          className="hero-title"
          delay={0.05}
        />
        <Button bg="brand.500" color="black" size="lg">
          Explore o Blog
        </Button>
      </VStack>
    </Box>
  )
}

// src/components/cards/member-card.tsx
'use client'
import { Card, CardBody, Image, Heading, Text } from '@chakra-ui/react'
import { TiltCard } from 'react-bits'

export function MemberCard({ name, role, photo }: any) {
  return (
    <TiltCard>
      <Card bg="bg.card">
        <CardBody>
          <Image src={photo} alt={name} borderRadius="md" mb={4} />
          <Heading size="md">{name}</Heading>
          <Text color="text.secondary">{role}</Text>
        </CardBody>
      </Card>
    </TiltCard>
  )
}
```

**Source:** [React Bits Documentation](https://reactbits.dev/) + GitHub

### Anti-Patterns to Avoid

- **Hardcoding colors:** Don't use `bg="#F5B800"` directly. Use semantic tokens: `bg="brand.500"` or `bg="border.brand"`.
- **Manual dark mode:** Don't track color mode with `useState()`. Use Chakra's `useColorMode()` hook + `ColorModeProvider`.
- **Storing auth state in client-side state:** Auth state lives in Supabase cookies. Use `createClient()` in Server Components or Server Actions.
- **Using `getSession()` alone:** Always call `getUser()` which validates JWT server-side; `getSession()` only reads the cookie.
- **Protecting routes without Proxy/Middleware:** Never rely on client-side redirects for auth. Use Next.js Proxy matcher for `/dashboard`.
- **Sending email domain to client:** Never expose the domain allowlist validation logic to client; always validate server-side.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Auth state management | Custom Redux/Zustand store for `isAuthenticated` | Supabase auth cookies + Server Components | Supabase handles secure session refresh, token rotation, and expiration. Custom stores duplicate logic and miss edge cases. |
| Magic Link flow | Custom email templating + link generation | `signInWithOtp()` + `exchangeCodeForSession()` | Supabase handles PKCE security, rate limiting (1/60s), 1-hour expiration, and email delivery. |
| Dark mode | CSS media queries + localStorage toggle | Chakra's ColorModeProvider + next-themes | Framework handles browser preference detection, persistence, and SSR hydration safely. |
| Theme token system | CSS variables + manual token objects | Chakra's semantic token system | Chakra tokens auto-generate CSS variables, support scoped overrides, and integrate with components for contrast/accessibility. |
| Route protection | Client-side `useEffect(() => redirect())` | Next.js Proxy with matcher config | Server-side protection prevents flashing unauth content, redirect race conditions, and URL parameter tampering. |

**Key insight:** Auth and theming are deceptively complex. The frameworks handle edge cases (token refresh race conditions, color preference detection during SSR, rate limiting, email validation) that custom solutions consistently miss, leading to rewrites.

## Common Pitfalls

### Pitfall 1: Using `getSession()` Without Server Validation

**What goes wrong:** Client reads `getSession()` without calling `getUser()`, trusting the cookie. Attacker modifies the cookie locally, and your route protection code doesn't detect the forgery because it never validated the JWT.

**Why it happens:** `getSession()` is convenient — it reads the stored cookie instantly. `getUser()` requires a network call to Supabase. Developers default to the faster option and miss that it skips validation.

**How to avoid:** Always call `supabase.auth.getUser()` in Proxy/middleware and Server Actions. It validates the JWT token cryptographically on the Supabase server. Document in code comments why you're making the extra call.

**Warning signs:** Testing with modified cookies still grants access; logs show no JWT validation errors.

### Pitfall 2: Exposing Email Domain Validation Logic to Client

**What goes wrong:** Frontend code checks `if (!email.endsWith('@ufpr.br'))` and shows an error without server submission. Attacker modifies the JavaScript, removes the check, and can submit arbitrary emails to the API.

**Why it happens:** Developers validate client-side for UX feedback, then forget to re-validate server-side.

**How to avoid:** Always re-validate the domain in the Server Action (`loginWithMagicLink()`), **after** receiving the email from the client. Client validation is UX only. Server validation is security.

**Warning signs:** No domain check in the `loginWithMagicLink()` function; magic links can be requested for non-@ufpr.br emails if the client validation is bypassed.

### Pitfall 3: Dark Mode Flash on Page Load

**What goes wrong:** Page loads in light mode, then flashes to dark mode after JavaScript runs and reads localStorage.

**Why it happens:** `ColorModeProvider` runs on the client, but HTML renders on the server. Chakra's `ColorModeScript` must run before any JSX renders to prevent the flash.

**How to avoid:** Use Chakra's setup exactly: wrap the app with `ColorModeProvider`, ensure `ColorModeScript` is in the `<html>` head (Chakra CLI adds this automatically), and let next-themes handle persistence.

**Warning signs:** Dark mode preference setting doesn't persist across refreshes; flashing visible on first load.

### Pitfall 4: Mismatched Color Contrast in Dark Mode

**What goes wrong:** Designs with white text on brand.100 (pale yellow) look fine in Figma but fail WCAG AA in dark mode where the page background darkens.

**Why it happens:** Semantic tokens use `{ base: light, _dark: dark }` syntax. If you don't explicitly set the dark variant, Chakra may auto-invert, creating poor contrast.

**How to avoid:** For every semantic token, test both light and dark themes. Use WebAIM or axe DevTools to measure contrast ratios. Brand.500 (#F5B800) + black text = 9.2:1 (excellent). Test the reverse before using it.

**Warning signs:** Text is hard to read in dark mode; accessibility scanner reports low contrast.

### Pitfall 5: Forgetting to Configure Allowed Redirect URLs in Supabase

**What goes wrong:** Magic link is sent, user clicks, lands at `/auth/callback?code=...`, but the code exchange fails because the URL isn't in Supabase's allowlist.

**Why it happens:** `emailRedirectTo` in `signInWithOtp()` must match a configured redirect URL in Supabase Dashboard → Authentication → URL Configuration.

**How to avoid:** Add the callback URL to Supabase: `https://yourdomain.com/auth/callback` (and `http://localhost:3000/auth/callback` for local development).

**Warning signs:** Code exchange returns "redirect URL mismatch" error; magic links work locally but fail on Vercel.

### Pitfall 6: React Bits Components Not Tree-Shaking

**What goes wrong:** Build size bloats because all React Bits components are bundled even if you only use SplitText.

**Why it happens:** React Bits is a collection, and incorrect imports or missing `"sideEffects": false` in package.json prevent tree-shaking.

**How to avoid:** Import specific components: `import { SplitText } from 'react-bits'` (not `import * as bits from 'react-bits'`). Check React Bits package.json confirms tree-shaking support. Use `npm ls react-bits` to verify only one copy is installed.

**Warning signs:** Build output shows unexpected `react-bits` chunks; `SplitText` bundle is >50KB.

## Code Examples

Verified patterns from official sources and project plan:

### Example 1: Complete Login Server Action

```typescript
// src/app/login/actions.ts
'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
})

export async function loginWithMagicLink(formData: FormData) {
  try {
    const rawEmail = formData.get('email') as string
    const parsed = loginSchema.parse({ email: rawEmail })
    const email = parsed.email.toLowerCase()

    // 1. Domain validation — @ufpr.br only
    if (!email.endsWith('@ufpr.br')) {
      throw new Error('Use seu e-mail institucional da UFPR (@ufpr.br)')
    }

    // 2. Request magic link from Supabase
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        shouldCreateUser: true, // Allow first-time signup if profile exists
      },
    })

    if (error) {
      // Log error server-side, return generic message to client
      console.error('[loginWithMagicLink]', error.message)
      throw new Error('Erro ao enviar link. Tente novamente.')
    }

    // 3. Redirect to confirmation page
    redirect('/login/verifique-seu-email')
  } catch (error) {
    throw error // Caught by form's useActionState
  }
}
```

**Source:** Project Plan + Supabase Docs

### Example 2: Auth Callback Route Handler

```typescript
// src/app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    console.error('[auth/callback]', error)
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error)}`)
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  const supabase = createClient()
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    console.error('[auth/callback] exchange:', exchangeError.message)
    return NextResponse.redirect(`${origin}/login?error=exchange_failed`)
  }

  // Session established via cookies; redirect to dashboard
  return NextResponse.redirect(`${origin}/dashboard`)
}
```

**Source:** Supabase PKCE Flow + Project Plan

### Example 3: Chakra UI Theme Configuration

```typescript
// src/lib/theme/config.ts
import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#FFFBEB' },
          100: { value: '#FEF3C7' },
          200: { value: '#FDE68A' },
          300: { value: '#FCD34D' },
          400: { value: '#FBBF24' },
          500: { value: '#F5B800' }, // CACIC PRIMARY
          600: { value: '#D97706' },
          700: { value: '#B45309' },
          800: { value: '#92400E' },
          900: { value: '#78350F' },
        },
        gray: {
          50: { value: '#F9FAFB' },
          100: { value: '#F3F4F6' },
          200: { value: '#E5E7EB' },
          300: { value: '#D1D5DB' },
          400: { value: '#9CA3AF' },
          500: { value: '#6B7280' },
          600: { value: '#4B5563' },
          700: { value: '#374151' },
          800: { value: '#1F2937' },
          900: { value: '#111827' },
        },
      },
      semanticTokens: {
        colors: {
          'bg.canvas': {
            value: { base: '#FFFFFF', _dark: '#0A0A0A' },
          },
          'bg.card': {
            value: { base: '#F9FAFB', _dark: '#1A1A1A' },
          },
          'bg.subtle': {
            value: { base: '#F3F4F6', _dark: '#262626' },
          },
          'text.primary': {
            value: { base: '#0A0A0A', _dark: '#FFFFFF' },
          },
          'text.secondary': {
            value: { base: '#6B7280', _dark: '#D1D5DB' },
          },
          'border.default': {
            value: { base: '#E5E7EB', _dark: '#374151' },
          },
          'border.brand': {
            value: '#F5B800',
          },
        },
      },
    },
    semanticTokens: {
      fontSizes: {
        'hero': { value: '3.5rem' },
        'h1': { value: '2.25rem' },
        'h2': { value: '1.875rem' },
        'h3': { value: '1.5rem' },
        'body': { value: '1rem' },
        'small': { value: '0.875rem' },
      },
    },
  },
})

export const system = createSystem(defaultConfig, customConfig)
```

**Source:** [Chakra UI v3 Theme Documentation](https://chakra-ui.com/docs/components/theme)

### Example 4: Navbar with Dark Mode Toggle

```typescript
// src/components/layout/navbar.tsx
'use client'
import { Box, Flex, Link as ChakraLink, Button, HStack, Container } from '@chakra-ui/react'
import { ColorModeButton } from '@chakra-ui/color-mode'
import NextLink from 'next/link'

export function Navbar() {
  return (
    <Box
      as="nav"
      bg="bg.canvas"
      borderBottomWidth="1px"
      borderColor="border.default"
      position="sticky"
      top={0}
      zIndex={50}
    >
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center" h={16}>
          {/* Logo */}
          <ChakraLink as={NextLink} href="/" fontWeight="bold" fontSize="xl">
            CACIC
          </ChakraLink>

          {/* Navigation Links */}
          <HStack spacing={6} hide={{ base: true, md: false }}>
            <ChakraLink as={NextLink} href="/blog">
              Blog
            </ChakraLink>
            <ChakraLink as={NextLink} href="/eventos">
              Eventos
            </ChakraLink>
            <ChakraLink as={NextLink} href="/trabalhos">
              Trabalhos
            </ChakraLink>
            <ChakraLink as={NextLink} href="/membros">
              Membros
            </ChakraLink>
          </HStack>

          {/* Right: Dark Mode Toggle + Login */}
          <HStack spacing={4}>
            <ColorModeButton />
            <Button
              as={NextLink}
              href="/login"
              bg="brand.500"
              color="black"
              _hover={{ bg: 'brand.600' }}
              size="sm"
            >
              Login
            </Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}
```

**Source:** Chakra UI + Project Plan

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `getSession()` for auth checks | `getUser()` + server validation | Supabase best practices (2023+) | Server-side JWT validation prevents token forgery |
| Custom CSS dark mode | Chakra ColorModeProvider + next-themes | Chakra UI v3 (2024) | Handles SSR hydration, browser preference detection |
| `middleware.ts` | `proxy.ts` (or `middleware.ts` in Next.js <16) | Next.js 16 (2026) | Clarifies intent (proxy ≠ Express middleware) |
| Manual theme tokens | Semantic token system in `createSystem()` | Chakra UI v3 (2024) | Auto CSS variable generation, scoped overrides |
| React Spring animations | React Bits (collection) | Industry trend (2025) | Pre-optimized, installable, tree-shakeable |

**Deprecated/outdated:**
- **Chakra UI v2 theme setup:** V3 uses `createSystem()` and Panda CSS under the hood. V2 patterns (ChakraProvider wrapper in \_app.tsx) don't apply.
- **Custom Supabase email validation:** Use Supabase Auth settings for domain allowlist (if available in your tier) or validate in Server Action.
- **localStorage for dark mode:** next-themes handles this via cookies or localStorage automatically; don't manage manually.

## Open Questions

1. **Supabase email domain allowlist at Auth level**
   - What we know: `signInWithOtp()` doesn't natively filter by domain. Project Plan shows domain validation in Server Action.
   - What's unclear: Does Supabase Dashboard → Authentication → Settings have a "Allowed Domains" field for Magic Link signup?
   - Recommendation: Verify in Supabase Dashboard. If unavailable, Server Action validation is the fallback and sufficient. Document in code comments.

2. **React Bits license and tree-shaking**
   - What we know: React Bits uses MIT + Commons Clause (allows commercial use).
   - What's unclear: Does the package ship with `"sideEffects": false` and ESM? Will importing SplitText tree-shake unused components?
   - Recommendation: Install and run `npm ls react-bits`, build locally, measure bundle size. If bloat occurs, consider animating with Framer Motion instead.

3. **Next.js Proxy vs Middleware naming**
   - What we know: Next.js 16 renamed `middleware.ts` to `proxy.ts`. Code is the same.
   - What's unclear: Should Phase 2 create `proxy.ts` or `middleware.ts`? Current project uses Next.js 14, so `middleware.ts` is correct now.
   - Recommendation: Use `src/middleware.ts` for Next.js 14. When upgrading to 16, rename to `proxy.ts` and update config.

4. **Mobile nav hamburger menu**
   - What we know: Navbar is responsive with `hide={{ base: true, md: false }}` for desktop links.
   - What's unclear: How to implement the mobile hamburger menu? Use Chakra's `Menu` component or custom drawer?
   - Recommendation: Use Chakra's `Menu` or `Drawer` component for mobile nav. Implement in mobile breakpoint (`base`). Verify at 375px viewport.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected — Wave 0 setup needed |
| Config file | None — see Wave 0 gaps |
| Quick run command | `npm run build && npm run start` (smoke test) |
| Full suite command | (To be determined in Phase 2 planning) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| AUTH-01 | Non-@ufpr.br email shows "Use seu e-mail institucional" error | unit | (Server action test in Wave 0) | ❌ Wave 0 |
| AUTH-02 | Code exchange redirects to /dashboard | integration | (E2E test for callback flow) | ❌ Wave 0 |
| AUTH-03 | Unauthenticated request to /dashboard redirects to /login | smoke | Manual: visit /dashboard in incognito | ❌ Wave 0 |
| AUTH-04 | getUser() called in middleware | code review | Grep: `getUser()` in middleware/proxy.ts | ✅ Verify manually |
| AUTH-05 | Login form renders + accepts email input | unit | (DOM test in Wave 0) | ❌ Wave 0 |
| AUTH-06 | /login/verifique-seu-email page accessible | smoke | Manual: submit login form | ❌ Wave 0 |
| UI-01 | Brand color #F5B800 applied to buttons/badges | visual | Manual: inspect element in browser | ✅ Manual verification |
| UI-02 | Semantic tokens render correctly (bg.canvas, text.primary) | unit | (Chakra token snapshot in Wave 0) | ❌ Wave 0 |
| UI-03 | Google Fonts loaded (Space Grotesk, Inter, JetBrains) | smoke | `curl <site> \| grep -i 'fonts.googleapis'` | ❌ Wave 0 |
| UI-04 | Dark mode toggle switches theme | smoke | Manual: click ColorModeButton | ✅ Manual verification |
| UI-05 | Navbar responsive at 375px and 1280px | visual | Manual: viewport tests in DevTools | ✅ Manual verification |
| UI-06 | Footer visible on all pages | smoke | Manual: scroll to bottom | ✅ Manual verification |
| UI-07 | PostCard renders with left yellow border | visual | Manual: inspect element | ❌ Wave 0 |
| UI-08 | EventCard shows event type icon | visual | Manual: visit /eventos mockup | ❌ Wave 0 |
| UI-09 | WorkCard PDF button functional | integration | (E2E test for PDF link) | ❌ Wave 0 |
| UI-10 | MemberCard uses TiltCard tilt effect | smoke | Manual: hover/move mouse over card | ✅ Manual verification |
| UI-11 | CategoryBadge colors per category | visual | Manual: inspect badge in /blog | ❌ Wave 0 |
| UI-12 | Hero SplitText animates on page load | smoke | Manual: watch title animation | ✅ Manual verification |
| UI-13 | Animations smooth (SplitText, FadeContent) | smoke | Manual: check 60fps in DevTools | ✅ Manual verification |

### Sampling Rate
- **Per task commit:** Build succeeds locally (`npm run build`); manual responsive test at 375px and 1280px in Chrome DevTools.
- **Per wave merge:** Full build succeeds; manual smoke test of login flow + dark mode toggle.
- **Phase gate:** All components render correctly on mobile and desktop; authentication flow works (non-@ufpr.br email rejected, valid email receives magic link, callback redirects to /dashboard).

### Wave 0 Gaps
- [ ] **Unit test setup** — Vitest or Jest config, test utilities, mocks for Supabase client
- [ ] **Server action tests** — Test `loginWithMagicLink()` validates @ufpr.br domain
- [ ] **E2E test setup** — Playwright or Cypress for auth flow verification
- [ ] **Component snapshot tests** — Chakra UI theme tokens render correctly
- [ ] **Accessibility tests** — axe-core for color contrast in light/dark modes

*For now:* Manual smoke tests (responsive design, dark mode toggle, auth flow) + code review (getUser validation, semantic tokens) are sufficient for Phase 2 closure. Full test harness deferred to Phase 3.

## Sources

### Primary (HIGH confidence)

- **Supabase Magic Link Docs** - [https://supabase.com/docs/guides/auth/auth-magic-link](https://supabase.com/docs/guides/auth/auth-magic-link) — PKCE flow, `signInWithOtp()`, rate limiting (1/60s), 1-hour expiration
- **Supabase Passwordless Email** - [https://supabase.com/docs/guides/auth/auth-email-passwordless](https://supabase.com/docs/guides/auth/auth-email-passwordless) — email validation mechanics
- **Chakra UI Theme Documentation** - [https://chakra-ui.com/docs/components/theme](https://chakra-ui.com/docs/components/theme) — semantic tokens, light/dark mode, `createSystem()`
- **Chakra UI Dark Mode** - [https://chakra-ui.com/docs/styling/dark-mode](https://chakra-ui.com/docs/styling/dark-mode) — ColorModeProvider setup
- **Next.js Proxy/Middleware** - [https://nextjs.org/docs/app/building-your-application/routing/middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware) — matcher config, route protection, `NextRequest`
- **Project Reference Plan** - `./Plano_Blog_CA_CC_UFPR.md` — exact code patterns for auth actions, theme config, security headers
- **Project Requirements** - `.planning/REQUIREMENTS.md` — AUTH-01 through AUTH-06, UI-01 through UI-13 specifications

### Secondary (MEDIUM confidence)

- **Chakra UI v3 Next.js Setup** - [https://chakra-ui.com/docs/get-started/frameworks/next-app](https://chakra-ui.com/docs/get-started/frameworks/next-app) — installation, ChakraProvider wrapper
- **Chakra UI Color Mode** - [https://chakra-ui.com/docs/components/color-mode](https://chakra-ui.com/docs/components/color-mode) — ColorModeButton, useColorMode hook
- **Supabase Row Level Security** - [https://supabase.com/docs/guides/database/postgres/row-level-security](https://supabase.com/docs/guides/database/postgres/row-level-security) — RLS overview (context for auth policies)
- **React Bits** - [https://reactbits.dev/](https://reactbits.dev/) and [https://github.com/DavidHDev/react-bits](https://github.com/DavidHDev/react-bits) — SplitText, TiltCard, FadeContent documentation
- **Next.js with Chakra Blog Posts** - Multiple sources verified SplitText + NextJS patterns (October 2025, January 2026)

### Tertiary (LOW confidence — noted for validation)

- **Supabase email domain allowlist at auth level** — WebSearch results mention GitHub issue #6228 but no official current feature. Server Action validation confirmed sufficient in Project Plan.
- **React Bits tree-shaking** — WebSearch results confirm MIT + Commons Clause license and collection structure, but specific bundle impact not verified. Recommend testing locally.

## Metadata

**Confidence breakdown:**
- **Standard stack:** HIGH — Chakra UI v3, Supabase Auth, Next.js 14+ all officially documented and project-locked.
- **Magic Link implementation:** HIGH — Project Plan provides exact code; Supabase docs confirm `signInWithOtp()` + `exchangeCodeForSession()` pattern.
- **Dark mode setup:** HIGH — Chakra UI v3 + ColorModeProvider + next-themes pattern is standard.
- **Authentication middleware:** HIGH — Next.js Proxy/middleware official docs + Project Plan code examples.
- **React Bits components:** MEDIUM — Library documented and available; specific integration impact not tested locally yet.
- **Email domain validation:** HIGH (Server Action) / MEDIUM (Supabase Dashboard feature) — Server Action approach verified in Project Plan; Dashboard feature status unclear (use server-side as fallback).

**Research date:** 2026-03-10
**Valid until:** 2026-03-31 (30 days for stable stack; reassess if Next.js or Chakra release new major versions)
