# Technical Communication: Writing & Explaining

Clear communication is as important as clean code. This document defines how to communicate technical information effectively.

---

## Core Principles

### 1. Respect the Reader's Time

Busy people skip to the bottom. Put the most important information first.

**Inverted pyramid structure:**
1. Conclusion/recommendation (what)
2. Key supporting points (why)
3. Details and evidence (how)
4. Background and context (if needed)

### 2. Clarity Over Cleverness

Don't impress—communicate.

```
// Bad: Impressive vocabulary
"The architectural paradigm leverages a microservices-oriented 
approach with asynchronous message-passing semantics."

// Good: Clear meaning
"The system uses small, independent services that communicate 
through message queues."
```

### 3. Be Specific

Vague statements waste everyone's time.

```
// Bad: Vague
"The performance is slow."
"We need to improve the code quality."
"There might be some issues."

// Good: Specific
"Search queries take 3-5 seconds; our target is 500ms."
"Functions exceed 100 lines and have no tests."
"The API returns 500 errors for 2% of requests."
```

---

## Code Documentation

### When to Comment

**Comment the WHY, not the WHAT:**

```typescript
// Bad: States the obvious
// Loop through jobs
for (const job of jobs) {

// Good: Explains reasoning
// Process older jobs first to avoid starvation
// when new jobs are added continuously
const sortedJobs = jobs.sort((a, b) => a.createdAt - b.createdAt);
```

**Comment non-obvious behavior:**

```typescript
// Salary ranges from ATS are often in different formats:
// - Annual: 100000
// - Monthly with "month" in text: 8000
// - Hourly with "hour" in text: 50
// We normalize everything to annual for comparison
function normalizeSalary(amount: number, text: string): number {
```

**Comment business rules:**

```typescript
// Jobs older than 90 days are considered stale and excluded
// from search results, but kept in DB for historical analysis.
// See: https://docs.company.com/data-retention
const STALE_THRESHOLD_DAYS = 90;
```

### JSDoc for Public APIs

```typescript
/**
 * Searches jobs based on filters and returns paginated results.
 * 
 * @param filters - Search filters including query, location, salary range
 * @param options - Pagination and sorting options
 * @returns Paginated job results with metadata
 * 
 * @example
 * // Search for remote frontend jobs
 * const results = await searchJobs(
 *   { query: 'frontend', isRemote: true },
 *   { page: 1, pageSize: 20 }
 * );
 * 
 * @throws {ValidationError} If filter values are invalid
 * @throws {DatabaseError} If database query fails
 */
export async function searchJobs(
  filters: JobFilters,
  options: PaginationOptions
): Promise<PaginatedResult<Job>> {
```

### README Structure

Every package/repo needs a README:

```markdown
# Package Name

One-line description of what this package does.

## Installation

npm install @jobscout/package-name

## Quick Start

// Minimal working example

## API Reference

### functionName(param: Type): ReturnType

Description of what the function does.

**Parameters:**
- `param` - Description of parameter

**Returns:** Description of return value

**Example:**
// Example usage

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| option | string | 'default' | What it does |

## Contributing

Link to contribution guidelines.

## License

MIT
```

---

## Commit Messages

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Subject Line

- 50 characters max
- Imperative mood ("Add feature" not "Added feature")
- No period at end
- Capitalize first letter

**Good subjects:**
```
feat(search): Add salary range filter
fix(api): Handle null company logos correctly
refactor(jobs): Extract validation into separate module
```

**Bad subjects:**
```
fixed the bug
Updated stuff
WIP
```

### Body (When Needed)

- Wrap at 72 characters
- Explain WHAT and WHY, not HOW
- Reference issues with "Fixes #123"

**Example:**
```
fix(search): Handle empty search results gracefully

Previously, an empty result set caused a null reference error
when rendering the results list. Now we show an empty state
component instead.

Users were seeing a blank page when searching for rare terms.

Fixes #456
```

---

## Pull Request Descriptions

### Title

Same format as commit message subject.

### Description Template

```markdown
## Summary

Brief description of what this PR does and why.

## Changes

- Added X to handle Y
- Fixed Z that was causing W
- Removed deprecated V

## Testing

Describe how to test the changes:
1. Step one
2. Step two
3. Expected result

## Screenshots

(If UI changes, include before/after screenshots)

## Checklist

- [ ] Tests pass locally
- [ ] Code follows style guidelines
- [ ] Self-reviewed
- [ ] Documentation updated
- [ ] No breaking changes (or documented in description)

## Related Issues

Fixes #123
Related to #456
```

---

## Technical Writing

### Error Messages

Error messages should be helpful, not cryptic.

**Components of a good error message:**
1. What went wrong
2. Why it went wrong (if known)
3. How to fix it

```typescript
// Bad: Cryptic
throw new Error('Invalid input');

// Good: Helpful
throw new ValidationError(
  `Invalid job type "${input}". ` +
  `Expected one of: ${VALID_JOB_TYPES.join(', ')}.`
);

// Bad: Technical jargon for user-facing
"ECONNREFUSED 127.0.0.1:5432"

// Good: User-friendly with technical detail
"Unable to connect to the database. " +
"Please check your connection and try again. " +
"(Technical details: ECONNREFUSED 127.0.0.1:5432)"
```

### Log Messages

Logs are for debugging. Make them useful.

```typescript
// Bad: Missing context
log.info('Processing...');
log.error('Failed');

// Good: Full context
log.info({ jobCount: jobs.length, source: 'greenhouse' }, 'Starting job processing');
log.error({ 
  err, 
  jobId: job.id, 
  attempt: retryCount,
  maxRetries: MAX_RETRIES 
}, 'Failed to save job');
```

**Log levels:**
- `error`: Something broke, needs attention
- `warn`: Something unexpected, but handled
- `info`: Normal operations, milestones
- `debug`: Detailed debugging info (disabled in prod)

### API Documentation

Every endpoint needs documentation:

```typescript
/**
 * @api {get} /jobs Search jobs
 * @apiName SearchJobs
 * @apiGroup Jobs
 * @apiVersion 1.0.0
 *
 * @apiQuery {String} [query] Search term
 * @apiQuery {String="full-time","part-time","contract"} [jobType] Filter by type
 * @apiQuery {Number} [salaryMin] Minimum salary
 * @apiQuery {Number} [page=1] Page number
 * @apiQuery {Number} [pageSize=20] Results per page (max 100)
 *
 * @apiSuccess {Object[]} data List of jobs
 * @apiSuccess {Object} meta Pagination metadata
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": [
 *         {
 *           "id": "clx123...",
 *           "title": "Senior Engineer",
 *           ...
 *         }
 *       ],
 *       "meta": {
 *         "total": 1234,
 *         "page": 1,
 *         "pageSize": 20
 *       }
 *     }
 *
 * @apiError ValidationError Invalid query parameters
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "code": "VALIDATION_ERROR",
 *         "message": "Invalid jobType",
 *         "details": [...]
 *       }
 *     }
 */
```

---

## Explaining Technical Concepts

### To Non-Technical Stakeholders

**Strategies:**
- Use analogies to familiar concepts
- Focus on outcomes, not implementation
- Quantify impact when possible
- Avoid jargon or define it

**Example:**
```
Technical: "We need to add an index to the jobs table because the 
query is doing a sequential scan, resulting in O(n) complexity."

Non-technical: "Right now, searching jobs is slow because we check 
every single job in the database. Adding an index is like adding 
a table of contents to a book—instead of reading every page to 
find what you want, you can jump straight to it. This will make 
searches 10x faster."
```

### To Other Engineers

**Be precise but not verbose:**

```
"The search is slow" 
→ "Search queries take 3-5s due to missing index on job_type column. 
   Adding a btree index should reduce this to <100ms based on EXPLAIN 
   analysis."
```

**Show, don't just tell:**

```
// Include actual data
Before: 3,200ms average query time (p95: 5,100ms)
After:  85ms average query time (p95: 120ms)

// Include relevant code/config
CREATE INDEX idx_jobs_type_posted ON jobs(job_type, posted_at DESC);
```

---

## Asking Questions

### Good Questions

A good question is specific, contextual, and shows effort.

**Format:**
```
Context: [What you're trying to do]
Problem: [What's not working]
Tried: [What you've attempted]
Question: [Specific ask]
```

**Example:**
```
I'm adding a salary filter to the job search.

When I filter for salary > $100K, jobs with null salary 
fields are excluded. I want to include them with a 
"Salary not disclosed" indicator.

I tried using COALESCE in the Prisma query but it 
doesn't work with JSON fields.

Is there a way to handle this in Prisma, or should I 
filter in application code?
```

### Answering Questions

**Be helpful, not superior:**

```
// Bad: Dismissive
"Just Google it."
"Read the docs."
"That's wrong."

// Good: Helpful
"The issue is X. Here's why: [explanation]. 
For future reference, this is covered in [doc link]."
```

---

## Code Review Comments

### As Reviewer

**Be kind, be specific:**

```
// Bad: Vague and unhelpful
"This is wrong."
"I don't like this."

// Good: Specific and constructive
"This function is getting complex (40+ lines). 
Consider extracting the validation logic into a 
separate function for readability and testability."
```

**Ask questions rather than demand:**

```
// Bad: Demanding
"Use a switch statement here."

// Good: Questioning
"Have you considered using a switch statement here? 
It might be clearer for this many conditions."
```

**Distinguish severity:**

```
// Critical: Must fix
"[blocking] This allows SQL injection. Use parameterized query."

// Suggestion: Nice to have
"[nit] Consider renaming to `isJobValid` for consistency."

// Question: Seeking understanding
"[question] Why is this timeout set to 30s? Is that intentional?"
```

### As Author

**Respond to every comment:**
- If you agree, fix it and say "Done"
- If you disagree, explain why
- If you're unsure, ask for clarification

**Don't take it personally:**
- Reviews are about code, not you
- Disagreement is healthy
- Learn from feedback

---

## Meetings & Discussions

### Technical Discussions

**Come prepared:**
- Have a written proposal
- Include alternatives considered
- Show data when possible

**Structure:**
```
1. Context (1 min): What problem we're solving
2. Options (2 min): What we considered
3. Recommendation (1 min): What we propose
4. Discussion (remaining time): Questions, concerns
5. Decision: Document outcome
```

### Status Updates

**Format:**
```
DONE: [What was completed]
DOING: [Current work]
BLOCKED: [What's preventing progress]
NEXT: [What's coming up]
```

**Example:**
```
DONE: Implemented Greenhouse scraper adapter, 
      added tests, deployed to staging.

DOING: Adding Lever adapter, similar pattern 
       but different auth mechanism.

BLOCKED: Need API key for Ashby staging environment.
         Asked John, waiting for response.

NEXT: Start on salary normalization once 
      adapters are complete.
```

---

## Documentation Maintenance

### Keep Docs Updated

**Triggers to update docs:**
- Code change that affects behavior
- API change
- Config change
- New feature
- Bug fix that reveals incorrect docs

### Doc Review

**Include docs in code review:**
- Are the docs accurate?
- Are examples current?
- Is anything missing?

### Deprecation

**When deprecating:**
```typescript
/**
 * @deprecated Use `searchJobs` instead. Will be removed in v2.0.
 */
export function findJobs() {}
```

**In docs:**
```markdown
> **Deprecated**: This API is deprecated and will be removed in v2.0.
> Use [searchJobs](/api/search-jobs) instead.
```

---

## Summary

Clear communication means:

1. **Lead with the conclusion**: Busy readers skip to the end
2. **Be specific**: Numbers, examples, code
3. **Respect time**: Only include what's needed
4. **Show, don't tell**: Code > description
5. **Be helpful**: Assume good intent, provide solutions
6. **Update continuously**: Stale docs are worse than no docs

The best code without clear communication is a liability. Document, explain, and communicate like your teammates depend on it—because they do.
