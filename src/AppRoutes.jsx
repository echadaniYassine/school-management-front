import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { LoadingSpinner } from './components/ui/index'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

// Lazy load pages with the .jsx extension
const Dashboard = lazy(() => import('@/pages/Dashboard.jsx'))
const Login = lazy(() => import('@/pages/auth/Login.jsx'))
const Register = lazy(() => import('@/pages/auth/Register.jsx'))
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword.jsx'))
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword.jsx'))
const Programs = lazy(() => import('@/pages/Programs.jsx'))
const Students = lazy(() => import('@/pages/Students.jsx'))
const Guardians = lazy(() => import('@/pages/Guardians.jsx'))
const Teachers = lazy(() => import('@/pages/Teachers.jsx'))
const Registrations = lazy(() => import('@/pages/Registrations.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))
const NotFound = lazy(() => import('@/pages/NotFound.jsx'))
const Home = lazy(() => import('@/pages/Home.jsx'))


function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <Routes>
        {/* Public routes */}
        <Route path="/" element={!user ? <Home /> : <Navigate to="/dashboard" replace />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/dashboard" replace />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />


        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/programs"
          element={
            <ProtectedRoute roles={['admin']}>
              <Programs />
            </ProtectedRoute>
          }
        />
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
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes