# JobScout - Complete Implementation Roadmap

## Executive Summary

**Project**: JobScout - India IT Job Aggregation Platform  
**Current State**: Phases 0-4 Complete  
**Focus**: India-based tech jobs from premium companies  
**Quality Target**: Google-standard UI/UX and performance

---

## Current Metrics (September 2024)

| Metric | Value | Trend |
|--------|-------|-------|
| Total India Jobs | 871 | ↑ from 788 |
| Companies with India Presence | 33 | ↑ from 26 |
| Greenhouse Companies | 48 | ↑8 new added |
| Lever Companies | 4 | Stable |
| Ashby Companies | 17 | Stable |
| Total Companies Monitored | 69 | ↑ |

### Top Companies by India Job Count
| Company | India Jobs | Platform |
|---------|-----------|----------|
| Paytm | 177 | Lever |
| Okta | 102 | Greenhouse |
| MongoDB | 61 | Greenhouse |
| Zscaler | 62 | Greenhouse |
| Databricks | 51 | Greenhouse |
| Meesho | 46 | Lever |
| GitLab | 41 | Greenhouse |
| Stripe | 40 | Greenhouse |
| Rubrik | 35 | Greenhouse ✨ NEW |
| PubMatic | 32 | Greenhouse ✨ NEW |
| Zenoti | 25 | Greenhouse ✨ NEW |

---

## Technical Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           JobScout Architecture                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                  │
│  │ Greenhouse  │    │   Lever     │    │   Ashby     │                  │
│  │   48 cos    │    │   4 cos     │    │   17 cos    │                  │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘                  │
│         │                  │                  │                          │
│         └──────────────────┼──────────────────┘                          │
│                            ▼                                             │
│                 ┌──────────────────────┐                                 │
│                 │   Scraper Service    │                                 │
│                 │  (Normalizes data)   │                                 │
│                 └──────────┬───────────┘                                 │
│                            │                                             │
│                            ▼                                             │
│                 ┌──────────────────────┐                                 │
│                 │  Neon PostgreSQL     │                                 │
│                 │  (871 India jobs)    │                                 │
│                 └──────────┬───────────┘                                 │
│                            │                                             │
│                            ▼                                             │
│                 ┌──────────────────────┐                                 │
│                 │    Fastify API       │                                 │
│                 │  (Caching enabled)   │                                 │
│                 └──────────┬───────────┘                                 │
│                            │                                             │
│                            ▼                                             │
│                 ┌──────────────────────┐                                 │
│                 │   Next.js Frontend   │                                 │
│                 │   (React Query)      │                                 │
│                 └──────────────────────┘                                 │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Completed Phases (0-4)

### Phase 0: Foundation ✅
- Turborepo monorepo structure
- Shared TypeScript types
- Development environment

### Phase 1: Data Layer ✅
- Prisma schema with full-text search
- Neon PostgreSQL database
- India location filter

### Phase 2: API Layer ✅
- Fastify REST API
- In-memory caching
- Search endpoints with filters

### Phase 3: Scraper Framework ✅
- Greenhouse adapter (48 companies)
- Lever adapter (4 companies)
- Ashby adapter (17 companies)
- Bulk scraping script

### Phase 4: Frontend Integration ✅
- React Query data fetching
- Real API integration
- URL-synced filters
- Loading/error states
- ClientOnly hydration fix

---

## Phase 5: Production Readiness

**Status**: In Progress  
**Target**: Deploy production-ready application

### 5.1 Frontend Polish

| Task | Priority | Status |
|------|----------|--------|
| Fix P0 a11y issues (aria-labels) | P0 | ✅ Done |
| Fix mobile viewport (dvh) | P0 | ✅ Done |
| Remove duplicate tailwind config | P2 | ✅ Done |
| Fix arbitrary pixel values | P2 | ✅ Done |
| Implement bookmark feature | P1 | Pending |
| Add error boundaries | P1 | Pending |
| Run Lighthouse audit | P1 | Pending |
| Optimize images with next/image | P1 | Pending |
| Add ESLint configuration | P2 | Pending |
| Decompose large page files | P2 | Pending |

### 5.2 Deployment

| Task | Platform | Status |
|------|----------|--------|
| Frontend deployment | Vercel | Pending |
| API deployment | Railway/Render | Pending |
| Database | Neon (already set up) | ✅ Done |
| Environment variables | Configured | Pending |
| Custom domain | DNS setup | Pending |

### 5.3 Operations

| Task | Tool | Status |
|------|------|--------|
| Scheduled scraping | Cron job | Pending |
| Error monitoring | Sentry | Pending |
| Analytics | Vercel Analytics | Pending |
| Uptime monitoring | UptimeRobot | Pending |

---

## Phase 6: Growth (Future)

### 6.1 Data Expansion
- [ ] Add more Greenhouse companies (ongoing discovery)
- [ ] Monitor Lever for new companies
- [ ] Track Ashby adoption in India
- [ ] Consider Workable if Indian companies adopt

### 6.2 Feature Enhancements
- [ ] Email job alerts
- [ ] Advanced search (boolean operators)
- [ ] Salary estimation
- [ ] Application tracking
- [ ] Resume upload & parsing

### 6.3 Platform Expansion (Not Recommended)
Based on research, these are NOT recommended:

| Platform | Reason | Decision |
|----------|--------|----------|
| Freshteam | Requires authentication | ❌ Skip |
| Keka | No public API | ❌ Skip |
| Darwinbox | No public API | ❌ Skip |
| Zoho Recruit | Custom portal only | ❌ Skip |
| Custom portals | Legal/maintenance concerns | ❌ Skip |

---

## Documentation Reference

### Created Documents

| Document | Purpose |
|----------|---------|
| `docs/INDIA_COMPANIES_DATABASE.md` | 200+ Indian IT companies by city |
| `docs/PLATFORM_ANALYSIS.md` | ATS platform research findings |
| `docs/ATS_ADAPTER_ARCHITECTURE.md` | Adapter design decisions |
| `docs/FRONTEND_AUDIT.md` | P0/P1/P2 issues and fixes |
| `docs/IMPLEMENTATION_ROADMAP.md` | This document |

### Key Files

| File | Purpose |
|------|---------|
| `packages/scraper/companies/greenhouse.json` | 48 Greenhouse companies |
| `packages/scraper/companies/lever.json` | 4 Lever companies |
| `packages/scraper/companies/ashby.json` | 17 Ashby companies |
| `packages/shared/src/db/repositories/job.ts` | India location filter |
| `packages/api/src/routes/jobs/index.ts` | Default India filter |

---

## Cost Analysis (Free Tier)

| Service | Plan | Monthly Cost | Limit |
|---------|------|--------------|-------|
| Neon | Free | $0 | 3GB storage |
| Vercel | Hobby | $0 | 100GB bandwidth |
| Railway/Render | Free | $0 | 500 hours |
| GitHub | Free | $0 | Unlimited |
| Sentry | Free | $0 | 5K events |
| **TOTAL** | | **$0** | |

---

## Risk Assessment

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| ATS API changes | Medium | High | Version pinning, monitoring |
| Database limits | Low | Medium | Neon scale or Supabase |
| Rate limiting | Medium | Medium | Respectful scraping, caching |
| Hydration issues | Low | Low | ClientOnly wrapper (done) |

### Business Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| ToS violations | Low | High | Only use public APIs |
| Data freshness | Medium | Medium | Regular scraping schedule |
| Competition | Medium | Low | Focus on UX quality |

---

## Timeline

### Week 1 (Current)
- [x] Company research complete
- [x] Platform analysis complete
- [x] ATS architecture documented
- [x] Frontend audit complete
- [x] Safe auto-fixes applied
- [ ] Lighthouse audit
- [ ] Performance optimization

### Week 2
- [ ] Deploy frontend to Vercel
- [ ] Deploy API to Railway
- [ ] Set up CI/CD pipeline
- [ ] Configure monitoring

### Week 3
- [ ] Set up scheduled scraping
- [ ] Add error tracking
- [ ] Performance tuning
- [ ] Beta testing

### Week 4+
- [ ] Public launch
- [ ] Marketing & growth
- [ ] Feature iteration
- [ ] User feedback integration

---

## Success Metrics

### Launch Criteria (MVP)
- [ ] 500+ India jobs displayed
- [ ] Search response time < 500ms
- [ ] Lighthouse Performance score > 90
- [ ] Lighthouse Accessibility score > 95
- [ ] Zero critical errors in 24h
- [ ] Mobile responsive (tested on 3+ devices)

### Growth Targets (Month 1)
- [ ] 1000+ unique visitors
- [ ] 100+ job applications clicked
- [ ] 5+ companies added
- [ ] < 1% error rate

---

## Next Actions

1. **Immediate**: Run Lighthouse audit on localhost
2. **Today**: Implement error boundaries
3. **This Week**: Deploy to Vercel (frontend) and Railway (API)
4. **Next Week**: Set up scraping cron job and monitoring

---

## Appendix: Commands Reference

```bash
# Development
npm run dev                    # Start all services
npm run build                  # Build all packages

# Scraping
cd packages/scraper
npm run scrape:greenhouse -- --company="stripe"
npm run scrape:lever -- --company="paytm"

# Database
npx prisma studio             # Database GUI
npx prisma db push            # Sync schema

# Testing
npm run typecheck             # TypeScript check
npm run lint                  # Linting

# Deployment (TBD)
vercel                        # Deploy frontend
railway up                    # Deploy API
```

---

*Last Updated: September 2024*
*Author: JobScout Engineering*
