import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

/**
 * Merge Tailwind CSS classes with clsx
 * Handles conflicts and deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format salary for display - India-focused with INR and Lakhs
 */
export function formatSalary(
  min?: number | null,
  max?: number | null,
  currency: string = 'INR'
): string {
  if (!min && !max) return 'Salary not specified'

  // For INR, use Lakhs/Crores format
  if (currency === 'INR') {
    const formatINR = (amount: number): string => {
      if (amount >= 10000000) {
        // Crores (1Cr = 10,000,000)
        const crores = amount / 10000000;
        return `₹${crores % 1 === 0 ? crores.toFixed(0) : crores.toFixed(1)}Cr`;
      }
      if (amount >= 100000) {
        // Lakhs (1L = 100,000)
        const lakhs = amount / 100000;
        return `₹${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)}L`;
      }
      // Under 1 lakh - show full number with Indian formatting
      return `₹${amount.toLocaleString('en-IN')}`;
    };

    if (min && max && min !== max) {
      return `${formatINR(min)} - ${formatINR(max)}`;
    }
    if (min) {
      return formatINR(min);
    }
    if (max) {
      return `Up to ${formatINR(max)}`;
    }
  }

  // Fallback for other currencies (USD, etc.)
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  })

  if (min && max) {
    return `${formatter.format(min)} - ${formatter.format(max)}`
  }
  if (min) {
    return `From ${formatter.format(min)}`
  }
  if (max) {
    return `Up to ${formatter.format(max)}`
  }
  return 'Salary not specified'
}

/**
 * Format Indian number with Lakhs/Crores
 */
export function formatIndianNumber(num: number): string {
  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(1)}Cr`;
  }
  if (num >= 100000) {
    return `${Math.round(num / 100000)}L`;
  }
  return num.toLocaleString('en-IN');
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const then = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000)

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ]

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds)
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`
    }
  }

  return 'Just now'
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Generate initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * Format number with K/M suffix (international) or L/Cr (India)
 */
export function formatCompactNumber(num: number, useIndian: boolean = true): string {
  if (useIndian) {
    if (num >= 10000000) {
      return (num / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr'
    }
    if (num >= 100000) {
      return (num / 100000).toFixed(1).replace(/\.0$/, '') + 'L'
    }
    return num.toLocaleString('en-IN')
  }
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return num.toString()
}

/**
 * Slugify text for URLs
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
