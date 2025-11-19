import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '../../ui/index'
import { cn } from '../../../lib/utils'

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType, 
  color = 'blue',
  loading = false
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
  }

  const changeIcon = changeType === 'positive' ? TrendingUp : TrendingDown
  const ChangeIcon = changeIcon

  if (loading) {
    return (
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse dark:bg-gray-700" />
              <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse dark:bg-gray-700" />
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mt-4 animate-pulse dark:bg-gray-700" />
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-5',
          colorClasses[color]
        )} />
        
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <p className="text-3xl font-bold">
                {value.toLocaleString()}
              </p>
            </div>
            
            <div className={cn(
              'p-3 rounded-full bg-gradient-to-br',
              colorClasses[color]
            )}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
          
          {change && (
            <div className="flex items-center mt-4 text-sm">
              <ChangeIcon className={cn(
                'w-4 h-4 mr-1',
                changeType === 'positive' ? 'text-green-500' : 'text-red-500'
              )} />
              <span className={cn(
                'font-medium',
                changeType === 'positive' ? 'text-green-500' : 'text-red-500'
              )}>
                {change}
              </span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}