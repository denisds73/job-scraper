import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { 
  Search, 
  ArrowRight, 
  TrendingUp, 
  Users, 
  Briefcase, 
  Building2,
  Code,
  Database,
  Cloud,
  Smartphone,
  BarChart3,
  Cpu,
  Palette,
  Shield,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/Input'
import { Tag } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Header, Footer } from '@/components/layout/Header'
import { JobList, JobCardSkeleton, type Job } from '@/components/jobs/JobCard'
import { useRecentJobs, useTopCompanies, formatSalary } from '@/hooks'
import type { JobListItem, CompanyListItem } from '@/lib/api'

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

/* ============================================
   STATIC DATA
   ============================================ */

const popularSearches = [
  'Frontend Engineer',
  'Backend Developer',
  'Full Stack',
  'DevOps',
  'Data Engineer',
  'SDE',
]

const categories = [
  { name: 'Frontend', icon: Code, skill: 'React', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  { name: 'Backend', icon: Database, skill: 'Node.js', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
  { name: 'DevOps', icon: Cloud, skill: 'Kubernetes', color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' },
  { name: 'Mobile', icon: Smartphone, skill: 'React Native', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
  { name: 'Data', icon: BarChart3, skill: 'Python', color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20' },
  { name: 'ML/AI', icon: Cpu, skill: 'Machine Learning', color: 'text-pink-600 bg-pink-50 dark:bg-pink-900/20' },
  { name: 'Design', icon: Palette, skill: 'Figma', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
  { name: 'Security', icon: Shield, skill: 'Security', color: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
]

/* ============================================
   HOMEPAGE
   ============================================ */

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Handle hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Fetch real data
  const { data: jobsData, isLoading: isLoadingJobs, error: jobsError } = useRecentJobs(6)
  const { data: topCompanies, isLoading: isLoadingCompanies } = useTopCompanies(6)

  // Map API jobs to component format
  const featuredJobs = jobsData?.data?.map(mapApiJobToComponent) || []
  
  // Calculate stats from real data
  const totalJobs = jobsData?.meta?.total || 0
  const totalCompanies = topCompanies?.length || 0

  const stats = [
    { label: 'Active Jobs', value: isMounted && totalJobs > 0 ? totalJobs.toLocaleString('en-IN') : '...', icon: Briefcase },
    { label: 'Companies', value: isMounted && totalCompanies > 0 ? totalCompanies.toLocaleString('en-IN') : '...', icon: Building2 },
    { label: 'Updated Daily', value: '24/7', icon: TrendingUp },
    { label: 'Free Forever', value: '₹0', icon: Users },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
  }

  const handleQuickSearch = (term: string) => {
    router.push(`/search?q=${encodeURIComponent(term)}`)
  }

  const handleCategoryClick = (skill: string) => {
    router.push(`/search?skills=${encodeURIComponent(skill)}`)
  }

  return (
    <div className={cn(isDarkMode && 'dark')}>
      <Head>
        <title>JobScout - Find Your Next Role in Tech</title>
        <meta name="description" content="Discover thousands of tech jobs from top companies. Filter by salary, location, and skills." />
      </Head>

      <div className="min-h-[100dvh] bg-neutral-0 dark:bg-neutral-950">
        <Header isDarkMode={isDarkMode} onThemeToggle={() => setIsDarkMode(!isDarkMode)} />

        {/* ==========================================
            HERO
            ========================================== */}
        <section className="relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 via-neutral-0 to-neutral-0 dark:from-brand-950/20 dark:via-neutral-950 dark:to-neutral-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-100/40 via-transparent to-transparent dark:from-brand-900/20" />
          
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative container-main pt-16 pb-20 md:pt-24 md:pb-28 lg:pt-32 lg:pb-36">
            <div className="max-w-3xl mx-auto text-center">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100/80 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-sm font-medium mb-6 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600"></span>
                </span>
                {isMounted && totalJobs > 0 ? `${totalJobs.toLocaleString()} jobs available` : 'Jobs from top tech companies'}
              </div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-neutral-50 mb-6 tracking-tight">
                Find your next role
                <br />
                <span className="text-gradient">in Indian tech</span>
              </h1>

              {/* Subheading */}
              <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-xl mx-auto leading-relaxed">
                Search jobs from India's top startups. Filter by salary, location, skills, and more.
              </p>

              {/* Search */}
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <SearchInput
                      placeholder="Search jobs, companies, skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onClear={() => setSearchQuery('')}
                    />
                  </div>
                  <Button type="submit" variant="primary" size="xl" className="sm:w-auto">
                    <Search size={18} strokeWidth={2} />
                    <span>Search</span>
                  </Button>
                </div>
              </form>

              {/* Popular */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-sm text-neutral-500">Popular:</span>
                {popularSearches.map((term) => (
                  <Tag
                    key={term}
                    variant="outline"
                    size="sm"
                    interactive
                    onClick={() => handleQuickSearch(term)}
                  >
                    {term}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            STATS
            ========================================== */}
        <section className="border-y border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="container-main py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 mb-3">
                      <Icon size={20} strokeWidth={2} />
                    </div>
                    <p className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-1 tracking-tight">
                      {stat.value}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{stat.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ==========================================
            FEATURED JOBS
            ========================================== */}
        <section className="container-main py-16 md:py-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2 tracking-tight">
                Latest opportunities
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400">
                Fresh roles from top companies
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              rightIcon={<ArrowRight size={16} strokeWidth={2} />}
              onClick={() => router.push('/search')}
            >
              View all jobs
            </Button>
          </div>

          {jobsError ? (
            <div className="text-center py-12">
              <p className="text-neutral-500 dark:text-neutral-400">
                Unable to load jobs. Please try again later.
              </p>
            </div>
          ) : (
            <JobList
              jobs={featuredJobs}
              isLoading={isLoadingJobs}
              loadingCount={3}
              onJobClick={(id) => router.push(`/job/${id}`)}
              onBookmark={(id) => console.log('Bookmark:', id)}
            />
          )}
        </section>

        {/* ==========================================
            CATEGORIES
            ========================================== */}
        <section className="bg-neutral-50/80 dark:bg-neutral-900/50 py-16 md:py-20">
          <div className="container-main">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2 tracking-tight">
                Browse by category
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400">
                Find jobs in your area of expertise
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <Card
                    key={category.name}
                    interactive
                    padding="md"
                    className="group"
                    onClick={() => handleCategoryClick(category.skill)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        category.color
                      )}>
                        <Icon size={20} strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                          {category.name}
                        </p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {category.skill}
                        </p>
                      </div>
                      <ChevronRight 
                        size={18} 
                        strokeWidth={2} 
                        className="text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-400 dark:group-hover:text-neutral-500 transition-colors" 
                      />
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* ==========================================
            TOP COMPANIES
            ========================================== */}
        <section className="container-main py-16 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2 tracking-tight">
              Companies hiring now
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400">
              Join innovative teams building the future
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {isLoadingCompanies ? (
              // Loading skeletons for companies
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} padding="md" className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl skeleton" />
                  <div className="h-4 w-20 mx-auto mb-1 skeleton rounded" />
                  <div className="h-3 w-12 mx-auto skeleton rounded" />
                </Card>
              ))
            ) : topCompanies && topCompanies.length > 0 ? (
              topCompanies.map((company) => (
                <Card
                  key={company.id}
                  interactive
                  padding="md"
                  className="text-center group"
                  onClick={() => router.push(`/search?companyId=${company.id}`)}
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center border border-neutral-200/50 dark:border-neutral-700/50 overflow-hidden">
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={`${company.name} logo`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold text-neutral-400 dark:text-neutral-500">
                        {company.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-0.5 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                    {company.name}
                  </p>
                  <p className="text-sm text-brand-600 dark:text-brand-400">
                    {company.jobCount} {company.jobCount === 1 ? 'job' : 'jobs'}
                  </p>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-neutral-500 dark:text-neutral-400">No companies available</p>
              </div>
            )}
          </div>

          {topCompanies && topCompanies.length > 0 && (
            <div className="text-center mt-8">
              <Button 
                variant="secondary" 
                size="md" 
                rightIcon={<ArrowRight size={16} />}
                onClick={() => router.push('/search')}
              >
                View all companies
              </Button>
            </div>
          )}
        </section>

        {/* ==========================================
            CTA
            ========================================== */}
        <section className="bg-gradient-to-br from-brand-600 to-brand-700 dark:from-brand-700 dark:to-brand-800">
          <div className="container-main py-16 md:py-20 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
              Ready to find your next opportunity?
            </h2>
            <p className="text-brand-100 mb-8 max-w-lg mx-auto">
              Start browsing thousands of tech jobs from top companies - completely free.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="bg-white text-brand-700 hover:bg-neutral-100"
                onClick={() => router.push('/search')}
              >
                Browse all jobs
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-white border border-white/20 hover:bg-white/10"
                onClick={() => router.push('/search?locationType=remote')}
              >
                Remote jobs only
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  )
}
