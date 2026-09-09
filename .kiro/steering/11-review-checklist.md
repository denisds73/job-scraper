# Review Checklist: Quality Gates

Use this checklist before marking any work as complete. These are the minimum standards for shipping code.

---

## Pre-Commit Checklist

Run through this before every commit:

### Code Quality

- [ ] **TypeScript compiles**: `npm run typecheck` passes
- [ ] **Linting passes**: `npm run lint` has no errors
- [ ] **Tests pass**: `npm run test` all green
- [ ] **No console.log**: Remove debugging statements
- [ ] **No commented code**: Delete or explain why it's there
- [ ] **No TODO without issue**: TODOs reference a ticket/issue number

### Naming & Clarity

- [ ] **Functions named by action**: `getJob`, `createJob`, `formatSalary`
- [ ] **Components named by purpose**: `JobCard`, `FilterSidebar`
- [ ] **No abbreviations**: `job` not `j`, `company` not `co`
- [ ] **Boolean clarity**: `isLoading`, `hasError`, `canEdit`
- [ ] **No magic numbers**: Constants are named

### Self-Review

- [ ] **Read the diff**: Review every line you're committing
- [ ] **Explain changes**: Could you explain this to a teammate?
- [ ] **Check edge cases**: What if data is null/empty/huge?
- [ ] **Error handling**: What happens when things fail?

---

## Component Checklist

Before completing any React component:

### Functionality

- [ ] **Works correctly**: Does what it's supposed to do
- [ ] **Handles loading**: Shows appropriate loading state
- [ ] **Handles errors**: Shows helpful error message
- [ ] **Handles empty**: Shows meaningful empty state
- [ ] **Props validated**: TypeScript types are correct and complete

### Accessibility

- [ ] **Semantic HTML**: Using correct elements (button, nav, article, etc.)
- [ ] **Keyboard navigation**: Can tab through all interactive elements
- [ ] **Focus visible**: Focus state is clearly visible
- [ ] **ARIA labels**: Interactive elements have accessible names
- [ ] **Alt text**: Images have descriptive alt text
- [ ] **Color contrast**: Text meets WCAG AA (4.5:1 ratio)

### Performance

- [ ] **No unnecessary re-renders**: Check with React DevTools
- [ ] **Images optimized**: Using Next.js Image, sized appropriately
- [ ] **Lazy loading**: Heavy components use dynamic imports
- [ ] **Memoization appropriate**: useMemo/useCallback where needed

### Styling

- [ ] **Uses design tokens**: No hardcoded colors, spacing, fonts
- [ ] **Responsive**: Works on mobile, tablet, desktop
- [ ] **Dark mode**: Proper dark mode support
- [ ] **Consistent spacing**: Following the 4px scale
- [ ] **Icons from Lucide**: No emojis, no other icon libraries

---

## API Endpoint Checklist

Before completing any API route:

### Correctness

- [ ] **Returns correct data**: Response matches specification
- [ ] **Handles all cases**: Happy path, edge cases, errors
- [ ] **Status codes correct**: 200, 201, 400, 404, 500 as appropriate

### Validation

- [ ] **Input validated**: All params/body validated with schema
- [ ] **Types enforced**: Numbers are numbers, strings are strings
- [ ] **Limits applied**: Pagination has max page size
- [ ] **Sanitization**: No SQL injection, XSS possible

### Error Handling

- [ ] **Errors are helpful**: Message explains what went wrong
- [ ] **Errors are safe**: No stack traces or internal details in response
- [ ] **Errors are logged**: Error details captured server-side
- [ ] **Consistent format**: All errors follow the same schema

### Performance

- [ ] **Query optimized**: EXPLAIN shows index usage
- [ ] **Response sized**: Not returning excessive data
- [ ] **Caching considered**: Appropriate Cache-Control headers

### Documentation

- [ ] **OpenAPI/Swagger**: Endpoint documented in API docs
- [ ] **Examples included**: Request/response examples
- [ ] **Errors documented**: Possible error responses listed

---

## Feature Checklist

Before completing any feature:

### User Experience

- [ ] **Solves the problem**: Does this address the user need?
- [ ] **Intuitive to use**: User can figure it out without instructions
- [ ] **Feedback provided**: User knows their action worked
- [ ] **Errors recoverable**: User can fix mistakes easily

### Quality

- [ ] **Unit tests**: Core logic is tested
- [ ] **Integration tests**: Components work together
- [ ] **Manual testing**: Actually used the feature yourself
- [ ] **Cross-browser**: Tested in Chrome, Firefox, Safari
- [ ] **Mobile tested**: Used on actual mobile device

### Completeness

- [ ] **Happy path works**: Normal use case functions
- [ ] **Edge cases handled**: Empty, null, large data
- [ ] **Error states covered**: Network failure, validation errors
- [ ] **Loading states shown**: User knows something is happening

### Code Quality

- [ ] **No duplication**: Shared logic extracted
- [ ] **Single responsibility**: Each function/component does one thing
- [ ] **Clear boundaries**: Separation between UI, logic, data
- [ ] **Types are accurate**: TypeScript catches real errors

---

## Design Review Checklist

Before any UI work is complete:

### Visual Design

- [ ] **Follows design system**: Using locked tokens only
- [ ] **Hierarchy clear**: Most important info stands out
- [ ] **Whitespace intentional**: Spacing creates grouping
- [ ] **Alignment consistent**: Elements line up properly
- [ ] **Typography correct**: Right sizes, weights, colors

### Interaction Design

- [ ] **Hover states**: Interactive elements respond to hover
- [ ] **Active states**: Buttons show press state
- [ ] **Focus states**: Keyboard focus is visible
- [ ] **Transitions smooth**: 150-300ms, ease-out
- [ ] **Loading feedback**: User knows action is processing

### Consistency

- [ ] **Patterns reused**: Similar problems, similar solutions
- [ ] **Language consistent**: Same terms throughout
- [ ] **Icons consistent**: From Lucide, same size/weight
- [ ] **Colors meaningful**: Semantic use (brand, success, error)

### Responsiveness

- [ ] **Mobile first**: Designed for small screens first
- [ ] **Breakpoints logical**: Content adapts at right points
- [ ] **Touch friendly**: 44px minimum touch targets
- [ ] **Content prioritized**: Important content visible first

---

## Pull Request Checklist

Before requesting review:

### Preparation

- [ ] **Self-reviewed**: Read through entire diff
- [ ] **Tests pass**: CI is green
- [ ] **Branch updated**: Rebased on latest main
- [ ] **Conflicts resolved**: No merge conflicts

### PR Quality

- [ ] **Title is clear**: Describes what, not how
- [ ] **Description complete**: Explains why and lists changes
- [ ] **Size appropriate**: <400 lines (split if larger)
- [ ] **Screenshots included**: For any UI changes
- [ ] **Breaking changes noted**: If applicable

### Documentation

- [ ] **README updated**: If setup/usage changed
- [ ] **API docs updated**: If endpoints changed
- [ ] **Comments added**: For complex logic
- [ ] **Changelog updated**: If user-facing change

---

## Deployment Checklist

Before deploying to production:

### Pre-Deploy

- [ ] **All tests pass**: CI is fully green
- [ ] **Environment variables**: All required env vars set
- [ ] **Database migrations**: Migrations applied successfully
- [ ] **Backwards compatible**: Old clients still work

### Deploy

- [ ] **Deploy to staging first**: Verify in staging environment
- [ ] **Smoke test staging**: Core functionality works
- [ ] **Deploy to production**: Rollout strategy followed
- [ ] **Smoke test production**: Core functionality works

### Post-Deploy

- [ ] **Monitor errors**: Watch error tracking (Sentry)
- [ ] **Check metrics**: Performance and usage normal
- [ ] **Verify functionality**: Manually test critical paths
- [ ] **Communicate**: Update team/stakeholders if needed

---

## Performance Checklist

For performance-sensitive changes:

### Metrics

- [ ] **LCP < 2.5s**: Largest contentful paint
- [ ] **FID < 100ms**: First input delay
- [ ] **CLS < 0.1**: Cumulative layout shift
- [ ] **Bundle size checked**: No unexpected growth

### Frontend

- [ ] **Images optimized**: Correct size, format, lazy loading
- [ ] **Code split**: Large components loaded on demand
- [ ] **Fonts optimized**: Using next/font, display: swap
- [ ] **No render blocking**: Critical CSS inlined

### Backend

- [ ] **Queries optimized**: Using indexes, avoiding N+1
- [ ] **Response cached**: Where appropriate
- [ ] **Payload minimized**: Only necessary data returned
- [ ] **Connection pooling**: Database connections reused

---

## Security Checklist

For security-sensitive changes:

### Input Handling

- [ ] **All input validated**: Never trust client data
- [ ] **Parameterized queries**: No string concatenation in SQL
- [ ] **Output encoded**: Prevent XSS in rendered content
- [ ] **File uploads validated**: Type, size, content checked

### Authentication & Authorization

- [ ] **Auth required**: Protected routes require authentication
- [ ] **Permissions checked**: Users can only access their data
- [ ] **Tokens secure**: Not exposed in logs or responses
- [ ] **Sessions managed**: Proper expiration and invalidation

### Data Protection

- [ ] **Sensitive data masked**: PII not logged
- [ ] **HTTPS enforced**: No mixed content
- [ ] **Headers set**: Security headers configured
- [ ] **Dependencies audited**: No known vulnerabilities

---

## Quick Daily Check

Use this abbreviated list for everyday commits:

```
□ TypeScript compiles
□ Lint passes
□ Tests pass
□ Self-reviewed diff
□ No console.log or commented code
□ Handles error cases
□ Accessible (keyboard, labels)
□ Responsive
□ Uses design tokens
```

---

## When to Skip Checklist Items

Most items should never be skipped. However:

**Acceptable to skip:**
- Performance optimization for throwaway prototypes
- Full cross-browser testing for internal tools
- Documentation for experimental branches

**Never skip:**
- TypeScript/lint errors
- Test failures
- Security validation
- Accessibility basics (keyboard nav, labels)
- Error handling

When in doubt, do the thorough check. Speed comes from doing it right the first time.
