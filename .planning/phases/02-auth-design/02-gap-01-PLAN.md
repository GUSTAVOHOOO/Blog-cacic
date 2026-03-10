---
phase: 02-auth-design
plan: gap-01
title: Fix Dark Mode Theme Integration
gap_closure: true
autonomous: true
depends_on: [02-01, 02-02, 02-03, 02-04, 02-05, 02-06]
provides: [UI-04]
requirements: [UI-04]
files_modified:
  - src/components/providers/chakra-provider.tsx
  - src/app/layout.tsx
  - src/lib/theme/config.ts
---

# Phase 2 Gap 1: Fix Dark Mode Theme Integration

## Objective
Fix dark mode toggle so theme switches between light and dark correctly. Currently next-themes is changing the HTML class but Chakra UI v3 isn't detecting it. Need to wire ColorModeProvider correctly.

## Tasks

### Task 1: Update Chakra Provider with ColorModeProvider
**File:** `src/components/providers/chakra-provider.tsx`

- Import `ColorModeProvider` from `@chakra-ui/react`
- Wrap ChakraProvider with ColorModeProvider
- Pass `forcedTheme` props to sync with next-themes

**Action:**
Replace:
```tsx
<ThemeProvider attribute="class" defaultTheme="light">
  <ChakraProvider value={system}>
    {children}
  </ChakraProvider>
</ThemeProvider>
```

With:
```tsx
<ThemeProvider attribute="class" defaultTheme="light" storageKey="theme-mode">
  <ChakraProvider value={system}>
    <ColorModeProvider>
      {children}
    </ColorModeProvider>
  </ChakraProvider>
</ThemeProvider>
```

**Verify:** `npm run build` succeeds

### Task 2: Update root layout to use data-theme attribute
**File:** `src/app/layout.tsx`

- Add `suppressHydrationWarning` to html tag (already done ✓)
- No other changes needed - html class switching is handled by next-themes

**Verify:** `npm run build` succeeds, `npm run dev` starts

### Task 3: Test dark mode toggle
**Manual verification:**

1. Run `npm run dev`
2. Visit http://localhost:3000
3. Click dark mode toggle (🌙/☀️ in navbar)
   - Background should change to black (#0A0A0A)
   - Text should change to white
   - CACIC yellow should be visible
4. Refresh page - dark mode preference should persist
5. Open devtools → Application → Cookies → look for `theme-mode` or check localStorage
6. Check Elements tab - `<html>` should have `class="dark"` in dark mode

**Expected Results:**
- Light mode: White background, black text
- Dark mode: Black (#0A0A0A) background, white text
- Toggle works instantly
- Preference persists on refresh
- No console errors

## Success Criteria

- [ ] Dark mode toggle works (click changes theme)
- [ ] Background and text colors change
- [ ] CACIC yellow visible in both modes
- [ ] Theme persists on page refresh
- [ ] No console errors
- [ ] npm run build succeeds with 0 errors

## Notes

- This is a Chakra UI v3 specific issue
- ColorModeProvider must be inside ChakraProvider for proper initialization
- next-themes handles the persistence, just needed to wire it to Chakra
