import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Search, MapPin, SlidersHorizontal, ArrowUpDown, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Header, Footer } from '@/components/layout/Header'
import { FilterSidebar, ActiveFiltersBar, type FilterGroup } from '@/components/layout/FilterSidebar'
import { JobList, type Job } from '@/components/jobs/JobCard'
import { useJobSearch, useFilters, formatLocationType, formatEmploymentType, formatExperienceLevel } from '@/hooks'
import type { JobSearchParams, JobListItem } from '@/lib/api'

/* ============================================
   HELPERS
   ============================================ */

/**
 * Map API job to component job format
 */
function mapApiJobToComponent(apiJob: JobListItem): Job {
  const postedDate = new Date(apiJob.postedAt)
  const now = new Date()
  const diffMs = now.getTime() - postedDate.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const isNew = diffDays <= 1

  return {
    id: apiJob.id,
    title: apiJob.title,
    company: {
      id: apiJob.company.id,
      name: apiJob.company.name,
      logo: apiJob.company.logo || undefined,
    },
    location: apiJob.location,
    locationType: apiJob.locationType,
    employmentType: apiJob.employmentType,
    salaryMin: apiJob.salary?.min || undefined,
    salaryMax: apiJob.salary?.max || undefined,
    salaryCurrency: apiJob.salary?.currency || 'INR',
    skills: apiJob.skills || [],
    postedAt: apiJob.postedAt,
    isNew,
  }
}

/**
 * Parse URL query into search params
 */
function parseQueryParams(query: Record<string, string | string[] | undefined>): {
  searchParams: JobSearchParams
  selectedFilters: Record<string, string[]>
  sortBy: string
} {
  const toArray = (val: string | string[] | undefined): string[] => {
    if (!val) return []
    return Array.isArray(val) ? val : [val]
  }

  const sortBy = (query.sort as string) || 'postedAt'
  const sortDir = (query.dir as string) === 'asc' ? 'asc' : 'desc'

  const selectedFilters: Record<string, string[]> = {
    'work-type': toArray(query.locationType),
    employment: toArray(query.employmentType),
    experience: toArray(query.experienceLevel),
    skills: toArray(query.skills),
  }

  // Handle salary range
  if (query.salaryMin || query.salaryMax) {
    const salaryKey = getSalaryFilterKey(
      query.salaryMin ? parseInt(query.salaryMin as string) : undefined,
      query.salaryMax ? parseInt(query.salaryMax as string) : undefined
    )
    if (salaryKey) {
      selectedFilters.salary = [salaryKey]
    }
  }

  const searchParams: JobSearchParams = {
    q: (query.q as string) || undefined,
    location: (query.location as string) || undefined,
    locationType: toArray(query.locationType).length > 0 ? toArray(query.locationType) : undefined,
    employmentType: toArray(query.employmentType).length > 0 ? toArray(query.employmentType) : undefined,
    experienceLevel: toArray(query.experienceLevel).length > 0 ? toArray(query.experienceLevel) : undefined,
    skills: toArray(query.skills).length > 0 ? toArray(query.skills) : undefined,
    salaryMin: query.salaryMin ? parseInt(query.salaryMin as string) : undefined,
    salaryMax: query.salaryMax ? parseInt(query.salaryMax as string) : undefined,
    companyId: (query.companyId as string) || undefined,
    sortBy: sortBy as JobSearchParams['sortBy'],
    sortDir: sortDir as JobSearchParams['sortDir'],
    page: query.page ? parseInt(query.page as string) : 1,
    limit: 20,
  }

  return { searchParams, selectedFilters, sortBy: `${sortBy}-${sortDir}` }
}

/**
 * Get salary filter key from min/max values (INR)
 */
function getSalaryFilterKey(min?: number, max?: number): string | null {
  if (!min && !max) return null;
  if (max && max <= 1000000) return 'under-10l';
  if (min && min >= 7500000) return '75l-plus';
  if (min && min >= 5000000) return '50-75l';
  if (min && min >= 3500000) return '35-50l';
  if (min && min >= 2000000) return '20-35l';
  if (min && min >= 1000000) return '10-20l';
  return null;
}

/**
 * Get salary min/max from filter key (INR values)
 */
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

/* ============================================
   FILTER CONFIG
   ============================================ */

const defaultFilterGroups: FilterGroup[] = [
  {
    id: 'work-type',
    label: 'Work Type',
    type: 'checkbox',
    options: [
      { id: 'remote', label: 'Remote' },
      { id: 'hybrid', label: 'Hybrid' },
      { id: 'onsite', label: 'On-site' },
    ],
  },
  {
    id: 'employment',
    label: 'Employment Type',
    type: 'checkbox',
    options: [
      { id: 'full-time', label: 'Full-time' },
      { id: 'part-time', label: 'Part-time' },
      { id: 'contract', label: 'Contract' },
      { id: 'internship', label: 'Internship' },
    ],
  },
  {
    id: 'experience',
    label: 'Experience Level',
    type: 'checkbox',
    options: [
      { id: 'entry', label: 'Entry Level' },
      { id: 'mid', label: 'Mid Level' },
      { id: 'senior', label: 'Senior' },
      { id: 'staff', label: 'Staff' },
      { id: 'principal', label: 'Principal' },
    ],
  },
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
]

const filterLabels: Record<string, Record<string, string>> = {
  'work-type': { remote: 'Remote', hybrid: 'Hybrid', onsite: 'On-site' },
  employment: { 'full-time': 'Full-time', 'part-time': 'Part-time', contract: 'Contract', internship: 'Internship' },
  experience: { entry: 'Entry', mid: 'Mid', senior: 'Senior', staff: 'Staff', principal: 'Principal' },
  salary: { 'under-10l': 'Under ₹10L', '10-20l': '₹10-20L', '20-35l': '₹20-35L', '35-50l': '₹35-50L', '50-75l': '₹50-75L', '75l-plus': '₹75L+' },
  skills: {},
}

/* ============================================
   SEARCH PAGE
   ============================================ */

export default function SearchPage() {
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
  // Local input state (for debouncing)
  const [searchInput, setSearchInput] = useState('')
  const [locationInput, setLocationInput] = useState('')

  // Handle hydration - mark as mounted after first render
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Parse URL params
  const { searchParams, selectedFilters, sortBy: urlSortBy } = useMemo(
    () => parseQueryParams(router.query),
    [router.query]
  )

  const [sortBy, setSortBy] = useState(urlSortBy)

  // Sync input with URL on mount/change
  useEffect(() => {
    setSearchInput((router.query.q as string) || '')
    setLocationInput((router.query.location as string) || '')
    setSortBy(urlSortBy)
  }, [router.query.q, router.query.location, urlSortBy])

  // Fetch data
  const { data: jobsData, isLoading, error, isFetching } = useJobSearch(searchParams, router.isReady)
  const { data: filtersData } = useFilters()

  // Map jobs to component format
  const jobs = useMemo(
    () => jobsData?.data?.map(mapApiJobToComponent) || [],
    [jobsData]
  )

  // Build filter groups with real counts if available
  const filterGroups = useMemo(() => {
    if (!filtersData) return defaultFilterGroups

    return defaultFilterGroups.map(group => {
      let options = group.options
      
      if (group.id === 'work-type' && filtersData.locationTypes) {
        options = filtersData.locationTypes.map(opt => ({
          id: opt.value,
          label: opt.label,
          count: opt.count,
        }))
      } else if (group.id === 'employment' && filtersData.employmentTypes) {
        options = filtersData.employmentTypes.map(opt => ({
          id: opt.value,
          label: opt.label,
          count: opt.count,
        }))
      } else if (group.id === 'experience' && filtersData.experienceLevels) {
        options = filtersData.experienceLevels.map(opt => ({
          id: opt.value,
          label: opt.label,
          count: opt.count,
        }))
      }

      return { ...group, options }
    })
  }, [filtersData])

  // Update URL with new params
  const updateUrl = useCallback((updates: Partial<Record<string, string | string[] | number | undefined>>) => {
    const newQuery = { ...router.query }
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
        delete newQuery[key]
      } else {
        newQuery[key] = Array.isArray(value) ? value : String(value)
      }
    })

    // Reset to page 1 when filters change (unless explicitly setting page)
    if (!('page' in updates)) {
      delete newQuery.page
    }

    router.push({ pathname: '/search', query: newQuery }, undefined, { shallow: true })
  }, [router])

  // Handle search submit
  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    updateUrl({
      q: searchInput || undefined,
      location: locationInput || undefined,
    })
  }

  // Handle filter changes
  const handleFilterChange = (groupId: string, values: string[]) => {
    if (groupId === 'work-type') {
      updateUrl({ locationType: values.length > 0 ? values : undefined })
    } else if (groupId === 'employment') {
      updateUrl({ employmentType: values.length > 0 ? values : undefined })
    } else if (groupId === 'experience') {
      updateUrl({ experienceLevel: values.length > 0 ? values : undefined })
    } else if (groupId === 'salary') {
      // Handle salary - use first selected value
      const firstValue = values[0]
      const salaryRange = firstValue ? getSalaryRange(firstValue) : {}
      updateUrl({
        salaryMin: salaryRange.min,
        salaryMax: salaryRange.max,
      })
    } else if (groupId === 'skills') {
      updateUrl({ skills: values.length > 0 ? values : undefined })
    }
  }

  // Handle removing a single filter
  const handleRemoveFilter = (groupId: string, value: string) => {
    const currentValues = selectedFilters[groupId] || []
    const newValues = currentValues.filter(v => v !== value)
    handleFilterChange(groupId, newValues)
  }

  // Handle clearing all filters
  const handleClearFilters = () => {
    updateUrl({
      locationType: undefined,
      employmentType: undefined,
      experienceLevel: undefined,
      salaryMin: undefined,
      salaryMax: undefined,
      skills: undefined,
    })
  }

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value)
    const [sort, dir] = value.split('-')
    updateUrl({ sort, dir })
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    updateUrl({ page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Calculate pagination
  const totalResults = jobsData?.meta?.total || 0
  const currentPage = jobsData?.meta?.page || 1
  const totalPages = jobsData?.meta?.totalPages || 1
  const pageSize = jobsData?.meta?.pageSize || 20

  const activeFilterCount = Object.values(selectedFilters).flat().length

  // Build page title
  const pageTitle = searchParams.q 
    ? `${searchParams.q} Jobs` 
    : 'Search Jobs'

  return (
    <div className={cn(isDarkMode && 'dark')}>
      <Head>
        <title>{pageTitle} - JobScout</title>
      </Head>

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        <Header isDarkMode={isDarkMode} onThemeToggle={() => setIsDarkMode(!isDarkMode)} />

        {/* ==========================================
            SEARCH BAR
            ========================================== */}
        <section className="sticky top-16 z-30 bg-neutral-0/95 dark:bg-neutral-900/95 backdrop-blur-lg border-b border-neutral-200 dark:border-neutral-800">
          <div className="container-main py-4">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search 
                  size={18} 
                  strokeWidth={2} 
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" 
                />
                <input
                  type="text"
                  placeholder="Job title, company, or keywords..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
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
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
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

              <Button type="submit" variant="primary" size="lg">
                <Search size={18} strokeWidth={2} />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </form>
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
                    {searchParams.q ? `"${searchParams.q}"` : 'All Jobs'}
                  </h1>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {!isMounted || isLoading ? (
                      <span>Loading jobs...</span>
                    ) : (
                      `${totalResults.toLocaleString()} job${totalResults !== 1 ? 's' : ''} found`
                    )}
                    {isMounted && isFetching && !isLoading && ' • Updating...'}
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
                      onChange={(e) => handleSortChange(e.target.value)}
                      className={cn(
                        'h-9 pl-3 pr-8 rounded-lg appearance-none',
                        'bg-neutral-0 dark:bg-neutral-800',
                        'border border-neutral-200 dark:border-neutral-700',
                        'text-sm text-neutral-700 dark:text-neutral-300',
                        'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500',
                        'cursor-pointer'
                      )}
                    >
                      <option value="postedAt-desc">Most Recent</option>
                      <option value="postedAt-asc">Oldest First</option>
                      <option value="salary-desc">Highest Salary</option>
                      <option value="salary-asc">Lowest Salary</option>
                      <option value="title-asc">Title A-Z</option>
                      <option value="title-desc">Title Z-A</option>
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

              {/* Error state */}
              {error && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-14 h-14 mb-4 rounded-full bg-error-50 dark:bg-error-500/10 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-error-600 dark:text-error-400" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                    Unable to load jobs
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mb-4">
                    There was an error fetching jobs. Please try again.
                  </p>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => router.reload()}
                  >
                    Try again
                  </Button>
                </div>
              )}

              {/* Job list */}
              {!error && (
                <JobList
                  jobs={jobs}
                  isLoading={isLoading}
                  loadingCount={5}
                  onJobClick={(id) => router.push(`/job/${id}`)}
                  onBookmark={(id) => console.log('Bookmark:', id)}
                />
              )}

              {/* Pagination */}
              {!isLoading && !error && totalPages > 1 && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Showing {((currentPage - 1) * pageSize) + 1}–{Math.min(currentPage * pageSize, totalResults)} of {totalResults.toLocaleString()} jobs
                  </p>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      disabled={currentPage <= 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    
                    {/* Page numbers */}
                    {generatePageNumbers(currentPage, totalPages).map((page, idx) => 
                      page === '...' ? (
                        <span key={`ellipsis-${idx}`} className="px-2 text-neutral-400">...</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page as number)}
                          className={cn(
                            'w-9 h-9 rounded-lg text-sm font-medium transition-colors',
                            page === currentPage
                              ? 'bg-brand-600 text-white'
                              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                          )}
                        >
                          {page}
                        </button>
                      )
                    )}

                    <Button 
                      variant="secondary" 
                      size="sm"
                      disabled={currentPage >= totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}

/**
 * Generate page numbers for pagination
 */
function generatePageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | '...')[] = []
  
  // Always show first page
  pages.push(1)

  if (current > 3) {
    pages.push('...')
  }

  // Show pages around current
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  
  for (let i = start; i <= end; i++) {
    if (!pages.includes(i)) {
      pages.push(i)
    }
  }

  if (current < total - 2) {
    pages.push('...')
  }

  // Always show last page
  if (!pages.includes(total)) {
    pages.push(total)
  }

  return pages
}
