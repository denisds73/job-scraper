# Tech Stack Context: Technology Decisions & Constraints

This document defines our technology choices, their rationale, and operational constraints. All decisions optimize for the zero-cost constraint while maintaining Google-level quality.

---

## Stack Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│  Next.js 14 (App Router) + React 18 + TypeScript           │
│  Tailwind CSS + Lucide Icons                                │
│  Deployed on Vercel (free tier)                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                          API                                │
│  Fastify + TypeScript                                       │
│  Deployed on Railway (free tier)                            │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌───────────────────┐ ┌───────────────┐ ┌───────────────────┐
│    DATABASE       │ │     CACHE     │ │     STORAGE       │
│  Neon PostgreSQL  │ │ Upstash Redis │ │  Cloudflare R2    │
│  + Full-Text      │ │               │ │                   │
│    Search         │ │               │ │                   │
└───────────────────┘ └───────────────┘ └───────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     BACKGROUND JOBS                         │
│  GitHub Actions (scheduled workflows)                       │
│  Runs scrapers on cron schedule                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Decisions

### Frontend: Next.js 14

**Why Next.js:**
- Server-side rendering for SEO (job listings need to be indexed)
- App Router for modern React patterns
- Built-in code splitting and optimization
- API routes for BFF pattern if needed
- Excellent Vercel integration

**Why NOT alternatives:**
- Create React App: No SSR, deprecated
- Remix: Smaller ecosystem, less Vercel optimization
- Astro: Better for static sites, not interactive apps
- Vue/Nuxt: React ecosystem is larger for job market

**Configuration:**
```ts
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.greenhouse.io' },
      { protocol: 'https', hostname: '**.lever.co' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};
```

### Styling: Tailwind CSS

**Why Tailwind:**
- Utility-first eliminates context switching
- Built-in design system constraints
- Excellent dark mode support
- Tree-shaking removes unused styles
- Consistent with locked design tokens

**Why NOT alternatives:**
- CSS Modules: More boilerplate, harder to maintain consistency
- Styled Components: Runtime overhead, SSR complexity
- Emotion: Same issues as Styled Components
- Vanilla CSS: No design system constraints

**Critical Rules:**
- Use only colors defined in design tokens
- Use only spacing from the scale (4px base)
- No arbitrary values (`[123px]`) without justification
- Use `cn()` utility for conditional classes

### API: Fastify

**Why Fastify:**
- Fastest Node.js framework (benchmarked)
- Built-in TypeScript support
- Schema validation with JSON Schema
- Plugin architecture for clean organization
- Excellent logging with Pino

**Why NOT alternatives:**
- Express: Slower, less modern, no built-in types
- Hono: Newer, smaller ecosystem
- tRPC: Tighter coupling, complexity for this use case
- GraphQL: Overkill for job listings

**Configuration:**
```ts
// server.ts
import Fastify from 'fastify';

const app = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV === 'development' 
      ? { target: 'pino-pretty' } 
      : undefined,
  },
});
```

### Database: Neon PostgreSQL

**Why Neon:**
- Serverless PostgreSQL (scales to zero)
- Generous free tier (0.5GB storage, 190 compute hours)
- Branching for development/staging
- PostgreSQL full-text search eliminates need for Elasticsearch
- Connection pooling built-in

**Why NOT alternatives:**
- PlanetScale: MySQL, less powerful full-text search
- Supabase: More opinionated, auth overhead
- MongoDB Atlas: Document store not ideal for relational job data
- SQLite: Not serverless, scaling limitations

**Schema Patterns:**
```sql
-- Full-text search index
CREATE INDEX jobs_search_idx ON jobs 
  USING GIN (to_tsvector('english', 
    coalesce(title, '') || ' ' || 
    coalesce(description, '') || ' ' || 
    coalesce(company_name, '')
  ));

-- Efficient filtering
CREATE INDEX jobs_filters_idx ON jobs (
  job_type, 
  experience_level, 
  is_remote, 
  posted_at DESC
);
```

### ORM: Prisma

**Why Prisma:**
- Type-safe database queries
- Auto-generated TypeScript types
- Migrations management
- Excellent developer experience
- Works well with Neon

**Why NOT alternatives:**
- Drizzle: Newer, less mature
- TypeORM: More complex, legacy patterns
- Knex: No type generation
- Raw SQL: Error-prone, no type safety

**Usage Pattern:**
```ts
// prisma/schema.prisma
model Job {
  id            String   @id @default(cuid())
  title         String
  company       Company  @relation(fields: [companyId], references: [id])
  companyId     String
  description   String
  requirements  String[]
  salary        Json?
  location      String
  isRemote      Boolean  @default(false)
  jobType       JobType
  postedAt      DateTime
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@index([jobType, isRemote, postedAt(sort: Desc)])
}
```

### Cache: Upstash Redis

**Why Upstash:**
- Serverless Redis (pay per request)
- Generous free tier (10K requests/day)
- Global edge deployment
- REST API (no connection management)

**Why NOT alternatives:**
- Redis Cloud: Connection-based pricing
- ElastiCache: AWS only, no free tier
- Memory cache: Lost on serverless cold starts

**Caching Strategy:**
```ts
// Cache patterns
const CACHE_TTL = {
  JOB_LIST: 60 * 5,      // 5 minutes
  JOB_DETAIL: 60 * 60,   // 1 hour
  COMPANY: 60 * 60 * 24, // 24 hours
  FILTERS: 60 * 60,      // 1 hour
};

// Cache key patterns
const keys = {
  jobList: (filters: string) => `jobs:list:${hash(filters)}`,
  jobDetail: (id: string) => `jobs:detail:${id}`,
  company: (id: string) => `company:${id}`,
};
```

### Storage: Cloudflare R2

**Why R2:**
- S3-compatible API
- Free tier: 10GB storage, 1M requests
- No egress fees (unlike S3)
- Global edge CDN

**Use Cases:**
- Company logos
- Cached API responses
- Job description snapshots
- Static assets

### Background Jobs: GitHub Actions

**Why GitHub Actions:**
- Free for public repos (2000 mins/month for private)
- Cron scheduling built-in
- No infrastructure to manage
- Logs and debugging included

**Why NOT alternatives:**
- Vercel Cron: Limited to Pro plan
- Railway Cron: Consumes compute hours
- AWS Lambda: Requires AWS setup

**Scraper Schedule:**
```yaml
# .github/workflows/scrape.yml
name: Scrape Jobs
on:
  schedule:
    - cron: '0 */4 * * *'  # Every 4 hours
  workflow_dispatch:        # Manual trigger

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run scrape
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

---

## Free Tier Constraints

### Current Limits

| Service | Limit | Strategy |
|---------|-------|----------|
| Vercel | 100GB bandwidth | CDN caching, optimize assets |
| Railway | 500 hours/month | Serverless-like behavior |
| Neon | 0.5GB storage | Prune old jobs monthly |
| Upstash | 10K requests/day | Aggressive caching |
| R2 | 10GB storage | Compress images |
| GitHub Actions | 2000 mins/month | Efficient scripts |

### Mitigation Strategies

**Vercel Bandwidth:**
- Use Next.js Image optimization
- Enable compression
- Aggressive cache headers
- Static generation where possible

**Neon Storage:**
```sql
-- Monthly cleanup job
DELETE FROM jobs 
WHERE posted_at < NOW() - INTERVAL '90 days'
AND source != 'featured';

-- Vacuum to reclaim space
VACUUM ANALYZE jobs;
```

**Upstash Requests:**
- Batch reads when possible
- Use longer TTLs for stable data
- Client-side caching with SWR
- Deduplicate cache keys

**Railway Compute:**
- Efficient code (no blocking operations)
- Connection pooling
- Response caching
- Minimize cold starts

---

## API Design

### REST Conventions

```
GET    /api/jobs              # List jobs (paginated)
GET    /api/jobs/:id          # Get job detail
GET    /api/jobs/search       # Full-text search
GET    /api/companies         # List companies
GET    /api/companies/:id     # Get company detail
GET    /api/filters           # Get available filters
```

### Response Format

```ts
// Success response
{
  "data": { ... },
  "meta": {
    "total": 1234,
    "page": 1,
    "pageSize": 20,
    "hasMore": true
  }
}

// Error response
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid filter parameter",
    "details": [
      { "field": "jobType", "message": "Must be one of: full-time, part-time, contract" }
    ]
  }
}
```

### Pagination

```ts
// Request
GET /api/jobs?page=2&pageSize=20&sort=postedAt:desc

// Response includes cursor for efficient pagination
{
  "data": [...],
  "meta": {
    "total": 1234,
    "page": 2,
    "pageSize": 20,
    "cursor": "eyJpZCI6IjEyMyIsInBvc3RlZEF0IjoiMjAyNC0wMS0xNSJ9"
  }
}
```

### Rate Limiting

```ts
// Upstash rate limiting
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
  analytics: true,
});

// Middleware
app.addHook('preHandler', async (request, reply) => {
  const { success, limit, remaining, reset } = await ratelimit.limit(
    request.ip
  );
  
  reply.header('X-RateLimit-Limit', limit);
  reply.header('X-RateLimit-Remaining', remaining);
  reply.header('X-RateLimit-Reset', reset);
  
  if (!success) {
    reply.status(429).send({ error: { code: 'RATE_LIMITED', message: 'Too many requests' } });
  }
});
```

---

## Security

### Input Validation

```ts
// Zod schemas for all inputs
import { z } from 'zod';

const jobFiltersSchema = z.object({
  query: z.string().max(200).optional(),
  jobType: z.enum(['full-time', 'part-time', 'contract', 'internship']).optional(),
  location: z.string().max(100).optional(),
  isRemote: z.coerce.boolean().optional(),
  salaryMin: z.coerce.number().positive().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
```

### SQL Injection Prevention

```ts
// Always use Prisma's parameterized queries
const jobs = await prisma.job.findMany({
  where: {
    title: { contains: query, mode: 'insensitive' },
  },
});

// For raw queries, use $queryRaw with template literals
const results = await prisma.$queryRaw`
  SELECT * FROM jobs 
  WHERE to_tsvector('english', title) @@ plainto_tsquery('english', ${query})
`;
```

### Headers

```ts
// Security headers
app.addHook('onSend', (request, reply) => {
  reply.header('X-Content-Type-Options', 'nosniff');
  reply.header('X-Frame-Options', 'DENY');
  reply.header('X-XSS-Protection', '1; mode=block');
  reply.header('Referrer-Policy', 'strict-origin-when-cross-origin');
});
```

---

## Monitoring & Observability

### Logging

```ts
// Structured logging with Pino
const log = app.log;

log.info({ jobId, source }, 'Job scraped successfully');
log.warn({ filters, count: 0 }, 'No jobs found for filters');
log.error({ err, jobId }, 'Failed to save job');
```

### Error Tracking

```ts
// Sentry for error tracking (free tier)
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // 10% of transactions
});

app.setErrorHandler((error, request, reply) => {
  Sentry.captureException(error);
  // ... handle error
});
```

### Health Checks

```ts
// Health endpoint
app.get('/health', async () => {
  const checks = await Promise.all([
    prisma.$queryRaw`SELECT 1`.then(() => ({ db: 'ok' })).catch(() => ({ db: 'error' })),
    redis.ping().then(() => ({ cache: 'ok' })).catch(() => ({ cache: 'error' })),
  ]);
  
  const status = checks.every(c => Object.values(c)[0] === 'ok') ? 'healthy' : 'degraded';
  
  return { status, checks: Object.assign({}, ...checks) };
});
```

---

## Decision Tree

### When to Use What

```
Need to store data persistently?
├─ Relational data → Neon PostgreSQL
├─ Files/blobs → Cloudflare R2
└─ Temporary/cache → Upstash Redis

Need to run code?
├─ User request → Fastify API (Railway)
├─ Scheduled task → GitHub Actions
└─ Static page → Next.js SSG (Vercel)

Need to search?
├─ Full-text search → PostgreSQL FTS
├─ Exact filters → PostgreSQL indexes
└─ Autocomplete → Redis sorted sets

Need to cache?
├─ API responses → Upstash Redis
├─ Static assets → Vercel CDN
└─ Client state → React Query
```

---

## Local Development

### Setup

```bash
# Clone and install
git clone [repo]
cd job-scraper
npm install

# Environment
cp .env.example .env.local
# Fill in values from 1Password/secrets manager

# Database
npx prisma migrate dev
npx prisma db seed

# Run
npm run dev          # Next.js frontend
npm run dev:api      # Fastify API
```

### Environment Variables

```bash
# .env.local (never commit)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."  # For migrations
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
R2_ENDPOINT="https://..."
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
```

### Docker Compose (Optional)

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: jobscout
      POSTGRES_PASSWORD: dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

---

## Summary

Our tech stack prioritizes:

1. **Zero cost**: All services have generous free tiers
2. **Type safety**: TypeScript end-to-end
3. **Performance**: SSR, caching, optimized queries
4. **Scalability**: Serverless architecture scales automatically
5. **Developer experience**: Fast iteration, good tooling
6. **Maintainability**: Clear patterns, good documentation

Every technology choice has a reason. Question decisions that don't make sense for your context.
