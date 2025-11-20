// src/pages/teachers.jsx
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusCircle, Users, AlertTriangle, BookOpen, GraduationCap } from 'lucide-react'
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
import { teachersService } from '@/services/api'
import { QUERY_KEYS } from '@/constants'

export default function Teachers() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const [isAddTeacherModalOpen, setAddTeacherModalOpen] = useState(false)
  const [teacherToDelete, setTeacherToDelete] = useState(null)
  const [newTeacher, setNewTeacher] = useState({ name: '', subject: '' })

  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [teacherToEdit, setTeacherToEdit] = useState(null)
  const [imageErrors, setImageErrors] = useState({})

  // Fetch teachers with React Query
  const {
    data: teachers = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.TEACHERS],
    queryFn: () => teachersService.getAll().then((res) => {
      const data = res.data?.data || res.data || []
      return Array.isArray(data) ? data : []
    }),
    staleTime: 5 * 60 * 1000,
  })

  // Mutation for adding a new teacher
  const addTeacherMutation = useMutation({
    mutationFn: teachersService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TEACHERS] })
      setAddTeacherModalOpen(false)
      setNewTeacher({ name: '', subject: '' })
      toast({ type: 'success', title: 'Teacher Added', description: 'The new teacher has been added successfully.' })
    },
    onError: (error) => {
      toast({ type: 'error', title: 'Error Adding Teacher', description: error.message || 'An unknown error occurred.' })
    },
  })

  // Mutation for deleting a teacher
  const deleteTeacherMutation = useMutation({
    mutationFn: teachersService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TEACHERS] })
      setTeacherToDelete(null)
      toast({ type: 'success', title: 'Teacher Deleted', description: 'The teacher has been removed successfully.' })
    },
    onError: (error) => {
      toast({ type: 'error', title: 'Error Deleting Teacher', description: error.message || 'An unknown error occurred.' })
    },
  })

  // Mutation for updating a teacher
  const editTeacherMutation = useMutation({
    mutationFn: ({ id, data }) => teachersService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TEACHERS] })
      setEditModalOpen(false)
      setTeacherToEdit(null)
      toast({ type: 'success', title: 'Teacher Updated', description: 'Teacher information updated successfully.' })
    },
    onError: (error) => {
      toast({ type: 'error', title: 'Update Error', description: error.message || 'An unknown error occurred.' })
    },
  })

  const handleAddTeacher = () => {
    // Basic validation
    if (!newTeacher.name || !newTeacher.subject) {
      toast({ type: 'warning', title: 'Missing Information', description: 'Please fill out all fields.' })
      return
    }
    addTeacherMutation.mutate(newTeacher)
  }

  const handleDeleteRequest = (e, id) => {
    e.stopPropagation() // Prevent card click
    setTeacherToDelete(id)
  }

  const handleConfirmDelete = () => {
    if (teacherToDelete) {
      deleteTeacherMutation.mutate(teacherToDelete)
    }
  }

  const handleEditRequest = (e, teacher) => {
    e.stopPropagation() // Prevent card click
    setTeacherToEdit(teacher)
    setEditModalOpen(true)
  }

  const handleImageError = (teacherId) => {
    setImageErrors(prev => ({ ...prev, [teacherId]: true }))
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
              {t('common.error', 'Error loading teachers.')}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
          </div>
        </div>
      )
    }

    if (teachers.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
          <GraduationCap className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {t('teachers.noData', 'No teachers found. Add one to get started.')}
          </p>
        </div>
      )
    }

    // Profile Cards Grid
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {teachers.map((teacher) => (
          <motion.div
            key={teacher.id}
            onClick={() => console.log("Open teacher details:", teacher.id)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 p-6 flex flex-col items-center hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
          >
            {/* Profile Image with fallback */}
            <div className="relative mb-4">
              {imageErrors[teacher.id] || !teacher.avatar ? (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-12 h-12 text-white" />
                </div>
              ) : (
                <img
                  src={teacher.avatar}
                  alt={teacher.name}
                  onError={() => handleImageError(teacher.id)}
                  className="w-24 h-24 rounded-full object-cover shadow-lg ring-2 ring-gray-200 dark:ring-gray-700"
                />
              )}
            </div>

            {/* Name */}
            <h3 className="text-lg font-semibold text-center mb-1 text-gray-900 dark:text-white">
              {teacher.name}
            </h3>

            {/* Subject with icon */}
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
              <BookOpen className="w-4 h-4" />
              <span>{teacher.subject}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 w-full mt-auto">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={(e) => handleEditRequest(e, teacher)}
              >
                {t('common.edit', 'Edit')}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={(e) => handleDeleteRequest(e, teacher.id)}
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
            <h1 className="text-3xl font-bold">{t('nav.teachers')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('teachers.subtitle', 'Manage teachers and their subjects.')}
            </p>
          </div>
          <Button onClick={() => setAddTeacherModalOpen(true)} className="w-full sm:w-auto">
            <PlusCircle className="w-4 h-4 mr-2" />
            {t('teachers.addTeacher', 'Add Teacher')}
          </Button>
        </motion.div>

        {/* Teacher List */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle>{t('teachers.listTitle', 'Teacher List')}</CardTitle>
            </CardHeader>
            <CardContent>{renderContent()}</CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Add Teacher Modal */}
      <AnimatePresence>
        {isAddTeacherModalOpen && (
          <Dialog open={isAddTeacherModalOpen} onOpenChange={setAddTeacherModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                <DialogHeader>
                  <DialogTitle>{t('teachers.addTeacher', 'Add Teacher')}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      {t('teachers.form.name', 'Name')}
                    </Label>
                    <Input
                      id="name"
                      value={newTeacher.name}
                      onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                      className="col-span-3"
                      placeholder="Teacher name"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subject" className="text-right">
                      {t('teachers.form.subject', 'Subject')}
                    </Label>
                    <Input
                      id="subject"
                      value={newTeacher.subject}
                      onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
                      className="col-span-3"
                      placeholder="Subject taught"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddTeacherModalOpen(false)}>
                    {t('common.cancel', 'Cancel')}
                  </Button>
                  <Button onClick={handleAddTeacher} disabled={addTeacherMutation.isPending}>
                    {addTeacherMutation.isPending ? t('common.saving', 'Saving...') : t('common.save', 'Save')}
                  </Button>
                </DialogFooter>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Edit Teacher Modal */}
      <AnimatePresence>
        {isEditModalOpen && teacherToEdit && (
          <Dialog open={isEditModalOpen} onOpenChange={setEditModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <DialogHeader>
                  <DialogTitle>Edit Teacher</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-name" className="text-right">Name</Label>
                    <Input
                      id="edit-name"
                      value={teacherToEdit.name}
                      onChange={(e) =>
                        setTeacherToEdit({ ...teacherToEdit, name: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-subject" className="text-right">Subject</Label>
                    <Input
                      id="edit-subject"
                      value={teacherToEdit.subject}
                      onChange={(e) =>
                        setTeacherToEdit({ ...teacherToEdit, subject: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-avatar" className="text-right">Avatar URL</Label>
                    <Input
                      id="edit-avatar"
                      value={teacherToEdit.avatar || ""}
                      onChange={(e) =>
                        setTeacherToEdit({ ...teacherToEdit, avatar: e.target.value })
                      }
                      className="col-span-3"
                      placeholder="Optional avatar URL"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      editTeacherMutation.mutate({
                        id: teacherToEdit.id,
                        data: teacherToEdit,
                      })
                    }
                    disabled={editTeacherMutation.isPending}
                  >
                    {editTeacherMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {teacherToDelete && (
          <Dialog open={!!teacherToDelete} onOpenChange={() => setTeacherToDelete(null)}>
            <DialogContent className="sm:max-w-[425px]">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="text-destructive" />
                    {t('teachers.delete.title', 'Are you sure?')}
                  </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p>{t('teachers.delete.description', 'This action cannot be undone. This will permanently delete the teacher.')}</p>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setTeacherToDelete(null)}>
                    {t('common.cancel', 'Cancel')}
                  </Button>
                  <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleteTeacherMutation.isPending}>
                    {deleteTeacherMutation.isPending ? t('common.deleting', 'Deleting...') : t('common.delete', 'Delete')}
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