import React, { useState } from 'react'
import Head from 'next/head'
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
import { JobList, type Job } from '@/components/jobs/JobCard'

/* ============================================
   SAMPLE DATA
   ============================================ */

const popularSearches = [
  'Frontend Engineer',
  'Backend Developer',
  'Full Stack',
  'DevOps',
  'Data Engineer',
  'Product Manager',
]

const stats = [
  { label: 'Active Jobs', value: '125K+', icon: Briefcase },
  { label: 'Companies', value: '8,500+', icon: Building2 },
  { label: 'Job Seekers', value: '2M+', icon: Users },
  { label: 'Hired This Month', value: '12K+', icon: TrendingUp },
]

const categories = [
  { name: 'Frontend', icon: Code, count: 12453, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  { name: 'Backend', icon: Database, count: 8932, color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
  { name: 'DevOps', icon: Cloud, count: 4532, color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' },
  { name: 'Mobile', icon: Smartphone, count: 4123, color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
  { name: 'Data', icon: BarChart3, count: 5621, color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20' },
  { name: 'ML/AI', icon: Cpu, count: 3421, color: 'text-pink-600 bg-pink-50 dark:bg-pink-900/20' },
  { name: 'Design', icon: Palette, count: 2891, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
  { name: 'Security', icon: Shield, count: 1876, color: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
]

const featuredCompanies = [
  { name: 'Stripe', jobs: 234 },
  { name: 'Airbnb', jobs: 189 },
  { name: 'Vercel', jobs: 156 },
  { name: 'Figma', jobs: 142 },
  { name: 'Linear', jobs: 98 },
  { name: 'Notion', jobs: 87 },
]

const featuredJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: { id: '1', name: 'Stripe' },
    location: 'San Francisco, CA',
    locationType: 'hybrid',
    employmentType: 'full-time',
    salaryMin: 180000,
    salaryMax: 250000,
    skills: ['React', 'TypeScript', 'GraphQL', 'Node.js'],
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Staff Software Engineer',
    company: { id: '2', name: 'Airbnb' },
    location: 'Remote',
    locationType: 'remote',
    employmentType: 'full-time',
    salaryMin: 200000,
    salaryMax: 280000,
    skills: ['Go', 'Kubernetes', 'AWS', 'Microservices'],
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isNew: true,
  },
  {
    id: '3',
    title: 'Platform Engineer',
    company: { id: '3', name: 'Vercel' },
    location: 'Remote',
    locationType: 'remote',
    employmentType: 'full-time',
    salaryMin: 150000,
    salaryMax: 200000,
    skills: ['Node.js', 'Rust', 'Edge Computing', 'CDN'],
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
]

/* ============================================
   HOMEPAGE
   ============================================ */

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
  }

  return (
    <div className={cn(isDarkMode && 'dark')}>
      <Head>
        <title>JobScout – Find Your Next Role in Tech</title>
        <meta name="description" content="Discover thousands of tech jobs from top companies. Filter by salary, location, and skills." />
      </Head>

      <div className="min-h-screen bg-neutral-0 dark:bg-neutral-950">
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
                125,000+ jobs available now
              </div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-neutral-50 mb-6 tracking-tight">
                Find your next role
                <br />
                <span className="text-gradient">in tech</span>
              </h1>

              {/* Subheading */}
              <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-xl mx-auto leading-relaxed">
                Search jobs from thousands of companies. Filter by salary, location, skills, and more.
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
                    onClick={() => {
                      setSearchQuery(term)
                      window.location.href = `/search?q=${encodeURIComponent(term)}`
                    }}
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
                Featured opportunities
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400">
                Hand-picked roles from top companies
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              rightIcon={<ArrowRight size={16} strokeWidth={2} />}
              onClick={() => window.location.href = '/search'}
            >
              View all jobs
            </Button>
          </div>

          <JobList
            jobs={featuredJobs}
            onJobClick={(id) => window.location.href = `/job/${id}`}
            onBookmark={(id) => console.log('Bookmark:', id)}
          />
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
                    onClick={() => window.location.href = `/search?category=${category.name.toLowerCase()}`}
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
                          {category.count.toLocaleString()} jobs
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
            {featuredCompanies.map((company) => (
              <Card
                key={company.name}
                interactive
                padding="md"
                className="text-center group"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center border border-neutral-200/50 dark:border-neutral-700/50">
                  <span className="text-lg font-bold text-neutral-400 dark:text-neutral-500">
                    {company.name.charAt(0)}
                  </span>
                </div>
                <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-0.5 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {company.name}
                </p>
                <p className="text-sm text-brand-600 dark:text-brand-400">
                  {company.jobs} jobs
                </p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="secondary" size="md" rightIcon={<ArrowRight size={16} />}>
              View all companies
            </Button>
          </div>
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
              Create a free account to save jobs, set alerts, and get personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="bg-white text-brand-700 hover:bg-neutral-100"
              >
                Create free account
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-white border border-white/20 hover:bg-white/10"
              >
                Learn more
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  )
}
