import React, { useState, useMemo } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { 
  MapPin, 
  Clock, 
  Bookmark, 
  Share2, 
  ExternalLink,
  Users,
  Globe,
  ChevronRight,
  ArrowLeft,
  Send,
  AlertCircle,
  Briefcase
} from 'lucide-react'
import { cn, formatSalary, formatRelativeTime } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Tag, JobTypeBadge, Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Header, Footer } from '@/components/layout/Header'
import { JobCard, JobCardSkeleton, type Job } from '@/components/jobs/JobCard'
import { useJob, useJobSearch, formatJobForDisplay } from '@/hooks'
import type { JobListItem, JobDetail } from '@/lib/api'

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
    salaryCurrency: apiJob.salary?.currency || 'USD',
    skills: apiJob.skills || [],
    postedAt: apiJob.postedAt,
    isNew,
  }
}

/**
 * Format experience level for display
 */
function formatExperience(level: string | null | undefined): string {
  if (!level) return 'Not specified'
  const labels: Record<string, string> = {
    entry: 'Entry Level',
    mid: 'Mid Level',
    senior: 'Senior',
    staff: 'Staff',
    principal: 'Principal',
  }
  return labels[level] || level
}

/* ============================================
   LOADING SKELETON
   ============================================ */

function JobDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Card Skeleton */}
      <Card padding="lg">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl skeleton" />
          <div className="flex-1">
            <div className="h-4 w-32 skeleton rounded mb-2" />
            <div className="h-8 w-3/4 skeleton rounded mb-3" />
            <div className="h-4 w-48 skeleton rounded" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
              <div className="h-3 w-12 skeleton rounded mb-2" />
              <div className="h-5 w-20 skeleton rounded" />
            </div>
          ))}
        </div>
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-7 w-16 skeleton rounded-md" />
          ))}
        </div>
        <div className="flex gap-3">
          <div className="h-11 flex-1 skeleton rounded-lg" />
          <div className="h-11 w-24 skeleton rounded-lg" />
          <div className="h-11 w-11 skeleton rounded-lg" />
        </div>
      </Card>

      {/* Description Skeleton */}
      <Card padding="lg">
        <div className="h-6 w-40 skeleton rounded mb-4" />
        <div className="space-y-3">
          <div className="h-4 w-full skeleton rounded" />
          <div className="h-4 w-5/6 skeleton rounded" />
          <div className="h-4 w-4/5 skeleton rounded" />
          <div className="h-4 w-full skeleton rounded" />
        </div>
      </Card>
    </div>
  )
}

/* ============================================
   JOB DETAIL PAGE
   ============================================ */

export default function JobDetailPage() {
  const router = useRouter()
  const { id } = router.query
  
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  // Fetch job data
  const { data: job, isLoading, error } = useJob(id as string)

  // Fetch similar jobs based on first skill
  const firstSkill = job?.skills?.[0]
  const { data: similarJobsData, isLoading: isLoadingSimilar } = useJobSearch(
    { skills: firstSkill, limit: 3 },
    !!firstSkill
  )

  // Filter out current job from similar jobs
  const similarJobs = useMemo(() => {
    if (!similarJobsData?.data || !job) return []
    return similarJobsData.data
      .filter(j => j.id !== job.id)
      .slice(0, 3)
      .map(mapApiJobToComponent)
  }, [similarJobsData, job])

  const handleApply = () => {
    if (job?.sourceUrl) {
      window.open(job.sourceUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const handleShare = async () => {
    if (navigator.share && job) {
      try {
        await navigator.share({
          title: `${job.title} at ${job.company.name}`,
          url: window.location.href,
        })
      } catch {
        // User cancelled or share not supported
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  // Build page title
  const pageTitle = job 
    ? `${job.title} at ${job.company.name}` 
    : 'Job Details'

  return (
    <div className={cn(isDarkMode && 'dark')}>
      <Head>
        <title>{pageTitle} - JobScout</title>
        {job && (
          <meta name="description" content={`${job.title} position at ${job.company.name}. ${job.location}. Apply now!`} />
        )}
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
                onClick={() => router.back()}
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
                  {job?.title || 'Loading...'}
                </span>
              </nav>
            </div>
          </div>
        </div>

        <div className="container-main py-8">
          {/* Error State */}
          {error && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 mb-4 rounded-full bg-error-50 dark:bg-error-500/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-error-600 dark:text-error-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                Job not found
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mb-4">
                This job listing may have been removed or is no longer available.
              </p>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => router.push('/search')}
              >
                Browse all jobs
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
              <main className="lg:col-span-2">
                <JobDetailSkeleton />
              </main>
              <aside className="space-y-6">
                <Card padding="lg">
                  <div className="h-5 w-32 skeleton rounded mb-4" />
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl skeleton" />
                    <div className="flex-1">
                      <div className="h-4 w-24 skeleton rounded mb-1" />
                      <div className="h-3 w-16 skeleton rounded" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full skeleton rounded" />
                    <div className="h-4 w-4/5 skeleton rounded" />
                  </div>
                </Card>
              </aside>
            </div>
          )}

          {/* Job Content */}
          {job && !error && (
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
              {/* ==========================================
                  MAIN CONTENT
                  ========================================== */}
              <main className="lg:col-span-2 space-y-6">
                {/* Header Card */}
                <Card padding="lg">
                  <div className="flex items-start gap-4 mb-6">
                    {/* Logo */}
                    <div className="w-14 h-14 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 flex items-center justify-center shrink-0 overflow-hidden">
                      {job.company.logo ? (
                        <img
                          src={job.company.logo}
                          alt={`${job.company.name} logo`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-bold text-neutral-400">
                          {job.company.name.charAt(0)}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {job.company.name}
                        </span>
                        {job.isNew && (
                          <Badge variant="success" size="sm">New</Badge>
                        )}
                      </div>
                      <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight mb-3">
                        {job.title}
                      </h1>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-500 dark:text-neutral-400">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={15} strokeWidth={2} />
                          {job.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={15} strokeWidth={2} />
                          {formatRelativeTime(job.postedAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Info Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Salary</p>
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {job.salary 
                          ? formatSalary(job.salary.min || undefined, job.salary.max || undefined, job.salary.currency)
                          : 'Not specified'}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Work Type</p>
                      <JobTypeBadge type={job.locationType} showIcon={false} />
                    </div>
                    <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Employment</p>
                      <JobTypeBadge type={job.employmentType} showIcon={false} />
                    </div>
                    <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Experience</p>
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {formatExperience(job.experienceLevel)}
                      </p>
                    </div>
                  </div>

                  {/* Skills */}
                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {job.skills.map((skill) => (
                        <Tag 
                          key={skill} 
                          variant="brand" 
                          size="md"
                          interactive
                          onClick={() => router.push(`/search?skills=${encodeURIComponent(skill)}`)}
                        >
                          {skill}
                        </Tag>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      onClick={handleApply}
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
                    <Button variant="ghost" size="lg" onClick={handleShare}>
                      <Share2 size={18} strokeWidth={2} />
                    </Button>
                  </div>
                </Card>

                {/* Job Description */}
                <Card padding="lg">
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                    About this role
                  </h2>
                  <div 
                    className="prose prose-neutral dark:prose-invert prose-sm max-w-none text-neutral-600 dark:text-neutral-300"
                    dangerouslySetInnerHTML={{ __html: job.description || '<p>No description available.</p>' }}
                  />
                </Card>

                {/* Requirements (if available) */}
                {job.requirements && job.requirements.length > 0 && (
                  <Card padding="lg">
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                      Requirements
                    </h2>
                    <ul className="space-y-2 text-neutral-600 dark:text-neutral-300">
                      {job.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 mt-2 rounded-full bg-brand-500 shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {/* Source Link */}
                <div className="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
                  <span>Source: {job.source}</span>
                  <a 
                    href={job.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    View original
                    <ExternalLink size={14} />
                  </a>
                </div>
              </main>

              {/* ==========================================
                  SIDEBAR
                  ========================================== */}
              <aside className="space-y-6">
                {/* Company Card */}
                <Card padding="lg">
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                    About {job.company.name}
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 flex items-center justify-center overflow-hidden">
                      {job.company.logo ? (
                        <img
                          src={job.company.logo}
                          alt={`${job.company.name} logo`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-bold text-neutral-400">
                          {job.company.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {job.company.name}
                      </p>
                      {job.department && (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {job.department}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button 
                    variant="secondary" 
                    size="md" 
                    fullWidth 
                    onClick={() => router.push(`/search?companyId=${job.companyId}`)}
                  >
                    View all jobs
                    <ChevronRight size={14} strokeWidth={2} />
                  </Button>
                </Card>

                {/* Quick Actions */}
                <Card padding="md">
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="md"
                      fullWidth
                      className="justify-start"
                      onClick={handleApply}
                    >
                      <ExternalLink size={16} />
                      Apply on {job.source}
                    </Button>
                    <Button
                      variant="ghost"
                      size="md"
                      fullWidth
                      className="justify-start"
                      onClick={handleShare}
                    >
                      <Share2 size={16} />
                      Share this job
                    </Button>
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
          )}

          {/* ==========================================
              SIMILAR JOBS
              ========================================== */}
          {job && similarJobs.length > 0 && (
            <section className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  Similar opportunities
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  rightIcon={<ChevronRight size={16} />}
                  onClick={() => router.push(`/search?skills=${encodeURIComponent(firstSkill || '')}`)}
                >
                  View all
                </Button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoadingSimilar ? (
                  [1, 2, 3].map(i => <JobCardSkeleton key={i} variant="compact" />)
                ) : (
                  similarJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      variant="compact"
                      onClick={(id) => router.push(`/job/${id}`)}
                      onBookmark={(id) => console.log('Bookmark:', id)}
                    />
                  ))
                )}
              </div>
            </section>
          )}

          {/* No similar jobs message */}
          {job && !isLoadingSimilar && similarJobs.length === 0 && (
            <section className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  Similar opportunities
                </h2>
              </div>
              <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No similar jobs found at this time.</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => router.push('/search')}
                >
                  Browse all jobs
                </Button>
              </div>
            </section>
          )}
        </div>

        <Footer />
      </div>
    </div>
  )
}
