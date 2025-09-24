// src/contexts/AuthContext.jsx
import { createContext, useContext, useReducer, useEffect } from 'react'
import { authApi } from '@/services/api'

const AuthContext = createContext({})

const initialState = {
  user: null,
  token: null,
  loading: true,
  error: null,
}

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload.user, 
        token: action.payload.token,
        loading: false,
        error: null 
      }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'LOGOUT':
      return { ...initialState, loading: false }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    // Check for existing session on app start
    const token = localStorage.getItem('auth_token')
    const user = localStorage.getItem('auth_user')
    
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user)
        authApi.defaults.headers.common['Authorization'] = `Bearer ${token}`
        dispatch({ 
          type: 'SET_USER', 
          payload: { user: parsedUser, token } 
        })
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await authApi.post('/login', credentials)
      
      if (response.data.success) {
        const { user, token } = response.data.data
        
        localStorage.setItem('auth_token', token)
        localStorage.setItem('auth_user', JSON.stringify(user))
        authApi.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        dispatch({ type: 'SET_USER', payload: { user, token } })
        return { success: true }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      dispatch({ type: 'SET_ERROR', payload: message })
      return { success: false, message }
    }
  }

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await authApi.post('/register', userData)
      
      if (response.data.success) {
        const { guardian, token } = response.data.data
        
        localStorage.setItem('auth_token', token)
        localStorage.setItem('auth_user', JSON.stringify(guardian))
        authApi.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        dispatch({ type: 'SET_USER', payload: { user: guardian, token } })
        return { success: true }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      dispatch({ type: 'SET_ERROR', payload: message })
      return { success: false, message }
    }
  }

  const logout = async () => {
    try {
      await authApi.post('/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      delete authApi.defaults.headers.common['Authorization']
      dispatch({ type: 'LOGOUT' })
    }
  }

  const value = {
    ...state,
    login,
    register,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}