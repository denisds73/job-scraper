# Product Context: JobScout - Comprehensive Product Understanding

This document provides complete product context for JobScout. Every feature, design decision, and technical choice serves the product vision described here.

---

## Product Vision

### One-Liner
JobScout aggregates IT jobs from company career pages, making job search faster and more comprehensive than any single job board.

### Problem Statement

**For Job Seekers:**
- Job boards (LinkedIn, Indeed) are cluttered with recruiter spam and duplicate postings
- Interesting companies post jobs only on their career pages (Greenhouse, Lever, Ashby)
- Checking dozens of company career pages daily is exhausting
- Salary transparency varies; many listings hide compensation
- Filtering options on most job boards are inadequate

**For the Market:**
- No single source aggregates direct company postings
- Premium job boards charge companies, creating incentive misalignment
- Search engines index job pages poorly
- RSS feeds from ATS systems exist but are underutilized

### Solution

JobScout scrapes public job APIs from Applicant Tracking Systems (Greenhouse, Lever, Ashby, Workable, etc.), normalizes the data, and presents it in a clean, searchable interface with:

- Direct links to company career pages (no intermediary)
- Standardized salary information when available
- Powerful filtering (role type, experience level, remote, tech stack)
- No recruiter spam, no duplicates, no middlemen

### Why This Exists

Google has Google Jobs. LinkedIn has its job board. Indeed aggregates from everywhere.

JobScout is different:
1. **Direct source**: We scrape company ATS APIs, not job boards
2. **No middlemen**: Every link goes to the company's actual application
3. **Transparent**: Open about data sources, scraping methods, freshness
4. **Developer-focused**: Filters for tech stack, languages, frameworks
5. **Zero cost**: Forever free, no premium tier, no "apply with one click" lock-in

---

## Target Users

### Primary Persona: The Active Job Seeker

**Demographics:**
- Software engineers, designers, PMs in tech
- 2-15 years experience
- Currently employed but looking
- Location: Remote-first or major tech hubs (SF, NYC, Austin, Seattle, etc.)

**Behaviors:**
- Checks job listings 2-3 times per week
- Has a list of "dream companies" to work for
- Frustrated with recruiter outreach on LinkedIn
- Values salary transparency
- Prefers applying directly to companies

**Pain Points:**
- "I want to see jobs from companies I respect, not recruiters"
- "Indeed/LinkedIn show me the same irrelevant jobs every day"
- "I want to filter by tech stack (React, Python, etc.)"
- "Most job posts don't show salary until the interview"

**Jobs to Be Done:**
1. Find relevant open positions at interesting companies
2. Compare compensation across similar roles
3. Track which jobs I've already viewed/applied to
4. Stay updated on new postings without daily manual checks

### Secondary Persona: The Passive Browser

**Demographics:**
- Happily employed but market-curious
- Checks job market quarterly
- Wants to know their market value

**Behaviors:**
- Browses casually, rarely applies
- Interested in salary data
- Shares interesting jobs with friends/network

**Jobs to Be Done:**
1. Understand current market conditions
2. Benchmark my compensation
3. Spot interesting opportunities worth exploring

---

## Core Features

### 1. Job Search & Discovery

**Search:**
- Full-text search across job titles, descriptions, requirements
- Search suggestions based on popular queries
- Recent searches saved locally

**Filters:**
| Filter | Options | Priority |
|--------|---------|----------|
| Job Type | Full-time, Part-time, Contract, Internship | P0 |
| Experience Level | Entry, Mid, Senior, Staff, Principal | P0 |
| Remote | On-site, Remote, Hybrid | P0 |
| Location | City/region with radius | P0 |
| Salary Range | Min/max with currency | P0 |
| Posted Date | 24h, 7d, 30d, Any | P1 |
| Company Size | Startup, Mid, Enterprise | P1 |
| Tech Stack | Languages, frameworks, tools | P1 |
| Industry | FinTech, HealthTech, AI/ML, etc. | P2 |

**Sorting:**
- Relevance (default for search)
- Date posted (newest first)
- Salary (highest first)
- Company name (A-Z)

### 2. Job Detail View

**Information Displayed:**
- Job title and company
- Location (with remote badge if applicable)
- Salary range (when available, estimated if not)
- Posted date and source
- Full job description
- Requirements (parsed into bullet points when possible)
- Benefits highlights
- Company overview (size, industry, founded, HQ)
- Apply button (direct link to company ATS)

**Related Content:**
- Other jobs at same company
- Similar jobs at other companies
- Company rating/review links (Glassdoor, Blind)

### 3. Company Profiles

**Information:**
- Company name, logo, description
- Industry, size, founded year
- Headquarters location
- Career page link
- Current open positions count
- Tech stack (if detectable)

**Why Companies (not just jobs):**
- Users often follow companies, not just jobs
- Enables "jobs at companies like X" discovery
- Provides context for compensation comparisons

### 4. Saved Jobs & History

**Saved Jobs:**
- Bookmark jobs for later
- Stored locally (localStorage) for MVP
- Future: Account-based sync

**Browsing History:**
- Recently viewed jobs
- Search history
- Clear history option

### 5. Notifications (Future)

**Job Alerts:**
- Save search as alert
- Email/browser notification when new matches
- Configurable frequency (immediate, daily, weekly)

---

## User Journeys

### Journey 1: Search for Jobs

```
1. User lands on homepage
2. Enters search query (e.g., "senior frontend engineer")
3. Optionally applies filters (remote, salary > $150K)
4. Scans job cards in results
5. Clicks interesting job to view details
6. Clicks "Apply" → redirected to company ATS
```

**Metrics:**
- Search → Result Click rate
- Result Click → Apply Click rate
- Time to first meaningful result

### Journey 2: Browse by Company

```
1. User searches for company name (e.g., "Stripe")
2. Lands on company profile page
3. Views all open positions at Stripe
4. Filters by role type or department
5. Clicks job → views detail → applies
```

### Journey 3: Discover New Opportunities

```
1. User visits homepage
2. Browses "Recently Posted" or "Featured" jobs
3. Sees interesting company they didn't know
4. Explores company profile
5. Saves a few jobs for later review
```

### Journey 4: Research Salary

```
1. User searches for their current role
2. Filters by their location and experience level
3. Reviews salary ranges across listings
4. Compares to their current compensation
5. Shares findings with colleagues
```

---

## Data Model

### Core Entities

```
Job
├── id: string (CUID)
├── externalId: string (ATS job ID)
├── source: enum (greenhouse, lever, ashby, ...)
├── sourceUrl: string (direct ATS URL)
├── title: string
├── description: string (HTML or Markdown)
├── requirements: string[]
├── benefits: string[]
├── location: string
├── isRemote: boolean
├── jobType: enum (full-time, part-time, contract, internship)
├── experienceLevel: enum (entry, mid, senior, staff, principal)
├── salary: { min?, max?, currency, period }
├── department: string
├── postedAt: datetime
├── scrapedAt: datetime
├── companyId: FK → Company
└── techStack: string[] (parsed/inferred)

Company
├── id: string (CUID)
├── name: string
├── slug: string (URL-friendly)
├── logo: string (URL or R2 path)
├── description: string
├── website: string
├── careerPageUrl: string
├── industry: string
├── size: enum (1-10, 11-50, 51-200, ...)
├── foundedYear: number
├── headquarters: string
└── atsType: enum (greenhouse, lever, ...)

Scrape
├── id: string
├── source: enum
├── startedAt: datetime
├── completedAt: datetime
├── status: enum (running, success, failed)
├── jobsFound: number
├── jobsCreated: number
├── jobsUpdated: number
├── errors: json[]
└── companyId?: FK → Company
```

### Data Relationships

```
Company 1 ←→ N Job
Job N ←→ N TechTag (many-to-many via join table)
```

---

## Data Sources

### Supported ATS Systems

| ATS | API Type | Coverage | Priority |
|-----|----------|----------|----------|
| Greenhouse | Public API + RSS | ~3,000 companies | P0 |
| Lever | Public API | ~2,500 companies | P0 |
| Ashby | Public API | ~500 companies | P0 |
| Workable | Public API | ~2,000 companies | P1 |
| SmartRecruiters | Public API | ~1,500 companies | P1 |
| BambooHR | Public API | ~1,000 companies | P2 |
| Recruitee | Public API | ~800 companies | P2 |

### Scraping Strategy

**Frequency:**
- Major ATS (Greenhouse, Lever, Ashby): Every 4 hours
- Secondary ATS: Every 12 hours
- New companies discovered: Weekly full crawl

**Deduplication:**
- External ID + Source = unique job
- Title + Company + Location = potential duplicate across sources
- Similarity threshold for description matching

**Freshness:**
- Mark jobs as "stale" after 60 days without re-scrape
- Remove jobs not found in 2 consecutive scrapes
- Display "last verified" timestamp

### Data Quality

**Normalization:**
- Experience level: Infer from title/requirements if not explicit
- Salary: Normalize to annual USD for comparison
- Location: Parse into city, state, country
- Tech stack: Extract from description using NLP/regex

**Validation:**
- Required fields: title, company, source, sourceUrl
- Description minimum: 100 characters
- Reject obvious spam patterns

---

## Competitive Analysis

### Direct Competitors

| Product | Strengths | Weaknesses | Differentiation |
|---------|-----------|------------|-----------------|
| LinkedIn Jobs | Network effects, dominant | Recruiter spam, pay-to-play | Direct sources only |
| Indeed | Scale, aggregation | Cluttered, outdated | Cleaner UX, tech focus |
| AngelList | Startup focus, equity info | Only startups | Broader company coverage |
| Otta | Curated, good UX | UK-focused, closed platform | Open, transparent |
| Wellfound | Startup equity | Limited to startups | Tech focus, salary |

### Indirect Competitors

| Product | Overlap | Differentiation |
|---------|---------|-----------------|
| Google Jobs | Search aggregation | Direct ATS scraping |
| Glassdoor | Reviews, salaries | Job-centric, not review-centric |
| Levels.fyi | Compensation data | Job discovery focus |
| Blind | Community discussion | Not social, pure utility |

### Our Advantages

1. **Data quality**: Direct from source, not scraped from job boards
2. **Transparency**: Open about methods, no hidden algorithms
3. **Tech focus**: Filters and features developers actually want
4. **No lock-in**: Always links to company directly
5. **Free forever**: No premium tier, no paywall

---

## Success Metrics

### North Star Metric
**Successful Job Applications**: Number of users who click "Apply" and complete an application on the company site.

(Hard to measure without company cooperation, so proxy metrics below.)

### Proxy Metrics

**Engagement:**
- Daily Active Users (DAU)
- Searches per session
- Job details viewed per session
- Apply button click rate

**Quality:**
- Search-to-click rate (relevance)
- Return visitor rate (value delivered)
- Time to first apply click (efficiency)

**Growth:**
- New users per week
- Organic traffic growth
- Referral rate

**Data:**
- Jobs in database (freshness < 7 days)
- Companies covered
- Scrape success rate

---

## Constraints & Requirements

### Hard Constraints

1. **Zero cost**: All infrastructure must fit in free tiers
2. **Legal**: Only scrape public APIs, respect robots.txt
3. **Performance**: LCP < 2.5s, TTI < 4s
4. **Accessibility**: WCAG AA minimum

### Design Requirements

1. **No emojis**: Use Lucide icons exclusively
2. **Design tokens**: Use locked v1.0 system only
3. **Mobile-first**: Responsive, touch-friendly
4. **Dark mode**: Required, user-preference respected

### Technical Requirements

1. **Type safety**: TypeScript strict mode
2. **Testing**: Core paths must have tests
3. **Monitoring**: Errors tracked, health checks
4. **Documentation**: All APIs documented

---

## Roadmap

### Phase 1: MVP (Current)
- [x] Design system locked
- [x] UI components built
- [ ] Scraper framework (Greenhouse, Lever)
- [ ] Database schema (Prisma + Neon)
- [ ] API endpoints (search, detail, filters)
- [ ] Frontend connected to real data
- [ ] Deploy to production

### Phase 2: Quality
- [ ] Additional ATS adapters (Ashby, Workable)
- [ ] Improved search relevance
- [ ] Salary normalization
- [ ] Tech stack parsing
- [ ] Performance optimization

### Phase 3: Features
- [ ] Saved jobs (local storage)
- [ ] Search history
- [ ] Company profiles
- [ ] Similar jobs recommendations
- [ ] Share functionality

### Phase 4: Growth
- [ ] Job alerts (email)
- [ ] User accounts (optional)
- [ ] API for developers
- [ ] Browser extension
- [ ] Mobile app (PWA)

---

## Glossary

| Term | Definition |
|------|------------|
| ATS | Applicant Tracking System - software companies use to manage hiring (Greenhouse, Lever, etc.) |
| Scraper | Automated process that fetches job data from ATS APIs |
| Adapter | Code module that knows how to talk to a specific ATS |
| Normalization | Converting diverse job data into our standard format |
| Deduplication | Detecting and merging duplicate job postings |
| Freshness | How recently a job listing was verified as active |
| Direct link | URL that goes to the company's actual application page |

---

## Summary

JobScout exists to make job searching less painful for tech professionals. We do this by:

1. **Going to the source**: Scraping company ATS systems directly
2. **Respecting users**: No spam, no middlemen, no dark patterns
3. **Building for developers**: Features tech people actually want
4. **Staying free**: Sustainable through minimal infrastructure costs

Every feature, design choice, and technical decision should serve these goals.
