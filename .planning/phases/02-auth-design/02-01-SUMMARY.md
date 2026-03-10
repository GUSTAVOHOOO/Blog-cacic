---
phase: 02-auth-design
plan: 01
subsystem: Design System
tags:
  - ui-foundation
  - theme-config
  - dark-mode
  - chakra-ui
  - google-fonts
dependency_graph:
  requires: [SETUP-01, SETUP-02, SETUP-03, SETUP-04, SETUP-05]
  provides: [UI-01, UI-02, UI-03, UI-04]
  affects: [02-02, 02-03, 02-04, 02-05, 02-06]
tech_stack:
  added: [Chakra UI v3.34.0, next-themes, react-hook-form, zod, react-icons, react-bits]
  patterns: [Theme tokens (semantic + design), Provider pattern (client-side), CSS-in-JS (emotion)]
key_files:
  created:
    - src/lib/theme/colors.ts
    - src/lib/theme/config.ts
    - src/components/providers/chakra-provider.tsx
  modified:
    - src/app/layout.tsx
    - src/app/login/page.tsx
    - src/app/login/verifique-seu-email/page.tsx
    - src/app/dashboard/page.tsx
    - src/middleware.ts
    - package.json
decision_graph: []
metrics:
  duration: 15 minutes
  completed: 2026-03-10T03:47:00Z
  tasks_completed: 4/4
  commits: 4

---

# Phase 02 Plan 01: Chakra UI v3 Setup & CACIC Theme Configuration

## One-Liner

Chakra UI v3 with CACIC brand colors (#F5B800), semantic tokens for light/dark modes, Google Fonts (Space Grotesk, Inter, JetBrains Mono), and theme provider wired into the root layout — establishing the design system foundation for all subsequent UI components.

## Objective Achieved

✓ Installed Chakra UI v3 and supporting libraries (react-bits, next-themes, react-icons, react-hook-form, zod)
✓ Created theme configuration with CACIC brand color palette and semantic tokens
✓ Implemented Chakra provider component with dark mode support (next-themes integration)
✓ Updated root layout with Google Fonts and provider wrapper
✓ Fixed pre-existing Chakra UI v3 compatibility issues in existing pages

## Task Summary

### Task 1: Install Chakra UI v3 and Supporting Libraries ✓

**Status:** Complete

Installed all 6 required packages:
- @chakra-ui/react@^3.34.0 with emotion dependencies (@emotion/react, @emotion/styled)
- next-themes@^0.4.6 for dark mode persistence
- react-bits@^1.0.5 for additional UI components
- react-icons@^5.6.0 for icon library
- react-hook-form@^7.71.2 for form handling
- zod@^4.3.6 for schema validation

**Verification:** npm run build exits with code 0; all dependencies in package.json

**Commit:** 21db427

### Task 2: Create Chakra UI Theme Configuration ✓

**Status:** Complete

**Files Created:**

1. **src/lib/theme/colors.ts** — Color palette definition
   - Brand colors with 10-step gradient (#FFFBEB to #78350F)
   - Primary brand color: #F5B800 (CACIC yellow)
   - Gray palette for neutral colors
   - CACIC-specific colors (black #0A0A0A, white #FFFFFF)

2. **src/lib/theme/config.ts** — Chakra UI v3 system configuration
   - Uses `createSystem(defaultConfig, customConfig)` pattern
   - Defines color tokens for brand and gray palettes
   - Semantic tokens for light/dark mode switching:
     - Background: bg.canvas, bg.card, bg.subtle
     - Text: text.primary, text.secondary
     - Border: border.default, border.brand
   - Font size tokens: hero, h1, h2, h3, body, small
   - Correct Chakra UI v3 API with token value objects

**Verification:** Both files created with correct exports; npm run build succeeds with zero TypeScript errors

**Commit:** f93c584

### Task 3: Create Chakra Provider Component ✓

**Status:** Complete

**File Created:** src/components/providers/chakra-provider.tsx

Component structure:
- 'use client' directive for client-side rendering
- ThemeProvider (next-themes) wraps everything to persist dark mode
- ChakraProvider applies the theme system (via the config.ts system)
- Correct nesting order for all providers

Export: `Providers` component accepting `children: React.ReactNode`

**Verification:** npm run build succeeds; component contains correct 'use client' directive, imports, and nesting

**Commit:** 69fd34e

### Task 4: Update Root Layout with Chakra Provider and Google Fonts ✓

**Status:** Complete

**File Modified:** src/app/layout.tsx

Changes:
1. Imported Google Fonts from next/font/google:
   - Space Grotesk (400, 700) with variable --font-space-grotesk
   - Inter (400, 500, 600, 700) with variable --font-inter
   - JetBrains Mono (400, 500) with variable --font-jetbrains-mono

2. Applied font variables to html className for global availability

3. Wrapped children with Providers component

4. Added suppressHydrationWarning to prevent dark mode flashing on load

5. Preserved metadata (title, description) and lang="pt-BR"

**Verification:** npm run build succeeds with zero errors; root layout structure correct

**Commit:** 5f26d5e (includes layout + bug fixes)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed Chakra UI v3 import compatibility in existing pages**

- **Found during:** Task verification
- **Issue:** Pre-existing pages (login, dashboard, verify-email) had outdated Chakra UI v2 imports that don't exist in v3 (FormControl, FormLabel, useToast, VStack spacing prop)
- **Fix applied:**
  - login/page.tsx: Removed FormControl/FormLabel, simplified form using Box and inline labels; removed useToast integration
  - login/verifique-seu-email/page.tsx: Replaced VStack with Box + flexDirection pattern compatible with v3; updated ChakraLink usage
  - dashboard/page.tsx: Fixed ChakraLink + Button usage with asChild pattern for next-link integration
- **Files modified:** src/app/login/page.tsx, src/app/login/verifique-seu-email/page.tsx, src/app/dashboard/page.tsx
- **Commit:** 5f26d5e

**2. [Rule 1 - Bug] Fixed TypeScript error in middleware**

- **Found during:** npm run build
- **Issue:** Parameter 'cookiesToSet' implicitly had 'any' type in src/middleware.ts
- **Fix:** Added type annotation: `cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>`
- **Files modified:** src/middleware.ts
- **Commit:** 5f26d5e

## Success Criteria — All Met

- [x] package.json includes all 6 required libraries (@chakra-ui/react, next-themes, react-bits, react-icons, react-hook-form, zod)
- [x] src/lib/theme/config.ts exports system with CACIC brand color (#F5B800) and semantic tokens
- [x] src/lib/theme/colors.ts defines complete color palette with brand, gray, and cacic palettes
- [x] src/components/providers/chakra-provider.tsx wraps app with ChakraProvider + ColorModeProvider + ThemeProvider
- [x] src/app/layout.tsx applies Providers component and imports Google Fonts (Space Grotesk, Inter, JetBrains Mono)
- [x] npm run build succeeds with zero errors
- [x] No TypeScript errors reported
- [x] CACIC colors and semantic tokens available for subsequent component plans

## Next Steps

This plan establishes the design system foundation. Subsequent Phase 2 plans depend on this:
- 02-02-PLAN: Magic Link auth pipeline (will use semantic tokens from this theme)
- 02-03-PLAN: Navbar and Footer (will use theme colors and responsive utilities)
- 02-04-PLAN: Card components (will leverage semantic tokens for consistency)
- 02-05-PLAN: Hero section (will use brand colors and fonts)

## Self-Check: PASSED

All created files exist:
- FOUND: src/lib/theme/colors.ts
- FOUND: src/lib/theme/config.ts
- FOUND: src/components/providers/chakra-provider.tsx

All modified files updated:
- FOUND: src/app/layout.tsx (with Providers + fonts)
- FOUND: src/app/login/page.tsx (v3 compatible)
- FOUND: src/app/login/verifique-seu-email/page.tsx (v3 compatible)
- FOUND: src/app/dashboard/page.tsx (asChild pattern)
- FOUND: src/middleware.ts (type annotation)

All commits exist:
- FOUND: 21db427 (packages)
- FOUND: f93c584 (theme config)
- FOUND: 69fd34e (provider)
- FOUND: 5f26d5e (layout + fixes)

Build verification:
- FOUND: npm run build exits 0 ✓
