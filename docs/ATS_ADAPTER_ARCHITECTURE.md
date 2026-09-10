# ATS Adapter Architecture

## Executive Summary

After thorough research, **we recommend NOT building new adapters for Indian ATS platforms** (Freshteam, Keka, Darwinbox, Zoho Recruit). These platforms require authentication and don't provide public APIs for job board access.

Instead, we should focus on:
1. Expanding Greenhouse coverage (highest ROI)
2. Adding more Lever companies if discovered
3. Monitoring Ashby for Indian startups

---

## Research Findings

### Indian ATS Platforms Analysis

| Platform | Companies Using | API Status | Integration Effort |
|----------|----------------|------------|-------------------|
| Freshteam | Freshworks, SurveySparrow, Kissflow | **401 Unauthorized** | Not feasible |
| Keka | 10+ mid-size Indian companies | **No public API** | Not feasible |
| Darwinbox | Swiggy, Dunzo, etc. | **No public API** | Not feasible |
| Zoho Recruit | Zoho | **Custom portal only** | Not feasible |

### Why These Platforms Don't Work

#### Freshteam (by Freshworks)
```
Tested: https://surveysparrow.freshteam.com/api/jobs
Result: 401 Unauthorized

Tested: https://freshworks.freshteam.com/jobs  
Result: 503 Service Unavailable
```

Freshteam is an HRMS product, not a job board platform. Their API documentation is only for authenticated HR users, not public job aggregators.

#### Keka
- Enterprise HRMS for Indian companies
- Career pages are company-specific subdomains
- No documented public API
- Would require HTML scraping with headless browser

#### Darwinbox
- Used by Swiggy (500+ roles), Dunzo, and others
- Enterprise HRMS platform
- Custom career portals per company
- No public API access

#### Zoho Recruit
- Zoho uses their own custom career portal
- https://careers.zohocorp.com/ is not using Zoho Recruit's embed
- Zoho Recruit API is for ATS users, not job aggregators

---

## Recommended Architecture

### Current Architecture (Keep As-Is)

```
packages/scraper/
├── src/
│   ├── adapters/
│   │   ├── base.ts          # Base adapter interface
│   │   ├── greenhouse.ts    # ✅ Working - 48 companies
│   │   ├── lever.ts         # ✅ Working - 4 companies  
│   │   ├── ashby.ts         # ✅ Working - 17 companies
│   │   └── index.ts         # Adapter registry
│   ├── scraper.ts           # Main scraper logic
│   └── main.ts              # CLI entry point
├── companies/
│   ├── greenhouse.json      # Company configs
│   ├── lever.json
│   └── ashby.json
└── bulk-scrape.ts           # Parallel scraping
```

### Adapter Interface (No Changes Needed)

```typescript
// packages/scraper/src/adapters/base.ts
export interface AtsAdapter {
  name: string;
  fetchJobs(companySlug: string): Promise<RawJob[]>;
  normalizeJob(rawJob: unknown, company: Company): NormalizedJob;
  validateConfig(config: CompanyConfig): boolean;
}
```

### Adding New Companies (Current Workflow)

1. Research company → Verify they use Greenhouse/Lever/Ashby
2. Add to `companies/{platform}.json`
3. Run `npm run scrape:{platform} -- --company="{slug}"`
4. Verify India jobs were added

---

## Future Extensibility

### If We Later Need Custom Portal Scraping

**Only implement if:**
1. Business requires specific high-value company (e.g., Flipkart, Razorpay)
2. Legal approval obtained for scraping
3. Company explicitly allows or has terms permitting aggregation

**Architecture would add:**

```
packages/scraper/
├── src/
│   ├── adapters/
│   │   ├── custom/
│   │   │   ├── base-html.ts      # HTML scraping base
│   │   │   ├── flipkart.ts       # Company-specific
│   │   │   └── razorpay.ts
│   │   └── ...
│   └── browser/
│       ├── playwright.ts          # Headless browser
│       └── rate-limiter.ts        # Polite crawling
```

**HTML Adapter Template:**
```typescript
export abstract class HtmlAdapter implements AtsAdapter {
  protected browser: Browser;
  protected rateLimiter: RateLimiter;
  
  abstract selectors: {
    jobList: string;
    jobTitle: string;
    jobLocation: string;
    jobUrl: string;
  };
  
  async fetchJobs(companySlug: string): Promise<RawJob[]> {
    // 1. Check robots.txt
    // 2. Apply rate limiting (1 req/sec)
    // 3. Use Playwright to render page
    // 4. Extract jobs using selectors
    // 5. Handle pagination
  }
}
```

---

## Cost Analysis

### Current Approach (Recommended)
- Cost: **$0** (using free public APIs)
- Maintenance: Low (APIs are stable)
- Legal risk: None (using intended public APIs)
- Coverage: 871 India jobs from 33 companies

### HTML Scraping Approach (Not Recommended)
- Cost: Playwright server, potential legal fees
- Maintenance: High (HTML changes break scrapers)
- Legal risk: Moderate to High
- Coverage: Would add ~200 jobs from 5-10 companies

**ROI of HTML scraping is negative** for JobScout's current needs.

---

## Recommendations

### Do Now
1. ✅ Expand Greenhouse company list (done - added 8 companies)
2. ✅ Run regular scrapes (weekly cron job)
3. 📋 Monitor for new companies using public ATS

### Don't Do
1. ❌ Build Freshteam adapter (requires auth)
2. ❌ Build Keka adapter (no API)
3. ❌ Build Darwinbox adapter (no API)
4. ❌ Scrape custom career portals (legal risk)

### Maybe Later (With Business Justification)
1. Workable adapter (if Indian companies discovered using it)
2. SmartRecruiters adapter (if companies discovered)
3. Single high-value custom portal (with legal approval)

---

## Alternative Data Sources

### LinkedIn Jobs API
- **Status**: Requires LinkedIn partner program
- **Cost**: Enterprise pricing ($$$$)
- **Not feasible** for free tier

### Naukri/Indeed APIs  
- **Status**: No public APIs
- **Scraping**: Against ToS
- **Not feasible**

### Google Jobs API
- **Status**: No public API for job data
- **Not feasible**

---

## Conclusion

The current 3-adapter architecture (Greenhouse, Lever, Ashby) provides excellent coverage of quality tech companies with India offices. Building additional adapters for Indian ATS platforms is not recommended because:

1. **No Public APIs**: Freshteam, Keka, Darwinbox don't offer public job board APIs
2. **High Maintenance**: HTML scraping would require constant updates
3. **Legal Concerns**: Custom portal scraping has unclear legal status
4. **Low ROI**: Marginal job count increase vs. significant effort

**Strategy**: Continue expanding coverage within existing adapters by discovering more companies that use Greenhouse/Lever/Ashby and have India offices.
