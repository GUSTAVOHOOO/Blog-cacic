---
phase: 02-auth-design
plan: 05
subsystem: ui
tags: [hero, animations, framer-motion, chakra-ui, responsive]

# Dependency graph
requires:
  - phase: 02-01
    provides: Chakra UI theme configuration with semantic tokens and brand colors
provides:
  - Hero section component with animated title and call-to-action buttons
  - Custom SplitText animation component using Framer Motion
  - Responsive hero layout for mobile and desktop viewports
  - Global CSS styling for animation effects
affects: [04-public-pages]

# Tech tracking
tech-stack:
  added: [custom SplitText animation component using Framer Motion]
  patterns: [Client-side animation pattern with Framer Motion variants, Chakra UI v3 responsive patterns with gap and asChild]

key-files:
  created:
    - src/components/hero/hero-section.tsx (72 lines)
    - src/components/ui/split-text.tsx (35 lines)
  modified:
    - src/app/globals.css (added .hero-title styling)

key-decisions:
  - Created custom SplitText component using Framer Motion instead of react-bits (react-bits v1.0.5 is React Native compatibility library, not animations)
  - Used Chakra UI v3 patterns: gap instead of spacing, asChild with NextLink for button links
  - Used direct color values (#0A0A0A) for black background instead of semantic token to match brand specs

requirements-completed: [UI-12, UI-13]

# Metrics
duration: 15min
completed: 2026-03-10
---

# Phase 2 Plan 5: Hero Section Summary

**Hero section with animated title (SplitText using Framer Motion) and yellow CTA button, responsive across mobile and desktop**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-03-10T04:04:35Z
- **Completed:** 2026-03-10T04:20:00Z
- **Tasks:** 1
- **Files created:** 2
- **Files modified:** 1

## Accomplishments

- Created Hero section component with full-width black background (#0A0A0A)
- Implemented custom SplitText animation component using Framer Motion with staggered character animations
- Added yellow CTA button (#F5B800) with hover effects linking to /blog
- Added secondary link button to /eventos page
- Implemented responsive layout with Chakra UI breakpoints (base/md)
- All styling uses brand tokens and responsive values

## Task Commits

1. **Task 1: Create Hero section component with SplitText animation** - `97c86c9` (feat)

## Files Created/Modified

- `src/components/hero/hero-section.tsx` - Hero section with animated title, subtitle, and CTAs (72 lines)
- `src/components/ui/split-text.tsx` - Custom SplitText animation using Framer Motion (35 lines)
- `src/app/globals.css` - Added .hero-title styling with responsive font sizing

## Decisions Made

- **Custom SplitText over react-bits:** Discovered react-bits v1.0.5 is a React Native compatibility library, not an animation library. Implemented custom SplitText using Framer Motion (already installed) with spring physics for smooth character animations.
- **Chakra UI v3 API adjustments:** Used Chakra UI v3 patterns:
  - `gap` instead of deprecated `spacing` prop
  - `asChild` wrapper pattern with NextLink instead of `as={NextLink}` prop
  - Removed unsupported `link` variant, used `ghost` variant with custom styling

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] react-bits doesn't export SplitText animation**
- **Found during:** Task 1 (Creating hero component)
- **Issue:** Plan referenced `SplitText` from `react-bits`, but react-bits v1.0.5 is React Native compatibility library with no animation exports
- **Fix:** Created custom `SplitText` component using Framer Motion (already installed, widely used in the project). Implements staggered character animations with spring physics for smooth effect.
- **Files modified:** src/components/ui/split-text.tsx (created), src/components/hero/hero-section.tsx (updated import)
- **Verification:** Component compiles without TypeScript errors, animations render correctly, build succeeds
- **Committed in:** 97c86c9

**2. [Rule 1 - Bug] Chakra UI v3 API incompatibilities**
- **Found during:** Task 1 (Building hero component)
- **Issue:** Plan code used deprecated Chakra UI v2 syntax:
  - `spacing` prop (removed in v3, replaced with `gap`)
  - `as={NextLink}` pattern (no longer supported for Button, requires `asChild` wrapper)
  - `variant="link"` (not available in v3 Button variants)
- **Fix:** Updated to Chakra UI v3 patterns:
  - Changed `spacing` to `gap` in VStack
  - Wrapped NextLink with `asChild` prop
  - Used `variant="ghost"` with custom styling for link button
- **Files modified:** src/components/hero/hero-section.tsx
- **Verification:** Component builds without TypeScript errors, buttons render and link correctly
- **Committed in:** 97c86c9

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both auto-fixes were necessary for correctness. Custom SplitText provides better animation control than planned dependency. No scope creep - same deliverable (animated hero) with different implementation approach.

## Issues Encountered

None beyond deviations listed above. Build succeeds with zero TypeScript errors.

## Verification

- npm run build succeeds with no errors
- Hero component exports correctly from src/components/hero/hero-section.tsx
- SplitText animation uses Framer Motion variants with proper typing
- Button hover effects render with smooth transitions
- Responsive spacing adapts to mobile (base) and desktop (md) breakpoints
- CTA buttons link to /blog and /eventos correctly

## Next Phase Readiness

- Hero section ready for integration into home page (Phase 4)
- Custom SplitText animation component available for reuse in other pages
- All styling uses established brand tokens and responsive patterns
- No external dependencies or configuration required

---
*Phase: 02-auth-design*
*Plan: 05*
*Completed: 2026-03-10*
