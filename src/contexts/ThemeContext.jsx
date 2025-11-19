// src/contexts/ThemeContext.jsx
import { createContext, useContext, useEffect } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {}
})

const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('theme', THEMES.SYSTEM)

  useEffect(() => {
    const root = window.document.documentElement
    
    // Remove all theme classes
    root.classList.remove(THEMES.LIGHT, THEMES.DARK)
    
    if (theme === THEMES.SYSTEM) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? THEMES.DARK
        : THEMES.LIGHT
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  // Listen for system theme changes
  useEffect(() => {
    if (theme === THEMES.SYSTEM) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      
      const handleChange = (e) => {
        const root = window.document.documentElement
        root.classList.remove(THEMES.LIGHT, THEMES.DARK)
        root.classList.add(e.matches ? THEMES.DARK : THEMES.LIGHT)
      }

      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT)
  }

  const value = {
    theme,
    setTheme,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}