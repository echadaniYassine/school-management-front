// src/pages/guardians.jsx

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusCircle, Users, AlertTriangle, GraduationCap, Mail } from 'lucide-react'
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
import { guardiansService } from '@/services/api'
import { QUERY_KEYS } from '@/constants'

export default function Guardians() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const [isAddModalOpen, setAddModalOpen] = useState(false)
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [guardianToEdit, setGuardianToEdit] = useState(null)
  const [guardianToDelete, setGuardianToDelete] = useState(null)
  const [imageErrors, setImageErrors] = useState({})

  const [newGuardian, setNewGuardian] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: ''
  })

  // GET Query
  const {
    data: guardians = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.GUARDIANS],
    queryFn: () =>
      guardiansService.getAll().then((res) => {
        const data = res.data?.data || res.data || []
        return Array.isArray(data) ? data : []
      }),
    staleTime: 5 * 60 * 1000,
  })

  // CREATE
  const addGuardianMutation = useMutation({
    mutationFn: guardiansService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GUARDIANS] })
      setAddModalOpen(false)
      setNewGuardian({ name: '', email: '', phone: '', avatar: '' })
      toast({ type: 'success', title: 'Guardian Added' })
    },
    onError: (err) => {
      toast({ type: 'error', title: 'Error', description: err.message })
    },
  })

  const handleAddGuardian = () => {
    if (!newGuardian.name || !newGuardian.email) {
      return toast({
        type: 'warning',
        title: 'Missing fields',
        description: 'Name and email are required'
      })
    }
    addGuardianMutation.mutate(newGuardian)
  }

  // DELETE
  const deleteGuardianMutation = useMutation({
    mutationFn: guardiansService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GUARDIANS] })
      setGuardianToDelete(null)
      toast({ type: 'success', title: 'Deleted successfully' })
    },
    onError: (err) => {
      toast({ type: 'error', title: 'Error', description: err.message })
    },
  })

  // UPDATE
  const editGuardianMutation = useMutation({
    mutationFn: ({ id, data }) => guardiansService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GUARDIANS] })
      setEditModalOpen(false)
      setGuardianToEdit(null)
      toast({ type: 'success', title: 'Updated successfully' })
    },
    onError: (err) => {
      toast({ type: 'error', title: 'Error', description: err.message })
    }
  })

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }))
  }

  // CONTENT
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">{t('common.loading')}</p>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-500 font-medium">{t('common.error')}</p>
            <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
          </div>
        </div>
      )
    }

    if (guardians.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
          <Users className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{t('guardians.noData')}</p>
        </div>
      )
    }

    // GRID
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {guardians.map((g) => (
          <motion.div
            key={g.id}
            className="cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 p-6 flex flex-col items-center hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="relative mb-4">
              {imageErrors[g.id] || !g.avatar ? (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                  <Users className="w-12 h-12 text-white" />
                </div>
              ) : (
                <img
                  src={g.avatar}
                  alt={g.name}
                  onError={() => handleImageError(g.id)}
                  className="w-24 h-24 rounded-full object-cover shadow-lg ring-2 ring-gray-200"
                />
              )}
            </div>

            <h3 className="text-lg font-semibold text-center mb-1">{g.name}</h3>

            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
              <Mail className="w-4 h-4" />
              <span>{g.email}</span>
            </div>

            <div className="flex gap-2 w-full">
              <Button variant="outline" size="sm" className="flex-1"
                onClick={() => {
                  setGuardianToEdit(g)
                  setEditModalOpen(true)
                }}>
                {t('common.edit')}
              </Button>

              <Button variant="destructive" size="sm" className="flex-1"
                onClick={() => setGuardianToDelete(g.id)}>
                {t('common.delete')}
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
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold">{t('nav.guardians')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('guardians.subtitle')}
            </p>
          </div>

          <Button onClick={() => setAddModalOpen(true)}>
            <PlusCircle className="w-4 h-4 mr-2" />
            {t('guardians.addGuardian')}
          </Button>
        </motion.div>

        {/* List */}
        <Card>
          <CardHeader>
            <CardTitle>{t('guardians.listTitle')}</CardTitle>
          </CardHeader>
          <CardContent>{renderContent()}</CardContent>
        </Card>
      </div>

      {/* Add Guardian Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <Dialog open={isAddModalOpen} onOpenChange={setAddModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('guardians.addGuardian')}</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <Input placeholder="Name" value={newGuardian.name}
                  onChange={(e) => setNewGuardian({ ...newGuardian, name: e.target.value })} />

                <Input placeholder="Email" value={newGuardian.email}
                  onChange={(e) => setNewGuardian({ ...newGuardian, email: e.target.value })} />

                <Input placeholder="Phone (optional)" value={newGuardian.phone}
                  onChange={(e) => setNewGuardian({ ...newGuardian, phone: e.target.value })} />

                <Input placeholder="Avatar URL (optional)" value={newGuardian.avatar}
                  onChange={(e) => setNewGuardian({ ...newGuardian, avatar: e.target.value })} />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setAddModalOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleAddGuardian}>
                  {addGuardianMutation.isPending ? 'Saving...' : t('common.save')}
                </Button>
              </DialogFooter>

            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Edit Guardian Modal */}
      <AnimatePresence>
        {isEditModalOpen && guardianToEdit && (
          <Dialog open={isEditModalOpen} onOpenChange={setEditModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('common.edit')}</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <Input value={guardianToEdit.name}
                  onChange={(e) => setGuardianToEdit({ ...guardianToEdit, name: e.target.value })} />

                <Input value={guardianToEdit.email}
                  onChange={(e) => setGuardianToEdit({ ...guardianToEdit, email: e.target.value })} />

                <Input value={guardianToEdit.phone || ''}
                  onChange={(e) => setGuardianToEdit({ ...guardianToEdit, phone: e.target.value })} />

                <Input value={guardianToEdit.avatar || ''}
                  onChange={(e) => setGuardianToEdit({ ...guardianToEdit, avatar: e.target.value })} />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                  {t('common.cancel')}
                </Button>

                <Button onClick={() =>
                  editGuardianMutation.mutate({ id: guardianToEdit.id, data: guardianToEdit })
                }>
                  {editGuardianMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {guardianToDelete && (
          <Dialog open={!!guardianToDelete} onOpenChange={() => setGuardianToDelete(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="text-destructive" />
                  {t('common.delete')}
                </DialogTitle>
              </DialogHeader>

              <p>{t('common.deleteConfirm')}</p>

              <DialogFooter>
                <Button variant="outline" onClick={() => setGuardianToDelete(null)}>
                  {t('common.cancel')}
                </Button>
                <Button variant="destructive"
                  onClick={() => deleteGuardianMutation.mutate(guardianToDelete)}>
                  {deleteGuardianMutation.isPending ? "Deleting..." : t('common.delete')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </Layout>
  )
}
