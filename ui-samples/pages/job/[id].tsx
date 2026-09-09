import React, { useState } from 'react'
import Head from 'next/head'
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Bookmark, 
  Share2, 
  ExternalLink,
  Building2,
  Users,
  Globe,
  ChevronRight,
  Check,
  ArrowLeft,
  Send
} from 'lucide-react'
import { cn, formatSalary, formatRelativeTime } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Tag, JobTypeBadge, Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Header, Footer } from '@/components/layout/Header'
import { JobCard, type Job } from '@/components/jobs/JobCard'

/* ============================================
   JOB DATA
   ============================================ */

const jobData = {
  id: '1',
  title: 'Senior Frontend Engineer',
  company: {
    name: 'Stripe',
    industry: 'Financial Technology',
    size: '1,001–5,000 employees',
    description: 'Stripe is a technology company that builds economic infrastructure for the internet. Businesses of every size—from new startups to public companies—use our software to accept payments and manage their businesses online.',
    website: 'stripe.com',
  },
  location: 'San Francisco, CA',
  locationType: 'hybrid' as const,
  employmentType: 'full-time' as const,
  salaryMin: 180000,
  salaryMax: 250000,
  skills: ['React', 'TypeScript', 'GraphQL', 'Node.js', 'CSS', 'Testing'],
  postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  applicants: 234,
  views: 1893,
  benefits: [
    'Competitive salary & equity',
    'Health, dental & vision insurance',
    '401(k) with company match',
    'Flexible PTO policy',
    'Remote work options',
    'Learning & development budget',
    'Home office stipend',
    'Wellness programs',
  ],
}

const similarJobs: Job[] = [
  {
    id: '2',
    title: 'Staff Frontend Engineer',
    company: { id: '2', name: 'Airbnb' },
    location: 'Remote',
    locationType: 'remote',
    employmentType: 'full-time',
    salaryMin: 200000,
    salaryMax: 280000,
    skills: ['React', 'TypeScript', 'GraphQL'],
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    title: 'Senior React Developer',
    company: { id: '3', name: 'Vercel' },
    location: 'Remote',
    locationType: 'remote',
    employmentType: 'full-time',
    salaryMin: 160000,
    salaryMax: 200000,
    skills: ['React', 'Next.js', 'TypeScript'],
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: '4',
    title: 'Frontend Engineer',
    company: { id: '4', name: 'Figma' },
    location: 'San Francisco, CA',
    locationType: 'hybrid',
    employmentType: 'full-time',
    salaryMin: 150000,
    salaryMax: 190000,
    skills: ['React', 'TypeScript', 'WebGL'],
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
]

/* ============================================
   JOB DETAIL PAGE
   ============================================ */

export default function JobDetailPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isApplying, setIsApplying] = useState(false)

  const handleApply = () => {
    setIsApplying(true)
    setTimeout(() => {
      setIsApplying(false)
      alert('Application submitted!')
    }, 1500)
  }

  return (
    <div className={cn(isDarkMode && 'dark')}>
      <Head>
        <title>{jobData.title} at {jobData.company.name} – JobScout</title>
      </Head>

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        <Header isDarkMode={isDarkMode} onThemeToggle={() => setIsDarkMode(!isDarkMode)} />

        {/* ==========================================
            BREADCRUMB & BACK
            ========================================== */}
        <div className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-0 dark:bg-neutral-900">
          <div className="container-main py-3">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => window.history.back()}
                className="p-1.5 -ml-1.5 rounded-lg text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <ArrowLeft size={18} strokeWidth={2} />
              </button>
              <nav className="flex items-center gap-2 text-sm">
                <a href="/" className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
                  Home
                </a>
                <ChevronRight size={14} className="text-neutral-400" />
                <a href="/search" className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
                  Jobs
                </a>
                <ChevronRight size={14} className="text-neutral-400" />
                <span className="text-neutral-900 dark:text-neutral-100 font-medium truncate max-w-[200px]">
                  {jobData.title}
                </span>
              </nav>
            </div>
          </div>
        </div>

        <div className="container-main py-8">
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* ==========================================
                MAIN CONTENT
                ========================================== */}
            <main className="lg:col-span-2 space-y-6">
              {/* Header Card */}
              <Card padding="lg">
                <div className="flex items-start gap-4 mb-6">
                  {/* Logo */}
                  <div className="w-14 h-14 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 flex items-center justify-center shrink-0">
                    <span className="text-xl font-bold text-neutral-400">
                      {jobData.company.name.charAt(0)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {jobData.company.name}
                      </span>
                      <Badge variant="brand" size="sm">Featured</Badge>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight mb-3">
                      {jobData.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-500 dark:text-neutral-400">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={15} strokeWidth={2} />
                        {jobData.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={15} strokeWidth={2} />
                        {formatRelativeTime(jobData.postedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Salary</p>
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {formatSalary(jobData.salaryMin, jobData.salaryMax)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Work Type</p>
                    <JobTypeBadge type={jobData.locationType} showIcon={false} />
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Employment</p>
                    <JobTypeBadge type={jobData.employmentType} showIcon={false} />
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Experience</p>
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">Senior</p>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {jobData.skills.map((skill) => (
                    <Tag key={skill} variant="brand" size="md">
                      {skill}
                    </Tag>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleApply}
                    isLoading={isApplying}
                    leftIcon={<Send size={18} strokeWidth={2} />}
                  >
                    Apply Now
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    leftIcon={
                      <Bookmark 
                        size={18} 
                        strokeWidth={2} 
                        fill={isBookmarked ? 'currentColor' : 'none'} 
                      />
                    }
                  >
                    {isBookmarked ? 'Saved' : 'Save'}
                  </Button>
                  <Button variant="ghost" size="lg">
                    <Share2 size={18} strokeWidth={2} />
                  </Button>
                </div>
              </Card>

              {/* Job Description */}
              <Card padding="lg">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  About this role
                </h2>
                <div className="prose prose-neutral dark:prose-invert prose-sm max-w-none">
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                    We're looking for a Senior Frontend Engineer to join our Dashboard team. You'll be responsible for building and maintaining the core user interfaces that millions of businesses use to manage their payments.
                  </p>

                  <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mt-6 mb-3">
                    What you'll do
                  </h3>
                  <ul className="space-y-2 text-neutral-600 dark:text-neutral-300">
                    <li className="flex items-start gap-2">
                      <Check size={16} className="mt-1 text-success-600 shrink-0" />
                      <span>Design, build, and maintain high-quality frontend code for the Stripe Dashboard</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="mt-1 text-success-600 shrink-0" />
                      <span>Collaborate with product managers, designers, and backend engineers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="mt-1 text-success-600 shrink-0" />
                      <span>Mentor junior engineers and contribute to our frontend culture</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="mt-1 text-success-600 shrink-0" />
                      <span>Improve performance, accessibility, and user experience</span>
                    </li>
                  </ul>

                  <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mt-6 mb-3">
                    What we're looking for
                  </h3>
                  <ul className="space-y-2 text-neutral-600 dark:text-neutral-300">
                    <li className="flex items-start gap-2">
                      <Check size={16} className="mt-1 text-success-600 shrink-0" />
                      <span>5+ years of professional frontend development experience</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="mt-1 text-success-600 shrink-0" />
                      <span>Expert knowledge of React, TypeScript, and modern CSS</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="mt-1 text-success-600 shrink-0" />
                      <span>Experience with GraphQL and state management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="mt-1 text-success-600 shrink-0" />
                      <span>Strong communication and collaboration skills</span>
                    </li>
                  </ul>
                </div>
              </Card>

              {/* Benefits */}
              <Card padding="lg">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  Benefits & Perks
                </h2>
                <div className="grid sm:grid-cols-2 gap-2">
                  {jobData.benefits.map((benefit, i) => (
                    <div 
                      key={i} 
                      className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50"
                    >
                      <div className="w-8 h-8 rounded-lg bg-success-100 dark:bg-success-500/10 flex items-center justify-center shrink-0">
                        <Check size={16} strokeWidth={2.5} className="text-success-600 dark:text-success-500" />
                      </div>
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </main>

            {/* ==========================================
                SIDEBAR
                ========================================== */}
            <aside className="space-y-6">
              {/* Company Card */}
              <Card padding="lg">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  About {jobData.company.name}
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 flex items-center justify-center">
                    <span className="text-lg font-bold text-neutral-400">
                      {jobData.company.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {jobData.company.name}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {jobData.company.industry}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
                  {jobData.company.description}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                    <Users size={15} strokeWidth={2} />
                    {jobData.company.size}
                  </div>
                  <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                    <Globe size={15} strokeWidth={2} />
                    <a 
                      href={`https://${jobData.company.website}`} 
                      className="text-brand-600 dark:text-brand-400 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {jobData.company.website}
                    </a>
                  </div>
                </div>
                <Button variant="secondary" size="md" fullWidth className="mt-4">
                  View company
                  <ExternalLink size={14} strokeWidth={2} />
                </Button>
              </Card>

              {/* Stats */}
              <Card padding="md">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                      {jobData.applicants}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Applicants</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                      {jobData.views.toLocaleString()}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Views</p>
                  </div>
                </div>
              </Card>

              {/* Report */}
              <div className="text-center">
                <button className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300">
                  Report this listing
                </button>
              </div>
            </aside>
          </div>

          {/* ==========================================
              SIMILAR JOBS
              ========================================== */}
          <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                Similar opportunities
              </h2>
              <Button variant="ghost" size="sm" rightIcon={<ChevronRight size={16} />}>
                View all
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {similarJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  variant="compact"
                  onClick={(id) => window.location.href = `/job/${id}`}
                  onBookmark={(id) => console.log('Bookmark:', id)}
                />
              ))}
            </div>
          </section>
        </div>

        <Footer />
      </div>
    </div>
  )
}
