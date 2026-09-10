/**
 * ClientOnly Component
 * =============================================================================
 * Renders children only on the client side to avoid hydration mismatches.
 * Use for components that depend on client-only state like React Query data.
 */

import { useState, useEffect, type ReactNode } from 'react'

interface ClientOnlyProps {
  children: ReactNode
  fallback?: ReactNode
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
