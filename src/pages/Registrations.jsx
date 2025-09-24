import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ClipboardList } from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

export default function Registrations() {
  const { t } = useTranslation()

  return (
    <Layout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold">{t('nav.registrations')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('registrations.subtitle', 'Review and process pending registrations.')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{t('registrations.listTitle', 'Registration List')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
                <ClipboardList className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {t('registrations.noData', 'No pending registrations.')}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  )
}