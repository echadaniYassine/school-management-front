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
    queryFn: () =>
      registrationsService.getPending().then((res) => {
        console.log('Full API response:', res)
        console.log('Response type:', typeof res)
        console.log('Is array:', Array.isArray(res))
        
        // Handle different response structures
        let data = res;
        if (res && res.data && Array.isArray(res.data)) {
          data = res.data;
          console.log('Using nested data array:', data)
        } else if (Array.isArray(res)) {
          console.log('Using direct array:', res)
        } else {
          console.warn('Unexpected response format:', res)
          return []
        }
        
        console.log(`Found ${data.length} registrations:`, data)
        return data
      }),
    staleTime: 5 * 60 * 1000,
  })

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: (id) => registrationsService.approve(id),
    onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.REGISTRATIONS),
  })

  // Reject mutation  
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => registrationsService.reject(id, reason),
    onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.REGISTRATIONS),
  })

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold">{t('nav.registrations')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('registrations.subtitle', 'Review and process pending registrations.')}
          </p>
        </motion.div>

        {/* Debug info - Remove this in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-sm">
            <strong>Debug Info:</strong>
            <br />
            Loading: {isLoading.toString()}
            <br />
            Error: {error?.message || 'None'}
            <br />
            Registrations count: {registrations.length}
            <br />
            First registration: {JSON.stringify(registrations[0] || 'None', null, 2)}
          </div>
        )}

        {/* Registrations list */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle>{t('registrations.listTitle', 'Registration List')}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>{t('common.loading', 'Loading...')}</p>
              ) : error ? (
                <div className="text-red-500">
                  <p>{t('common.error', 'Error loading registrations.')}</p>
                  <p className="text-sm mt-1">Details: {error.message}</p>
                </div>
              ) : registrations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
                  <ClipboardList className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {t('registrations.noData', 'No pending registrations.')}
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {registrations.map((reg) => (
                    <li key={reg.id} className="py-3 flex justify-between items-center">
                      <div>
                        {/* Updated to use correct field names */}
                        <p className="font-medium">
                          {reg.full_name || reg.student_name || 'Unknown Student'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {reg.program?.name || reg.program_name || 'Unknown Program'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Email: {reg.email} | Phone: {reg.phone}
                        </p>
                        <p className="text-xs text-gray-500">
                          Status: {reg.status} | Created: {new Date(reg.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => approveMutation.mutate(reg.id)}
                          disabled={approveMutation.isLoading}
                        >
                          {t('registrations.approve', 'Approve')}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
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