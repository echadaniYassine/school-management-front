import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { PlusCircle, GraduationCap } from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { useQuery } from '@tanstack/react-query'
import { guardiansService } from '@/services/api'
import { QUERY_KEYS } from '@/constants'

export default function Guardians() {
  const { t } = useTranslation()

  // Fetch guardians
  const {
    data: guardians = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.GUARDIANS,
    queryFn: () =>
      guardiansService.getAll().then((res) => {
        console.log('Guardians API response:', res.data)
        return Array.isArray(res.data) ? res.data : []
      }),
    staleTime: 5 * 60 * 1000,
  })

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold">{t('nav.guardians')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('guardians.subtitle', 'Browse and manage guardian accounts.')}
            </p>
          </div>
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            {t('guardians.addGuardian')}
          </Button>
        </motion.div>

        {/* Guardians list */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{t('guardians.listTitle', 'Guardian List')}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>{t('common.loading', 'Loading...')}</p>
              ) : error ? (
                <p className="text-red-500">{t('common.error', 'Error loading guardians.')}</p>
              ) : guardians.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
                  <GraduationCap className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {t('guardians.noData', 'No guardians found.')}
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {guardians.map((guardian) => (
                    <li key={guardian.id} className="py-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{guardian.name}</span>
                        <span className="text-muted-foreground text-sm">
                          {guardian.email}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  )
}
