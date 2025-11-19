// src/components/forms/SearchableSelect.jsx
import { useState, useRef, useEffect } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input, Button } from '@/components/ui'
import useDebounce from '@/hooks/useDebounce'

export const SearchableSelect = ({
  options = [],
  value,
  onChange,
  onSearch,
  placeholder = 'Select an option...',
  searchPlaceholder = 'Search...',
  loading = false,
  disabled = false,
  error,
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const containerRef = useRef(null)
  const searchInputRef = useRef(null)

  // Handle search
  useEffect(() => {
    if (onSearch && debouncedSearchTerm) {
      onSearch(debouncedSearchTerm)
    }
  }, [debouncedSearchTerm, onSearch])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  const selectedOption = options.find(option => option.value === value)
  const filteredOptions = searchTerm
    ? options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : options

  const handleOptionSelect = (option) => {
    onChange(option.value)
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      setIsOpen(!isOpen)
    } else if (event.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div ref={containerRef} className={cn('relative', className)} {...props}>
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={cn(
          'w-full justify-between',
          !selectedOption && 'text-muted-foreground',
          error && 'border-red-500',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
      >
        {selectedOption ? selectedOption.label : placeholder}
        <ChevronDown className={cn(
          'ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </Button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-8"
              />
            </div>
          </div>

          <div className="max-h-60 overflow-auto p-1" role="listbox">
            {loading ? (
              <div className="px-2 py-3 text-center text-sm text-muted-foreground">
                Loading...
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="px-2 py-3 text-center text-sm text-muted-foreground">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  className={cn(
                    'w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent focus:bg-accent focus:outline-none flex items-center justify-between',
                    option.value === value && 'bg-accent'
                  )}
                  onClick={() => handleOptionSelect(option)}
                >
                  {option.label}
                  {option.value === value && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}