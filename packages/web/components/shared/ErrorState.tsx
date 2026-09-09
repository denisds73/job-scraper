/**
 * Error States
 * =============================================================================
 * Error display components for failed data fetches and other errors.
 */

import React from 'react'
import { AlertCircle, RefreshCw, WifiOff, ServerOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

/**
 * Error State Props
 */
export interface ErrorStateProps {
  title?: string
  message?: string
  error?: Error | null
  onRetry?: () => void
  className?: string
}

/**
 * Generic Error State
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error while loading this content. Please try again.',
  error,
  onRetry,
  className,
}) => (
  <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
    <div className="w-14 h-14 mb-4 rounded-full bg-error-50 dark:bg-error-500/10 flex items-center justify-center">
      <AlertCircle className="w-6 h-6 text-error-600 dark:text-error-400" strokeWidth={1.5} />
    </div>
    <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-1">
      {title}
    </h3>
    <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mb-4">
      {message}
    </p>
    {process.env.NODE_ENV === 'development' && error && (
      <pre className="text-xs text-neutral-400 bg-neutral-100 dark:bg-neutral-800 p-2 rounded mb-4 max-w-md overflow-auto">
        {error.message}
      </pre>
    )}
    {onRetry && (
      <Button 
        variant="secondary" 
        size="sm"
        onClick={onRetry}
        leftIcon={<RefreshCw size={14} />}
      >
        Try again
      </Button>
    )}
  </div>
)

/**
 * Network Error State
 */
export const NetworkError: React.FC<Omit<ErrorStateProps, 'title' | 'message'>> = (props) => (
  <ErrorState
    title="Connection error"
    message="Unable to connect to the server. Please check your internet connection."
    {...props}
  />
)

/**
 * Server Error State
 */
export const ServerError: React.FC<Omit<ErrorStateProps, 'title' | 'message'>> = (props) => (
  <ErrorState
    title="Server error"
    message="The server is experiencing issues. Please try again later."
    {...props}
  />
)

/**
 * Not Found Error State
 */
export interface NotFoundProps {
  title?: string
  message?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export const NotFound: React.FC<NotFoundProps> = ({
  title = 'Not found',
  message = 'The content you\'re looking for doesn\'t exist or has been removed.',
  actionLabel = 'Go back',
  onAction,
  className,
}) => (
  <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
    <div className="w-14 h-14 mb-4 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
      <ServerOff className="w-6 h-6 text-neutral-400" strokeWidth={1.5} />
    </div>
    <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-1">
      {title}
    </h3>
    <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mb-4">
      {message}
    </p>
    {onAction && (
      <Button variant="secondary" size="sm" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
)
