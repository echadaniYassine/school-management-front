import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusCircle, AlertTriangle, BookOpen, GraduationCap, Mail, Phone } from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
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
import { guardiansService } from '@/api/index'
import { QUERY_KEYS } from '@/constants'

export default function Guardians() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const [isAddModalOpen, setAddModalOpen] = useState(false)
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [guardianToDelete, setGuardianToDelete] = useState(null)
  const [guardianToEdit, setGuardianToEdit] = useState(null)
  const [imageErrors, setImageErrors] = useState({})

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  })

  // Fetch guardians with React Query
  const {
    data: guardians = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.GUARDIANS],
    queryFn: () => guardiansService.getAll().then((res) => {
      const data = res.data?.data || res.data || []
      return Array.isArray(data) ? data : []
    }),
    staleTime: 5 * 60 * 1000,
  })

  // Mutation for adding a new guardian
  const addGuardianMutation = useMutation({
    mutationFn: guardiansService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GUARDIANS] })
      setAddModalOpen(false)
      resetForm()
      toast({
        type: 'success',
        title: 'Guardian Added',
        description: 'The new guardian has been added successfully.'
      })
    },
    onError: (error) => {
      toast({
        type: 'error',
        title: 'Error Adding Guardian',
        description: error.message || 'An unknown error occurred.'
      })
    },
  })

  // Mutation for updating a guardian
  const editGuardianMutation = useMutation({
    mutationFn: ({ id, data }) => guardiansService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GUARDIANS] })
      setEditModalOpen(false)
      setGuardianToEdit(null)
      toast({
        type: 'success',
        title: 'Guardian Updated',
        description: 'Guardian information updated successfully.'
      })
    },
    onError: (error) => {
      toast({
        type: 'error',
        title: 'Update Error',
        description: error.message || 'An unknown error occurred.'
      })
    },
  })

  // Mutation for deleting a guardian
  const deleteGuardianMutation = useMutation({
    mutationFn: guardiansService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GUARDIANS] })
      setGuardianToDelete(null)
      toast({
        type: 'success',
        title: 'Guardian Deleted',
        description: 'The guardian has been removed successfully.'
      })
    },
    onError: (error) => {
      toast({
        type: 'error',
        title: 'Error Deleting Guardian',
        description: error.message || 'An unknown error occurred.'
      })
    },
  })

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
    })
  }

  const handleAddGuardian = () => {
    if (!formData.name) {
      toast({
        type: 'warning',
        title: 'Missing Information',
        description: 'Please enter guardian name.'
      })
      return
    }

    addGuardianMutation.mutate(formData)
  }

  const handleEditGuardian = () => {
    if (!guardianToEdit.name) {
      toast({
        type: 'warning',
        title: 'Missing Information',
        description: 'Please enter guardian name.'
      })
      return
    }

    editGuardianMutation.mutate({
      id: guardianToEdit.id,
      data: {
        name: guardianToEdit.name,
        phone: guardianToEdit.phone,
      }
    })
  }

  const handleDeleteGuardian = () => {
    if (!guardianToDelete) return
    deleteGuardianMutation.mutate(guardianToDelete)
  }

  const handleImageError = (guardianId) => {
    setImageErrors(prev => ({ ...prev, [guardianId]: true }))
  }

  const openEditModal = (e, guardian) => {
    e.stopPropagation()
    setGuardianToEdit({ ...guardian })
    setEditModalOpen(true)
  }

  const openDeleteModal = (e, id) => {
    e.stopPropagation()
    setGuardianToDelete(id)
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
              {t('common.error', 'Error loading guardians.')}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
          </div>
        </div>
      )
    }

    if (guardians.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
          <GraduationCap className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {t('guardians.noData', 'No guardians found. Add one to get started.')}
          </p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {guardians.map((guardian) => (
          <motion.div
            key={guardian.id}
            onClick={() => console.log("Open guardian details:", guardian.id)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 p-6 flex flex-col items-center hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
          >
            {/* Profile Image with fallback */}
            <div className="relative mb-4">
              {imageErrors[guardian.id] || !guardian.avatar ? (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-12 h-12 text-white" />
                </div>
              ) : (
                <img
                  src={guardian.avatar}
                  alt={guardian.name}
                  onError={() => handleImageError(guardian.id)}
                  className="w-24 h-24 rounded-full object-cover shadow-lg ring-2 ring-gray-200 dark:ring-gray-700"
                />
              )}
            </div>

            {/* Name */}
            <h3 className="text-lg font-semibold text-center mb-2 text-gray-900 dark:text-white">
              {guardian.name}
            </h3>

            {/* Contact Info */}
            <div className="w-full space-y-1 mb-4">
              {guardian.phone && (
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Phone className="w-3 h-3 flex-shrink-0" />
                  <span>{guardian.phone}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 w-full mt-auto">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={(e) => openEditModal(e, guardian)}
              >
                {t('common.edit', 'Edit')}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={(e) => openDeleteModal(e, guardian.id)}
              >
                {t('common.delete', 'Delete')}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold">{t('nav.guardians', 'Guardians')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('guardians.subtitle', 'Manage guardians and their details.')}
            </p>
          </div>
          <Button onClick={() => setAddModalOpen(true)} className="w-full sm:w-auto">
            <PlusCircle className="w-4 h-4 mr-2" />
            {t('guardians.addGuardian', 'Add Guardian')}
          </Button>
        </motion.div>

        {/* Guardian List */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle>{t('guardians.listTitle', 'Guardian List')}</CardTitle>
            </CardHeader>
            <CardContent>{renderContent()}</CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Add Guardian Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <Dialog open={isAddModalOpen} onOpenChange={setAddModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <DialogHeader>
                  <DialogTitle>{t('guardians.addGuardian', 'Add Guardian')}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      {t('guardians.form.name', 'Name')} *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="col-span-3"
                      placeholder="Full name"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      {t('guardians.form.phone', 'Phone')}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="col-span-3"
                      placeholder="+1234567890"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => { setAddModalOpen(false); resetForm(); }}
                  >
                    {t('common.cancel', 'Cancel')}
                  </Button>
                  <Button
                    onClick={handleAddGuardian}
                    disabled={addGuardianMutation.isPending}
                  >
                    {addGuardianMutation.isPending
                      ? t('common.saving', 'Saving...')
                      : t('common.save', 'Save')}
                  </Button>
                </DialogFooter>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Edit Guardian Modal */}
      <AnimatePresence>
        {isEditModalOpen && guardianToEdit && (
          <Dialog open={isEditModalOpen} onOpenChange={setEditModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <DialogHeader>
                  <DialogTitle>{t('guardians.editGuardian', 'Edit Guardian')}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-name" className="text-right">
                      {t('guardians.form.name', 'Name')} *
                    </Label>
                    <Input
                      id="edit-name"
                      value={guardianToEdit.name}
                      onChange={(e) =>
                        setGuardianToEdit({ ...guardianToEdit, name: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-phone" className="text-right">
                      {t('guardians.form.phone', 'Phone')}
                    </Label>
                    <Input
                      id="edit-phone"
                      type="tel"
                      value={guardianToEdit.phone || ''}
                      onChange={(e) =>
                        setGuardianToEdit({ ...guardianToEdit, phone: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => { setEditModalOpen(false); setGuardianToEdit(null); }}
                  >
                    {t('common.cancel', 'Cancel')}
                  </Button>
                  <Button
                    onClick={handleEditGuardian}
                    disabled={editGuardianMutation.isPending}
                  >
                    {editGuardianMutation.isPending
                      ? t('common.saving', 'Saving...')
                      : t('common.save', 'Save Changes')}
                  </Button>
                </DialogFooter>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {guardianToDelete && (
          <Dialog open={!!guardianToDelete} onOpenChange={() => setGuardianToDelete(null)}>
            <DialogContent className="sm:max-w-[425px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="text-destructive" />
                    {t('guardians.delete.title', 'Are you sure?')}
                  </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                  <p>
                    {t('guardians.delete.description',
                      'This action cannot be undone. This will permanently delete the guardian.')}
                  </p>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setGuardianToDelete(null)}
                  >
                    {t('common.cancel', 'Cancel')}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteGuardian}
                    disabled={deleteGuardianMutation.isPending}
                  >
                    {deleteGuardianMutation.isPending
                      ? t('common.deleting', 'Deleting...')
                      : t('common.delete', 'Delete')}
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