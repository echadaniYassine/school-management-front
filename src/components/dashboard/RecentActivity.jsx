import { Clock, User, Calendar, Users, BookOpen, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Button, Card, CardHeader, CardTitle, CardContent, LoadingSpinner } from '@/components/ui'
import { cn } from '@/lib/utils'
import { api } from '@/services/api' // Assuming a generic endpoint exists

// Mock API call for demonstration. Replace with your actual service.
const getRecentActivities = async () => {
  // Replace with your actual API endpoint, e.g., api.get('/activities')
  // For now, we'll simulate an API call with mock data.
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
  return {
    data: [
       {
        id: 1,
        type: 'registration',
        title: 'New student registration',
        description: 'Sarah Johnson registered for Mathematics Program',
        time: '2 hours ago',
        icon: User,
        color: 'blue'
      },
      {
        id: 2,
        type: 'program',
        title: 'Program updated',
        description: 'Science Program curriculum updated',
        time: '4 hours ago',
        icon: BookOpen,
        color: 'green'
      },
      {
        id: 3,
        type: 'guardian',
        title: 'Guardian added',
        description: 'Michael Smith added as guardian',
        time: '1 day ago',
        icon: Users,
        color: 'purple'
      },
    ]
  };
};


export function RecentActivity() {
  const { t } = useTranslation()

  const { data: activities, isLoading, isError } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: getRecentActivities
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          {t('dashboard.recentActivity')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <LoadingSpinner />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-48 text-red-500">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p>Failed to load recent activity.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {activities?.data?.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <div
                    className={cn(
                      'p-2 rounded-full flex-shrink-0',
                      activity.color === 'blue' &&
                        'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
                      activity.color === 'green' &&
                        'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
                      activity.color === 'purple' &&
                        'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
                      activity.color === 'orange' &&
                        'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
                    )}
                  >
                    <activity.icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full" size="sm">
                View all activities
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}