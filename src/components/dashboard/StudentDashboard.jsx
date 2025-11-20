// src/components/dashboard/StudentDashboard.jsx
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Calendar, 
  Award,
  Clock,
  FileText,
  User
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'

export function StudentDashboard() {
  const { t } = useTranslation()
  const { user } = useAuth()

  const studentStats = [
    {
      title: 'Enrolled Programs',
      value: 3,
      icon: BookOpen,
      color: 'blue'
    },
    {
      title: 'Upcoming Classes',
      value: 5,
      icon: Calendar,
      color: 'green'
    },
    {
      title: 'Assignments Due',
      value: 2,
      icon: FileText,
      color: 'orange'
    },
    {
      title: 'Grade Average',
      value: 'A-',
      icon: Award,
      color: 'purple'
    }
  ]

  const upcomingClasses = [
    {
      id: 1,
      subject: 'Mathematics',
      time: '09:00 AM',
      duration: '1h 30m',
      instructor: 'Dr. Smith',
      room: 'Room 201'
    },
    {
      id: 2,
      subject: 'Science',
      time: '11:00 AM',
      duration: '1h',
      instructor: 'Prof. Johnson',
      room: 'Lab 1'
    },
    {
      id: 3,
      subject: 'English',
      time: '02:00 PM',
      duration: '45m',
      instructor: 'Ms. Davis',
      room: 'Room 105'
    }
  ]

  const recentAssignments = [
    {
      id: 1,
      title: 'Math Problem Set 5',
      subject: 'Mathematics',
      dueDate: '2024-03-25',
      status: 'pending',
      grade: null
    },
    {
      id: 2,
      title: 'Science Lab Report',
      subject: 'Science',
      dueDate: '2024-03-22',
      status: 'submitted',
      grade: 'A'
    },
    {
      id: 3,
      title: 'English Essay',
      subject: 'English',
      dueDate: '2024-03-20',
      status: 'graded',
      grade: 'B+'
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's your academic progress and upcoming activities.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {studentStats.map((stat, index) => (
          <motion.div 
            key={stat.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 text-${stat.color}-500`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingClasses.map((class_, index) => (
                <motion.div
                  key={class_.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{class_.subject}</h4>
                    <p className="text-sm text-muted-foreground">
                      {class_.instructor} • {class_.room}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{class_.time}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {class_.duration}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Assignments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Recent Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAssignments.map((assignment, index) => (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{assignment.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {assignment.subject} • Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      assignment.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                      assignment.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {assignment.status}
                    </span>
                    {assignment.grade && (
                      <span className="font-medium text-lg">{assignment.grade}</span>
                    )}
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