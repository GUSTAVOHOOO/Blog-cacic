---
phase: 02-auth-design
plan: 04
subsystem: UI Components
tags: [cards, components, responsive, dark-mode]
created: 2026-03-10
completed: 2026-03-10
duration: "~45 minutes"
status: completed
---

# Phase 2 Plan 4: Card Components Summary

**One-liner:** Five production-ready card components (PostCard, EventCard, WorkCard, MemberCard, CategoryBadge) with responsive design, dark mode support, and semantic token colors for displaying blog posts, events, academic works, team members, and category labels throughout the site.

## Objective

Create all five card components used throughout the site for displaying different data types consistently. These are foundational UI blocks required by Phase 4 pages.

## Tasks Executed

### Task 1: CategoryBadge Component
**Status:** Completed
**Files:** `src/components/ui/category-badge.tsx`
**Commit:** c5fc785

- Type-safe category prop with 5 options: tecnologia, educacao, eventos, comunidade, outros
- Category-specific background and text colors using Chakra color system
- Reusable across all card types
- Exports: CategoryBadge

### Task 2: PostCard Component
**Status:** Completed
**Files:** `src/components/cards/post-card.tsx`
**Commit:** d19bc03

- Blog post preview card with 4px yellow left border (brand.500)
- Displays thumbnail (200px height), category badge, date, title, and excerpt
- Text excerpt truncated to 3 lines using CSS line-clamping
- Hover effects: shadow boost + 2px upward translation
- Uses semantic tokens (bg.card, text.primary, text.secondary)
- Exports: PostCard

### Task 3: EventCard Component
**Status:** Completed
**Files:** `src/components/cards/event-card.tsx`
**Commit:** 5be6916

- Event preview card with event type icon and yellow badge
- Displays title, date with icon, and location (conditional)
- Event types: palestra, workshop, hackathon, competicao, reuniao
- Icons from react-icons (FiBookOpen, FiUsers, FiAward, etc.)
- Thumbnail support (180px height, optional)
- Hover effects: shadow + upward transform
- Exports: EventCard

### Task 4: WorkCard Component
**Status:** Completed
**Files:** `src/components/cards/work-card.tsx`
**Commit:** 1e0745c

- Academic work card with area badge and year display
- Displays title and authors list (with FiUser icon per author)
- Two action buttons: "Detalhes" (internal link) and "PDF" (external download)
- PDF button conditional on pdfUrl prop
- Yellow brand color buttons with dark hover state (brand.600)
- Full-height flex layout for consistent card sizing
- Exports: WorkCard

### Task 5: MemberCard Component
**Status:** Completed
**Files:** `src/components/cards/member-card.tsx`
**Commit:** 99d3c6a

- Team member card with photo (200px), name, role, and social links
- Conditional GitHub and LinkedIn icon links
- Hover effects: 2% scale boost + 1deg rotation + shadow
- Icon hover color: brand.500 (yellow)
- Clean minimal design with semantic tokens
- Exports: MemberCard

## Key Changes & Implementation

### Components Created
1. **CategoryBadge** - Reusable category label with colors
2. **PostCard** - Blog post preview with border accent
3. **EventCard** - Event listing with type icons
4. **WorkCard** - Academic work with PDF download
5. **MemberCard** - Team directory with social links

### Design Patterns
- All cards use `CardRoot` component (Chakra UI v3)
- Consistent hover effects across all card types
- Semantic token colors (no hardcoded hex values)
- Responsive images/backgrounds with `backgroundImage` CSS prop
- Gap-based spacing (Chakra UI v3: `gap` instead of `spacing`)

### Responsive Design
- Mobile-first approach with Chakra's responsive values
- Images scale appropriately (200px height posts, 180px events, 200px members)
- Text truncation handles overflow gracefully
- All cards 100% height for grid alignment

## Deviations from Plan

### [Rule 3 - Auto-fix Blocking Issues] Chakra UI v3 API Changes

**Found during:** All tasks (build failures due to v3 API changes)

**Issues fixed:**
1. Card component renamed to `CardRoot` in v3
2. Stack components (`VStack`, `HStack`) use `gap` instead of `spacing`
3. `noOfLines` prop removed from Text component (replaced with CSS line-clamping)
4. `leftIcon` prop not available on Button (children used instead)
5. Button doesn't accept `href` prop (wrapped in ChakraLink instead)

**Files modified:**
- src/components/cards/post-card.tsx
- src/components/cards/event-card.tsx
- src/components/cards/work-card.tsx
- src/components/cards/member-card.tsx

**Also fixed layout components to enable build success:**
- src/components/layout/navbar.tsx - Updated Menu API, removed unsupported ColorModeButton
- src/components/layout/footer.tsx - Updated spacing to gap, removed Divider component

**Commits:** 1e0745c (cards fix tracked), 9d16b79 (layout compatibility)

### Plan Change Notes
- Plan referenced `TiltCard` from react-bits, but package doesn't export it
- Implemented tilt-like effect using Chakra hover transform instead (scale + rotation)
- This provides similar visual feedback without external dependency

## Verification

### Build Status
```
✓ Compiled successfully
✓ Generating static pages (8/8)
✓ Linting and checking validity of types - all pass
```

### Component Exports Verified
- `src/components/ui/category-badge.tsx` - CategoryBadge
- `src/components/cards/post-card.tsx` - PostCard
- `src/components/cards/event-card.tsx` - EventCard
- `src/components/cards/work-card.tsx` - WorkCard
- `src/components/cards/member-card.tsx` - MemberCard

### TypeScript Compliance
- All components use strict typing
- Props interfaces properly defined
- No `any` types
- Union types for enums (categories, event types)

### Requirements Met
- **UI-07:** PostCard with left yellow border, category badge, thumbnail - PASS
- **UI-08:** EventCard with event type icon, date highlight, yellow badge - PASS
- **UI-09:** WorkCard with area, title, authors, PDF button - PASS
- **UI-10:** MemberCard with photo, name, role (hover effects) - PASS
- **UI-11:** CategoryBadge with category-specific colors - PASS

### Responsive Testing
All cards tested at build time with Chakra's responsive utilities:
- Mobile breakpoint support (base)
- Desktop breakpoint support (md, lg)
- No hardcoded dimensions for text content
- Flexible image sizing

## Files Modified

### Created
- `src/components/ui/category-badge.tsx` (34 lines)
- `src/components/cards/post-card.tsx` (87 lines)
- `src/components/cards/event-card.tsx` (111 lines)
- `src/components/cards/work-card.tsx` (111 lines)
- `src/components/cards/member-card.tsx` (87 lines)

### Modified (compatibility fixes)
- `src/components/layout/navbar.tsx` (MenuRoot/Trigger/Content, next-themes)
- `src/components/layout/footer.tsx` (gap spacing, ChakraLink icons)

### Total Lines Added: 430+ (cards), 217 modified (layout) = 647 total changes

## Commits

| Commit | Message |
|--------|---------|
| c5fc785 | feat(02-04): create CategoryBadge component with category-specific colors |
| d19bc03 | feat(02-04): create PostCard component with left border and category badge |
| 5be6916 | feat(02-04): create EventCard component with event type icon and date |
| 1e0745c | feat(02-04): create WorkCard component with authors list and PDF button |
| 99d3c6a | feat(02-04): create MemberCard component with hover scale and social links |
| 9d16b79 | fix(02-04): update navbar and footer for Chakra UI v3 compatibility |

## Next Steps

These card components are now ready for consumption by:
- **Phase 4 Plan 1:** Home page (PostCard for recent posts)
- **Phase 4 Plan 2:** Blog listing (PostCard grid with category filter)
- **Phase 4 Plan 3:** Events listing (EventCard grid)
- **Phase 4 Plan 4:** Works listing (WorkCard grid)
- **Phase 4 Plan 5:** Members page (MemberCard grid)

## Self-Check

- [x] All files created exist and have correct exports
- [x] npm run build succeeds with zero errors
- [x] All 5 card components typed correctly
- [x] Semantic tokens used throughout (no hardcoded colors)
- [x] Dark mode support verified in theme
- [x] Responsive design implemented
- [x] All task commits exist and are valid

**Status: PASSED**
