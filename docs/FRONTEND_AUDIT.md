# Frontend Audit Report — JobScout

**Scope**: Entire web package (`packages/web`)  
**Files inspected**: 25 components, 4 pages, 6 hooks  
**Date**: Current session

## Summary

| Severity | Count | Status |
|----------|-------|--------|
| P0 (Bugs, blockers) | 3 | Needs fixing |
| P1 (UX/Inconsistency) | 6 | Should fix |
| P2 (Polish/Drift) | 8 | Nice to have |

**Overall Grade**: B+ (Good foundation, needs polish for Google-standard)

---

## P0 — Bugs & Blockers

### 1. Missing aria-label on icon-only buttons
- **Files**: 
  - `components/layout/Header.tsx:90` (Search button)
  - `components/layout/Header.tsx:129` (Notifications button)
  - `components/layout/FilterSidebar.tsx:117,124,143,281` (Multiple filter buttons)
- **Issue**: Icon-only buttons without `aria-label` are inaccessible to screen readers
- **Fix**: Add descriptive `aria-label` attributes
- **Safe to auto-fix**: Yes (labels are unambiguous from context)

### 2. Mobile viewport bug: `min-h-screen` instead of `min-h-dvh`
- **Files**:
  - `pages/index.tsx:142`
  - `pages/search.tsx:367`
  - `pages/job/[id].tsx:193`
- **Issue**: `min-h-screen` causes the iOS Safari toolbar jump bug
- **Fix**: Replace with `min-h-[100dvh]` or `min-h-dvh` (Tailwind v3.4+)
- **Safe to auto-fix**: Yes

### 3. Console.log statements in production code
- **Files**:
  - `pages/index.tsx:280`
  - `pages/search.tsx:568`
  - `pages/job/[id].tsx:550`
- **Issue**: `console.log('Bookmark:', id)` placeholder code left in
- **Fix**: Implement actual bookmark functionality or remove
- **Safe to auto-fix**: No (requires feature decision)

---

## P1 — UX & Inconsistency

### 4. Form inputs without associated labels
- **Files**:
  - `components/layout/FilterSidebar.tsx:200` (Checkbox without label)
  - `pages/search.tsx:382,405` (Search inputs)
- **Issue**: Inputs without labels fail WCAG AA
- **Fix**: Add `<label>` elements or `aria-label` attributes
- **Safe to auto-fix**: Partially (aria-label yes, visual labels need design input)

### 5. Large page files need decomposition
- **Files**:
  - `pages/search.tsx` (666 lines)
  - `pages/job/[id].tsx` (586 lines)
  - `pages/index.tsx` (447 lines)
  - `components/jobs/JobCard.tsx` (361 lines)
- **Issue**: Files over 300 lines are hard to maintain and test
- **Fix**: Extract logical sections into sub-components
- **Safe to auto-fix**: No (architectural decision)

### 6. `key={index}` on potentially reorderable lists
- **Files**:
  - `components/ui/Card.tsx:154`
  - `pages/index.tsx:355`
  - `pages/job/[id].tsx:95,103,416`
- **Issue**: Using array index as key can cause bugs if items reorder
- **Fix**: Use unique IDs where available
- **Safe to auto-fix**: Partially (only where stable ID exists)

### 7. Inconsistent spacing scale usage
- **File**: `components/ui/Card.tsx:18,140`
- **Issue**: Uses `p-5` which is off the typical 4/6/8 spacing scale
- **Fix**: Standardize to `p-4` or `p-6`
- **Safe to auto-fix**: No (visual impact)

### 8. Missing prefers-reduced-motion respect
- **Issue**: Animations defined but no `motion-reduce:` variants
- **Fix**: Add `motion-reduce:transition-none` to animated elements
- **Safe to auto-fix**: Yes

### 9. No loading states for interactive actions
- **Issue**: Bookmark buttons have no loading/feedback state
- **Fix**: Add loading spinner or disabled state during action
- **Safe to auto-fix**: No (feature implementation)

---

## P2 — Polish & Drift

### 10. Arbitrary pixel value
- **File**: `pages/job/[id].tsx:217`
- **Issue**: `max-w-[200px]` could be `max-w-48` (192px) or `max-w-52` (208px)
- **Fix**: Use Tailwind spacing scale
- **Safe to auto-fix**: Yes (use `max-w-48`)

### 11. Inline styles that could be Tailwind
- **Files**:
  - `components/shared/Skeleton.tsx:42` - animation delay
  - `pages/index.tsx:156` - background gradient
- **Issue**: Inline styles are harder to maintain than Tailwind classes
- **Fix**: Use Tailwind arbitrary values or extend theme
- **Safe to auto-fix**: Partially

### 12. Duplicate Tailwind config files
- **Files**: `tailwind.config.ts` AND `tailwind.config.js`
- **Issue**: Two config files can cause confusion
- **Fix**: Remove the `.js` version, keep `.ts`
- **Safe to auto-fix**: Yes (delete `.js`)

### 13. ESLint configuration missing
- **Issue**: No ESLint config found, relying only on TypeScript
- **Fix**: Add ESLint with Next.js and React accessibility rules
- **Safe to auto-fix**: No (config decision)

### 14. No explicit error boundary
- **Issue**: No React error boundary for graceful error handling
- **Fix**: Add error boundary component
- **Safe to auto-fix**: No (architectural decision)

### 15. Dark mode color inconsistency
- **Issue**: Some components use `dark:bg-neutral-850` which isn't in the scale
- **Fix**: Audit all dark mode colors for consistency
- **Safe to auto-fix**: No (visual verification needed)

### 16. Missing SEO meta tags
- **Issue**: Pages lack comprehensive Open Graph and Twitter Card meta
- **Fix**: Add meta tags in `_app.tsx` or per-page
- **Safe to auto-fix**: Partially

### 17. Performance: No image optimization
- **Issue**: Company logos use raw `<img>` instead of Next.js `Image`
- **Fix**: Replace with `next/image` for automatic optimization
- **Safe to auto-fix**: No (may affect layout)

---

## Performance Recommendations

### Core Web Vitals Targets (Google Standard)

| Metric | Target | Current Status |
|--------|--------|----------------|
| LCP (Largest Contentful Paint) | < 2.5s | ⚠️ Needs measurement |
| FID (First Input Delay) | < 100ms | ⚠️ Needs measurement |
| CLS (Cumulative Layout Shift) | < 0.1 | ⚠️ Needs measurement |
| TTI (Time to Interactive) | < 3.8s | ⚠️ Needs measurement |

### Recommended Performance Improvements

1. **Image Optimization**: Use `next/image` with proper sizing
2. **Code Splitting**: Dynamic imports for heavy components
3. **Font Loading**: Add `font-display: swap` for web fonts
4. **Prefetching**: Add `prefetch` for likely navigation targets
5. **Bundle Analysis**: Run `npm run build` and analyze chunk sizes

---

## Proposed Auto-Fixes (Safe)

These can be applied immediately without user confirmation:

1. ✅ Add `aria-label` to Header search button: "Search jobs"
2. ✅ Add `aria-label` to Header notifications button: "View notifications"
3. ✅ Add `aria-label` to FilterSidebar reset button: "Reset filters"
4. ✅ Add `aria-label` to FilterSidebar close button: "Close filters"
5. ✅ Replace `min-h-screen` with `min-h-[100dvh]` in 3 page files
6. ✅ Replace `max-w-[200px]` with `max-w-48`
7. ✅ Delete duplicate `tailwind.config.js`
8. ✅ Add `motion-reduce:animate-none` to skeleton animations

---

## Needs Your Call

### Question 1: Bookmark Feature
The bookmark buttons currently log to console. Options:
- A) Implement actual bookmark functionality with localStorage
- B) Implement with user accounts (requires backend)
- C) Remove bookmark buttons entirely

### Question 2: Page Decomposition
Large page files could be split. Options:
- A) Keep as-is for now, split later
- B) Extract into feature-specific components
- C) Create shared section components

### Question 3: Form Labels
Filter checkboxes need labels. Options:
- A) Add visible labels (changes layout)
- B) Add `aria-label` only (no visual change)
- C) Both visible and aria labels

---

## Implementation Priority

### Phase 1: Critical A11y (Do Now)
- [ ] Fix all P0 issues (aria-labels, dvh, console.logs)
- [ ] Add form input labels
- [ ] Add prefers-reduced-motion support

### Phase 2: Performance (This Week)
- [ ] Run Lighthouse audit and document baseline
- [ ] Replace `<img>` with `next/image`
- [ ] Analyze and optimize bundle size

### Phase 3: Polish (Next Sprint)
- [ ] Decompose large page files
- [ ] Add error boundaries
- [ ] Add comprehensive SEO meta tags
- [ ] Add ESLint configuration

### Phase 4: Enhancement (Future)
- [ ] Implement bookmark functionality
- [ ] Add keyboard navigation for filter sidebar
- [ ] Add focus management for modal interactions

---

## Commands to Run

```bash
# Run Lighthouse audit
npx lighthouse http://localhost:3000 --view

# Check bundle size
cd packages/web && npm run build && npx @next/bundle-analyzer

# Run accessibility audit (if axe-core installed)
npm install -D @axe-core/react
# Then add to _app.tsx in development
```

---

## Appendix: File-by-File Issues

| File | Issues | Severity |
|------|--------|----------|
| `pages/search.tsx` | 666 lines, console.log, min-h-screen | P0, P1 |
| `pages/job/[id].tsx` | 586 lines, console.log, min-h-screen, key={index} | P0, P1 |
| `pages/index.tsx` | 447 lines, console.log, min-h-screen, key={index} | P0, P1 |
| `components/layout/Header.tsx` | Missing aria-labels on 2 buttons | P0 |
| `components/layout/FilterSidebar.tsx` | Missing aria-labels, unlabeled inputs | P0, P1 |
| `components/jobs/JobCard.tsx` | 361 lines, key={index} in skeleton | P1, P2 |
| `components/ui/Card.tsx` | Off-scale p-5 spacing | P2 |
| `tailwind.config.js` | Duplicate config file | P2 |
