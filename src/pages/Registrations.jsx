// src/pages/Registrations.jsx
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ClipboardList } from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { registrationsService } from '@/services/api'
import { QUERY_KEYS } from '@/constants'

export default function Registrations() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  // Fetch pending registrations
  const {
    data: registrations = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.REGISTRATIONS,
    queryFn: async () => {
      const res = await registrationsService.getPending()

      // Normalize structure
      if (Array.isArray(res)) return res
      if (res?.data && Array.isArray(res.data)) return res.data

      console.warn('Unexpected API format:', res)
      return []
    },
    staleTime: 5 * 60 * 1000,
  })

  // Mutations
  const approveMutation = useMutation({
    mutationFn: (id) => registrationsService.approve(id),
    onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.REGISTRATIONS),
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => registrationsService.reject(id, reason),
    onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.REGISTRATIONS),
  })

  return (
    <Layout>
      <div className="space-y-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold tracking-tight">
            {t('nav.registrations')}
          </h1>
          <p className="text-muted-foreground">
            {t('registrations.subtitle', 'Review and process pending registrations.')}
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {t('registrations.listTitle', 'Pending Registrations')}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Loading */}
              {isLoading && (
                <p className="text-sm text-muted-foreground">
                  {t('common.loading', 'Loading...')}
                </p>
              )}

              {/* Error */}
              {error && (
                <div className="text-red-500">
                  <p className="font-medium">{t('common.error', 'Error loading data.')}</p>
                  <p className="text-sm mt-1">{error.message}</p>
                </div>
              )}

              {/* Empty state */}
              {!isLoading && !error && registrations.length === 0 && (
                <div className="flex flex-col items-center justify-center h-60 rounded-lg border border-dashed">
                  <ClipboardList className="w-12 h-12 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">
                    {t('registrations.noData', 'No pending registrations.')}
                  </p>
                </div>
              )}

              {/* List */}
              {registrations.length > 0 && (
                <ul className="divide-y divide-border">
                  {registrations.map((reg) => (
                    <li
                      key={reg.id}
                      className="py-4 flex justify-between items-start hover:bg-muted/30 px-2 rounded-lg transition"
                    >
                      {/* Info */}
                      <div className="space-y-1">
                        <p className="font-semibold text-base">
                          {reg.full_name || reg.student_name || 'Unknown Student'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {reg.program?.name || reg.program_name || 'Unknown Program'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Email: {reg.email} — Phone: {reg.phone}
                        </p>
                        <p className="text-xs text-gray-500">
                          Status: <span className="font-medium">{reg.status}</span>
                          {' | '}Created: {new Date(reg.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => approveMutation.mutate(reg.id)}
                          disabled={approveMutation.isLoading}
                          className="px-4"
                        >
                          {t('registrations.approve', 'Approve')}
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          className="px-4"
                          onClick={() =>
                            rejectMutation.mutate({ id: reg.id, reason: 'Not eligible' })
                          }
                          disabled={rejectMutation.isLoading}
                        >
                          {t('registrations.reject', 'Reject')}
                        </Button>
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
