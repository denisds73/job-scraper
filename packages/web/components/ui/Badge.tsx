import React from 'react'
import { 
  Globe, 
  Building2, 
  RefreshCw, 
  Clock, 
  Timer, 
  FileText,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Badge Component
 * Small status indicators with refined styling
 */

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'brand' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
  dot?: boolean
}

const badgeVariants = {
  default: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
  brand: 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300',
  success: 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-500',
  warning: 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-500',
  error: 'bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-500',
  info: 'bg-info-50 text-info-700 dark:bg-info-500/10 dark:text-info-500',
}

const dotColors = {
  default: 'bg-neutral-500',
  brand: 'bg-brand-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
  info: 'bg-info-500',
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', dot, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 font-medium rounded-md',
          size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-0.5 text-xs',
          badgeVariants[variant],
          className
        )}
        {...props}
      >
        {dot && (
          <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />
        )}
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

/**
 * Tag Component
 * Interactive pills for skills and filters
 */

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'brand'
  size?: 'sm' | 'md'
  interactive?: boolean
  selected?: boolean
  removable?: boolean
  onRemove?: () => void
}

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      interactive,
      selected,
      removable,
      onRemove,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 font-medium rounded-md',
          'transition-all duration-150 ease-out',
          // Size
          size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
          // Variant
          variant === 'default' && [
            'bg-neutral-100 text-neutral-700',
            'dark:bg-neutral-800 dark:text-neutral-300',
          ],
          variant === 'outline' && [
            'border border-neutral-300 text-neutral-700',
            'dark:border-neutral-600 dark:text-neutral-300',
            'bg-transparent',
          ],
          variant === 'brand' && [
            'bg-brand-50 text-brand-700 border border-brand-200',
            'dark:bg-brand-900/20 dark:text-brand-300 dark:border-brand-800',
          ],
          // Selected state
          selected && [
            'bg-brand-100 text-brand-800 border-brand-300',
            'dark:bg-brand-900/30 dark:text-brand-200 dark:border-brand-700',
          ],
          // Interactive
          interactive && [
            'cursor-pointer',
            'hover:bg-neutral-200 dark:hover:bg-neutral-700',
            variant === 'outline' && 'hover:border-neutral-400 dark:hover:border-neutral-500',
          ],
          className
        )}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        {...props}
      >
        {children}
        {removable && onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className={cn(
              '-mr-0.5 p-0.5 rounded',
              'hover:bg-neutral-900/10 dark:hover:bg-neutral-0/10',
              'transition-colors duration-100'
            )}
            aria-label="Remove"
          >
            <X size={12} strokeWidth={2.5} />
          </button>
        )}
      </span>
    )
  }
)

Tag.displayName = 'Tag'

/**
 * JobTypeBadge Component
 * Specialized badges for job attributes with icons
 */

export type JobLocationType = 'remote' | 'hybrid' | 'onsite'
export type JobEmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship'

const locationTypeConfig: Record<JobLocationType, { label: string; icon: React.ElementType; className: string }> = {
  remote: {
    label: 'Remote',
    icon: Globe,
    className: 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400',
  },
  hybrid: {
    label: 'Hybrid',
    icon: RefreshCw,
    className: 'bg-info-50 text-info-700 dark:bg-info-500/10 dark:text-info-400',
  },
  onsite: {
    label: 'On-site',
    icon: Building2,
    className: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
  },
}

const employmentTypeConfig: Record<JobEmploymentType, { label: string; icon: React.ElementType; className: string }> = {
  'full-time': {
    label: 'Full-time',
    icon: Clock,
    className: 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300',
  },
  'part-time': {
    label: 'Part-time',
    icon: Timer,
    className: 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-500',
  },
  contract: {
    label: 'Contract',
    icon: FileText,
    className: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
  },
  internship: {
    label: 'Internship',
    icon: Timer,
    className: 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
  },
}

export interface JobTypeBadgeProps {
  type: JobLocationType | JobEmploymentType
  showIcon?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export const JobTypeBadge: React.FC<JobTypeBadgeProps> = ({
  type,
  showIcon = true,
  size = 'sm',
  className,
}) => {
  const config = locationTypeConfig[type as JobLocationType] || employmentTypeConfig[type as JobEmploymentType]
  if (!config) return null

  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-md',
        size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-0.5 text-xs',
        config.className,
        className
      )}
    >
      {showIcon && <Icon size={size === 'sm' ? 12 : 14} strokeWidth={2} />}
      {config.label}
    </span>
  )
}
