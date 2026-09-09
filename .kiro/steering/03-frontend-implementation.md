# Frontend Implementation: Architecture & Best Practices

This document defines how we build frontend applications. Every pattern, every decision, every line of code reflects Google-level engineering standards.

---

## Architecture Principles

### 1. Component-Driven Development

Build from atoms up. Components are the building blocks.

**Atomic Design Hierarchy:**
```
Atoms       → Button, Input, Badge, Icon
Molecules   → SearchInput, FormField, JobCard
Organisms   → Header, FilterSidebar, JobList
Templates   → PageLayout, SearchLayout
Pages       → HomePage, SearchPage, JobDetailPage
```

**Rules:**
- Each component does one thing well
- Components are self-contained (styles, logic, types)
- Props down, events up
- Composition over inheritance

### 2. Separation of Concerns

Keep things where they belong.

```
components/     → UI rendering (what it looks like)
hooks/          → Stateful logic (how it behaves)
services/       → API calls (where data comes from)
utils/          → Pure functions (helpers)
types/          → TypeScript definitions (shape of data)
constants/      → Static values (configuration)
```

### 3. Colocation

Keep related things together.

```
components/
└── JobCard/
    ├── JobCard.tsx        # Component
    ├── JobCard.test.tsx   # Tests
    ├── JobCard.stories.tsx # Storybook (if used)
    └── index.ts           # Public export
```

**Rules:**
- Component-specific types in the component file
- Shared types in `types/`
- Component-specific utils in the component folder
- Shared utils in `utils/`

---

## React Patterns

### Component Structure

Every component follows this structure:

```tsx
// 1. Imports (external → internal → types → styles)
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui';
import type { JobCardProps } from './types';

// 2. Types (if not in separate file)
interface Props extends JobCardProps {
  onSave?: (id: string) => void;
}

// 3. Component
export function JobCard({ job, onSave, className }: Props) {
  // 3a. Hooks (state, effects, custom hooks)
  const [isSaved, setIsSaved] = useState(false);
  
  // 3b. Derived state (computed values)
  const formattedSalary = formatSalary(job.salary);
  
  // 3c. Handlers
  const handleSave = useCallback(() => {
    setIsSaved(true);
    onSave?.(job.id);
  }, [job.id, onSave]);
  
  // 3d. Render
  return (
    <article className={cn('job-card', className)}>
      {/* JSX */}
    </article>
  );
}

// 4. Display name (for DevTools)
JobCard.displayName = 'JobCard';
```

### State Management

**Local State First:**
- Use `useState` for component-specific state
- Use `useReducer` for complex local state
- Lift state only when needed for sharing

**Server State:**
- Use React Query (TanStack Query) for API data
- Never store server data in global state
- Let React Query handle caching, refetching, stale data

**Global State (sparingly):**
- Use Zustand for truly global UI state
- Examples: theme preference, sidebar open/closed, user session
- NOT for: API data, form state, component state

```tsx
// Good: Server state with React Query
const { data: jobs, isLoading } = useQuery({
  queryKey: ['jobs', filters],
  queryFn: () => fetchJobs(filters),
});

// Good: Global UI state with Zustand
const useSidebarStore = create((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

// Bad: API data in global state
const useJobStore = create((set) => ({
  jobs: [],
  fetchJobs: async () => { /* Don't do this */ }
}));
```

### Custom Hooks

Extract reusable logic into custom hooks.

**Naming:**
- Always prefix with `use`
- Name describes what it returns: `useJobs`, `useDebounce`, `useLocalStorage`

**Structure:**
```tsx
// hooks/useJobs.ts
export function useJobs(filters: JobFilters) {
  const query = useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => jobsService.getJobs(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    jobs: query.data?.jobs ?? [],
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
```

### Error Boundaries

Catch and handle errors gracefully.

```tsx
// components/ErrorBoundary.tsx
import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Error boundary caught:', error, info);
    // Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <DefaultErrorFallback />;
    }
    return this.props.children;
  }
}
```

**Usage:**
- Wrap page-level components
- Wrap third-party components
- Provide meaningful fallback UI

---

## Performance

### Performance Budget

These are requirements, not guidelines:

| Metric | Target | Max |
|--------|--------|-----|
| First Contentful Paint (FCP) | < 1.5s | 2.0s |
| Largest Contentful Paint (LCP) | < 2.0s | 2.5s |
| Cumulative Layout Shift (CLS) | < 0.05 | 0.1 |
| First Input Delay (FID) | < 50ms | 100ms |
| Time to Interactive (TTI) | < 3.0s | 4.0s |
| Bundle Size (initial) | < 150KB | 200KB |

### Code Splitting

Load only what you need.

```tsx
// Route-based splitting (automatic in Next.js)
// pages/search.tsx loads only when visiting /search

// Component-based splitting
import dynamic from 'next/dynamic';

const FilterSidebar = dynamic(
  () => import('@/components/FilterSidebar'),
  { 
    loading: () => <FilterSidebarSkeleton />,
    ssr: false // Only if component uses browser APIs
  }
);

// Library splitting
const Chart = dynamic(() => import('recharts').then(mod => mod.LineChart));
```

**When to Split:**
- Routes (automatic with Next.js)
- Heavy components (charts, editors, maps)
- Below-the-fold content
- Modal/dialog content
- Features not used by all users

### Memoization

Don't over-optimize. Measure first.

```tsx
// useMemo: Expensive calculations
const sortedJobs = useMemo(
  () => jobs.sort((a, b) => new Date(b.posted) - new Date(a.posted)),
  [jobs]
);

// useCallback: Stable function references for child components
const handleSave = useCallback(
  (id: string) => saveJob(id),
  [saveJob]
);

// React.memo: Prevent re-renders of expensive components
export const JobCard = memo(function JobCard({ job }: Props) {
  return <article>...</article>;
});
```

**Rules:**
- Don't memoize everything—it has overhead
- Memoize when: expensive calculation, preventing child re-renders, dependency array stability
- Profile before and after to verify improvement

### Image Optimization

Images are often the biggest performance issue.

```tsx
import Image from 'next/image';

// Always use Next.js Image component
<Image
  src={company.logo}
  alt={`${company.name} logo`}
  width={48}
  height={48}
  loading="lazy" // Default, explicit for clarity
  placeholder="blur"
  blurDataURL={company.logoBlurHash}
/>
```

**Rules:**
- Always specify width and height (prevents CLS)
- Use `loading="lazy"` for below-fold images
- Use modern formats (WebP, AVIF) via Next.js automatic optimization
- Provide blur placeholder for better perceived performance
- Size images appropriately—don't serve 2000px for a 200px display

### Bundle Analysis

Regularly audit bundle size.

```bash
# Analyze bundle
npx @next/bundle-analyzer

# Check for duplicates
npx duplicate-package-checker-webpack-plugin

# Visualize dependencies
npx source-map-explorer .next/static/**/*.js
```

---

## Accessibility Implementation

### Semantic HTML

Use the right element for the job.

```tsx
// Good: Semantic elements
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>
<main>
  <article>
    <h1>Job Title</h1>
    <section aria-labelledby="description-heading">
      <h2 id="description-heading">Description</h2>
    </section>
  </article>
</main>
<footer>...</footer>

// Bad: Div soup
<div class="header">
  <div class="nav">
    <div class="link" onclick="...">Home</div>
  </div>
</div>
```

### Keyboard Navigation

All functionality must be keyboard accessible.

```tsx
// Focus management
const dialogRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (isOpen) {
    dialogRef.current?.focus();
  }
}, [isOpen]);

// Focus trap in modals
import { FocusTrap } from '@headlessui/react';

<FocusTrap>
  <dialog open={isOpen}>
    {/* Dialog content */}
  </dialog>
</FocusTrap>

// Skip links
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

### ARIA

Use ARIA to fill gaps, not replace semantic HTML.

```tsx
// Loading states
<div aria-busy={isLoading} aria-live="polite">
  {isLoading ? <Spinner /> : <Content />}
</div>

// Dynamic content
<div aria-live="polite" aria-atomic="true">
  {jobs.length} jobs found
</div>

// Custom components
<button
  role="switch"
  aria-checked={isEnabled}
  onClick={toggle}
>
  Dark mode
</button>
```

### Screen Reader Testing

Test with actual screen readers:

- **macOS**: VoiceOver (built-in, Cmd+F5)
- **Windows**: NVDA (free) or JAWS
- **Mobile**: VoiceOver (iOS), TalkBack (Android)

**Checklist:**
- [ ] Page title announced correctly
- [ ] Headings form logical outline
- [ ] Links and buttons have descriptive text
- [ ] Images have appropriate alt text
- [ ] Forms have associated labels
- [ ] Error messages announced
- [ ] Dynamic content updates announced

---

## Testing Strategy

### Testing Pyramid

```
       /\
      /E2E\        ~10% — Critical user journeys
     /------\
    /Integration\  ~20% — Component interaction
   /--------------\
  /     Unit       \ ~70% — Functions, hooks, utils
 /------------------\
```

### Unit Tests

Test pure functions and hooks in isolation.

```tsx
// utils/formatSalary.test.ts
import { formatSalary } from './formatSalary';

describe('formatSalary', () => {
  it('formats salary range', () => {
    expect(formatSalary({ min: 100000, max: 150000 }))
      .toBe('$100K - $150K');
  });

  it('handles single value', () => {
    expect(formatSalary({ min: 100000 }))
      .toBe('$100K+');
  });

  it('returns empty for missing data', () => {
    expect(formatSalary(null)).toBe('');
  });
});
```

### Integration Tests

Test component behavior with React Testing Library.

```tsx
// components/JobCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { JobCard } from './JobCard';

const mockJob = {
  id: '1',
  title: 'Senior Engineer',
  company: 'Google',
  location: 'Remote',
};

describe('JobCard', () => {
  it('renders job information', () => {
    render(<JobCard job={mockJob} />);
    
    expect(screen.getByRole('heading')).toHaveTextContent('Senior Engineer');
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('Remote')).toBeInTheDocument();
  });

  it('calls onSave when save button clicked', () => {
    const onSave = jest.fn();
    render(<JobCard job={mockJob} onSave={onSave} />);
    
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    expect(onSave).toHaveBeenCalledWith('1');
  });
});
```

### E2E Tests

Test critical user journeys with Playwright.

```ts
// e2e/search.spec.ts
import { test, expect } from '@playwright/test';

test('user can search and view job details', async ({ page }) => {
  await page.goto('/');
  
  // Search for jobs
  await page.fill('[data-testid="search-input"]', 'frontend');
  await page.click('[data-testid="search-button"]');
  
  // Verify results
  await expect(page.locator('[data-testid="job-card"]')).toHaveCount.greaterThan(0);
  
  // Click first result
  await page.click('[data-testid="job-card"]:first-child');
  
  // Verify detail page
  await expect(page).toHaveURL(/\/job\//);
  await expect(page.locator('h1')).toBeVisible();
});
```

### What to Test

**Always Test:**
- User interactions (click, type, submit)
- Conditional rendering
- Error states
- Loading states
- Accessibility (keyboard nav, ARIA)

**Don't Test:**
- Implementation details
- Third-party libraries
- Static content
- Styling (use visual regression testing if needed)

---

## SEO

### Technical SEO

```tsx
// pages/_document.tsx
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="canonical" href={canonicalUrl} />
  </head>
</html>

// pages/job/[id].tsx
import Head from 'next/head';

export default function JobDetailPage({ job }) {
  return (
    <>
      <Head>
        <title>{job.title} at {job.company} | JobScout</title>
        <meta name="description" content={job.description.slice(0, 160)} />
        <meta property="og:title" content={`${job.title} at ${job.company}`} />
        <meta property="og:description" content={job.description.slice(0, 160)} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={job.company.logo} />
      </Head>
      <JobDetail job={job} />
    </>
  );
}
```

### Structured Data

Add JSON-LD for rich search results.

```tsx
// For job listings
const jobPostingSchema = {
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: job.title,
  description: job.description,
  datePosted: job.postedAt,
  hiringOrganization: {
    '@type': 'Organization',
    name: job.company.name,
    logo: job.company.logo,
  },
  jobLocation: {
    '@type': 'Place',
    address: job.location,
  },
  employmentType: job.type,
  baseSalary: job.salary ? {
    '@type': 'MonetaryAmount',
    currency: 'USD',
    value: {
      '@type': 'QuantitativeValue',
      minValue: job.salary.min,
      maxValue: job.salary.max,
      unitText: 'YEAR',
    },
  } : undefined,
};

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
/>
```

---

## Error Handling

### API Errors

Handle errors gracefully at every level.

```tsx
// services/api.ts
class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

async function fetchWithError(url: string, options?: RequestInit) {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new APIError(
      error.message || 'An error occurred',
      response.status,
      error.code
    );
  }
  
  return response.json();
}

// Component usage
const { error } = useQuery({
  queryKey: ['jobs'],
  queryFn: fetchJobs,
});

if (error) {
  if (error instanceof APIError && error.status === 404) {
    return <NotFound />;
  }
  return <ErrorState error={error} onRetry={refetch} />;
}
```

### Form Validation

Validate early and clearly.

```tsx
// Using react-hook-form with zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  query: z.string().min(2, 'Search term must be at least 2 characters'),
});

function SearchForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('query')}
        error={errors.query?.message}
        aria-invalid={!!errors.query}
      />
    </form>
  );
}
```

---

## Summary

Frontend implementation at Google level means:

1. **Component architecture**: Atomic design, single responsibility
2. **State management**: Right tool for the job (local → server → global)
3. **Performance**: Budget-driven, measured, optimized
4. **Accessibility**: Built-in, not bolted on
5. **Testing**: Pyramid strategy, user-focused
6. **Error handling**: Graceful degradation, helpful messages

Every line of code serves the user. Every pattern enables the team.
