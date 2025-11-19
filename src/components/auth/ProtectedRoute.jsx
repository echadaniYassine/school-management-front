// src/components/auth/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { LoadingSpinner } from '@/components/ui'
import { USER_ROLES } from '@/constants'

/**
 * ProtectedRoute Component
 * Handles authentication and authorization for protected routes
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string[]} [props.roles] - Array of allowed user roles
 * @param {string} [props.redirectTo='/login'] - Redirect path for unauthorized users
 */
export function ProtectedRoute({
  children,
  roles = null,
  redirectTo = '/login'
}) {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location.pathname }}
        replace
      />
    )
  }

  // Check role-based authorization
  if (roles && roles.length > 0) {
    const hasRequiredRole = roles.includes(user.role)

    if (!hasRequiredRole) {
      // Redirect to dashboard with unauthorized message
      return (
        <Navigate
          to="/dashboard"
          state={{
            unauthorized: true,
            message: 'You do not have permission to access this page'
          }}
          replace
        />
      )
    }
  }

  // User is authenticated and authorized
  return children
}

/**
 * Admin-only route wrapper
 */
export function AdminRoute({ children }) {
  return (
    <ProtectedRoute roles={[USER_ROLES.ADMIN]}>
      {children}
    </ProtectedRoute>
  )
}

/**
 * Teacher route wrapper
 */
export function TeacherRoute({ children }) {
  return (
    <ProtectedRoute roles={[USER_ROLES.ADMIN, USER_ROLES.TEACHER]}>
      {children}
    </ProtectedRoute>
  )
}

/**
 * Guardian route wrapper
 */
export function GuardianRoute({ children }) {
  return (
    <ProtectedRoute roles={[USER_ROLES.ADMIN, USER_ROLES.GUARDIAN]}>
      {children}
    </ProtectedRoute>
  )
}

/**
 * Student route wrapper
 */
export function StudentRoute({ children }) {
  return (
    <ProtectedRoute roles={[USER_ROLES.ADMIN, USER_ROLES.STUDENT]}>
      {children}
    </ProtectedRoute>
  )
}

export default ProtectedRoute