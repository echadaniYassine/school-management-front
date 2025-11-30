import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { LoadingSpinner } from './components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute, AdminRoute } from '@/components/auth/ProtectedRoute'
// import { USER_ROLES } from '@/constants'

// Lazy load pages - components are already .jsx, no need to specify extension
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Login = lazy(() => import('@/pages/auth/Login'))
const Register = lazy(() => import('@/pages/auth/Register'))
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword'))
// const Schedule = lazy(() => import('@/pages/Schedule'))
const Students = lazy(() => import('@/pages/Students'))
const Guardians = lazy(() => import('@/pages/Guardians'))
const Teachers = lazy(() => import('@/pages/Teachers'))
const Registrations = lazy(() => import('@/pages/Registrations'))
const Profile = lazy(() => import('@/pages/Profile'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const Home = lazy(() => import('@/pages/Home'))

// Centralized loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
)

// Public route wrapper to handle authenticated user redirects
function PublicRoute({ children }) {
  const { user } = useAuth()
  return !user ? children : <Navigate to="/dashboard" replace />
}

function AppRoutes() {
  const { user, loading } = useAuth()

  // Show loading state while checking authentication
  if (loading) {
    return <LoadingFallback />
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes - redirect to dashboard if authenticated */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Password reset routes - accessible to all */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected routes - require authentication */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin-only routes */}
        {/* <Route
          path="/schedule"
          element={
            <ProtectedRoute roles={['admin']}>
              <Schedule />
            </ProtectedRoute>
          } */}
        {/* /> */}
        <Route
          path="/students"
          element={
            <ProtectedRoute roles={['admin']}>
              <Students />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teachers"
          element={
            <ProtectedRoute roles={['admin']}>
              <Teachers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guardians"
          element={
            <ProtectedRoute roles={['admin']}>
              <Guardians />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registrations"
          element={
            <ProtectedRoute roles={['admin']}>
              <Registrations />
            </ProtectedRoute>
          }
        />

        {/* 404 Not Found - catch all unmatched routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes