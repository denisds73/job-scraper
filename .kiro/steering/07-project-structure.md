# Project Structure: Codebase Organization

This document defines how the JobScout codebase is organized. Consistent structure enables fast navigation, clear ownership, and predictable patterns.

---

## Repository Layout

```
job-scraper/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # Build, lint, test on PR
│   │   ├── deploy.yml          # Deploy to production
│   │   └── scrape.yml          # Scheduled scraper jobs
│   └── PULL_REQUEST_TEMPLATE.md
│
├── .kiro/
│   └── steering/               # Agent context (this directory)
│       ├── 01-core-identity.md
│       ├── 02-ui-ux-standards.md
│       └── ...
│
├── docs/
│   ├── DESIGN_SYSTEM_v1.md     # Locked design tokens
│   ├── public-job-apis.txt     # Data source reference
│   └── tech-stack.txt          # Infrastructure decisions
│
├── packages/
│   ├── web/                    # Next.js frontend
│   ├── api/                    # Fastify backend
│   ├── scraper/                # Job scraping service
│   └── shared/                 # Shared types and utilities
│
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── migrations/             # Migration history
│   └── seed.ts                 # Development seed data
│
├── scripts/
│   ├── setup.sh                # Initial project setup
│   ├── db-reset.sh             # Reset local database
│   └── deploy.sh               # Manual deployment helper
│
├── .env.example                # Environment template
├── .eslintrc.js               # ESLint configuration
├── .prettierrc                # Prettier configuration
├── package.json               # Root package.json (workspaces)
├── tsconfig.json              # Base TypeScript config
├── turbo.json                 # Turborepo configuration
└── README.md
```

---

## Package Structure

### packages/web (Next.js Frontend)

```
packages/web/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── (main)/            # Main layout group
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── search/
│   │   │   │   └── page.tsx   # Search results
│   │   │   └── job/
│   │   │       └── [id]/
│   │   │           └── page.tsx  # Job detail
│   │   ├── company/
│   │   │   └── [slug]/
│   │   │       └── page.tsx   # Company profile
│   │   ├── layout.tsx         # Root layout
│   │   ├── error.tsx          # Error boundary
│   │   ├── loading.tsx        # Loading state
│   │   └── not-found.tsx      # 404 page
│   │
│   ├── components/
│   │   ├── ui/                # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── index.ts       # Barrel export
│   │   │
│   │   ├── layout/            # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── jobs/              # Job-related components
│   │   │   ├── JobCard.tsx
│   │   │   ├── JobList.tsx
│   │   │   ├── JobDetail.tsx
│   │   │   ├── JobFilters.tsx
│   │   │   ├── JobCardSkeleton.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── company/           # Company-related components
│   │   │   ├── CompanyCard.tsx
│   │   │   ├── CompanyProfile.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── search/            # Search components
│   │       ├── SearchInput.tsx
│   │       ├── SearchResults.tsx
│   │       ├── SearchSuggestions.tsx
│   │       └── index.ts
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useJobs.ts
│   │   ├── useSearch.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   └── index.ts
│   │
│   ├── lib/                   # Library code
│   │   ├── api.ts             # API client
│   │   ├── utils.ts           # General utilities
│   │   ├── cn.ts              # Classname utility
│   │   └── constants.ts       # App constants
│   │
│   ├── styles/
│   │   └── globals.css        # Global styles + Tailwind
│   │
│   └── types/                 # Frontend-specific types
│       └── index.ts
│
├── public/
│   ├── favicon.ico
│   ├── og-image.png
│   └── robots.txt
│
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

### packages/api (Fastify Backend)

```
packages/api/
├── src/
│   ├── routes/
│   │   ├── jobs/
│   │   │   ├── index.ts       # Route registration
│   │   │   ├── list.ts        # GET /jobs
│   │   │   ├── get.ts         # GET /jobs/:id
│   │   │   ├── search.ts      # GET /jobs/search
│   │   │   └── schema.ts      # Request/response schemas
│   │   │
│   │   ├── companies/
│   │   │   ├── index.ts
│   │   │   ├── list.ts        # GET /companies
│   │   │   ├── get.ts         # GET /companies/:slug
│   │   │   └── schema.ts
│   │   │
│   │   ├── filters/
│   │   │   └── index.ts       # GET /filters
│   │   │
│   │   └── health/
│   │       └── index.ts       # GET /health
│   │
│   ├── services/              # Business logic
│   │   ├── job.service.ts
│   │   ├── company.service.ts
│   │   ├── search.service.ts
│   │   └── cache.service.ts
│   │
│   ├── repositories/          # Data access
│   │   ├── job.repository.ts
│   │   ├── company.repository.ts
│   │   └── base.repository.ts
│   │
│   ├── middleware/
│   │   ├── auth.ts            # Authentication (future)
│   │   ├── rateLimit.ts       # Rate limiting
│   │   ├── cors.ts            # CORS configuration
│   │   └── errorHandler.ts    # Global error handler
│   │
│   ├── plugins/
│   │   ├── prisma.ts          # Prisma client plugin
│   │   ├── redis.ts           # Redis client plugin
│   │   └── swagger.ts         # API documentation
│   │
│   ├── utils/
│   │   ├── errors.ts          # Custom error classes
│   │   ├── pagination.ts      # Pagination helpers
│   │   └── validation.ts      # Validation utilities
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   └── server.ts              # Fastify app entry point
│
├── tsconfig.json
└── package.json
```

### packages/scraper (Job Scraping Service)

```
packages/scraper/
├── src/
│   ├── adapters/              # ATS-specific scrapers
│   │   ├── base.adapter.ts    # Abstract base class
│   │   ├── greenhouse.adapter.ts
│   │   ├── lever.adapter.ts
│   │   ├── ashby.adapter.ts
│   │   ├── workable.adapter.ts
│   │   └── index.ts
│   │
│   ├── processors/            # Data transformation
│   │   ├── normalizer.ts      # Normalize job data
│   │   ├── salary-parser.ts   # Extract salary info
│   │   ├── tech-extractor.ts  # Detect tech stack
│   │   └── deduplicator.ts    # Find duplicates
│   │
│   ├── schedulers/
│   │   ├── cron.ts            # Cron job definitions
│   │   └── queue.ts           # Job queue (if needed)
│   │
│   ├── services/
│   │   ├── scrape.service.ts  # Orchestrates scraping
│   │   ├── company.service.ts # Company discovery
│   │   └── metrics.service.ts # Scraping metrics
│   │
│   ├── utils/
│   │   ├── http.ts            # HTTP client with retry
│   │   ├── rate-limiter.ts    # Respectful scraping
│   │   └── logger.ts          # Structured logging
│   │
│   ├── types/
│   │   ├── raw-job.ts         # Raw job from ATS
│   │   ├── adapter.ts         # Adapter interface
│   │   └── index.ts
│   │
│   └── main.ts                # Entry point
│
├── companies/                 # Company lists to scrape
│   ├── greenhouse.json
│   ├── lever.json
│   └── ashby.json
│
├── tsconfig.json
└── package.json
```

### packages/shared (Shared Code)

```
packages/shared/
├── src/
│   ├── types/                 # Shared TypeScript types
│   │   ├── job.ts
│   │   ├── company.ts
│   │   ├── filters.ts
│   │   ├── api.ts             # API request/response types
│   │   └── index.ts
│   │
│   ├── constants/             # Shared constants
│   │   ├── job-types.ts
│   │   ├── experience-levels.ts
│   │   ├── ats-types.ts
│   │   └── index.ts
│   │
│   ├── utils/                 # Shared utilities
│   │   ├── format-salary.ts
│   │   ├── format-date.ts
│   │   ├── slugify.ts
│   │   └── index.ts
│   │
│   └── validation/            # Shared schemas
│       ├── job.schema.ts
│       ├── filters.schema.ts
│       └── index.ts
│
├── tsconfig.json
└── package.json
```

---

## Naming Conventions

### Files

| Type | Pattern | Example |
|------|---------|---------|
| Component | PascalCase | `JobCard.tsx` |
| Hook | camelCase with use prefix | `useJobs.ts` |
| Utility | camelCase | `formatSalary.ts` |
| Type | PascalCase | `Job.ts` |
| Schema | kebab-case with .schema | `job.schema.ts` |
| Route | kebab-case | `list.ts`, `get-by-id.ts` |
| Test | Same as source + .test | `JobCard.test.tsx` |
| Config | kebab-case | `tailwind.config.js` |

### Directories

| Type | Pattern | Example |
|------|---------|---------|
| Feature | lowercase | `jobs/`, `search/` |
| Component type | lowercase | `ui/`, `layout/` |
| Route group | (parentheses) | `(main)/` |
| Dynamic route | [brackets] | `[id]/`, `[slug]/` |

---

## Import Aliases

```typescript
// tsconfig.json path aliases
{
  "paths": {
    "@/*": ["./src/*"],
    "@shared/*": ["../../packages/shared/src/*"]
  }
}

// Usage
import { Button } from '@/components/ui';
import { Job } from '@shared/types';
import { formatSalary } from '@shared/utils';
```

---

## Module Boundaries

### What Goes Where

**packages/web:**
- React components
- Next.js pages and layouts
- Frontend hooks and utilities
- Client-side state management
- Styling (Tailwind)

**packages/api:**
- HTTP routes and handlers
- Business logic services
- Database queries
- Caching logic
- API documentation

**packages/scraper:**
- ATS adapters
- Data normalization
- Scheduling logic
- Company discovery
- Scraping utilities

**packages/shared:**
- TypeScript types used by multiple packages
- Constants (enums, options)
- Pure utility functions
- Validation schemas (Zod)

### Dependency Rules

```
web → shared
web → (calls api via HTTP)

api → shared
api → prisma

scraper → shared
scraper → prisma

shared → (no dependencies on other packages)
```

---

## Key Files Reference

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` (root) | Workspace configuration, scripts |
| `turbo.json` | Build pipeline, caching |
| `tsconfig.json` (root) | Base TypeScript config |
| `.env.example` | Environment variable template |
| `.eslintrc.js` | Linting rules |
| `.prettierrc` | Code formatting |
| `.gitignore` | Git ignore patterns |

### Database

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Database schema |
| `prisma/migrations/` | Migration history |
| `prisma/seed.ts` | Development data |

### CI/CD

| File | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | PR checks |
| `.github/workflows/deploy.yml` | Production deployment |
| `.github/workflows/scrape.yml` | Scheduled scraping |

### Documentation

| File | Purpose |
|------|---------|
| `docs/DESIGN_SYSTEM_v1.md` | Locked design tokens |
| `README.md` | Project overview |
| `.kiro/steering/*.md` | Agent context |

---

## Creating New Components

When creating a new component, follow this structure:

```
components/
└── NewComponent/
    ├── NewComponent.tsx     # Main component
    ├── NewComponent.test.tsx # Tests
    ├── types.ts             # Types (if complex)
    ├── utils.ts             # Component-specific utils
    └── index.ts             # Public export
```

**index.ts pattern:**
```typescript
// Export the component as default and named
export { NewComponent } from './NewComponent';
export type { NewComponentProps } from './types';
```

---

## Creating New API Routes

When adding a new route:

```
routes/
└── resource/
    ├── index.ts         # Route registration
    ├── list.ts          # GET /resource
    ├── get.ts           # GET /resource/:id
    ├── create.ts        # POST /resource
    ├── update.ts        # PUT /resource/:id
    ├── delete.ts        # DELETE /resource/:id
    └── schema.ts        # Validation schemas
```

**Route registration pattern:**
```typescript
// routes/resource/index.ts
import { FastifyInstance } from 'fastify';
import { list } from './list';
import { get } from './get';

export async function resourceRoutes(app: FastifyInstance) {
  app.get('/', list);
  app.get('/:id', get);
}
```

---

## Where to Put Things

| I want to add... | Put it in... |
|------------------|--------------|
| New page | `packages/web/src/app/` |
| UI component | `packages/web/src/components/ui/` |
| Feature component | `packages/web/src/components/[feature]/` |
| Custom hook | `packages/web/src/hooks/` |
| API endpoint | `packages/api/src/routes/` |
| Business logic | `packages/api/src/services/` |
| Database query | `packages/api/src/repositories/` |
| New scraper | `packages/scraper/src/adapters/` |
| Shared type | `packages/shared/src/types/` |
| Shared utility | `packages/shared/src/utils/` |
| Database change | `prisma/schema.prisma` + migration |
| Environment var | `.env.example` + docs |
| GitHub Action | `.github/workflows/` |

---

## Summary

Project structure principles:

1. **Monorepo**: Turborepo manages multiple packages
2. **Separation**: web, api, scraper are independent
3. **Shared code**: Common types/utils in shared package
4. **Colocation**: Related files stay together
5. **Consistency**: Same patterns everywhere
6. **Discoverability**: Clear naming, logical organization

When in doubt, follow existing patterns.
