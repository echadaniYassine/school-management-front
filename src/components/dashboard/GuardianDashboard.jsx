// src/components/dashboard/GuardianDashboard.jsx
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { 
  Users,
  Calendar, 
  Award,
  Bell,
  BookOpen,
  TrendingUp,
  MessageCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'

export function GuardianDashboard() {
  const { t } = useTranslation()
  const { user } = useAuth()

  // Mock data for guardian dashboard
  const children = [
    {
      id: 1,
      name: 'Emma Johnson',
      grade: '5th Grade',
      programs: ['Mathematics', 'Science', 'Art'],
      nextClass: 'Mathematics - 9:00 AM',
      recentGrade: 'A-',
      attendance: '95%'
    },
    {
      id: 2,
      name: 'Liam Johnson',
      grade: '3rd Grade',
      programs: ['Reading', 'Basic Math', 'Music'],
      nextClass: 'Reading - 10:00 AM',
      recentGrade: 'B+',
      attendance: '92%'
    }
  ]

  const notifications = [
    {
      id: 1,
      type: 'grade',
      title: 'New Grade Available',
      message: 'Emma received an A- in Mathematics',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'event',
      title: 'Parent-Teacher Conference',
      message: 'Scheduled for March 25th at 3:00 PM',
      time: '1 day ago',
      read: false
    },
    {
      id: 3,
      type: 'assignment',
      title: 'Assignment Due Reminder',
      message: 'Liam has an assignment due tomorrow',
      time: '2 days ago',
      read: true
    }
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: 'Parent-Teacher Conference',
      date: '2024-03-25',
      time: '3:00 PM',
      location: 'Room 201'
    },
    {
      id: 2,
      title: 'School Science Fair',
      date: '2024-03-28',
      time: '6:00 PM',
      location: 'Main Auditorium'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome, {user?.name}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Keep track of your children's academic progress and school activities.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              Messages
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4" />
              {notifications.filter(n => !n.read).length}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Children Overview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <h2 className="text-xl font-semibold">Your Children</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {children.map((child, index) => (
            <motion.div
              key={child.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {child.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{child.grade}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Recent Grade</p>
                      <p className="text-2xl font-bold text-green-600">{child.recentGrade}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Attendance</p>
                      <p className="text-2xl font-bold text-blue-600">{child.attendance}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Enrolled Programs</p>
                    <div className="flex flex-wrap gap-1">
                      {child.programs.map((program, i) => (
                        <span 
                          key={i}
                          className="px-2 py-1 bg-muted rounded-full text-xs"
                        >
                          {program}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Next Class</p>
                    <p className="text-sm text-muted-foreground">{child.nextClass}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bottom Row: Notifications & Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.slice(0, 3).map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg border ${
                    notification.read ? 'bg-muted/50' : 'bg-blue-50 dark:bg-blue-900/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-2"></div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {notification.time}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </p>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
