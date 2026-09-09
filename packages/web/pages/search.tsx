import React, { useState } from 'react'
import Head from 'next/head'
import { Search, MapPin, SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { SearchInput, Input } from '@/components/ui/Input'
import { Header, Footer } from '@/components/layout/Header'
import { FilterSidebar, ActiveFiltersBar, type FilterGroup } from '@/components/layout/FilterSidebar'
import { JobList, type Job } from '@/components/jobs/JobCard'

/* ============================================
   FILTER CONFIG
   ============================================ */

const filterGroups: FilterGroup[] = [
  {
    id: 'work-type',
    label: 'Work Type',
    type: 'checkbox',
    options: [
      { id: 'remote', label: 'Remote', count: 45231 },
      { id: 'hybrid', label: 'Hybrid', count: 32145 },
      { id: 'onsite', label: 'On-site', count: 28976 },
    ],
  },
  {
    id: 'employment',
    label: 'Employment Type',
    type: 'checkbox',
    options: [
      { id: 'full-time', label: 'Full-time', count: 98234 },
      { id: 'part-time', label: 'Part-time', count: 4532 },
      { id: 'contract', label: 'Contract', count: 12453 },
    ],
  },
  {
    id: 'experience',
    label: 'Experience Level',
    type: 'checkbox',
    options: [
      { id: 'entry', label: 'Entry Level', count: 15432 },
      { id: 'mid', label: 'Mid Level', count: 45231 },
      { id: 'senior', label: 'Senior', count: 38765 },
      { id: 'lead', label: 'Lead / Staff', count: 12453 },
    ],
  },
  {
    id: 'salary',
    label: 'Salary Range',
    type: 'checkbox',
    options: [
      { id: '50-100k', label: '$50K – $100K', count: 23456 },
      { id: '100-150k', label: '$100K – $150K', count: 34567 },
      { id: '150-200k', label: '$150K – $200K', count: 18765 },
      { id: '200k+', label: '$200K+', count: 12453 },
    ],
  },
  {
    id: 'posted',
    label: 'Date Posted',
    type: 'radio',
    options: [
      { id: '24h', label: 'Last 24 hours', count: 5432 },
      { id: '7d', label: 'Last 7 days', count: 23456 },
      { id: '30d', label: 'Last 30 days', count: 67890 },
      { id: 'all', label: 'All time' },
    ],
  },
]

const filterLabels: Record<string, Record<string, string>> = {
  'work-type': { remote: 'Remote', hybrid: 'Hybrid', onsite: 'On-site' },
  employment: { 'full-time': 'Full-time', 'part-time': 'Part-time', contract: 'Contract' },
  experience: { entry: 'Entry', mid: 'Mid', senior: 'Senior', lead: 'Lead' },
  salary: { '50-100k': '$50-100K', '100-150k': '$100-150K', '150-200k': '$150-200K', '200k+': '$200K+' },
  posted: { '24h': '24h', '7d': '7 days', '30d': '30 days', all: 'All' },
}

/* ============================================
   SAMPLE JOBS
   ============================================ */

const sampleJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: { id: '1', name: 'Stripe' },
    location: 'San Francisco, CA',
    locationType: 'hybrid',
    employmentType: 'full-time',
    salaryMin: 180000,
    salaryMax: 250000,
    skills: ['React', 'TypeScript', 'GraphQL', 'Node.js', 'CSS'],
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Staff Software Engineer',
    company: { id: '2', name: 'Airbnb' },
    location: 'Remote (US)',
    locationType: 'remote',
    employmentType: 'full-time',
    salaryMin: 200000,
    salaryMax: 280000,
    skills: ['Go', 'Kubernetes', 'AWS', 'Microservices', 'gRPC'],
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isNew: true,
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    company: { id: '3', name: 'Datadog' },
    location: 'New York, NY',
    locationType: 'onsite',
    employmentType: 'full-time',
    salaryMin: 150000,
    salaryMax: 200000,
    skills: ['Kubernetes', 'Terraform', 'AWS', 'Python', 'Go'],
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: '4',
    title: 'React Native Developer',
    company: { id: '4', name: 'Discord' },
    location: 'Remote',
    locationType: 'remote',
    employmentType: 'full-time',
    salaryMin: 140000,
    salaryMax: 180000,
    skills: ['React Native', 'TypeScript', 'iOS', 'Android'],
    postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  {
    id: '5',
    title: 'Machine Learning Engineer',
    company: { id: '5', name: 'OpenAI' },
    location: 'San Francisco, CA',
    locationType: 'hybrid',
    employmentType: 'full-time',
    salaryMin: 250000,
    salaryMax: 350000,
    skills: ['Python', 'PyTorch', 'TensorFlow', 'NLP', 'LLMs'],
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    isFeatured: true,
  },
  {
    id: '6',
    title: 'Full Stack Developer',
    company: { id: '6', name: 'Vercel' },
    location: 'Remote (Worldwide)',
    locationType: 'remote',
    employmentType: 'full-time',
    salaryMin: 150000,
    salaryMax: 200000,
    skills: ['Next.js', 'React', 'Node.js', 'PostgreSQL'],
    postedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  },
  {
    id: '7',
    title: 'Backend Engineer',
    company: { id: '7', name: 'Figma' },
    location: 'San Francisco, CA',
    locationType: 'hybrid',
    employmentType: 'full-time',
    salaryMin: 170000,
    salaryMax: 220000,
    skills: ['Go', 'Rust', 'PostgreSQL', 'Redis', 'gRPC'],
    postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: '8',
    title: 'Platform Engineer',
    company: { id: '8', name: 'Notion' },
    location: 'New York, NY',
    locationType: 'onsite',
    employmentType: 'full-time',
    salaryMin: 180000,
    salaryMax: 240000,
    skills: ['Kubernetes', 'AWS', 'Terraform', 'Go'],
    postedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
  },
]

/* ============================================
   SEARCH PAGE
   ============================================ */

export default function SearchPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('React Developer')
  const [location, setLocation] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState<string>('relevance')

  const handleFilterChange = (groupId: string, values: string[]) => {
    setSelectedFilters((prev) => ({ ...prev, [groupId]: values }))
  }

  const handleRemoveFilter = (groupId: string, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [groupId]: (prev[groupId] || []).filter((v) => v !== value),
    }))
  }

  const handleClearFilters = () => setSelectedFilters({})

  const totalResults = 12453
  const activeFilterCount = Object.values(selectedFilters).flat().length

  return (
    <div className={cn(isDarkMode && 'dark')}>
      <Head>
        <title>{searchQuery ? `${searchQuery} Jobs` : 'Search Jobs'} – JobScout</title>
      </Head>

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        <Header isDarkMode={isDarkMode} onThemeToggle={() => setIsDarkMode(!isDarkMode)} />

        {/* ==========================================
            SEARCH BAR
            ========================================== */}
        <section className="sticky top-16 z-30 bg-neutral-0/95 dark:bg-neutral-900/95 backdrop-blur-lg border-b border-neutral-200 dark:border-neutral-800">
          <div className="container-main py-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search 
                  size={18} 
                  strokeWidth={2} 
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" 
                />
                <input
                  type="text"
                  placeholder="Job title, company, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    'w-full h-11 pl-10 pr-4 rounded-lg',
                    'bg-neutral-0 dark:bg-neutral-800',
                    'border border-neutral-200 dark:border-neutral-700',
                    'text-neutral-900 dark:text-neutral-100',
                    'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
                    'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500',
                    'transition-all duration-150'
                  )}
                />
              </div>

              <div className="md:w-56 relative">
                <MapPin 
                  size={18} 
                  strokeWidth={2} 
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" 
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={cn(
                    'w-full h-11 pl-10 pr-4 rounded-lg',
                    'bg-neutral-0 dark:bg-neutral-800',
                    'border border-neutral-200 dark:border-neutral-700',
                    'text-neutral-900 dark:text-neutral-100',
                    'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
                    'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500',
                    'transition-all duration-150'
                  )}
                />
              </div>

              <Button variant="primary" size="lg">
                <Search size={18} strokeWidth={2} />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </div>
          </div>
        </section>

        {/* ==========================================
            MAIN CONTENT
            ========================================== */}
        <div className="container-main py-6">
          <div className="flex gap-6">
            {/* Sidebar */}
            <FilterSidebar
              filters={filterGroups}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearFilters}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
            />

            {/* Results */}
            <main className="flex-1 min-w-0">
              {/* Results header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                    {searchQuery ? `"${searchQuery}"` : 'All Jobs'}
                  </h1>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {totalResults.toLocaleString()} jobs found
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Mobile filter toggle */}
                  <Button
                    variant="secondary"
                    size="sm"
                    className="lg:hidden"
                    onClick={() => setIsFilterOpen(true)}
                  >
                    <SlidersHorizontal size={16} strokeWidth={2} />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 text-xs bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 rounded">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>

                  {/* Sort */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={cn(
                        'h-9 pl-3 pr-8 rounded-lg appearance-none',
                        'bg-neutral-0 dark:bg-neutral-800',
                        'border border-neutral-200 dark:border-neutral-700',
                        'text-sm text-neutral-700 dark:text-neutral-300',
                        'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500',
                        'cursor-pointer'
                      )}
                    >
                      <option value="relevance">Most Relevant</option>
                      <option value="recent">Most Recent</option>
                      <option value="salary-high">Highest Salary</option>
                      <option value="salary-low">Lowest Salary</option>
                    </select>
                    <ArrowUpDown 
                      size={14} 
                      strokeWidth={2} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" 
                    />
                  </div>
                </div>
              </div>

              {/* Active filters */}
              <ActiveFiltersBar
                filters={selectedFilters}
                filterLabels={filterLabels}
                onRemove={handleRemoveFilter}
                onClearAll={handleClearFilters}
                className="mb-4"
              />

              {/* Job list */}
              <JobList
                jobs={sampleJobs}
                onJobClick={(id) => window.location.href = `/job/${id}`}
                onBookmark={(id) => console.log('Bookmark:', id)}
              />

              {/* Pagination */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Showing 1–20 of {totalResults.toLocaleString()} jobs
                </p>
                <div className="flex items-center gap-1">
                  <Button variant="secondary" size="sm" disabled>
                    Previous
                  </Button>
                  {[1, 2, 3].map((page) => (
                    <button
                      key={page}
                      className={cn(
                        'w-9 h-9 rounded-lg text-sm font-medium transition-colors',
                        page === 1
                          ? 'bg-brand-600 text-white'
                          : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      )}
                    >
                      {page}
                    </button>
                  ))}
                  <span className="px-2 text-neutral-400">...</span>
                  <button className="w-9 h-9 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                    623
                  </button>
                  <Button variant="secondary" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </main>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}
