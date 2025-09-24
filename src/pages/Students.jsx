import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { PlusCircle, Users } from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

export default function Students() {
  const { t } = useTranslation()

  return (
    <Layout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold">{t('nav.students')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('students.subtitle', 'View and manage all student profiles.')}
            </p>
          </div>
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            {t('students.addStudent')}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{t('students.listTitle', 'Student List')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
                <Users className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {t('students.noData', 'No students found. Add one to get started.')}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  )
}