/**
 * Skeleton Components
 * =============================================================================
 * Loading placeholder components for improved perceived performance.
 */

import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Base Skeleton
 * Animated placeholder box
 */
export interface SkeletonProps {
  className?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div className={cn('skeleton rounded', className)} />
)

/**
 * Text Skeleton
 * Placeholder for text content
 */
export interface TextSkeletonProps {
  lines?: number
  lastLineWidth?: string
  className?: string
}

export const TextSkeleton: React.FC<TextSkeletonProps> = ({
  lines = 3,
  lastLineWidth = '60%',
  className,
}) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="h-4 skeleton rounded"
        style={{
          width: i === lines - 1 ? lastLineWidth : '100%',
        }}
      />
    ))}
  </div>
)

/**
 * Card Skeleton
 * Generic card placeholder
 */
export interface CardSkeletonProps {
  className?: string
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ className }) => (
  <div className={cn('p-4 rounded-lg border border-neutral-200 dark:border-neutral-800', className)}>
    <div className="flex gap-4">
      <div className="w-12 h-12 skeleton rounded-lg" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-24 skeleton rounded" />
        <div className="h-5 w-3/4 skeleton rounded" />
        <div className="h-4 w-40 skeleton rounded" />
      </div>
    </div>
  </div>
)

/**
 * List Skeleton
 * Multiple card placeholders
 */
export interface ListSkeletonProps {
  count?: number
  className?: string
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({ count = 5, className }) => (
  <div className={cn('space-y-3', className)}>
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
)

/**
 * Grid Skeleton
 * Grid of card placeholders
 */
export interface GridSkeletonProps {
  count?: number
  columns?: 2 | 3 | 4 | 6
  className?: string
}

export const GridSkeleton: React.FC<GridSkeletonProps> = ({ 
  count = 6, 
  columns = 3, 
  className 
}) => {
  const colsClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
  }[columns]

  return (
    <div className={cn('grid gap-4', colsClass, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800"
        >
          <div className="w-12 h-12 mx-auto mb-3 skeleton rounded-lg" />
          <div className="h-4 w-20 mx-auto skeleton rounded mb-1" />
          <div className="h-3 w-12 mx-auto skeleton rounded" />
        </div>
      ))}
    </div>
  )
}
