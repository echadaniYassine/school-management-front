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
import { StatsGrid, RecentActivity, QuickActions, DashboardHeader } from '@/components/dashboard'
import { useAdminDashboardData } from '@/hooks/useAdminDashboardData'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { LoadingSpinner } from '@/components/ui'

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
      programsData = [],
      registrationsData = []
    } = data

    const pendingRegistrations = Array.isArray(registrationsData)
      ? registrationsData.filter(r => r.status === 'pending').length
      : 0

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
        change: '+12%',
        changeType: 'positive',
        color: 'blue',
        loading: loading.teachers
      },
      {
        id: 'guardians',
        title: t('dashboard.totalGuardians'),
        value: guardiansData.length,
        icon: GraduationCap,
        change: '+8%',
        changeType: 'positive',
        color: 'green',
        loading: loading.guardians
      },
      {
        id: 'programs',
        title: t('dashboard.totalPrograms'),
        value: programsData.length,
        icon: BookOpen,
        change: '+2%',
        changeType: 'positive',
        color: 'purple',
        loading: loading.programs
      },
      // {
      //   id: 'registrations',
      //   title: t('dashboard.pendingRegistrations'),
      //   value: pendingRegistrations,
      //   icon: ClipboardList,
      //   change: '+5%',
      //   changeType: 'neutral',
      //   color: 'orange',
      //   loading: loading.registrations
      // }
    ]
  }, [data, loading, t])
}

// Separated quick actions configuration
const useQuickActionsConfig = () => {
  const { t } = useTranslation()

  return useMemo(() => [
    {
      id: 'add-student',
      title: t('dashboard.addStudent'),
      description: 'Create a new student profile',
      icon: Users,
      href: '/students/create',
      color: 'blue'
    },
    {
      id: 'add-teacher',
      title: t('dashboard.addTeacher'),
      description: 'Create a new teacher profile',
      icon: Users,
      href: '/teachers/create',
      color: 'blue'
    },
    {
      id: 'add-program',
      title: t('dashboard.addProgram'),
      description: 'Add a new educational program',
      icon: BookOpen,
      href: '/programs/create',
      color: 'green'
    },
    {
      id: 'view-reports',
      title: t('dashboard.viewReports'),
      description: 'Generate and view reports',
      icon: BookOpen,
      href: '/reports',
      color: 'purple'
    },
    {
      id: 'manage-registrations',
      title: t('dashboard.manageRegistrations'),
      description: 'Review pending registrations',
      icon: ClipboardList,
      href: '/registrations',
      color: 'orange'
    }
  ], [t])
}

// Error fallback component
const DashboardErrorFallback = () => (
  <div className="text-center py-12">
    <h2 className="text-xl font-semibold text-gray-900 mb-2">
      Something went wrong
    </h2>
    <p className="text-gray-600 mb-4">
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
        {t('common.today')}
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
  const quickActions = useQuickActionsConfig()

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-medium">
          Failed to load dashboard data
        </p>
        <p className="text-gray-500 text-sm mt-2">
          {error.message || "Unknown error"}
        </p>
        {error.status && (
          <p className="text-xs text-gray-400">Status: {error.status}</p>
        )}
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <ErrorBoundary fallback={<DashboardErrorFallback />}>
      <div className="space-y-8">
        <DashboardHeader
          title={t('dashboard.adminTitle')}
          subtitle={t('dashboard.adminSubtitle')}
          actions={<DashboardActions />}
        />

        <StatsGrid stats={stats} variants={ANIMATION_VARIANTS} />

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={ANIMATION_VARIANTS.container}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="lg:col-span-1" variants={ANIMATION_VARIANTS.item}>
            <QuickActions actions={quickActions} />
          </motion.div>
          <motion.div className="lg:col-span-2" variants={ANIMATION_VARIANTS.item}>
            <RecentActivity />
          </motion.div>
        </motion.div>
      </div>
    </ErrorBoundary>
  )
}