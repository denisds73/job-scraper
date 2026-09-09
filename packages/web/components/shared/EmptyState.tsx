/**
 * Empty States
 * =============================================================================
 * Empty state components for when there's no data to display.
 */

import React from 'react'
import { Briefcase, Search, Building2, Filter, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

/**
 * Empty State Props
 */
export interface EmptyStateProps {
  icon?: React.ElementType
  title: string
  message?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

/**
 * Generic Empty State
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Briefcase,
  title,
  message,
  actionLabel,
  onAction,
  className,
}) => (
  <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
    <div className="w-14 h-14 mb-4 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
      <Icon className="w-6 h-6 text-neutral-400" strokeWidth={1.5} />
    </div>
    <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-1">
      {title}
    </h3>
    {message && (
      <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mb-4">
        {message}
      </p>
    )}
    {actionLabel && onAction && (
      <Button variant="secondary" size="sm" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
)

/**
 * No Jobs Found State
 */
export interface NoJobsProps {
  hasFilters?: boolean
  onClearFilters?: () => void
  onBrowseAll?: () => void
  className?: string
}

export const NoJobs: React.FC<NoJobsProps> = ({
  hasFilters = false,
  onClearFilters,
  onBrowseAll,
  className,
}) => (
  <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
    <div className="w-14 h-14 mb-4 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
      {hasFilters ? (
        <Filter className="w-6 h-6 text-neutral-400" strokeWidth={1.5} />
      ) : (
        <Search className="w-6 h-6 text-neutral-400" strokeWidth={1.5} />
      )}
    </div>
    <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-1">
      No jobs found
    </h3>
    <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mb-4">
      {hasFilters 
        ? 'Try adjusting your filters or search terms to find more results.'
        : 'We couldn\'t find any jobs matching your criteria. Try a different search.'}
    </p>
    <div className="flex gap-2">
      {hasFilters && onClearFilters && (
        <Button variant="secondary" size="sm" onClick={onClearFilters}>
          Clear filters
        </Button>
      )}
      {onBrowseAll && (
        <Button variant="ghost" size="sm" onClick={onBrowseAll}>
          Browse all jobs
        </Button>
      )}
    </div>
  </div>
)

/**
 * No Companies State
 */
export const NoCompanies: React.FC<{ className?: string }> = ({ className }) => (
  <EmptyState
    icon={Building2}
    title="No companies found"
    message="We couldn't find any companies matching your criteria."
    className={className}
  />
)

/**
 * No Saved Jobs State
 */
export interface NoSavedJobsProps {
  onBrowseJobs?: () => void
  className?: string
}

export const NoSavedJobs: React.FC<NoSavedJobsProps> = ({ onBrowseJobs, className }) => (
  <EmptyState
    icon={Heart}
    title="No saved jobs yet"
    message="Jobs you save will appear here. Start browsing to find opportunities you love."
    actionLabel="Browse jobs"
    onAction={onBrowseJobs}
    className={className}
  />
)

/**
 * Empty Search Results State
 */
export interface EmptySearchProps {
  query?: string
  onClear?: () => void
  className?: string
}

export const EmptySearch: React.FC<EmptySearchProps> = ({ query, onClear, className }) => (
  <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
    <div className="w-14 h-14 mb-4 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
      <Search className="w-6 h-6 text-neutral-400" strokeWidth={1.5} />
    </div>
    <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-1">
      No results for "{query}"
    </h3>
    <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mb-4">
      Try checking your spelling or using more general terms.
    </p>
    {onClear && (
      <Button variant="secondary" size="sm" onClick={onClear}>
        Clear search
      </Button>
    )}
  </div>
)
