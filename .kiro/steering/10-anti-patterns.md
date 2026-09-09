# Anti-Patterns: What NOT to Do

This document catalogs common mistakes and anti-patterns. Learn to recognize these patterns and avoid them. When you see them in existing code, fix them.

---

## Architecture Anti-Patterns

### Premature Abstraction

**The Problem:**
Creating abstractions before you understand the problem domain.

```typescript
// Bad: Over-engineered from day one
interface IJobRepository<T extends BaseJob> {
  findById<R extends T>(id: string): Promise<R | null>;
  findMany<R extends T, F extends BaseFilter>(filters: F): Promise<R[]>;
  create<R extends T, I extends CreateInput<R>>(input: I): Promise<R>;
  update<R extends T, I extends UpdateInput<R>>(id: string, input: I): Promise<R>;
  delete<R extends T>(id: string): Promise<void>;
}

// Good: Simple and direct
async function getJob(id: string): Promise<Job | null> {
  return prisma.job.findUnique({ where: { id } });
}

async function getJobs(filters: JobFilters): Promise<Job[]> {
  return prisma.job.findMany({ where: buildWhereClause(filters) });
}
```

**Rule:** Add abstraction when you have 3+ concrete implementations, not before.

### Premature Optimization

**The Problem:**
Optimizing code before measuring performance.

```typescript
// Bad: Optimizing without measurement
const memoizedFormat = useMemo(() => 
  formatSalary(job.salary), 
  [job.salary]
); // For a simple string format? Unnecessary.

// Good: Measure first, optimize if needed
const formattedSalary = formatSalary(job.salary);
// Only add useMemo if profiling shows this is a bottleneck
```

**Rule:** Profile first. Optimize the measured bottleneck.

### God Objects/Components

**The Problem:**
Components that do too much and know too much.

```typescript
// Bad: Component does everything
function JobPage({ jobId }: Props) {
  // Fetches job data
  // Fetches company data
  // Fetches similar jobs
  // Handles saving
  // Handles sharing
  // Handles applying
  // Renders 500 lines of JSX
  // Has 15 useState calls
}

// Good: Composed from focused components
function JobPage({ jobId }: Props) {
  const { job } = useJob(jobId);
  
  return (
    <Layout>
      <JobHeader job={job} />
      <JobContent job={job} />
      <JobActions job={job} />
      <SimilarJobs companyId={job.companyId} />
    </Layout>
  );
}
```

**Rule:** If you can't describe a component in one sentence, split it.

### Prop Drilling

**The Problem:**
Passing props through many layers of components.

```typescript
// Bad: Props passed through 5 levels
<App user={user}>
  <Layout user={user}>
    <Sidebar user={user}>
      <UserMenu user={user}>
        <Avatar user={user} />
      </UserMenu>
    </Sidebar>
  </Layout>
</App>

// Good: Context for truly global state
const UserContext = createContext<User | null>(null);

function UserProvider({ children }) {
  const user = useCurrentUser();
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

// Components access directly
function Avatar() {
  const user = useContext(UserContext);
  return <img src={user?.avatar} />;
}
```

**Rule:** Use context for global state, props for component configuration.

---

## Code Quality Anti-Patterns

### Copy-Paste Programming

**The Problem:**
Duplicating code instead of extracting common logic.

```typescript
// Bad: Same logic repeated
function JobCard({ job }) {
  const salaryText = job.salary 
    ? `$${Math.round(job.salary.min / 1000)}K - $${Math.round(job.salary.max / 1000)}K`
    : 'Salary not disclosed';
  // ...
}

function JobDetail({ job }) {
  const salaryText = job.salary 
    ? `$${Math.round(job.salary.min / 1000)}K - $${Math.round(job.salary.max / 1000)}K`
    : 'Salary not disclosed';
  // ...
}

// Good: Extracted utility
function formatSalary(salary: SalaryRange | null): string {
  if (!salary) return 'Salary not disclosed';
  return `$${Math.round(salary.min / 1000)}K - $${Math.round(salary.max / 1000)}K`;
}
```

**Rule:** If you copy-paste, you probably need a function.

### Magic Numbers/Strings

**The Problem:**
Hard-coded values without explanation.

```typescript
// Bad: What do these numbers mean?
if (retries > 3) throw new Error();
setTimeout(fn, 300);
if (jobs.length > 50) paginate();

// Good: Named constants
const MAX_RETRIES = 3;
const DEBOUNCE_MS = 300;
const PAGE_SIZE = 50;

if (retries > MAX_RETRIES) throw new Error();
setTimeout(fn, DEBOUNCE_MS);
if (jobs.length > PAGE_SIZE) paginate();
```

**Rule:** Every literal value should be a named constant or obviously self-explanatory.

### Boolean Blindness

**The Problem:**
Functions with boolean parameters that obscure meaning.

```typescript
// Bad: What does true mean?
fetchJobs(filters, true, false);

// Good: Use options object
fetchJobs(filters, { includeExpired: true, sortDescending: false });

// Or use separate functions
fetchJobsIncludingExpired(filters);
```

**Rule:** If a boolean parameter isn't obvious, use an options object.

### Nested Callbacks/Conditionals

**The Problem:**
Deeply nested code that's hard to follow.

```typescript
// Bad: Pyramid of doom
if (job) {
  if (job.company) {
    if (job.company.logo) {
      if (isValidUrl(job.company.logo)) {
        return <img src={job.company.logo} />;
      }
    }
  }
}
return <DefaultLogo />;

// Good: Guard clauses
if (!job) return <DefaultLogo />;
if (!job.company) return <DefaultLogo />;
if (!job.company.logo) return <DefaultLogo />;
if (!isValidUrl(job.company.logo)) return <DefaultLogo />;
return <img src={job.company.logo} />;

// Or: Optional chaining + early return
const logoUrl = job?.company?.logo;
if (!logoUrl || !isValidUrl(logoUrl)) return <DefaultLogo />;
return <img src={logoUrl} />;
```

**Rule:** Maximum 2 levels of nesting. Use guard clauses.

### Stringly-Typed Code

**The Problem:**
Using strings where enums or types would be safer.

```typescript
// Bad: Typos will bite you
if (job.type === 'full-tiem') { } // Typo goes unnoticed
job.status = 'actve'; // Another typo

// Good: TypeScript enums/union types
type JobType = 'full-time' | 'part-time' | 'contract';
type JobStatus = 'active' | 'expired' | 'draft';

if (job.type === 'full-tiem') { } // TS error!
job.status = 'actve'; // TS error!
```

**Rule:** If a string has a fixed set of values, make it a type.

---

## React Anti-Patterns

### Mutating State

**The Problem:**
Directly modifying state instead of creating new references.

```typescript
// Bad: Mutating state directly
const [jobs, setJobs] = useState<Job[]>([]);

function addJob(job: Job) {
  jobs.push(job); // Mutation!
  setJobs(jobs); // Won't trigger re-render
}

// Good: Create new array
function addJob(job: Job) {
  setJobs(prev => [...prev, job]);
}
```

**Rule:** Never mutate state. Always create new references.

### useEffect for Derived State

**The Problem:**
Using useEffect to compute values that can be derived directly.

```typescript
// Bad: Unnecessary useEffect
const [jobs, setJobs] = useState<Job[]>([]);
const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
const [filter, setFilter] = useState('');

useEffect(() => {
  setFilteredJobs(jobs.filter(j => j.title.includes(filter)));
}, [jobs, filter]);

// Good: Derive during render
const [jobs, setJobs] = useState<Job[]>([]);
const [filter, setFilter] = useState('');

const filteredJobs = useMemo(
  () => jobs.filter(j => j.title.includes(filter)),
  [jobs, filter]
);

// Or even simpler if perf isn't a concern
const filteredJobs = jobs.filter(j => j.title.includes(filter));
```

**Rule:** If you can compute it from existing state, don't store it.

### Inline Function Props (When It Matters)

**The Problem:**
Creating new function references on every render, breaking memoization.

```typescript
// Bad: New function every render
<MemoizedJobList
  onJobClick={(job) => handleJobClick(job)} // New reference each time
/>

// Good: Stable reference
const handleJobClick = useCallback((job: Job) => {
  // handle click
}, [/* dependencies */]);

<MemoizedJobList onJobClick={handleJobClick} />
```

**Rule:** For memoized children, use useCallback for function props.

### Index as Key

**The Problem:**
Using array index as React key for dynamic lists.

```typescript
// Bad: Index as key
{jobs.map((job, index) => (
  <JobCard key={index} job={job} /> // Breaks when list reorders
))}

// Good: Stable unique identifier
{jobs.map(job => (
  <JobCard key={job.id} job={job} />
))}
```

**Rule:** Keys should be stable, unique identifiers from your data.

---

## API Anti-Patterns

### Chatty APIs

**The Problem:**
Requiring multiple requests for a single view.

```typescript
// Bad: N+1 requests
const job = await fetchJob(id);
const company = await fetchCompany(job.companyId);
const similarJobs = await fetchSimilarJobs(job.id);
const reviews = await fetchCompanyReviews(company.id);

// Good: Single request with includes
const jobDetail = await fetchJobDetail(id, {
  include: ['company', 'similarJobs', 'companyReviews']
});
```

**Rule:** Optimize API for client use cases, not database structure.

### Leaking Implementation Details

**The Problem:**
API responses that mirror database structure.

```typescript
// Bad: Database structure exposed
{
  "job_id": "123",
  "company_fk": "456",
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z",
  "_metadata": { "version": 3 }
}

// Good: Clean API contract
{
  "id": "123",
  "company": {
    "id": "456",
    "name": "Acme Corp"
  },
  "postedAt": "2024-01-15T10:30:00Z"
}
```

**Rule:** API responses should be designed for clients, not reflect database.

### Silent Failures

**The Problem:**
Operations that fail without indication.

```typescript
// Bad: Silent failure
async function saveJob(job: Job) {
  try {
    await db.jobs.create(job);
  } catch (e) {
    // Silently ignored
  }
}

// Good: Explicit error handling
async function saveJob(job: Job): Promise<Result<Job, SaveError>> {
  try {
    const saved = await db.jobs.create(job);
    return { success: true, data: saved };
  } catch (e) {
    logger.error({ err: e, job }, 'Failed to save job');
    return { success: false, error: new SaveError(e) };
  }
}
```

**Rule:** Errors should be explicit. Never silently swallow failures.

---

## Testing Anti-Patterns

### Testing Implementation

**The Problem:**
Tests that break when implementation changes.

```typescript
// Bad: Testing implementation
it('calls setState with new value', () => {
  const wrapper = shallow(<Counter />);
  wrapper.instance().handleIncrement();
  expect(wrapper.state('count')).toBe(1);
});

// Good: Testing behavior
it('increments the displayed count', () => {
  render(<Counter />);
  fireEvent.click(screen.getByRole('button', { name: /increment/i }));
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

**Rule:** Test what users see and do, not internal implementation.

### Test Data Coupling

**The Problem:**
Tests that depend on specific database state.

```typescript
// Bad: Depends on seeded data
it('finds the software engineer job', async () => {
  const job = await getJob('job-123'); // Hardcoded ID
  expect(job.title).toBe('Software Engineer');
});

// Good: Creates its own data
it('finds a job by ID', async () => {
  const created = await createJob({ title: 'Test Job' });
  const found = await getJob(created.id);
  expect(found.title).toBe('Test Job');
});
```

**Rule:** Tests should be isolated and create their own data.

### Mocking Everything

**The Problem:**
Mocking so much that you're not testing real behavior.

```typescript
// Bad: Mock everything
jest.mock('../api');
jest.mock('../utils');
jest.mock('../hooks');
jest.mock('react-query');

it('renders job card', () => {
  // Testing nothing real
});

// Good: Mock only boundaries
jest.mock('../api'); // Network boundary

it('renders job card with fetched data', async () => {
  mockApi.getJob.mockResolvedValue(testJob);
  render(<JobCard jobId="123" />);
  await screen.findByText(testJob.title);
});
```

**Rule:** Mock at boundaries (network, timers), not internal code.

---

## Performance Anti-Patterns

### Loading Everything Upfront

**The Problem:**
Loading all data/code before showing anything.

```typescript
// Bad: Blocks entire page
async function getServerSideProps() {
  const jobs = await fetchAllJobs(); // 10,000 jobs
  const companies = await fetchAllCompanies();
  const filters = await fetchAllFilters();
  // ... user waits for all of this
}

// Good: Load progressively
function JobsPage() {
  const { data: jobs, isLoading } = useJobs({ limit: 20 });
  
  if (isLoading) return <JobListSkeleton />;
  return <JobList jobs={jobs} />;
}
```

**Rule:** Show something useful immediately. Load more progressively.

### Unbound Queries

**The Problem:**
Queries without limits that can return unbounded data.

```typescript
// Bad: No limit
const jobs = await prisma.job.findMany({
  where: { isRemote: true }
}); // Could return 100,000 jobs

// Good: Always paginate
const jobs = await prisma.job.findMany({
  where: { isRemote: true },
  take: 20,
  skip: (page - 1) * 20,
});
```

**Rule:** All queries should have explicit limits.

### Synchronous Heavy Operations

**The Problem:**
Blocking the main thread with heavy computation.

```typescript
// Bad: Blocks UI
function SearchResults({ jobs }) {
  const sorted = jobs.sort((a, b) => /* complex sort */);
  const filtered = sorted.filter(/* complex filter */);
  const grouped = groupBy(filtered, 'company');
  // UI frozen during this
}

// Good: Debounce or offload
const processedJobs = useMemo(() => {
  // Only recompute when jobs or filters change
  return processJobs(jobs, filters);
}, [jobs, filters]);

// Or use web worker for truly heavy operations
```

**Rule:** Heavy computation should be memoized, debounced, or offloaded.

---

## Security Anti-Patterns

### Trusting Client Input

**The Problem:**
Using client-provided data without validation.

```typescript
// Bad: Using input directly
app.get('/jobs', async (req, res) => {
  const { limit } = req.query;
  const jobs = await prisma.job.findMany({ take: limit }); // Could be 1,000,000
});

// Good: Validate and constrain
app.get('/jobs', async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const jobs = await prisma.job.findMany({ take: limit });
});
```

**Rule:** All client input is untrusted. Validate everything.

### Exposing Sensitive Data

**The Problem:**
Including sensitive data in API responses.

```typescript
// Bad: Exposing internal data
return res.json({
  job,
  _internal: {
    scrapedAt: job.scrapedAt,
    sourceId: job.sourceId,
    rawData: job.rawData // Could contain PII
  }
});

// Good: Explicit serialization
return res.json(serializeJob(job)); // Only includes public fields
```

**Rule:** Explicitly define what's included in responses.

---

## Summary: Red Flags

When you see these, stop and reconsider:

| Red Flag | Better Approach |
|----------|-----------------|
| Copying code | Extract function/component |
| Boolean parameter | Options object |
| Nested >2 levels | Guard clauses |
| `any` type | Proper typing |
| Index as key | Stable ID |
| useEffect for derived state | Compute directly |
| No limit on query | Pagination |
| Testing implementation | Test behavior |
| Silent catch | Handle/report error |
| Hardcoded values | Named constants |

Every anti-pattern has a better alternative. Learn to recognize them and fix them.
