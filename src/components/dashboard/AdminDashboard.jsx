import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  Calendar,
  Bell,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui'
import { StatsGrid, DashboardHeader } from '@/components/dashboard'
import { useAdminDashboardData } from '@/hooks/useAdminDashboardData'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

// Extracted constants for better maintainability
const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  },
  item: {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }
}

// Separated stats configuration for better organization
const useStatsConfig = (data, loading) => {
  const { t } = useTranslation()

  return useMemo(() => {
    const {
      studentsData = [],
      teachersData = [],
      guardiansData = [],
      // programsData = [],
      // registrationsData = []
    } = data

    // const pendingRegistrations = Array.isArray(registrationsData)
    //   ? registrationsData.filter(r => r.status === 'pending').length
    //   : 0

    return [
      {
        id: 'students',
        title: t('dashboard.totalStudents'),
        value: studentsData.length,
        icon: Users,
        change: '+12%',
        changeType: 'positive',
        color: 'blue',
        loading: loading.students
      },
      {
        id: 'teachers',
        title: t('dashboard.totalTeachers'),
        value: teachersData.length,
        icon: Users,
        change: '+8%',
        changeType: 'positive',
        color: 'green',
        loading: loading.teachers
      },
      {
        id: 'guardians',
        title: t('dashboard.totalGuardians'),
        value: guardiansData.length,
        icon: GraduationCap,
        change: '+5%',
        changeType: 'positive',
        color: 'purple',
        loading: loading.guardians
      },
      // {
      //   id: 'programs',
      //   title: t('dashboard.totalPrograms'),
      //   value: programsData.length,
      //   icon: BookOpen,
      //   change: '+2%',
      //   changeType: 'positive',
      //   color: 'orange',
      //   loading: loading.programs
      // },
      // {
      //   id: 'registrations',
      //   title: t('dashboard.pendingRegistrations'),
      //   value: pendingRegistrations,
      //   icon: ClipboardList,
      //   change: pendingRegistrations > 0 ? `${pendingRegistrations} pending` : 'No pending',
      //   changeType: pendingRegistrations > 0 ? 'warning' : 'neutral',
      //   color: 'yellow',
      //   loading: loading.registrations
      // }
    ]
  }, [data, loading, t])
}

// Error fallback component
const DashboardErrorFallback = () => (
  <div className="text-center py-12">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
      Something went wrong
    </h2>
    <p className="text-gray-600 dark:text-gray-400 mb-4">
      We're having trouble loading your dashboard. Please try refreshing the page.
    </p>
    <Button onClick={() => window.location.reload()}>
      Refresh Page
    </Button>
  </div>
)

// Extracted header actions for better separation of concerns
const DashboardActions = () => {
  const { t } = useTranslation()

  return (
    <div className="mt-4 sm:mt-0 flex items-center gap-2">
      <Button variant="outline" size="sm" aria-label="View today's schedule">
        <Calendar className="w-4 h-4 mr-2" />
        {t('common.today', 'Today')}
      </Button>
      <Button
        variant="outline"
        size="icon"
        aria-label="View notifications"
      >
        <Bell className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        aria-label="Open settings"
      >
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  )
}

// Main dashboard component
export function AdminDashboard() {
  const { t } = useTranslation()
  const { data, loading, error } = useAdminDashboardData()
  const stats = useStatsConfig(data, loading)

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-12 px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
            <ClipboardList className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Failed to load dashboard data
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 mb-1">
            {error.message || "Unknown error occurred"}
          </p>
          {error.status && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
              Status Code: {error.status}
            </p>
          )}
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Retry Loading
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary fallback={<DashboardErrorFallback />}>
      <div className="space-y-8">
        {/* Dashboard Header */}
        <DashboardHeader
          title={t('dashboard.adminTitle', 'Admin Dashboard')}
          subtitle={t('dashboard.adminSubtitle', 'Welcome back! Here\'s what\'s happening today.')}
          actions={<DashboardActions />}
        />

        {/* Stats Grid */}
        <StatsGrid stats={stats} variants={ANIMATION_VARIANTS} />

        {/* Additional Content Area (Optional - for future use) */}
        <motion.div
          className="grid grid-cols-1 gap-8"
          variants={ANIMATION_VARIANTS.container}
          initial="hidden"
          animate="visible"
        >
          {/* This section is reserved for future components like:
              - Recent Activity
              - Quick Actions
              - Charts/Analytics
              - Notifications
          */}
        </motion.div>
      </div>
    </ErrorBoundary>
  )
}