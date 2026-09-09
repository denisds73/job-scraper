import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Button Component
 * Google Material 3 inspired with refined interactions
 * 
 * Features:
 * - Subtle scale on active
 * - Proper focus rings
 * - Loading state with spinner
 * - Icon support with proper spacing
 */

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center',
    'font-medium',
    'rounded-lg',
    'transition-all duration-150 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    'select-none',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-brand-600 text-white',
          'hover:bg-brand-700',
          'active:bg-brand-800 active:scale-[0.98]',
          'focus-visible:ring-brand-500',
          'shadow-sm hover:shadow',
        ],
        secondary: [
          'bg-neutral-0 dark:bg-neutral-800',
          'text-neutral-700 dark:text-neutral-200',
          'border border-neutral-300 dark:border-neutral-600',
          'hover:bg-neutral-50 dark:hover:bg-neutral-750',
          'hover:border-neutral-400 dark:hover:border-neutral-500',
          'active:bg-neutral-100 dark:active:bg-neutral-700 active:scale-[0.98]',
          'focus-visible:ring-brand-500',
        ],
        ghost: [
          'text-neutral-600 dark:text-neutral-300',
          'hover:bg-neutral-100 dark:hover:bg-neutral-800',
          'hover:text-neutral-900 dark:hover:text-neutral-100',
          'active:bg-neutral-200 dark:active:bg-neutral-700',
          'focus-visible:ring-brand-500',
        ],
        accent: [
          'bg-accent-600 text-white',
          'hover:bg-accent-700',
          'active:bg-accent-800 active:scale-[0.98]',
          'focus-visible:ring-accent-500',
          'shadow-sm hover:shadow-accent',
        ],
        danger: [
          'bg-error-600 text-white',
          'hover:bg-error-700',
          'active:bg-error-800 active:scale-[0.98]',
          'focus-visible:ring-error-500',
        ],
        link: [
          'text-brand-600 dark:text-brand-400',
          'hover:text-brand-700 dark:hover:text-brand-300',
          'underline-offset-4 hover:underline',
          'focus-visible:ring-brand-500',
          'p-0 h-auto',
        ],
      },
      size: {
        xs: 'h-7 px-2.5 text-xs gap-1 rounded-md',
        sm: 'h-8 px-3 text-sm gap-1.5',
        md: 'h-9 px-4 text-sm gap-2',
        lg: 'h-10 px-5 text-base gap-2',
        xl: 'h-12 px-6 text-base gap-2.5',
        icon: 'h-9 w-9 p-0',
        'icon-sm': 'h-8 w-8 p-0',
        'icon-xs': 'h-7 w-7 p-0 rounded-md',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const iconSize = size === 'xs' ? 14 : size === 'sm' ? 16 : size === 'xl' ? 20 : 18

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={iconSize} />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { buttonVariants }
