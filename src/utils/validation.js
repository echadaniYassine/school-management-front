// src/utils/validation.js - Validation utilities
export const createValidator = (rules) => {
  return (value) => {
    for (const rule of rules) {
      const result = rule(value)
      if (result !== true) {
        throw new Error(result)
      }
    }
    return true
  }
}

export const validationRules = {
  required: (message = 'This field is required') => (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return message
    }
    return true
  },

  email: (message = 'Please enter a valid email address') => (value) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return message
    }
    return true
  },

  minLength: (min, message) => (value) => {
    const msg = message || `Must be at least ${min} characters`
    if (value && value.length < min) {
      return msg
    }
    return true
  },

  maxLength: (max, message) => (value) => {
    const msg = message || `Must be no more than ${max} characters`
    if (value && value.length > max) {
      return msg
    }
    return true
  },

  pattern: (regex, message = 'Invalid format') => (value) => {
    if (value && !regex.test(value)) {
      return message
    }
    return true
  },

  min: (minValue, message) => (value) => {
    const msg = message || `Must be at least ${minValue}`
    if (value !== undefined && value !== null && Number(value) < minValue) {
      return msg
    }
    return true
  },

  max: (maxValue, message) => (value) => {
    const msg = message || `Must be no more than ${maxValue}`
    if (value !== undefined && value !== null && Number(value) > maxValue) {
      return msg
    }
    return true
  }
}
export const validate = (formData, rules) => {
  const errors = {}
  let valid = true

  for (const field in rules) {
    const fieldRules = rules[field]

    for (const rule of fieldRules) {
      let check

      if (typeof rule === 'string') {
        const validator = validationRules[rule]
        check = validator && validator()(formData[field])
      } else if (typeof rule === 'function') {
        check = rule(formData[field])
      }

      if (check !== true) {
        errors[field] = check
        valid = false
        break
      }
    }
  }

  return { valid, errors }
}
