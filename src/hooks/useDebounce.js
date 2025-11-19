import { useState, useEffect } from 'react'
import { debounce } from '@/lib/utils'

export default function useDebounce(value, delay) {

  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = debounce(() => setDebouncedValue(value), delay)
    handler()
  }, [value, delay])
  
  return debouncedValue
}