import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Card Component
 * Refined elevation and subtle interactions
 */

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline' | 'ghost'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  interactive?: boolean
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant = 'default', padding = 'md', interactive = false, children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl transition-all duration-200 ease-out',
          // Variant styles
          variant === 'default' && [
            'bg-neutral-0 dark:bg-neutral-900',
            'border border-neutral-200/80 dark:border-neutral-800',
            'shadow-sm',
          ],
          variant === 'elevated' && [
            'bg-neutral-0 dark:bg-neutral-850',
            'border border-neutral-100 dark:border-neutral-800/50',
            'shadow-md',
          ],
          variant === 'outline' && [
            'bg-transparent',
            'border border-neutral-200 dark:border-neutral-700',
          ],
          variant === 'ghost' && [
            'bg-neutral-50/50 dark:bg-neutral-800/30',
          ],
          // Interactive states
          interactive && [
            'cursor-pointer',
            'hover:border-neutral-300 dark:hover:border-neutral-700',
            'hover:shadow-md',
            'active:scale-[0.995]',
          ],
          // Padding
          paddingStyles[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

/**
 * Card sub-components for structured content
 */

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col gap-1', className)} {...props} />
))
CardHeader.displayName = 'CardHeader'

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-lg font-semibold text-neutral-900 dark:text-neutral-50', className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-neutral-500 dark:text-neutral-400', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props} />
))
CardContent.displayName = 'CardContent'

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-3 pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

/**
 * Skeleton Card
 * Loading placeholder with shimmer effect
 */

export const CardSkeleton: React.FC<{ className?: string; lines?: number }> = ({
  className,
  lines = 3,
}) => (
  <div
    className={cn(
      'rounded-xl bg-neutral-0 dark:bg-neutral-900',
      'border border-neutral-200/80 dark:border-neutral-800',
      'p-5',
      className
    )}
  >
    <div className="flex gap-4">
      {/* Logo skeleton */}
      <div className="w-12 h-12 rounded-lg skeleton shrink-0" />
      <div className="flex-1 space-y-3">
        {/* Title skeleton */}
        <div className="h-4 w-28 skeleton rounded" />
        <div className="h-5 w-3/4 skeleton rounded" />
        {/* Lines */}
        {Array.from({ length: lines - 1 }).map((_, i) => (
          <div
            key={i}
            className={cn('h-4 skeleton rounded', i === 0 ? 'w-1/2' : 'w-2/3')}
          />
        ))}
      </div>
    </div>
  </div>
)
