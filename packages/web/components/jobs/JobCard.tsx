import React from 'react'
import { 
  MapPin, 
  DollarSign, 
  Bookmark, 
  ChevronRight,
  Star,
  Sparkles,
  Clock,
  Briefcase
} from 'lucide-react'
import { cn, formatSalary, formatRelativeTime } from '@/lib/utils'
import { Card } from '../ui/Card'
import { Tag, JobTypeBadge, type JobLocationType, type JobEmploymentType } from '../ui/Badge'
import { Button } from '../ui/Button'

/**
 * Job Types
 */

export interface Company {
  id: string
  name: string
  logo?: string
  industry?: string
}

export interface Job {
  id: string
  title: string
  company: Company
  location: string
  locationType: JobLocationType
  employmentType: JobEmploymentType
  salaryMin?: number
  salaryMax?: number
  salaryCurrency?: string
  skills: string[]
  postedAt: string | Date
  description?: string
  isBookmarked?: boolean
  isNew?: boolean
  isFeatured?: boolean
}

/**
 * JobCard Component
 * Premium job listing with refined interactions
 */

export interface JobCardProps {
  job: Job
  variant?: 'default' | 'compact'
  onBookmark?: (jobId: string) => void
  onClick?: (jobId: string) => void
  className?: string
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  variant = 'default',
  onBookmark,
  onClick,
  className,
}) => {
  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    onBookmark?.(job.id)
  }

  const isCompact = variant === 'compact'

  return (
    <Card
      interactive
      padding={isCompact ? 'sm' : 'md'}
      className={cn(
        'group relative',
        job.isFeatured && [
          'ring-1 ring-brand-200 dark:ring-brand-800/50',
          'bg-gradient-to-br from-brand-50/50 via-neutral-0 to-neutral-0',
          'dark:from-brand-950/30 dark:via-neutral-900 dark:to-neutral-900',
        ],
        className
      )}
      onClick={() => onClick?.(job.id)}
      role="article"
      aria-label={`${job.title} at ${job.company.name}`}
    >
      {/* Featured indicator */}
      {job.isFeatured && (
        <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent" />
      )}

      <div className={cn('flex gap-4', isCompact ? 'items-center' : 'items-start')}>
        {/* Company Logo */}
        <div
          className={cn(
            'shrink-0 rounded-lg flex items-center justify-center overflow-hidden',
            'bg-neutral-100 dark:bg-neutral-800',
            'border border-neutral-200/50 dark:border-neutral-700/50',
            isCompact ? 'w-10 h-10' : 'w-12 h-12'
          )}
        >
          {job.company.logo ? (
            <img
              src={job.company.logo}
              alt={`${job.company.name} logo`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className={cn(
              'font-semibold text-neutral-500 dark:text-neutral-400',
              isCompact ? 'text-sm' : 'text-base'
            )}>
              {job.company.name.charAt(0)}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-1">
            <div className="min-w-0 flex-1">
              {/* Company + badges row */}
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
                  {job.company.name}
                </span>
                {job.isFeatured && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium rounded bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300">
                    <Star size={10} strokeWidth={2.5} fill="currentColor" />
                    Featured
                  </span>
                )}
                {job.isNew && !job.isFeatured && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium rounded bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-400">
                    <Sparkles size={10} strokeWidth={2.5} />
                    New
                  </span>
                )}
              </div>

              {/* Job Title */}
              <h3
                className={cn(
                  'font-semibold text-neutral-900 dark:text-neutral-50',
                  'group-hover:text-brand-600 dark:group-hover:text-brand-400',
                  'transition-colors duration-150',
                  isCompact ? 'text-base truncate' : 'text-lg'
                )}
              >
                {job.title}
              </h3>
            </div>

            {/* Bookmark */}
            <button
              onClick={handleBookmark}
              className={cn(
                'shrink-0 p-1.5 rounded-lg',
                'transition-all duration-150',
                'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                'focus:outline-none focus:ring-2 focus:ring-brand-500/50',
                job.isBookmarked
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300'
              )}
              aria-label={job.isBookmarked ? 'Remove from saved' : 'Save job'}
            >
              <Bookmark
                size={18}
                strokeWidth={2}
                fill={job.isBookmarked ? 'currentColor' : 'none'}
              />
            </button>
          </div>

          {/* Meta */}
          <div className={cn(
            'flex flex-wrap items-center gap-x-3 gap-y-1',
            'text-sm text-neutral-500 dark:text-neutral-400',
            !isCompact && 'mb-3'
          )}>
            {/* Location */}
            <span className="inline-flex items-center gap-1">
              <MapPin size={14} strokeWidth={2} className="text-neutral-400" />
              {job.location}
            </span>

            {/* Salary */}
            {(job.salaryMin || job.salaryMax) && (
              <span className="inline-flex items-center gap-1">
                <DollarSign size={14} strokeWidth={2} className="text-neutral-400" />
                {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
              </span>
            )}

            {/* Posted time - compact only */}
            {isCompact && (
              <span className="inline-flex items-center gap-1 text-neutral-400" suppressHydrationWarning>
                <Clock size={14} strokeWidth={2} />
                {formatRelativeTime(job.postedAt)}
              </span>
            )}
          </div>

          {/* Badges row */}
          {!isCompact && (
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <JobTypeBadge type={job.locationType} size="sm" />
              <JobTypeBadge type={job.employmentType} size="sm" />
              <span className="text-xs text-neutral-400 dark:text-neutral-500" suppressHydrationWarning>
                {formatRelativeTime(job.postedAt)}
              </span>
            </div>
          )}

          {/* Skills */}
          {!isCompact && job.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {job.skills.slice(0, 5).map((skill) => (
                <Tag key={skill} size="sm">
                  {skill}
                </Tag>
              ))}
              {job.skills.length > 5 && (
                <span className="inline-flex items-center px-2 py-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                  +{job.skills.length - 5}
                </span>
              )}
            </div>
          )}

          {/* Compact skills */}
          {isCompact && job.skills.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              {job.skills.slice(0, 3).map((skill) => (
                <Tag key={skill} size="sm">
                  {skill}
                </Tag>
              ))}
              {job.skills.length > 3 && (
                <span className="text-xs text-neutral-400">+{job.skills.length - 3}</span>
              )}
            </div>
          )}
        </div>

        {/* View action - Desktop */}
        {!isCompact && (
          <div className="hidden lg:flex shrink-0 self-center">
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ChevronRight size={16} strokeWidth={2} />}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              View
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}

/**
 * JobCard Skeleton
 */

export const JobCardSkeleton: React.FC<{ variant?: 'default' | 'compact' }> = ({
  variant = 'default',
}) => {
  const isCompact = variant === 'compact'

  return (
    <Card padding={isCompact ? 'sm' : 'md'}>
      <div className="flex gap-4">
        <div className={cn('shrink-0 rounded-lg skeleton', isCompact ? 'w-10 h-10' : 'w-12 h-12')} />
        <div className="flex-1 space-y-2.5">
          <div className="h-3.5 w-24 skeleton rounded" />
          <div className={cn('skeleton rounded', isCompact ? 'h-4 w-48' : 'h-5 w-3/4')} />
          <div className="h-3.5 w-40 skeleton rounded" />
          {!isCompact && (
            <div className="flex gap-1.5 pt-1">
              <div className="h-6 w-16 skeleton rounded-md" />
              <div className="h-6 w-20 skeleton rounded-md" />
              <div className="h-6 w-14 skeleton rounded-md" />
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

/**
 * JobList Component
 */

export interface JobListProps {
  jobs: Job[]
  variant?: 'default' | 'compact'
  isLoading?: boolean
  loadingCount?: number
  onBookmark?: (jobId: string) => void
  onJobClick?: (jobId: string) => void
  className?: string
}

export const JobList: React.FC<JobListProps> = ({
  jobs,
  variant = 'default',
  isLoading,
  loadingCount = 5,
  onBookmark,
  onJobClick,
  className,
}) => {
  if (isLoading) {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: loadingCount }).map((_, i) => (
          <JobCardSkeleton key={i} variant={variant} />
        ))}
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className={cn('text-center py-16', className)}>
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
          <Briefcase className="w-6 h-6 text-neutral-400" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-1">
          No jobs found
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          variant={variant}
          onBookmark={onBookmark}
          onClick={onJobClick}
        />
      ))}
    </div>
  )
}
