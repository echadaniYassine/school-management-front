// src/hooks/useForm.js - Custom form handling hook
import { useState, useCallback } from 'react'

export const useForm = (initialValues = {}, validationSchema = {}) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }, [errors])

  const setError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }))
  }, [])

  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched(prev => ({ ...prev, [name]: isTouched }))
  }, [])

  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target
    const fieldValue = type === 'checkbox' ? checked : value
    setValue(name, fieldValue)
  }, [setValue])

  const handleBlur = useCallback((event) => {
    const { name } = event.target
    setFieldTouched(name, true)
    
    // Validate field on blur if validation schema exists
    if (validationSchema[name]) {
      try {
        validationSchema[name](values[name])
        setError(name, '')
      } catch (error) {
        setError(name, error.message)
      }
    }
  }, [values, validationSchema, setFieldTouched, setError])

  const validate = useCallback(() => {
    const newErrors = {}
    
    Object.keys(validationSchema).forEach(key => {
      try {
        validationSchema[key](values[key])
      } catch (error) {
        newErrors[key] = error.message
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [values, validationSchema])

  const reset = useCallback((newValues = initialValues) => {
    setValues(newValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  const handleSubmit = useCallback((onSubmit) => {
    return async (event) => {
      event.preventDefault()
      
      if (isSubmitting) return
      
      setIsSubmitting(true)
      
      const isValid = validate()
      if (!isValid) {
        setIsSubmitting(false)
        return
      }
      
      try {
        await onSubmit(values)
      } catch (error) {
        console.error('Form submission error:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }, [values, validate, isSubmitting])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setError,
    setFieldTouched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    validate
  }
}