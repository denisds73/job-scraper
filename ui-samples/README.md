# Job Scraper UI Samples

Google-standard UI/UX implementation with React, TypeScript, and Tailwind CSS.

## 📁 Structure

```
ui-samples/
├── components/
│   ├── ui/                    # Core UI components
│   │   ├── Button.tsx         # Button with variants (primary, secondary, ghost, etc.)
│   │   ├── Input.tsx          # Input fields and SearchInput
│   │   ├── Badge.tsx          # Badges, Tags, and JobTypeBadge
│   │   ├── Card.tsx           # Card container with variants
│   │   └── index.ts
│   │
│   ├── layout/                # Layout components
│   │   ├── Header.tsx         # Navigation header and Footer
│   │   ├── FilterSidebar.tsx  # Filter panel and ActiveFiltersBar
│   │   └── index.ts
│   │
│   └── jobs/                  # Job-specific components
│       ├── JobCard.tsx        # Job listing card, JobList, and skeletons
│       └── index.ts
│
├── pages/                     # Sample page implementations
│   ├── HomePage.tsx           # Landing page with hero and search
│   ├── SearchResultsPage.tsx  # Job listings with filters
│   ├── JobDetailPage.tsx      # Full job detail view
│   └── index.ts
│
├── lib/
│   └── utils.ts               # Utility functions (cn, formatSalary, etc.)
│
├── styles/
│   └── globals.css            # Global styles and CSS custom properties
│
└── tailwind.config.ts         # Tailwind configuration with design tokens
```

## 🎨 Design System

### Colors

**Primary (Brand Blue)**
- Default: `#1976D2` (primary-700)
- Hover: `#1565C0` (primary-800)
- Active: `#0D47A1` (primary-900)

**Semantic Colors**
- Success: `#4CAF50`
- Warning: `#FFC107`
- Error: `#F44336`
- Info: `#00BCD4`

### Typography

**Font Stack**
- Primary: Inter, system-ui, sans-serif
- Monospace: JetBrains Mono, Consolas, monospace

**Type Scale**
- `text-xs`: 12px
- `text-sm`: 14px
- `text-base`: 16px
- `text-lg`: 18px
- `text-xl`: 20px (card titles)
- `text-2xl`: 24px (section headings)
- `text-3xl`: 30px (page titles)
- `text-4xl`: 36px (hero headings)

### Spacing

Base unit: 4px (Tailwind default)

Key values:
- `space-4` (16px): Standard gap
- `space-6` (24px): Card padding
- `space-8` (32px): Section spacing

### Border Radius

- `rounded-md` (8px): Buttons, inputs
- `rounded-lg` (12px): Cards
- `rounded-xl` (16px): Large cards
- `rounded-full`: Pills, avatars

## 🧩 Components

### Button

```tsx
import { Button } from '@/components/ui'

// Variants: primary, secondary, ghost, danger, link, success
<Button variant="primary" size="md">Click me</Button>

// Sizes: xs, sm, md, lg, xl, icon, icon-sm, icon-lg
<Button size="lg" isLoading>Loading...</Button>

// With icons
<Button leftIcon={<Icon />} rightIcon={<ChevronRight />}>
  Next
</Button>
```

### Input

```tsx
import { Input, SearchInput } from '@/components/ui'

// Standard input
<Input
  label="Email"
  placeholder="Enter email..."
  error="Invalid email"
  leftIcon={<MailIcon />}
/>

// Search input (larger, with clear button)
<SearchInput
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  onClear={() => setQuery('')}
/>
```

### Badge & Tag

```tsx
import { Badge, Tag, JobTypeBadge } from '@/components/ui'

// Badge (small status indicator)
<Badge variant="success" dot>Active</Badge>

// Tag (skills, categories)
<Tag variant="primary" size="md">React</Tag>
<Tag variant="frontend">Frontend</Tag>

// Job type badge
<JobTypeBadge type="remote" />  // Remote, Hybrid, On-site, etc.
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

<Card variant="default" padding="md" hover>
  <CardHeader>
    <CardTitle>Job Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here...
  </CardContent>
</Card>
```

### JobCard

```tsx
import { JobCard, JobList } from '@/components/jobs'

// Single card
<JobCard
  job={jobData}
  variant="default" // or "compact", "featured"
  onBookmark={(id) => handleBookmark(id)}
  onClick={(id) => navigateToJob(id)}
/>

// List with loading state
<JobList
  jobs={jobs}
  isLoading={loading}
  loadingCount={5}
/>
```

## 📱 Responsive Breakpoints

```css
xs: 475px   /* Small phones */
sm: 640px   /* Large phones */
md: 768px   /* Tablets */
lg: 1024px  /* Small laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large monitors */
```

## 🌙 Dark Mode

All components support dark mode via the `dark` class on a parent element:

```tsx
const [isDarkMode, setIsDarkMode] = useState(false)

<div className={cn(isDarkMode && 'dark')}>
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    {/* Content automatically adapts to dark mode */}
  </div>
</div>
```

## ♿ Accessibility

- Minimum contrast ratio: 4.5:1 (text), 3:1 (UI components)
- Touch targets: 44x44px minimum
- Focus rings on all interactive elements
- Semantic HTML with proper heading hierarchy
- ARIA labels where needed
- Respects `prefers-reduced-motion`

## 🚀 Usage

1. Install dependencies:
```bash
npm install clsx tailwind-merge class-variance-authority
npm install lucide-react  # For icons
```

2. Add Inter font to your layout:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

3. Import and use components:
```tsx
import { Button, Input, Card } from '@/components/ui'
import { Header, Footer } from '@/components/layout'
import { JobCard, JobList } from '@/components/jobs'
```

## 📐 Sample Pages

### HomePage
- Hero section with gradient background
- Search bar with popular searches
- Stats section
- Featured jobs
- Job categories grid
- Top companies
- CTA section

### SearchResultsPage
- Sticky search bar
- Sidebar filters (responsive - drawer on mobile)
- Active filters bar
- Job listings with pagination
- Sort dropdown

### JobDetailPage
- Breadcrumb navigation
- Job header with quick info
- Full job description
- Benefits grid
- Company sidebar
- Job stats
- Similar jobs section
