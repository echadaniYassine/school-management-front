
// src/components/forms/FormField.jsx
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Input, Button } from '@/components/ui'

export const FormField = forwardRef(({
  label,
  error,
  required = false,
  helpText,
  children,
  className,
  ...props
}, ref) => {
  const fieldId = props.id || `field-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label 
          htmlFor={fieldId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
      )}
      
      <div className="relative">
        {children ? children : (
          <Input
            ref={ref}
            id={fieldId}
            className={cn(
              error && "border-red-500 focus:border-red-500 focus:ring-red-500"
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${fieldId}-error` : 
              helpText ? `${fieldId}-help` : undefined
            }
            {...props}
          />
        )}
      </div>

      {error && (
        <p 
          id={`${fieldId}-error`}
          className="text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}

      {helpText && !error && (
        <p 
          id={`${fieldId}-help`}
          className="text-sm text-muted-foreground"
        >
          {helpText}
        </p>
      )}
    </div>
  )
})

FormField.displayName = 'FormField'
