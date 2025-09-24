import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/layout/Layout'
import { AdminDashboard } from '@/components/dashboard/AdminDashboard'
import { GuardianDashboard } from '@/components/dashboard/GuardianDashboard'
import { StudentDashboard } from '@/components/dashboard/StudentDashboard'
import { LoadingSpinner } from '@/components/ui'

export default function Dashboard() {
  const { user, loading } = useAuth()

  const renderDashboard = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-full">
          <LoadingSpinner size="xl" />
        </div>
      )
    }

    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />
      case 'guardian':
        return <GuardianDashboard />
      case 'student':
        return <StudentDashboard />
      default:
        return (
          <div className="text-center">
            <h1 className="text-2xl font-bold">Welcome!</h1>
            <p className="text-muted-foreground">
              No specific dashboard available for your role.
            </p>
          </div>
        )
    }
  }

  return <Layout>{renderDashboard()}</Layout>
}