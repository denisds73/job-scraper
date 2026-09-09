import React, { useState } from 'react'
import { 
  Briefcase, 
  Menu, 
  X, 
  Moon, 
  Sun,
  ChevronDown,
  Search,
  Bell,
  Bookmark
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '../ui/Button'

/**
 * Header Component
 * Clean, professional navigation with glass effect
 */

export interface HeaderProps {
  className?: string
  onThemeToggle?: () => void
  isDarkMode?: boolean
}

export const Header: React.FC<HeaderProps> = ({
  className,
  onThemeToggle,
  isDarkMode = false,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Find Jobs', href: '/search', active: true },
    { label: 'Companies', href: '/companies' },
    { label: 'Salaries', href: '/salaries' },
    { label: 'Resources', href: '/resources' },
  ]

  return (
    <header
      className={cn(
        'sticky top-0 z-sticky',
        'bg-neutral-0/90 dark:bg-neutral-950/90',
        'backdrop-blur-lg',
        'border-b border-neutral-200/80 dark:border-neutral-800/80',
        className
      )}
    >
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center',
              'bg-gradient-to-br from-brand-600 to-brand-700',
              'shadow-sm',
              'transition-transform duration-200 group-hover:scale-105'
            )}>
              <Briefcase className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 tracking-tight">
              JobScout
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3.5 py-2 rounded-lg text-sm font-medium',
                  'transition-colors duration-150',
                  link.active
                    ? 'text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-900/20'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Search - Desktop */}
            <button
              className={cn(
                'hidden lg:flex items-center gap-2',
                'h-9 px-3 rounded-lg',
                'bg-neutral-100 dark:bg-neutral-800',
                'text-neutral-500 dark:text-neutral-400',
                'text-sm',
                'hover:bg-neutral-200 dark:hover:bg-neutral-700',
                'transition-colors duration-150'
              )}
            >
              <Search size={16} strokeWidth={2} />
              <span>Search...</span>
              <kbd className="hidden xl:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-neutral-200 dark:bg-neutral-700 rounded">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onThemeToggle}
              className={cn(
                'p-2 rounded-lg',
                'text-neutral-500 dark:text-neutral-400',
                'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                'hover:text-neutral-700 dark:hover:text-neutral-200',
                'transition-colors duration-150',
                'focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:ring-offset-2'
              )}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <Sun size={18} strokeWidth={2} />
              ) : (
                <Moon size={18} strokeWidth={2} />
              )}
            </button>

            {/* Notifications - Desktop */}
            <button
              className={cn(
                'hidden sm:flex p-2 rounded-lg',
                'text-neutral-500 dark:text-neutral-400',
                'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                'hover:text-neutral-700 dark:hover:text-neutral-200',
                'transition-colors duration-150'
              )}
              aria-label="Notifications"
            >
              <Bell size={18} strokeWidth={2} />
            </button>

            {/* Saved Jobs - Desktop */}
            <button
              className={cn(
                'hidden sm:flex p-2 rounded-lg',
                'text-neutral-500 dark:text-neutral-400',
                'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                'hover:text-neutral-700 dark:hover:text-neutral-200',
                'transition-colors duration-150'
              )}
              aria-label="Saved jobs"
            >
              <Bookmark size={18} strokeWidth={2} />
            </button>

            {/* Divider */}
            <div className="hidden sm:block w-px h-6 bg-neutral-200 dark:bg-neutral-700 mx-1" />

            {/* Auth buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
              <Button variant="primary" size="sm">
                Post a Job
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                'md:hidden p-2 rounded-lg',
                'text-neutral-500 dark:text-neutral-400',
                'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                'transition-colors duration-150'
              )}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X size={20} strokeWidth={2} />
              ) : (
                <Menu size={20} strokeWidth={2} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200 dark:border-neutral-800 animate-fade-in">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2.5 rounded-lg text-base font-medium',
                    'transition-colors duration-150',
                    link.active
                      ? 'text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-900/20'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  )}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex gap-2 pt-4 mt-2 border-t border-neutral-200 dark:border-neutral-800">
                <Button variant="secondary" size="md" fullWidth>
                  Sign in
                </Button>
                <Button variant="primary" size="md" fullWidth>
                  Post a Job
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

/**
 * Footer Component
 * Clean, organized footer
 */

export const Footer: React.FC<{ className?: string }> = ({ className }) => {
  const footerLinks = {
    'Job Seekers': [
      { label: 'Browse Jobs', href: '/search' },
      { label: 'Saved Jobs', href: '/saved' },
      { label: 'Job Alerts', href: '/alerts' },
      { label: 'Career Advice', href: '/resources' },
    ],
    'Employers': [
      { label: 'Post a Job', href: '/post' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Resources', href: '/employer-resources' },
    ],
    'Company': [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  }

  return (
    <footer
      className={cn(
        'bg-neutral-50 dark:bg-neutral-900',
        'border-t border-neutral-200 dark:border-neutral-800',
        className
      )}
    >
      <div className="container-main py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-brand-600 to-brand-700">
                <Briefcase className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                JobScout
              </span>
            </a>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs">
              Find your next opportunity in tech. We aggregate jobs from thousands of companies.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
            © {new Date().getFullYear()} JobScout. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
