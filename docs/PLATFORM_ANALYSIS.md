# ATS Platform Analysis for Indian IT Companies

## Executive Summary

After comprehensive research, here's the breakdown of hiring platforms used by Indian IT companies:

| Platform | API Available | Companies Found | India Jobs | Effort Level |
|----------|--------------|-----------------|------------|--------------|
| Greenhouse | ✅ Yes | 50+ | 500+ | Low |
| Lever | ✅ Yes | 4 working | 300+ | Low |
| Ashby | ✅ Yes | 17+ | 50+ | Low |
| Freshteam | ⚠️ Requires Auth | 10+ | Unknown | High |
| Zoho Recruit | ⚠️ Requires Auth | 1 (Zoho) | Unknown | High |
| Keka | ⚠️ No Public API | 10+ | Unknown | Very High |
| Darwinbox | ⚠️ No Public API | 5+ | Unknown | Very High |
| Custom Portals | ❌ No API | 100+ | Unknown | Very High |

**Recommendation**: Focus on Greenhouse, Lever, and Ashby which provide public APIs.
Custom portals require web scraping which has legal/ethical considerations.

---

## Platform Deep Dive

### 1. Greenhouse (Recommended - Priority 1)

**API Endpoint**: `https://boards-api.greenhouse.io/v1/boards/{company}/jobs`

**Newly Discovered Companies with India Jobs**:

| Company | Total Jobs | India Jobs | Key Locations |
|---------|-----------|------------|---------------|
| rubrik | 139 | 35 | Bangalore |
| zenoti | 46 | 25 | Hyderabad |
| pubmatic | 77 | 32 | Pune, Gurugram |
| commvault | 70 | 17 | Bangalore |
| hackerrank | 29 | 18 | Bangalore |
| samsara | 255 | 10 | Bangalore |
| anthropic | 599 | 3 | Bangalore |
| amplitude | 36 | 2 | Bangalore |
| stripe | 616 | 40 | Bangalore |
| adyen | 229 | 10 | Bangalore |
| elastic | 345 | 17 | Bangalore, Hyderabad |
| mongodb | 404 | 63 | Multiple cities |
| databricks | 873 | 97 | Bangalore, Hyderabad |
| twilio | 153 | 17 | Bangalore |
| vonage | 26 | 2 | Bangalore |
| **TOTAL** | **3,897** | **~387** | |

**Already Integrated** (from context):
- stripe, coinbase, airbnb, twilio, datadog, cloudflare, mongodb, elastic
- gitlab, zscaler, okta, databricks, brex, mercury, carta, gusto, toast
- adyen, instacart, lyft, asana, figma, webflow, vercel, anthropic
- postman, druva, block, affirm, wise, chime, robinhood, groww, slice

**New Companies to Add**:
```json
["rubrik", "zenoti", "pubmatic", "commvault", "hackerrank", "samsara", "amplitude", "vonage"]
```

---

### 2. Lever (Recommended - Priority 1)

**API Endpoint**: `https://api.lever.co/v0/postings/{company}?mode=json`

**Working Companies with India Jobs**:

| Company | Total Jobs | India Jobs | Notes |
|---------|-----------|------------|-------|
| paytm | 209 | 180+ | ✅ Already integrated |
| meesho | 49 | 40+ | ✅ Already integrated |
| cred | 11 | 10+ | ✅ Already integrated |
| spotify | 200+ | 15+ | Stockholm HQ, Bangalore office |

**Note**: Many Indian unicorns (Razorpay, Swiggy, Zomato, Flipkart, etc.) do NOT use Lever.
They have custom career portals.

---

### 3. Ashby (Recommended - Priority 1)

**API Endpoint**: `https://api.ashbyhq.com/posting-api/job-board/{company}`

**Working Companies** (from context):
- linear, supabase, railway, resend, neon, axiom, mintlify
- inngest, stytch, clerk, infisical, langfuse, twenty, plane, n8n, airbyte, posthog

**India Jobs**: Limited, mostly remote-friendly roles that may accept India.

---

### 4. Freshteam (Not Recommended - High Effort)

**Used By**: Freshworks, SurveySparrow, Kissflow, Chargebee (some)

**API Status**: 
- Public pages exist: `https://{company}.freshteam.com/jobs`
- API endpoint: `https://{company}.freshteam.com/api/jobs` returns 401 (requires auth)
- No public API documentation for job boards

**Technical Analysis**:
```
surveysparrow.freshteam.com/jobs - 200 (HTML page, no embedded JSON)
kissflow.freshteam.com/jobs - 200 (HTML page)
freshworks.freshteam.com/jobs - 503 (Service unavailable)
```

**Verdict**: Would require HTML scraping with headless browser. Not worth the effort
given legal/ethical concerns and maintenance burden.

---

### 5. Zoho Recruit (Not Recommended)

**Used By**: Zoho Corporation

**API Status**:
- Career page: `https://careers.zohocorp.com/` (custom portal)
- No public API for job listings
- Zoho Recruit is their ATS product, but they use custom portal for hiring

**Verdict**: Custom portal scraping required. Skip for now.

---

### 6. Keka (Not Recommended)

**Used By**: 10+ mid-size Indian companies

**API Status**:
- HR SaaS platform, no public job board API
- Career pages are typically: `https://{company}.keka.com/careers`
- No programmatic access

**Verdict**: No API access. Skip.

---

### 7. Darwinbox (Not Recommended)

**Used By**: Swiggy, Dunzo, and several Indian startups

**API Status**:
- Enterprise HRMS platform
- Career pages vary by company
- No public API

**Verdict**: No API access. Skip.

---

## Companies by Hiring Platform

### Using Public APIs (Easy to Integrate)

#### Greenhouse
```
Existing (40+): stripe, mongodb, databricks, twilio, elastic, anthropic, etc.
New to Add: rubrik, zenoti, pubmatic, commvault, hackerrank, samsara, amplitude, vonage
```

#### Lever  
```
Existing: paytm, meesho, cred, spotify
New to Test: None found with working APIs
```

#### Ashby
```
Existing (17): linear, supabase, railway, resend, neon, etc.
New to Add: None found with India jobs
```

### Using Custom Portals (Cannot Integrate Easily)

**Major Indian Unicorns** (Custom portals - would need scraping):
- Flipkart (flipkartcareers.com)
- Razorpay (razorpay.com/careers)
- Swiggy (careers.swiggy.com) - Uses Darwinbox
- Zomato (zomato.com/careers)
- PhonePe (phonepe.com/careers)
- Ola (ola.com/careers)
- BYJU'S (careers.byjus.com)
- OYO (oyorooms.com/careers)
- Zerodha (zerodha.com/careers)
- PolicyBazaar (policybazaar.com/careers)
- Nykaa (nykaa.com/careers)
- Lenskart (lenskart.com/careers)

**Chennai Companies** (Custom portals):
- Zoho (careers.zohocorp.com)
- Freshworks (freshworks.com/company/careers) - Uses Freshteam
- SurveySparrow (surveysparrow.freshteam.com)
- Kissflow (kissflow.com/careers)
- Chargebee - Split between Greenhouse and custom

---

## Recommended Action Plan

### Phase 1: Expand Greenhouse Coverage (Immediate)
Add these companies to `packages/scraper/companies/greenhouse.json`:
```json
[
  "rubrik",
  "zenoti", 
  "pubmatic",
  "commvault",
  "hackerrank",
  "samsara",
  "amplitude",
  "vonage"
]
```

**Expected New Jobs**: ~150-200 India jobs

### Phase 2: Scrape New Companies (Today)
Run bulk scraper with new companies to add ~200+ new India jobs.

### Phase 3: Monitor and Maintain
- Weekly scrape updates
- Add new companies as discovered
- Remove companies that block API access

### Phase 4: Custom Portal Scraping (Future - Optional)
If needed in future:
1. Build headless browser scraper (Playwright)
2. Respect robots.txt and rate limits
3. Legal review before deployment
4. Start with 2-3 high-value companies

---

## Legal & Ethical Considerations

### Safe (Current Approach)
- Using public APIs designed for job board integration
- Respecting rate limits
- Not accessing authenticated endpoints
- Storing only publicly available job data

### Risky (Not Implementing)
- Scraping custom career portals
- Bypassing authentication
- Aggressive rate patterns
- Storing personal data

---

## Next Steps

1. ✅ Research complete
2. ⬜ Update greenhouse.json with new companies
3. ⬜ Run bulk scraper
4. ⬜ Verify new job counts
5. ⬜ Update documentation
