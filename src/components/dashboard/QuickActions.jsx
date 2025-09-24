import { Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function QuickActions({ actions = [] }) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          {t('dashboard.quickActions')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={action.href}>
              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-4 hover:bg-accent/50 group"
              >
                <div
                  className={cn(
                    'p-2 rounded-lg mr-3 transition-colors',
                    action.color === 'blue' &&
                      'bg-blue-100 text-blue-600 group-hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400',
                    action.color === 'green' &&
                      'bg-green-100 text-green-600 group-hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400',
                    action.color === 'purple' &&
                      'bg-purple-100 text-purple-600 group-hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-400',
                    action.color === 'orange' &&
                      'bg-orange-100 text-orange-600 group-hover:bg-orange-200 dark:bg-orange-900/20 dark:text-orange-400'
                  )}
                >
                  <action.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            </Link>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}