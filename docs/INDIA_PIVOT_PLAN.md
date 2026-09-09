# India Pivot Implementation Plan

## Overview

Transform JobScout from a global job platform to an India-focused IT job aggregator. This involves updating company data, currency handling, location filters, and UI text across the entire stack.

**Estimated Time:** 4-6 hours  
**Risk Level:** Medium (data changes, no schema changes)

---

## Phase 1: Scraper Company Lists

### 1.1 Update packages/scraper/companies/greenhouse.json

Replace with Indian companies using Greenhouse:
```json
{
  "source": "greenhouse",
  "companies": [
    { "slug": "razorpay", "name": "Razorpay" },
    { "slug": "phonepe", "name": "PhonePe" },
    { "slug": "flipkart", "name": "Flipkart" },
    { "slug": "myntra", "name": "Myntra" },
    { "slug": "browserstack", "name": "BrowserStack" },
    { "slug": "chargebee", "name": "Chargebee" },
    { "slug": "eruditus", "name": "Eruditus" },
    { "slug": "bigbasket", "name": "BigBasket" },
    { "slug": "pinelabs", "name": "Pine Labs" },
    { "slug": "ather", "name": "Ather Energy" },
    { "slug": "cure-fit", "name": "Cult.fit" },
    { "slug": "zerodha", "name": "Zerodha" },
    { "slug": "sharechat", "name": "ShareChat" },
    { "slug": "moglix", "name": "Moglix" },
    { "slug": "leadsquared", "name": "LeadSquared" },
    { "slug": "mindtickle", "name": "MindTickle" },
    { "slug": "druva", "name": "Druva" },
    { "slug": "infra-market", "name": "Infra.Market" },
    { "slug": "zetwerk", "name": "Zetwerk" },
    { "slug": "lenskart", "name": "Lenskart" }
  ]
}
```

### 1.2 Update packages/scraper/companies/lever.json

Replace with Indian companies using Lever:
```json
{
  "source": "lever",
  "companies": [
    { "slug": "swiggy", "name": "Swiggy" },
    { "slug": "zomato", "name": "Zomato" },
    { "slug": "dream11", "name": "Dream11" },
    { "slug": "meesho", "name": "Meesho" },
    { "slug": "unacademy", "name": "Unacademy" },
    { "slug": "upgrad", "name": "upGrad" },
    { "slug": "nykaa", "name": "Nykaa" },
    { "slug": "urban-company", "name": "Urban Company" },
    { "slug": "dunzo", "name": "Dunzo" },
    { "slug": "blinkit", "name": "Blinkit" },
    { "slug": "clevertap", "name": "CleverTap" },
    { "slug": "webengage", "name": "WebEngage" },
    { "slug": "practo", "name": "Practo" },
    { "slug": "1mg", "name": "1mg" },
    { "slug": "healthifyme", "name": "HealthifyMe" },
    { "slug": "ola", "name": "Ola" },
    { "slug": "olaelectric", "name": "Ola Electric" },
    { "slug": "mpl", "name": "MPL" },
    { "slug": "bharatpe", "name": "BharatPe" },
    { "slug": "slice", "name": "Slice" }
  ]
}
```

### 1.3 Update packages/scraper/companies/ashby.json

Replace with Indian companies using Ashby:
```json
{
  "source": "ashby",
  "companies": [
    { "slug": "groww", "name": "Groww" },
    { "slug": "cred", "name": "CRED" },
    { "slug": "jupiter", "name": "Jupiter" },
    { "slug": "hasura", "name": "Hasura" },
    { "slug": "setu", "name": "Setu" },
    { "slug": "atlan", "name": "Atlan" },
    { "slug": "yellowai", "name": "Yellow.ai" },
    { "slug": "observeai", "name": "Observe.AI" },
    { "slug": "postman", "name": "Postman" },
    { "slug": "smallcase", "name": "Smallcase" },
    { "slug": "razorpayx", "name": "RazorpayX" },
    { "slug": "cleartrip", "name": "Cleartrip" },
    { "slug": "springworks", "name": "Springworks" },
    { "slug": "keka", "name": "Keka" },
    { "slug": "leena-ai", "name": "Leena AI" }
  ]
}
```

---

## Phase 2: Salary Parser (INR Support)

### 2.1 Update packages/scraper/src/processors/salary-parser.ts

Add INR to currency symbols:
```typescript
const CURRENCY_SYMBOLS: Record<string, string> = {
  '₹': 'INR',
  'Rs': 'INR',
  'Rs.': 'INR',
  'INR': 'INR',
  '$': 'USD',
  '£': 'GBP',
  '€': 'EUR',
};
```

Add Indian salary patterns:
```typescript
// Indian patterns (lakhs)
/(?<min>\d+(?:\.\d+)?)\s*(?:L|lakh|lac|lpa)\s*[-–to]+\s*(?<max>\d+(?:\.\d+)?)\s*(?:L|lakh|lac|lpa)/gi,
// ₹15,00,000 format
/₹\s*(?<min>[\d,]+)\s*[-–to]+\s*₹?\s*(?<max>[\d,]+)/gi,
```

Handle lakhs conversion:
```typescript
function parseIndianNumber(str: string): number {
  // 15L, 15 lakh, 15 lac = 1500000
  if (/l|lakh|lac|lpa/i.test(str)) {
    const num = parseFloat(str.replace(/[^\d.]/g, ''));
    return num * 100000; // Convert lakhs to absolute
  }
  // Handle Indian comma format: 15,00,000
  return parseFloat(str.replace(/,/g, ''));
}
```

---

## Phase 3: API Filter Routes

### 3.1 Update packages/api/src/routes/filters/index.ts

Replace USD salary ranges with INR (in lakhs):
```typescript
const SALARY_RANGES = [
  { min: 0, max: 1000000, label: 'Under ₹10L' },
  { min: 1000000, max: 2000000, label: '₹10L - ₹20L' },
  { min: 2000000, max: 3500000, label: '₹20L - ₹35L' },
  { min: 3500000, max: 5000000, label: '₹35L - ₹50L' },
  { min: 5000000, max: 7500000, label: '₹50L - ₹75L' },
  { min: 7500000, max: null, label: '₹75L+' },
];
```

Add Indian cities to location options (if static):
```typescript
const INDIAN_CITIES = [
  'Bangalore', 'Bengaluru',
  'Hyderabad',
  'Pune',
  'Chennai',
  'Mumbai',
  'Delhi', 'Delhi-NCR', 'Gurugram', 'Gurgaon', 'Noida',
  'Kochi',
  'Ahmedabad',
  'Kolkata',
  'Remote', 'Remote (India)',
];
```

---

## Phase 4: Seed Data (Indian Companies)

### 4.1 Update prisma/seed/index.ts

Replace US companies with Indian companies:
```typescript
const companies: Prisma.CompanyCreateInput[] = [
  {
    name: 'Razorpay',
    slug: 'razorpay',
    logo: 'https://logo.clearbit.com/razorpay.com',
    description: 'Razorpay is India\'s leading full-stack financial solutions company.',
    website: 'https://razorpay.com',
    careerPageUrl: 'https://razorpay.com/jobs',
    industry: 'Financial Technology',
    size: 'SIZE_1001_5000',
    foundedYear: 2014,
    headquarters: 'Bangalore, India',
    atsType: 'GREENHOUSE',
  },
  // ... more Indian companies
];
```

Update salary ranges to INR lakhs:
```typescript
const jobTemplates = [
  {
    title: 'Senior Software Engineer',
    department: 'Engineering',
    employmentType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS'],
    salaryMin: 3000000,  // 30 LPA
    salaryMax: 5000000,  // 50 LPA
  },
  // ... more templates with INR salaries
];
```

Update locations to Indian cities:
```typescript
const locations = [
  'Bangalore, India',
  'Hyderabad, India',
  'Pune, India',
  'Chennai, India',
  'Mumbai, India',
  'Delhi-NCR, India',
  'Remote (India)',
];
```

---

## Phase 5: Frontend - Currency Formatting

### 5.1 Update packages/web/lib/utils.ts

Add INR formatter with Indian number system:
```typescript
export function formatIndianCurrency(amount: number): string {
  // Convert to lakhs for display
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(0)}L`;
  }
  // Format with Indian comma system
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatSalaryINR(
  min?: number | null,
  max?: number | null
): string {
  if (!min && !max) return '';
  
  const formatAmount = (amt: number) => {
    if (amt >= 100000) return `₹${(amt / 100000).toFixed(0)}L`;
    return `₹${amt.toLocaleString('en-IN')}`;
  };
  
  if (min && max && min !== max) {
    return `${formatAmount(min)} - ${formatAmount(max)}/year`;
  }
  if (min) return `${formatAmount(min)}/year`;
  if (max) return `Up to ${formatAmount(max)}/year`;
  return '';
}
```

### 5.2 Update packages/web/hooks/useJobs.ts

Update formatSalary function to use INR:
```typescript
export function formatSalary(salary: JobListItem['salary']): string {
  if (!salary) return '';
  
  const { min, max, currency } = salary;
  
  // Default to INR formatting
  const formatAmount = (n: number) => {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
    if (n >= 100000) return `₹${Math.round(n / 100000)}L`;
    return `₹${n.toLocaleString('en-IN')}`;
  };

  let range: string;
  if (min && max && min !== max) {
    range = `${formatAmount(min)} - ${formatAmount(max)}`;
  } else if (min) {
    range = formatAmount(min);
  } else if (max) {
    range = `Up to ${formatAmount(max)}`;
  } else {
    return '';
  }

  return `${range}/yr`;
}
```

---

## Phase 6: Frontend - UI Updates

### 6.1 Update packages/web/pages/index.tsx

Update stats section:
```typescript
const stats = [
  { label: 'Active Jobs', value: totalJobs > 0 ? totalJobs.toLocaleString('en-IN') : '...', icon: Briefcase },
  { label: 'Companies', value: totalCompanies > 0 ? totalCompanies.toLocaleString('en-IN') : '...', icon: Building2 },
  { label: 'Updated Daily', value: '24/7', icon: TrendingUp },
  { label: 'Free Forever', value: '₹0', icon: Users },
];
```

Update popular searches for India:
```typescript
const popularSearches = [
  'Frontend Engineer',
  'Backend Developer',
  'Full Stack',
  'DevOps',
  'Data Engineer',
  'SDE',
];
```

Update tagline:
```typescript
<h1>
  Find your next role
  <br />
  <span className="text-gradient">in Indian tech</span>
</h1>
```

### 6.2 Update packages/web/pages/search.tsx

Update salary filter labels:
```typescript
const defaultFilterGroups: FilterGroup[] = [
  // ... other filters
  {
    id: 'salary',
    label: 'Salary Range',
    type: 'checkbox',
    options: [
      { id: 'under-10l', label: 'Under ₹10L' },
      { id: '10-20l', label: '₹10L - ₹20L' },
      { id: '20-35l', label: '₹20L - ₹35L' },
      { id: '35-50l', label: '₹35L - ₹50L' },
      { id: '50-75l', label: '₹50L - ₹75L' },
      { id: '75l-plus', label: '₹75L+' },
    ],
  },
];
```

Update salary range conversion:
```typescript
function getSalaryRange(key: string): { min?: number; max?: number } {
  switch (key) {
    case 'under-10l': return { max: 1000000 };
    case '10-20l': return { min: 1000000, max: 2000000 };
    case '20-35l': return { min: 2000000, max: 3500000 };
    case '35-50l': return { min: 3500000, max: 5000000 };
    case '50-75l': return { min: 5000000, max: 7500000 };
    case '75l-plus': return { min: 7500000 };
    default: return {};
  }
}
```

### 6.3 Update packages/web/pages/job/[id].tsx

No major changes needed - formatSalary will handle INR display.

---

## Phase 7: Shared Constants

### 7.1 Add to packages/shared/src/constants/index.ts

```typescript
export const INDIAN_CITIES = [
  'Bangalore',
  'Bengaluru', 
  'Hyderabad',
  'Pune',
  'Chennai',
  'Mumbai',
  'Delhi',
  'Delhi-NCR',
  'Gurugram',
  'Gurgaon',
  'Noida',
  'Kochi',
  'Ahmedabad',
  'Kolkata',
  'Jaipur',
  'Remote',
  'Remote (India)',
] as const;

export const DEFAULT_CURRENCY = 'INR';
```

---

## Implementation Checklist

### Scraper (packages/scraper/)
- [ ] Update companies/greenhouse.json with 20 Indian companies
- [ ] Update companies/lever.json with 20 Indian companies  
- [ ] Update companies/ashby.json with 15 Indian companies
- [ ] Update salary-parser.ts to support INR and lakhs

### API (packages/api/)
- [ ] Update routes/filters/index.ts with INR salary ranges
- [ ] Update default currency to INR

### Database (prisma/)
- [ ] Update seed/index.ts with Indian companies
- [ ] Update seed salary templates to INR
- [ ] Update seed locations to Indian cities

### Frontend (packages/web/)
- [ ] Update lib/utils.ts with INR formatters
- [ ] Update hooks/useJobs.ts formatSalary for INR
- [ ] Update pages/index.tsx (tagline, stats, searches)
- [ ] Update pages/search.tsx (salary filter labels)
- [ ] Verify pages/job/[id].tsx displays INR correctly

### Shared (packages/shared/)
- [ ] Add INDIAN_CITIES constant
- [ ] Add DEFAULT_CURRENCY constant

### Verification
- [ ] Run TypeScript check (npm run typecheck)
- [ ] Build all packages (npm run build)
- [ ] Test salary parsing with INR values
- [ ] Verify frontend displays ₹ correctly

---

## Testing

1. **Scraper Test:**
   ```bash
   npm run scrape -- --source=greenhouse --company=razorpay --dry-run
   ```

2. **API Test:**
   ```bash
   curl http://localhost:3001/api/filters
   # Verify INR salary ranges
   ```

3. **Frontend Test:**
   - Homepage shows Indian context
   - Search filters show ₹ salary ranges
   - Job cards display ₹XL format

---

## Rollback Plan

If issues arise:
1. Git revert to previous commit
2. Company JSON files are standalone - can swap back instantly
3. Seed data only affects dev environment

---

## Notes

- INR salary values stored as integers (paise-free): ₹30L = 3000000
- Display uses "L" (Lakh) abbreviation: ₹30L, ₹1.5Cr
- All locations should include "India" suffix for clarity
- Remote jobs default to "Remote (India)"
