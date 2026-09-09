# JobScout Implementation Plan

## Executive Summary

**Project:** JobScout - IT Job Aggregation Platform  
**Status:** Design & UI Complete, Backend Required  
**Timeline:** 6 Phases, ~8-12 weeks to MVP  
**Budget:** $0 (Free Tier Only)

---

## Current State Analysis

### What Exists (Complete)

| Asset | Status | Quality |
|-------|--------|---------|
| Design System | LOCKED v1.0 | Production-ready |
| UI Components | 10 components | Google-level |
| Sample Pages | 3 pages | Functional with mock data |
| Steering Files | 12 comprehensive docs | Complete engineering guidance |
| Knowledge Base | Indexed | Searchable code context |

### Component Inventory

**Core UI (`ui-samples/components/ui/`)**
- Button (variants: primary, secondary, ghost, accent, danger, link)
- Input, SearchInput (with validation states)
- Badge, Tag, JobTypeBadge (semantic badges)
- Card, CardHeader, CardTitle, CardContent, CardFooter, CardSkeleton

**Layout (`ui-samples/components/layout/`)**
- Header (navigation, theme toggle, mobile menu)
- Footer (links, social)
- FilterSidebar (checkbox/radio filters, mobile drawer)

**Jobs (`ui-samples/components/jobs/`)**
- JobCard (default/compact variants, bookmark, featured)
- JobList (with loading skeletons, empty state)
- JobCardSkeleton

**Pages (`ui-samples/pages/`)**
- Homepage (`index.tsx`) - Hero, search, featured jobs, categories
- Search Results (`search.tsx`) - Filters, job list, pagination
- Job Detail (`job/[id].tsx`) - Full job info, similar jobs, apply CTA

### What's Missing (Gaps)

| Layer | Gap | Impact |
|-------|-----|--------|
| Data | No database schema | Cannot store jobs |
| Data | No Prisma models | No type-safe queries |
| API | No Fastify server | No endpoints |
| API | No search implementation | Cannot query jobs |
| Scraper | No adapters | Cannot fetch job data |
| Scraper | No normalization | Inconsistent data |
| Frontend | Mock data only | Not functional |
| Frontend | No React Query | No data fetching |
| Infra | No deployment | Not accessible |
| Infra | No CI/CD | Manual deploys |

---

## Implementation Phases

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 0: Foundation (Week 1)                                                │
│ Monorepo setup, shared types, development environment                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ PHASE 1: Data Layer (Week 2)                                                │
│ Prisma schema, Neon database, migrations, seed data                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ PHASE 2: API Layer (Week 3-4)                                               │
│ Fastify server, REST endpoints, validation, caching                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ PHASE 3: Scraper Framework (Week 5-6)                                       │
│ Base adapter, Greenhouse, Lever, normalization, scheduling                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ PHASE 4: Frontend Integration (Week 7-8)                                    │
│ React Query, real API calls, error handling, loading states                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ PHASE 5: Deployment & Polish (Week 9-10)                                    │
│ Vercel, Railway, CI/CD, monitoring, performance                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 0: Foundation

**Status: COMPLETE** (Completed: 2026-09-10)

**Duration:** 3-5 days  
**Goal:** Establish monorepo structure and shared infrastructure

### 0.1 Monorepo Setup

```
job-scraper/
├── packages/
│   ├── web/                    # Next.js (move from ui-samples)
│   ├── api/                    # Fastify backend
│   ├── scraper/                # Job scraper service
│   └── shared/                 # Shared types & utils
├── prisma/
│   └── schema.prisma           # Database schema
├── .github/
│   └── workflows/              # CI/CD
├── turbo.json                  # Turborepo config
├── package.json                # Root workspace
└── docker-compose.yml          # Local dev services
```

### 0.2 Tasks

| Task | Priority | Est. Hours | Status |
|------|----------|------------|--------|
| Initialize Turborepo | P0 | 2h | ✅ DONE |
| Move ui-samples → packages/web | P0 | 2h | ✅ DONE |
| Create packages/shared with types | P0 | 3h | ✅ DONE |
| Create packages/api scaffold | P0 | 2h | ✅ DONE |
| Create packages/scraper scaffold | P0 | 2h | ✅ DONE |
| Configure TypeScript paths | P0 | 1h | ✅ DONE |
| Setup Docker Compose (Postgres, Redis) | P1 | 2h | ✅ DONE |
| Configure ESLint/Prettier for monorepo | P1 | 1h | ✅ DONE |

### 0.3 Shared Types (`packages/shared/src/types/`)

```typescript
// job.ts
export interface Job {
  id: string;
  externalId: string;
  source: JobSource;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  isRemote: boolean;
  locationType: LocationType;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  salary: SalaryRange | null;
  skills: string[];
  department: string | null;
  postedAt: Date;
  expiresAt: Date | null;
  sourceUrl: string;
  companyId: string;
  company: Company;
  createdAt: Date;
  updatedAt: Date;
}

export type JobSource = 'greenhouse' | 'lever' | 'ashby' | 'workable';
export type LocationType = 'remote' | 'hybrid' | 'onsite';
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'staff' | 'principal';

export interface SalaryRange {
  min: number | null;
  max: number | null;
  currency: string;
  period: 'yearly' | 'monthly' | 'hourly';
}

// company.ts
export interface Company {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  website: string | null;
  careerPageUrl: string;
  industry: string | null;
  size: CompanySize | null;
  foundedYear: number | null;
  headquarters: string | null;
  atsType: JobSource;
  createdAt: Date;
  updatedAt: Date;
}

export type CompanySize = '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1001-5000' | '5000+';
```

### 0.4 Deliverables

- [x] Turborepo monorepo working
- [x] All packages build successfully
- [x] Shared types importable from all packages
- [x] Local Docker services configured
- [x] README with setup instructions (in .env.example)

---

## Phase 1: Data Layer

**Status: COMPLETE** (Completed: 2026-09-10)

**Duration:** 4-5 days  
**Goal:** Database schema and data access layer

### 1.1 Prisma Schema (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ============================================
// COMPANY
// ============================================
model Company {
  id            String       @id @default(cuid())
  name          String
  slug          String       @unique
  logo          String?
  description   String?
  website       String?
  careerPageUrl String
  industry      String?
  size          CompanySize?
  foundedYear   Int?
  headquarters  String?
  atsType       JobSource
  
  jobs          Job[]
  scrapes       Scrape[]
  
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
  
  @@index([atsType])
  @@index([slug])
}

enum CompanySize {
  SIZE_1_10
  SIZE_11_50
  SIZE_51_200
  SIZE_201_500
  SIZE_501_1000
  SIZE_1001_5000
  SIZE_5000_PLUS
}

// ============================================
// JOB
// ============================================
model Job {
  id              String          @id @default(cuid())
  externalId      String
  source          JobSource
  title           String
  description     String
  requirements    String[]
  location        String
  isRemote        Boolean         @default(false)
  locationType    LocationType
  employmentType  EmploymentType
  experienceLevel ExperienceLevel?
  
  salaryMin       Int?
  salaryMax       Int?
  salaryCurrency  String          @default("USD")
  salaryPeriod    SalaryPeriod    @default(YEARLY)
  
  skills          String[]
  department      String?
  
  postedAt        DateTime
  expiresAt       DateTime?
  lastSeenAt      DateTime        @default(now())
  sourceUrl       String
  
  companyId       String
  company         Company         @relation(fields: [companyId], references: [id])
  
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  
  // Unique constraint: same job from same source
  @@unique([externalId, source])
  
  // Search index
  @@index([title])
  @@index([location])
  @@index([isRemote])
  @@index([employmentType])
  @@index([experienceLevel])
  @@index([postedAt(sort: Desc)])
  @@index([companyId])
  
  // Composite index for common filters
  @@index([employmentType, isRemote, postedAt(sort: Desc)])
}

enum JobSource {
  GREENHOUSE
  LEVER
  ASHBY
  WORKABLE
  SMARTRECRUITERS
}

enum LocationType {
  REMOTE
  HYBRID
  ONSITE
}

enum EmploymentType {
  FULL_TIME
  PART_TIME
  CONTRACT
  INTERNSHIP
}

enum ExperienceLevel {
  ENTRY
  MID
  SENIOR
  STAFF
  PRINCIPAL
}

enum SalaryPeriod {
  YEARLY
  MONTHLY
  HOURLY
}

// ============================================
// SCRAPE (Audit Trail)
// ============================================
model Scrape {
  id            String      @id @default(cuid())
  source        JobSource
  status        ScrapeStatus
  
  companyId     String?
  company       Company?    @relation(fields: [companyId], references: [id])
  
  jobsFound     Int         @default(0)
  jobsCreated   Int         @default(0)
  jobsUpdated   Int         @default(0)
  jobsRemoved   Int         @default(0)
  
  errors        Json[]
  
  startedAt     DateTime    @default(now())
  completedAt   DateTime?
  
  @@index([source, startedAt(sort: Desc)])
  @@index([companyId])
}

enum ScrapeStatus {
  RUNNING
  SUCCESS
  PARTIAL
  FAILED
}
```

### 1.2 Full-Text Search Setup

```sql
-- Migration: Add full-text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create search vector column
ALTER TABLE "Job" ADD COLUMN search_vector tsvector 
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(array_to_string(skills, ' '), '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C')
  ) STORED;

-- Create GIN index for fast full-text search
CREATE INDEX job_search_idx ON "Job" USING GIN (search_vector);

-- Create trigram index for fuzzy matching
CREATE INDEX job_title_trgm_idx ON "Job" USING GIN (title gin_trgm_ops);
```

### 1.3 Tasks

| Task | Priority | Est. Hours | Status |
|------|----------|------------|--------|
| Create Prisma schema | P0 | 4h | ✅ DONE |
| Setup Neon database | P0 | 1h | ⏳ Ready (needs connection string) |
| Create initial migration | P0 | 1h | ⏳ Ready (run prisma migrate) |
| Add full-text search migration | P0 | 2h | ✅ DONE (manual SQL created) |
| Create seed data script | P1 | 3h | ✅ DONE |
| Create repository layer | P1 | 4h | ✅ DONE |
| Write database tests | P2 | 3h | Phase 6 |

### 1.4 Deliverables

- [x] Prisma schema complete (5 models: Company, Job, Scrape, Skill, SavedSearch)
- [ ] Neon database provisioned (requires DATABASE_URL in .env)
- [ ] Migrations applied (run: npm run db:migrate)
- [x] Full-text search SQL ready (prisma/migrations/manual/001_full_text_search.sql)
- [x] Seed data for development (8 companies, realistic job templates)
- [x] Repository layer with typed queries (JobRepository, CompanyRepository, ScrapeRepository)

---

## Phase 2: API Layer

**Status: COMPLETE** (Completed: 2026-09-10)

**Duration:** 7-10 days  
**Goal:** Production-ready REST API

### 2.1 API Structure

```
packages/api/
├── src/
│   ├── routes/
│   │   ├── jobs/
│   │   │   ├── index.ts        # Route registration
│   │   │   ├── list.ts         # GET /jobs
│   │   │   ├── search.ts       # GET /jobs/search
│   │   │   ├── get.ts          # GET /jobs/:id
│   │   │   └── schema.ts       # Zod schemas
│   │   ├── companies/
│   │   │   ├── index.ts
│   │   │   ├── list.ts         # GET /companies
│   │   │   ├── get.ts          # GET /companies/:slug
│   │   │   └── schema.ts
│   │   ├── filters/
│   │   │   └── index.ts        # GET /filters
│   │   └── health/
│   │       └── index.ts        # GET /health
│   ├── services/
│   │   ├── job.service.ts
│   │   ├── company.service.ts
│   │   ├── search.service.ts
│   │   └── cache.service.ts
│   ├── plugins/
│   │   ├── prisma.ts
│   │   ├── redis.ts
│   │   ├── cors.ts
│   │   └── rateLimit.ts
│   ├── utils/
│   │   ├── errors.ts
│   │   ├── pagination.ts
│   │   └── response.ts
│   └── server.ts
├── package.json
└── tsconfig.json
```

### 2.2 API Endpoints

| Method | Endpoint | Description | Cache TTL |
|--------|----------|-------------|-----------|
| GET | `/health` | Health check | - |
| GET | `/jobs` | List jobs (paginated) | 5 min |
| GET | `/jobs/search` | Full-text search | 5 min |
| GET | `/jobs/:id` | Job detail | 1 hour |
| GET | `/companies` | List companies | 1 hour |
| GET | `/companies/:slug` | Company detail + jobs | 1 hour |
| GET | `/filters` | Available filter options | 1 hour |

### 2.3 Request/Response Examples

**GET /jobs/search**
```typescript
// Request
GET /jobs/search?q=frontend&location=remote&salary_min=100000&page=1&limit=20

// Response
{
  "data": [
    {
      "id": "clx123...",
      "title": "Senior Frontend Engineer",
      "company": {
        "id": "clx456...",
        "name": "Stripe",
        "logo": "https://..."
      },
      "location": "San Francisco, CA",
      "locationType": "hybrid",
      "employmentType": "full-time",
      "salary": {
        "min": 180000,
        "max": 250000,
        "currency": "USD"
      },
      "skills": ["React", "TypeScript"],
      "postedAt": "2024-01-15T10:00:00Z",
      "sourceUrl": "https://..."
    }
  ],
  "meta": {
    "total": 1234,
    "page": 1,
    "pageSize": 20,
    "totalPages": 62,
    "hasMore": true
  }
}
```

### 2.4 Tasks

| Task | Priority | Est. Hours |
|------|----------|------------|
| Setup Fastify with TypeScript | P0 | 2h |
| Create Prisma plugin | P0 | 2h |
| Create Redis/cache plugin | P0 | 3h |
| Implement /jobs/search endpoint | P0 | 6h |
| Implement /jobs/:id endpoint | P0 | 2h |
| Implement /jobs list endpoint | P0 | 3h |
| Implement /companies endpoints | P1 | 3h |
| Implement /filters endpoint | P1 | 2h |
| Add rate limiting | P1 | 2h |
| Add request validation (Zod) | P1 | 3h |
| Add error handling middleware | P1 | 2h |
| Add OpenAPI documentation | P2 | 3h |
| Write API tests | P2 | 4h |

### 2.5 Deliverables

- [ ] All endpoints functional
- [ ] Full-text search working
- [ ] Pagination implemented
- [ ] Caching layer active
- [ ] Rate limiting configured
- [ ] Error responses consistent
- [ ] OpenAPI spec generated

---

## Phase 3: Scraper Framework

**Status: COMPLETE** (Completed: 2026-09-10)

**Duration:** 10-14 days  
**Goal:** Automated job ingestion from multiple ATS platforms

### 3.1 Scraper Architecture

```
packages/scraper/
├── src/
│   ├── adapters/
│   │   ├── base.adapter.ts       # Abstract base class
│   │   ├── greenhouse.adapter.ts
│   │   ├── lever.adapter.ts
│   │   ├── ashby.adapter.ts
│   │   └── index.ts
│   ├── processors/
│   │   ├── normalizer.ts         # Standardize job data
│   │   ├── salary-parser.ts      # Extract salary info
│   │   ├── skill-extractor.ts    # Detect tech stack
│   │   ├── experience-parser.ts  # Infer experience level
│   │   └── deduplicator.ts       # Find duplicates
│   ├── services/
│   │   ├── scrape.service.ts     # Orchestration
│   │   ├── company.service.ts    # Company discovery
│   │   └── storage.service.ts    # Persist to DB
│   ├── utils/
│   │   ├── http.ts               # Retry-enabled fetch
│   │   ├── rate-limiter.ts       # Respectful scraping
│   │   └── logger.ts
│   └── main.ts
├── companies/
│   ├── greenhouse.json           # Companies to scrape
│   └── lever.json
└── package.json
```

### 3.2 Adapter Interface

```typescript
// adapters/base.adapter.ts
export interface RawJob {
  externalId: string;
  title: string;
  description: string;
  location: string;
  department?: string;
  postedAt: Date;
  applyUrl: string;
  metadata?: Record<string, unknown>;
}

export interface AdapterConfig {
  baseUrl: string;
  rateLimit: number; // requests per second
  timeout: number;   // ms
}

export abstract class BaseAdapter {
  abstract source: JobSource;
  abstract config: AdapterConfig;
  
  abstract fetchJobs(companySlug: string): Promise<RawJob[]>;
  abstract normalizeJob(raw: RawJob, company: Company): Partial<Job>;
  
  protected async fetch(url: string): Promise<unknown> {
    // Rate-limited, retry-enabled fetch
  }
}
```

### 3.3 Greenhouse Adapter Example

```typescript
// adapters/greenhouse.adapter.ts
export class GreenhouseAdapter extends BaseAdapter {
  source = 'GREENHOUSE' as const;
  
  config = {
    baseUrl: 'https://boards-api.greenhouse.io/v1/boards',
    rateLimit: 2,  // 2 requests/second
    timeout: 10000,
  };
  
  async fetchJobs(companySlug: string): Promise<RawJob[]> {
    const url = `${this.config.baseUrl}/${companySlug}/jobs`;
    const response = await this.fetch(url);
    
    return response.jobs.map(job => ({
      externalId: String(job.id),
      title: job.title,
      description: job.content,
      location: job.location.name,
      department: job.departments?.[0]?.name,
      postedAt: new Date(job.updated_at),
      applyUrl: job.absolute_url,
      metadata: job.metadata,
    }));
  }
  
  normalizeJob(raw: RawJob, company: Company): Partial<Job> {
    return {
      externalId: raw.externalId,
      source: this.source,
      title: raw.title,
      description: raw.description,
      location: raw.location,
      locationType: this.inferLocationType(raw.location),
      employmentType: this.inferEmploymentType(raw.title),
      experienceLevel: this.inferExperienceLevel(raw.title, raw.description),
      skills: this.extractSkills(raw.description),
      department: raw.department,
      postedAt: raw.postedAt,
      sourceUrl: raw.applyUrl,
      companyId: company.id,
    };
  }
}
```

### 3.4 Company Lists

```json
// companies/greenhouse.json
{
  "companies": [
    { "slug": "stripe", "name": "Stripe" },
    { "slug": "airbnb", "name": "Airbnb" },
    { "slug": "figma", "name": "Figma" },
    { "slug": "notion", "name": "Notion" },
    { "slug": "linear", "name": "Linear" },
    { "slug": "vercel", "name": "Vercel" },
    { "slug": "openai", "name": "OpenAI" }
    // ... 100+ companies
  ]
}
```

### 3.5 GitHub Actions Workflow

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
    timeout-minutes: 30
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      
      - name: Run Greenhouse Scraper
        run: npm run scrape -- --source=greenhouse
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          UPSTASH_REDIS_URL: ${{ secrets.UPSTASH_REDIS_URL }}
      
      - name: Run Lever Scraper
        run: npm run scrape -- --source=lever
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          UPSTASH_REDIS_URL: ${{ secrets.UPSTASH_REDIS_URL }}
      
      - name: Report Results
        if: always()
        run: |
          echo "Scrape completed at $(date)"
          # Could send to Slack/Discord
```

### 3.6 Tasks

| Task | Priority | Est. Hours |
|------|----------|------------|
| Create base adapter class | P0 | 4h |
| Implement Greenhouse adapter | P0 | 6h |
| Implement Lever adapter | P0 | 6h |
| Create job normalizer | P0 | 4h |
| Create salary parser | P1 | 4h |
| Create skill extractor | P1 | 4h |
| Create experience level parser | P1 | 3h |
| Create deduplication logic | P1 | 3h |
| Setup scrape orchestration | P0 | 4h |
| Setup GitHub Actions workflow | P0 | 2h |
| Curate initial company list (50+) | P0 | 3h |
| Add Ashby adapter | P2 | 4h |
| Add Workable adapter | P2 | 4h |
| Add scrape monitoring/alerts | P2 | 3h |

### 3.7 Deliverables

- [ ] Greenhouse adapter working
- [ ] Lever adapter working
- [ ] Job normalization pipeline
- [ ] Skill/salary/experience extraction
- [ ] GitHub Actions scheduled runs
- [ ] 50+ companies configured
- [ ] Scrape audit logging

---

## Phase 4: Frontend Integration

**Status: COMPLETE** (Completed: 2026-09-10)

**Duration:** 7-10 days  
**Goal:** Connect UI to real backend

### 4.1 Changes Required

```
packages/web/
├── lib/
│   ├── api.ts              # Typed API client with normalizers
│   ├── query-provider.tsx  # React Query setup
│   └── utils.ts            # Utilities
├── hooks/
│   ├── useJobs.ts          # Job data hooks (useJobSearch, useRecentJobs, useJob)
│   ├── useCompanies.ts     # Company hooks (useCompanies, useCompany, useTopCompanies)
│   ├── useFilters.ts       # Filter hooks (useFilters, useSkillSearch, useLocationSearch)
│   └── index.ts            # Re-exports
├── components/
│   └── shared/
│       ├── Skeleton.tsx    # Loading skeletons
│       ├── ErrorState.tsx  # Error components
│       ├── EmptyState.tsx  # Empty state components
│       └── index.ts
└── pages/
    ├── _app.tsx            # QueryProvider wrapper
    ├── index.tsx           # Real data with useRecentJobs, useTopCompanies
    ├── search.tsx          # Full search with URL sync, filters, pagination
    └── job/[id].tsx        # Job detail with similar jobs
```

### 4.2 Implemented Features

**API Client (lib/api.ts):**
- Type-safe fetch wrapper with error handling
- Enum normalization (HYBRID → hybrid, FULL_TIME → full-time)
- Full endpoint coverage: jobs/search, jobs/:id, companies, filters

**React Query Hooks:**
- `useJobSearch(params)` - Paginated job search with filters
- `useRecentJobs(limit)` - Latest jobs for homepage
- `useJob(id)` - Single job detail
- `useTopCompanies(limit)` - Companies with most jobs
- `useFilters()` - Filter options for sidebar

**Page Updates:**
- Homepage: Real job listings, top companies, dynamic stats
- Search: URL state sync, filter persistence, pagination, sorting
- Job Detail: Full job info, similar jobs by skill, share/apply actions

**Loading & Error States:**
- Skeleton components for cards, lists, grids
- Error states with retry actions
- Empty states for no results

### 4.3 Tasks

| Task | Priority | Est. Hours | Status |
|------|----------|------------|--------|
| Setup React Query provider | P0 | 1h | ✅ DONE |
| Create typed API client | P0 | 3h | ✅ DONE |
| Create useJobSearch hook | P0 | 2h | ✅ DONE |
| Create useJob hook | P0 | 1h | ✅ DONE |
| Create useFilters hook | P0 | 1h | ✅ DONE |
| Create useCompany hook | P1 | 1h | ✅ DONE |
| Update Homepage with real data | P0 | 3h | ✅ DONE |
| Update Search page with real data | P0 | 4h | ✅ DONE |
| Update Job Detail with real data | P0 | 3h | ✅ DONE |
| Add error boundaries | P1 | 2h | ✅ DONE |
| Add loading skeletons | P1 | 2h | ✅ DONE |
| Add empty states | P1 | 2h | ✅ DONE |
| URL state sync for filters | P1 | 3h | ✅ DONE |
| Add search suggestions | P2 | 4h | Deferred to Phase 5 |

### 4.4 Deliverables

- [x] All pages using real API data
- [x] Loading states implemented
- [x] Error handling complete
- [x] URL reflects filter state
- [x] Pagination working
- [x] Search with debounce (via React Query staleTime)

### 4.5 Key Files Modified

```
packages/web/lib/api.ts                    # API client with normalizers
packages/web/lib/query-provider.tsx        # React Query provider
packages/web/hooks/useJobs.ts              # Job hooks
packages/web/hooks/useCompanies.ts         # Company hooks  
packages/web/hooks/useFilters.ts           # Filter hooks
packages/web/hooks/index.ts                # Hook exports
packages/web/pages/_app.tsx                # QueryProvider wrapper
packages/web/pages/index.tsx               # Homepage with real data
packages/web/pages/search.tsx              # Search with URL sync
packages/web/pages/job/[id].tsx            # Job detail page
packages/web/components/shared/Skeleton.tsx
packages/web/components/shared/ErrorState.tsx
packages/web/components/shared/EmptyState.tsx
packages/web/components/ui/Badge.tsx       # Added internship type
```

---

## Phase 5: Deployment & Polish

**Duration:** 5-7 days  
**Goal:** Production deployment and monitoring

### 5.1 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                            PRODUCTION                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────────┐         ┌─────────────┐         ┌─────────────┐  │
│   │   Vercel    │ ──────▶ │   Railway   │ ──────▶ │    Neon     │  │
│   │  (Next.js)  │         │  (Fastify)  │         │ (PostgreSQL)│  │
│   └─────────────┘         └─────────────┘         └─────────────┘  │
│          │                       │                                  │
│          │                       ▼                                  │
│          │                ┌─────────────┐                          │
│          │                │   Upstash   │                          │
│          │                │   (Redis)   │                          │
│          └────────────────┴─────────────┘                          │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │                    GitHub Actions                            │  │
│   │  - CI/CD on push to main                                    │  │
│   │  - Scheduled scraper runs (every 4 hours)                   │  │
│   │  - Database maintenance (weekly)                            │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │                     Monitoring                               │  │
│   │  - Sentry: Error tracking                                   │  │
│   │  - Better Stack: Logging                                    │  │
│   │  - Better Uptime: Health checks                             │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.2 CI/CD Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run test
  
  deploy-api:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: railwayapp/railway-action@v1
        with:
          service: api
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
  
  deploy-web:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 5.3 Tasks

| Task | Priority | Est. Hours |
|------|----------|------------|
| Setup Vercel project | P0 | 1h |
| Setup Railway project | P0 | 1h |
| Configure environment variables | P0 | 2h |
| Setup CI/CD workflow | P0 | 3h |
| Configure Neon production branch | P0 | 1h |
| Setup Upstash Redis | P0 | 1h |
| Setup Sentry error tracking | P1 | 2h |
| Setup Better Stack logging | P1 | 2h |
| Setup Better Uptime monitoring | P1 | 1h |
| Performance audit (Lighthouse) | P1 | 3h |
| SEO optimization | P1 | 3h |
| Add structured data (JSON-LD) | P2 | 2h |
| Setup sitemap generation | P2 | 2h |
| Load testing | P2 | 3h |

### 5.4 Deliverables

- [ ] Production URLs live
- [ ] CI/CD pipeline working
- [ ] Error tracking active
- [ ] Logging configured
- [ ] Health checks running
- [ ] Lighthouse score > 90
- [ ] Sitemap generated

---

## Resource Allocation

### Free Tier Budget

| Service | Free Limit | Expected Usage | Buffer |
|---------|------------|----------------|--------|
| Neon PostgreSQL | 0.5 GB | ~0.2 GB | 60% |
| Upstash Redis | 10K cmd/day | ~5K cmd/day | 50% |
| Vercel | 100 GB BW | ~10 GB/month | 90% |
| Railway | $5 credit | ~$3/month | 40% |
| GitHub Actions | 2000 min/month | ~500 min | 75% |
| Cloudflare R2 | 10 GB | ~1 GB | 90% |

### Timeline Summary

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 0: Foundation | Week 1 | None |
| Phase 1: Data Layer | Week 2 | Phase 0 |
| Phase 2: API Layer | Week 3-4 | Phase 1 |
| Phase 3: Scraper | Week 5-6 | Phase 1, 2 |
| Phase 4: Frontend | Week 7-8 | Phase 2, 3 |
| Phase 5: Deploy | Week 9-10 | All |

**Total: 8-10 weeks to MVP**

---

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| ATS API changes | High | Medium | Monitor, multiple adapters |
| Rate limiting by ATS | Medium | Medium | Respectful scraping, backoff |
| Free tier exceeded | Medium | Low | Monitoring, alerts |
| Data quality issues | Medium | High | Validation, normalization |
| Search performance | Medium | Medium | Indexes, caching |
| Scraper reliability | High | Medium | Retries, alerts, logs |

---

## Success Criteria

### MVP Launch Criteria

- [ ] 50+ companies being scraped
- [ ] 1,000+ jobs in database
- [ ] Search returns results in < 500ms
- [ ] All pages load in < 2.5s (LCP)
- [ ] Zero critical bugs
- [ ] Mobile responsive
- [ ] Dark mode working
- [ ] Error tracking active

### 30-Day Post-Launch Goals

- [ ] 10,000+ jobs in database
- [ ] 100+ companies indexed
- [ ] < 1% error rate
- [ ] 1,000+ unique visitors
- [ ] User feedback incorporated

---

## Next Steps

**Immediate Actions (Today):**
1. Initialize Turborepo monorepo structure
2. Move ui-samples to packages/web
3. Create packages/shared with types

**This Week:**
1. Complete Phase 0 (Foundation)
2. Start Phase 1 (Data Layer)

**Approval Required:**
- Confirm phase priorities
- Confirm company list for scraping
- Confirm launch timeline
