import React from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Input Component
 * Clean, focused design with clear states
 */

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  inputSize?: 'sm' | 'md' | 'lg'
}

const sizeStyles = {
  sm: 'h-8 text-sm px-3',
  md: 'h-10 text-base px-3',
  lg: 'h-12 text-lg px-4',
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      inputSize = 'md',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const hasError = !!error

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              'w-full rounded-lg',
              'bg-neutral-0 dark:bg-neutral-900',
              'text-neutral-900 dark:text-neutral-100',
              'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
              'transition-all duration-150 ease-out',
              // Border states
              hasError
                ? 'border-error-500 focus:border-error-500 focus:ring-error-500/30'
                : 'border-neutral-300 dark:border-neutral-700 focus:border-brand-500 focus:ring-brand-500/30',
              'border',
              'focus:outline-none focus:ring-2',
              // Hover
              'hover:border-neutral-400 dark:hover:border-neutral-600',
              // Disabled
              'disabled:bg-neutral-100 dark:disabled:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60',
              // Size
              sizeStyles[inputSize],
              // Icon padding
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            aria-invalid={hasError}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-error-600 dark:text-error-400">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

/**
 * SearchInput Component
 * Prominent search with clear button
 */

export interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'rightIcon'> {
  onClear?: () => void
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onClear, value, inputSize = 'lg', ...props }, ref) => {
    const hasValue = value && String(value).length > 0

    return (
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 pointer-events-none">
          <Search size={20} strokeWidth={2} />
        </div>
        <input
          ref={ref}
          type="search"
          value={value}
          className={cn(
            'w-full h-12 md:h-14',
            'bg-neutral-0 dark:bg-neutral-900',
            'border border-neutral-200 dark:border-neutral-700',
            'rounded-xl',
            'pl-12 pr-12 text-base md:text-lg',
            'text-neutral-900 dark:text-neutral-100',
            'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
            'shadow-sm',
            'transition-all duration-200 ease-out',
            'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500',
            'focus:shadow-md',
            // Hide native clear button
            '[&::-webkit-search-cancel-button]:hidden',
            className
          )}
          {...props}
        />
        {hasValue && onClear && (
          <button
            type="button"
            onClick={onClear}
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2',
              'p-1.5 rounded-lg',
              'text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300',
              'hover:bg-neutral-100 dark:hover:bg-neutral-800',
              'transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-brand-500/50'
            )}
            aria-label="Clear search"
          >
            <X size={18} strokeWidth={2} />
          </button>
        )}
      </div>
    )
  }
)

SearchInput.displayName = 'SearchInput'
