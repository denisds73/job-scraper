import React, { useState } from 'react'
import { SlidersHorizontal, ChevronDown, X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '../ui/Button'
import { Tag } from '../ui/Badge'

/**
 * Filter Types
 */

export interface FilterOption {
  id: string
  label: string
  count?: number
}

export interface FilterGroup {
  id: string
  label: string
  options: FilterOption[]
  type: 'checkbox' | 'radio'
}

/**
 * FilterSidebar Component
 * Professional filter panel with smooth interactions
 */

export interface FilterSidebarProps {
  filters: FilterGroup[]
  selectedFilters: Record<string, string[]>
  onFilterChange: (groupId: string, values: string[]) => void
  onClearAll?: () => void
  isOpen?: boolean
  onClose?: () => void
  className?: string
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  selectedFilters,
  onFilterChange,
  onClearAll,
  isOpen = true,
  onClose,
  className,
}) => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(
    filters.map((f) => f.id)
  )

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    )
  }

  const handleOptionToggle = (groupId: string, optionId: string, type: 'checkbox' | 'radio') => {
    const currentValues = selectedFilters[groupId] || []
    
    if (type === 'radio') {
      onFilterChange(groupId, [optionId])
    } else {
      const newValues = currentValues.includes(optionId)
        ? currentValues.filter((id) => id !== optionId)
        : [...currentValues, optionId]
      onFilterChange(groupId, newValues)
    }
  }

  const totalActiveFilters = Object.values(selectedFilters).flat().length

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-40 animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'bg-neutral-0 dark:bg-neutral-900',
          'lg:border-r border-neutral-200 dark:border-neutral-800',
          // Desktop
          'lg:relative lg:translate-x-0 lg:w-64 xl:w-72 lg:shrink-0',
          // Mobile
          'fixed lg:static inset-y-0 left-0 z-50',
          'w-80 max-w-[85vw]',
          'transform transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        <div className="h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} strokeWidth={2} className="text-neutral-500" />
              <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                Filters
              </h2>
              {totalActiveFilters > 0 && (
                <span className="px-1.5 py-0.5 text-xs font-medium bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 rounded">
                  {totalActiveFilters}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {totalActiveFilters > 0 && (
                <button
                  onClick={onClearAll}
                  className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={onClose}
                className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Close filters"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Filter Groups */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {filters.map((group) => {
              const isExpanded = expandedGroups.includes(group.id)
              const selectedInGroup = selectedFilters[group.id]?.length || 0

              return (
                <div key={group.id} className="pb-4 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
                  {/* Group header */}
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between text-left mb-2 group"
                  >
                    <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                      {group.label}
                      {selectedInGroup > 0 && (
                        <span className="text-xs text-brand-600 dark:text-brand-400">
                          ({selectedInGroup})
                        </span>
                      )}
                    </span>
                    <ChevronDown
                      size={16}
                      strokeWidth={2}
                      className={cn(
                        'text-neutral-400 transition-transform duration-200',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  </button>

                  {/* Options */}
                  {isExpanded && (
                    <div className="space-y-1 animate-fade-in">
                      {group.options.map((option) => {
                        const isSelected = selectedFilters[group.id]?.includes(option.id)
                        
                        return (
                          <label
                            key={option.id}
                            className={cn(
                              'flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer',
                              'transition-colors duration-150',
                              isSelected
                                ? 'bg-brand-50 dark:bg-brand-900/20'
                                : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                            )}
                          >
                            {/* Custom checkbox/radio */}
                            <span
                              className={cn(
                                'flex items-center justify-center w-4 h-4 rounded border-2 transition-all duration-150',
                                group.type === 'radio' ? 'rounded-full' : 'rounded',
                                isSelected
                                  ? 'bg-brand-600 border-brand-600 text-white'
                                  : 'border-neutral-300 dark:border-neutral-600'
                              )}
                            >
                              {isSelected && (
                                group.type === 'radio' ? (
                                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                ) : (
                                  <Check size={12} strokeWidth={3} />
                                )
                              )}
                            </span>
                            <input
                              type={group.type}
                              checked={isSelected}
                              onChange={() => handleOptionToggle(group.id, option.id, group.type)}
                              className="sr-only"
                            />
                            <span className="flex-1 text-sm text-neutral-700 dark:text-neutral-300">
                              {option.label}
                            </span>
                            {option.count !== undefined && (
                              <span className="text-xs text-neutral-400 dark:text-neutral-500 tabular-nums">
                                {option.count.toLocaleString()}
                              </span>
                            )}
                          </label>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Mobile Apply Button */}
          <div className="lg:hidden p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-0 dark:bg-neutral-900">
            <Button variant="primary" size="lg" fullWidth onClick={onClose}>
              Show Results
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}

/**
 * ActiveFiltersBar Component
 */

export interface ActiveFiltersBarProps {
  filters: Record<string, string[]>
  filterLabels: Record<string, Record<string, string>>
  onRemove: (groupId: string, value: string) => void
  onClearAll: () => void
  className?: string
}

export const ActiveFiltersBar: React.FC<ActiveFiltersBarProps> = ({
  filters,
  filterLabels,
  onRemove,
  onClearAll,
  className,
}) => {
  const activeFilters = Object.entries(filters).flatMap(([groupId, values]) =>
    values.map((value) => ({
      groupId,
      value,
      label: filterLabels[groupId]?.[value] || value,
    }))
  )

  if (activeFilters.length === 0) return null

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-sm text-neutral-500 dark:text-neutral-400">
        Filters:
      </span>
      {activeFilters.map(({ groupId, value, label }) => (
        <Tag
          key={`${groupId}-${value}`}
          variant="brand"
          size="sm"
          removable
          onRemove={() => onRemove(groupId, value)}
        >
          {label}
        </Tag>
      ))}
      <button
        onClick={onClearAll}
        className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium ml-1"
      >
        Clear all
      </button>
    </div>
  )
}
