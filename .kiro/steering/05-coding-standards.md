# Coding Standards: Quality & Conventions

Code is a liability. Every line must justify its existence. These standards ensure our code is readable, maintainable, and professional.

---

## Core Principles

### 1. Readability Over Cleverness

Code is read 10x more than it's written. Optimize for the reader.

```ts
// Bad: Clever but cryptic
const r = d.filter(x => x.t === 'f' && x.s > 50000).map(x => ({ ...x, f: true }));

// Good: Clear and explicit
const remoteJobs = jobs
  .filter(job => job.type === 'full-time' && job.salary > 50000)
  .map(job => ({ ...job, featured: true }));
```

### 2. Explicit Over Implicit

Don't make readers guess your intent.

```ts
// Bad: Magic numbers
if (retries > 3) throw new Error();
setTimeout(fn, 300);

// Good: Named constants
const MAX_RETRIES = 3;
const DEBOUNCE_DELAY_MS = 300;

if (retries > MAX_RETRIES) throw new Error();
setTimeout(fn, DEBOUNCE_DELAY_MS);
```

### 3. Consistency Is King

Same problem, same solution, same style.

```ts
// Pick one pattern and stick to it everywhere
// Option A: Named exports
export function formatSalary() {}
export function formatDate() {}

// Option B: Default exports (avoid for utils)
export default { formatSalary, formatDate };

// We use Option A — always
```

---

## TypeScript Standards

### Strict Mode Required

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Type Definitions

**Prefer `interface` for object shapes:**
```ts
// Good: Interface for objects
interface Job {
  id: string;
  title: string;
  company: Company;
  salary?: SalaryRange;
}

// Good: Type for unions, primitives, utilities
type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';
type JobId = string;
type Nullable<T> = T | null;
```

**Avoid `any`:**
```ts
// Bad: Defeats the purpose of TypeScript
function processData(data: any) {
  return data.something;
}

// Good: Use unknown and narrow
function processData(data: unknown): ProcessedData {
  if (!isValidData(data)) {
    throw new Error('Invalid data');
  }
  return transform(data);
}

// Good: Use generics when type varies
function first<T>(items: T[]): T | undefined {
  return items[0];
}
```

**Use discriminated unions:**
```ts
// Good: Type-safe state handling
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function render(state: AsyncState<Job[]>) {
  switch (state.status) {
    case 'idle':
      return <Placeholder />;
    case 'loading':
      return <Spinner />;
    case 'success':
      return <JobList jobs={state.data} />;
    case 'error':
      return <ErrorMessage error={state.error} />;
  }
}
```

### Type Imports

```ts
// Use type-only imports
import type { Job, Company } from '@/types';
import { formatSalary } from '@/utils';

// Or inline
import { formatSalary, type Job } from '@/lib/jobs';
```

---

## Naming Conventions

### Files & Directories

```
Pattern                    | Example
---------------------------|---------------------------
Components: PascalCase     | JobCard.tsx, FilterSidebar.tsx
Pages: kebab-case          | search-results.tsx
Utilities: camelCase       | formatSalary.ts
Types: PascalCase          | Job.ts, ApiResponse.ts
Constants: SCREAMING_SNAKE | constants.ts (for values)
Hooks: camelCase with use  | useJobs.ts
```

### Variables & Functions

```ts
// Variables: camelCase
const jobList = [];
const isLoading = true;
const hasError = false;

// Functions: camelCase, verb prefixes
function getJob(id: string) {}
function createJob(data: JobInput) {}
function updateJob(id: string, data: Partial<Job>) {}
function deleteJob(id: string) {}
function validateJob(job: Job) {}
function formatSalary(range: SalaryRange) {}
function isValidEmail(email: string) {}
function hasPermission(user: User) {}

// Event handlers: handle + Event
function handleClick() {}
function handleSubmit() {}
function handleJobSelect(job: Job) {}

// Boolean variables: is, has, can, should
const isActive = true;
const hasChildren = false;
const canEdit = user.role === 'admin';
const shouldShowBanner = !user.dismissed;
```

### Components & Props

```ts
// Component: PascalCase, noun
function JobCard() {}
function FilterSidebar() {}
function SearchInput() {}

// Props interface: ComponentNameProps
interface JobCardProps {
  job: Job;
  onSelect?: (job: Job) => void;
  isSelected?: boolean;
}

// Callback props: on + Action
interface Props {
  onClick?: () => void;
  onSelect?: (item: Item) => void;
  onChange?: (value: string) => void;
  onSubmit?: (data: FormData) => void;
}
```

### Constants

```ts
// File-level constants: SCREAMING_SNAKE_CASE
const MAX_RETRIES = 3;
const API_BASE_URL = 'https://api.jobscout.dev';
const CACHE_TTL_SECONDS = 300;

// Enum-like objects: PascalCase key
const JobType = {
  FullTime: 'full-time',
  PartTime: 'part-time',
  Contract: 'contract',
} as const;

// HTTP status codes (example)
const HttpStatus = {
  OK: 200,
  Created: 201,
  BadRequest: 400,
  NotFound: 404,
} as const;
```

---

## Code Organization

### Import Order

```ts
// 1. React/Next (framework)
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

// 2. Third-party libraries
import { useQuery } from '@tanstack/react-query';
import { clsx } from 'clsx';

// 3. Internal aliases (@/)
import { Button, Input } from '@/components/ui';
import { useJobs } from '@/hooks';
import { formatSalary } from '@/utils';

// 4. Types (with type keyword)
import type { Job, Company } from '@/types';

// 5. Relative imports (./  ../)
import { JobCardSkeleton } from './JobCardSkeleton';
import { formatPostedDate } from './utils';

// 6. Styles (if any)
import styles from './JobCard.module.css';
```

### File Structure

```ts
// Component file structure
// 1. Imports
import { useState } from 'react';
import type { Job } from '@/types';

// 2. Types/Interfaces (if not in separate file)
interface JobCardProps {
  job: Job;
  onSelect?: (job: Job) => void;
}

// 3. Constants (component-specific)
const DESCRIPTION_MAX_LENGTH = 150;

// 4. Helper functions (pure, no hooks)
function truncateDescription(text: string): string {
  if (text.length <= DESCRIPTION_MAX_LENGTH) return text;
  return text.slice(0, DESCRIPTION_MAX_LENGTH).trim() + '...';
}

// 5. Component
export function JobCard({ job, onSelect }: JobCardProps) {
  // 5a. Hooks
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 5b. Derived state
  const shortDescription = truncateDescription(job.description);
  
  // 5c. Handlers
  const handleClick = () => onSelect?.(job);
  
  // 5d. Render
  return (
    <article onClick={handleClick}>
      {/* JSX */}
    </article>
  );
}

// 6. Display name
JobCard.displayName = 'JobCard';
```

---

## Functions

### Function Guidelines

**Keep functions small:**
```ts
// Bad: Function does too much
async function processJob(rawJob: RawJob) {
  // 50 lines of validation, transformation, API calls...
}

// Good: Single responsibility
async function processJob(rawJob: RawJob): Promise<Job> {
  const validated = validateJob(rawJob);
  const normalized = normalizeJob(validated);
  const enriched = await enrichWithCompanyData(normalized);
  return enriched;
}
```

**Limit parameters:**
```ts
// Bad: Too many parameters
function createJob(
  title: string,
  company: string,
  location: string,
  salary: number,
  type: string,
  remote: boolean,
  description: string
) {}

// Good: Use an options object
interface CreateJobOptions {
  title: string;
  company: string;
  location: string;
  salary?: number;
  type: JobType;
  isRemote?: boolean;
  description: string;
}

function createJob(options: CreateJobOptions) {}
```

**Early returns:**
```ts
// Bad: Deep nesting
function processJob(job: Job | null) {
  if (job) {
    if (job.isActive) {
      if (job.salary) {
        return formatSalary(job.salary);
      }
    }
  }
  return 'N/A';
}

// Good: Guard clauses
function processJob(job: Job | null) {
  if (!job) return 'N/A';
  if (!job.isActive) return 'N/A';
  if (!job.salary) return 'N/A';
  
  return formatSalary(job.salary);
}
```

### Pure Functions

Prefer pure functions when possible:

```ts
// Pure: Same input always produces same output, no side effects
function formatSalary(min: number, max: number): string {
  return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
}

// Impure: Has side effects (fine when necessary, but isolate)
async function saveJob(job: Job): Promise<void> {
  await db.jobs.create({ data: job });
}
```

---

## Error Handling

### Always Handle Errors

```ts
// Bad: Ignoring errors
const data = await fetch(url).then(r => r.json());

// Good: Explicit error handling
async function fetchJobs(filters: JobFilters): Promise<Job[]> {
  const response = await fetch(buildUrl('/api/jobs', filters));
  
  if (!response.ok) {
    throw new ApiError(
      `Failed to fetch jobs: ${response.status}`,
      response.status
    );
  }
  
  const data = await response.json();
  return data.jobs;
}
```

### Custom Error Classes

```ts
// errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public fields: Record<string, string>
  ) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}
```

### Error Messages

```ts
// Bad: Vague
throw new Error('Something went wrong');

// Good: Specific and actionable
throw new ValidationError('Invalid job type', {
  jobType: `Expected one of: ${VALID_JOB_TYPES.join(', ')}`,
});
```

---

## Comments

### When to Comment

**Comment the WHY, not the WHAT:**
```ts
// Bad: States the obvious
// Increment the counter
count++;

// Good: Explains reasoning
// Use exponential backoff to avoid overwhelming the API
// during rate limiting recovery
const delay = Math.pow(2, retryCount) * 1000;
```

**Comment complex business logic:**
```ts
// Salary display logic:
// - If both min and max exist: show range ($80K - $100K)
// - If only min exists: show floor ($80K+)
// - If only max exists: show ceiling (Up to $100K)
// - If negotiable flag: append "DOE" (Depending on Experience)
function formatSalaryDisplay(salary: Salary): string {
  // Implementation
}
```

**TODOs with context:**
```ts
// TODO(username): Implement caching once Redis is set up
// Issue: #123
// Deadline: Q2 2024

// FIXME: This is O(n²) - optimize if list exceeds 1000 items
// See: https://github.com/org/repo/issues/456
```

### JSDoc for Public APIs

```ts
/**
 * Formats a salary range for display.
 * 
 * @param salary - The salary range object
 * @param options - Formatting options
 * @returns Formatted salary string, or empty string if no salary data
 * 
 * @example
 * formatSalary({ min: 80000, max: 100000 })
 * // Returns: "$80K - $100K"
 * 
 * formatSalary({ min: 80000 })
 * // Returns: "$80K+"
 */
export function formatSalary(
  salary: SalaryRange | null,
  options?: FormatOptions
): string {
  // Implementation
}
```

---

## Git Conventions

### Commit Messages

Follow conventional commits:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, missing semicolons (not CSS)
- `refactor`: Code change that neither fixes nor adds
- `perf`: Performance improvement
- `test`: Adding or fixing tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(jobs): add salary filter to search

fix(auth): handle expired session tokens correctly

refactor(api): extract common validation logic

docs(readme): add local development instructions

chore(deps): update React to 18.3.0
```

### Branch Naming

```
<type>/<issue-id>-<short-description>

Examples:
feat/123-add-salary-filter
fix/456-login-redirect-loop
refactor/789-api-client
```

### Pull Requests

**Title:** Same format as commit messages

**Description Template:**
```markdown
## Summary
Brief description of changes.

## Changes
- Added X
- Fixed Y
- Refactored Z

## Testing
- [ ] Unit tests pass
- [ ] Manual testing done
- [ ] Accessibility tested

## Screenshots
(if UI changes)
```

---

## Code Quality Tools

### ESLint Configuration

```js
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-floating-promises': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
};
```

### Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

### Pre-commit Hooks

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

---

## Testing Standards

### Test File Location

```
components/
└── JobCard/
    ├── JobCard.tsx
    ├── JobCard.test.tsx    # Unit tests colocated
    └── index.ts

__tests__/
└── integration/
    └── job-search.test.ts  # Integration tests separate
```

### Test Naming

```ts
describe('JobCard', () => {
  describe('rendering', () => {
    it('displays job title and company', () => {});
    it('shows salary when provided', () => {});
    it('handles missing salary gracefully', () => {});
  });

  describe('interactions', () => {
    it('calls onSelect when clicked', () => {});
    it('shows expanded view on hover', () => {});
  });

  describe('accessibility', () => {
    it('has correct ARIA attributes', () => {});
    it('is keyboard navigable', () => {});
  });
});
```

### Test Best Practices

```ts
// Test behavior, not implementation
// Bad: Testing internal state
expect(component.state.isLoading).toBe(true);

// Good: Testing observable behavior
expect(screen.getByRole('progressbar')).toBeInTheDocument();

// Use realistic data
// Bad: Minimal test data
const job = { id: '1' };

// Good: Representative data
const job = createMockJob({
  title: 'Senior Engineer',
  company: 'Google',
  salary: { min: 150000, max: 200000 },
});
```

---

## Summary

Quality code is:

1. **Readable**: Clear names, simple structure, good formatting
2. **Type-safe**: Strict TypeScript, no `any`, proper error types
3. **Consistent**: Same patterns everywhere
4. **Tested**: Behavior verified, edge cases covered
5. **Documented**: JSDoc for APIs, comments for complex logic
6. **Maintainable**: Small functions, single responsibility

Write code that your future self will thank you for.
