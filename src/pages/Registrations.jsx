import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { ClipboardList, AlertTriangle, Mail, Phone, Calendar, User, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Input,
  Label,
  useToast,
} from '@/components/ui'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { registrationsService } from '@/api/index'
import { QUERY_KEYS } from '@/constants'

export default function Registrations() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState('pending')
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [registrationToReject, setRegistrationToReject] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  // Fetch ALL registrations (not just pending)
  const {
    data: allRegistrations = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.REGISTRATIONS,
    queryFn: async () => {
      // Fetch all registrations, not just pending
      const res = await registrationsService.getAll() // Change from getPending() to getAll()

      if (Array.isArray(res)) return res
      if (res?.data && Array.isArray(res.data)) return res.data

      console.warn('Unexpected API format:', res)
      return []
    },
    staleTime: 5 * 60 * 1000,
  })

  // Filter registrations by status
  const pendingRegistrations = allRegistrations.filter(reg => reg.status === 'pending')
  const acceptedRegistrations = allRegistrations.filter(reg => reg.status === 'confirmed')
  const rejectedRegistrations = allRegistrations.filter(reg => reg.status === 'rejected')

  // Get current tab's registrations
  const getCurrentRegistrations = () => {
    switch (activeTab) {
      case 'pending':
        return pendingRegistrations
      case 'accepted':
        return acceptedRegistrations
      case 'rejected':
        return rejectedRegistrations
      default:
        return []
    }
  }

  const currentRegistrations = getCurrentRegistrations()

  // Mutations
  const approveMutation = useMutation({
    mutationFn: (id) => registrationsService.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.REGISTRATIONS)
      toast({
        type: 'success',
        title: 'Registration Approved',
        description: 'The registration has been approved successfully.',
      })
    },
    onError: (error) => {
      toast({
        type: 'error',
        title: 'Approval Error',
        description: error.message || 'Failed to approve registration.',
      })
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => registrationsService.reject(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.REGISTRATIONS)
      setRejectModalOpen(false)
      setRegistrationToReject(null)
      setRejectReason('')
      toast({
        type: 'success',
        title: 'Registration Rejected',
        description: 'The registration has been rejected.',
      })
    },
    onError: (error) => {
      toast({
        type: 'error',
        title: 'Rejection Error',
        description: error.message || 'Failed to reject registration.',
      })
    },
  })

  const handleApprove = (id) => {
    approveMutation.mutate(id)
  }

  const openRejectModal = (registration) => {
    setRegistrationToReject(registration)
    setRejectModalOpen(true)
  }

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast({
        type: 'warning',
        title: 'Reason Required',
        description: 'Please provide a reason for rejection.',
      })
      return
    }

    rejectMutation.mutate({
      id: registrationToReject.id,
      reason: rejectReason,
    })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <ClipboardList className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'from-yellow-400 to-yellow-600'
      case 'confirmed':
        return 'from-green-400 to-green-600'
      case 'rejected':
        return 'from-red-400 to-red-600'
      default:
        return 'from-gray-400 to-gray-600'
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">{t('common.loading', 'Loading...')}</p>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-500 font-medium">
              {t('common.error', 'Error loading registrations.')}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
          </div>
        </div>
      )
    }

    if (currentRegistrations.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
          <ClipboardList className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {t('registrations.noData', `No ${activeTab} registrations.`)}
          </p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentRegistrations.map((reg) => (
          <motion.div
            key={reg.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 p-6 flex flex-col hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
          >
            {/* Status Badge */}
            <div className="relative mb-4">
              <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${getStatusColor(reg.status)} flex items-center justify-center shadow-lg`}>
                <User className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                {getStatusIcon(reg.status)}
              </div>
            </div>

            {/* Name */}
            <h3 className="text-lg font-semibold text-center mb-2 text-gray-900 dark:text-white">
              {reg.full_name || reg.student_name || 'Unknown Student'}
            </h3>

            {/* Program */}
            <div className="flex items-center justify-center gap-1 text-sm text-purple-600 dark:text-purple-400 mb-3">
              <ClipboardList className="w-4 h-4" />
              <span className="text-center">{reg.program?.name || reg.program_name || 'Unknown Program'}</span>
            </div>

            {/* Contact Info */}
            <div className="w-full space-y-2 mb-4">
              {reg.email && (
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Mail className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{reg.email}</span>
                </div>
              )}
              {reg.phone && (
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Phone className="w-3 h-3 flex-shrink-0" />
                  <span>{reg.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="w-3 h-3 flex-shrink-0" />
                <span>{new Date(reg.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Status Badge Text */}
            <div className="text-center mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${reg.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                reg.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
              </span>
            </div>

            {/* Rejection Reason */}
            {reg.status === 'rejected' && reg.rejection_reason && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                <span className="font-medium">Reason: </span>
                {reg.rejection_reason}
              </div>
            )}

            {/* Action Buttons - Only show for pending */}
            {reg.status === 'pending' && (
              <div className="flex gap-2 w-full mt-auto">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => handleApprove(reg.id)}
                  disabled={approveMutation.isLoading}
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {t('registrations.approve', 'Approve')}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                  onClick={() => openRejectModal(reg)}
                  disabled={rejectMutation.isLoading}
                >
                  <XCircle className="w-3 h-3 mr-1" />
                  {t('registrations.reject', 'Reject')}
                </Button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {t('nav.registrations', 'Registrations')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('registrations.subtitle', 'Review and process student registrations.')}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Pending</p>
                    <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{pendingRegistrations.length}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Accepted</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">{acceptedRegistrations.length}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">Rejected</p>
                    <p className="text-2xl font-bold text-red-900 dark:text-red-100">{rejectedRegistrations.length}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Card with Tabs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
          <Card className="border shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  {t('registrations.listTitle', 'Registration List')}
                </CardTitle>

                {/* Tabs */}
                <div className="flex gap-2">
                  <Button
                    variant={activeTab === 'pending' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab('pending')}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Pending ({pendingRegistrations.length})
                  </Button>
                  <Button
                    variant={activeTab === 'accepted' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab('accepted')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Accepted ({acceptedRegistrations.length})
                  </Button>
                  <Button
                    variant={activeTab === 'rejected' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab('rejected')}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rejected ({rejectedRegistrations.length})
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>{renderContent()}</CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Reject Modal */}
      <AnimatePresence>
        {rejectModalOpen && registrationToReject && (
          <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="text-destructive" />
                    {t('registrations.reject.title', 'Reject Registration')}
                  </DialogTitle>
                </DialogHeader>

                <div className="py-4 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    You are about to reject the registration for{' '}
                    <span className="font-semibold">
                      {registrationToReject.full_name || registrationToReject.student_name}
                    </span>
                  </p>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Rejection *</Label>
                    <Input
                      id="reason"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="e.g., Incomplete documents, Not eligible"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setRejectModalOpen(false)
                      setRegistrationToReject(null)
                      setRejectReason('')
                    }}
                  >
                    {t('common.cancel', 'Cancel')}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleReject}
                    disabled={rejectMutation.isLoading}
                  >
                    {rejectMutation.isLoading
                      ? t('common.rejecting', 'Rejecting...')
                      : t('common.reject', 'Reject')}
                  </Button>
                </DialogFooter>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </Layout>
  )
}