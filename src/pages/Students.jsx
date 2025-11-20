// src/pages/students.jsx
import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusCircle, Users, AlertTriangle, UserCircle } from 'lucide-react'
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
import { studentsService } from '@/services/api'
import { QUERY_KEYS } from '@/constants'

export default function Students() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const [isAddStudentModalOpen, setAddStudentModalOpen] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState(null)
  const [newStudent, setNewStudent] = useState({ name: '', email: '' })

  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [studentToEdit, setStudentToEdit] = useState(null)
  const [imageErrors, setImageErrors] = useState({})

  // Fetch students with React Query
  const {
    data: students = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.STUDENTS],
    queryFn: () => studentsService.getAll().then((res) => (Array.isArray(res.data) ? res.data : [])),
    staleTime: 5 * 60 * 1000,
  })

  // Mutation for adding a new student
  const addStudentMutation = useMutation({
    mutationFn: studentsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS] })
      setAddStudentModalOpen(false)
      setNewStudent({ name: '', email: '' })
      toast({ type: 'success', title: 'Student Added', description: 'The new student has been added successfully.' })
    },
    onError: (error) => {
      toast({ type: 'error', title: 'Error Adding Student', description: error.message || 'An unknown error occurred.' })
    },
  })

  // Mutation for deleting a student
  const deleteStudentMutation = useMutation({
    mutationFn: studentsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS] })
      setStudentToDelete(null)
      toast({ type: 'success', title: 'Student Deleted', description: 'The student has been removed successfully.' })
    },
    onError: (error) => {
      toast({ type: 'error', title: 'Error Deleting Student', description: error.message || 'An unknown error occurred.' })
    },
  })

  const editStudentMutation = useMutation({
    mutationFn: ({ id, data }) => studentsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS] })
      setEditModalOpen(false)
      setStudentToEdit(null)
      toast({ type: 'success', title: 'Student Updated', description: 'Student information updated successfully.' })
    },
    onError: (error) => {
      toast({ type: 'error', title: 'Update Error', description: error.message || 'An unknown error occurred.' })
    },
  })


  const handleAddStudent = () => {
    // Basic validation
    if (!newStudent.name || !newStudent.email) {
      toast({ type: 'warning', title: 'Missing Information', description: 'Please fill out all fields.' })
      return
    }
    addStudentMutation.mutate(newStudent)
  }

  const handleDeleteRequest = (e, id) => {
    e.stopPropagation() // Prevent card click
    setStudentToDelete(id)
  }

  const handleConfirmDelete = () => {
    if (studentToDelete) {
      deleteStudentMutation.mutate(studentToDelete)
    }
  }

  const handleEditRequest = (e, student) => {
    e.stopPropagation() // Prevent card click
    setStudentToEdit(student)
    setEditModalOpen(true)
  }

  const handleImageError = (studentId) => {
    setImageErrors(prev => ({ ...prev, [studentId]: true }))
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
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-500 font-medium">
              {t('common.error', 'Error loading students.')}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
          </div>
        </div>
      );
    }

    if (students.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
          <Users className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {t('students.noData', 'No students found. Add one to get started.')}
          </p>
        </div>
      );
    }

    // ✅ Profile Cards Grid
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {students.map((student) => (
          <motion.div
            key={student.id}
            onClick={() => console.log("Open student details:", student.id)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 p-6 flex flex-col items-center hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
          >
            {/* Profile Image with fallback */}
            <div className="relative mb-4">
              {imageErrors[student.id] || !student.avatar ? (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                  <UserCircle className="w-16 h-16 text-white" />
                </div>
              ) : (
                <img
                  src={student.avatar}
                  alt={student.name}
                  onError={() => handleImageError(student.id)}
                  className="w-24 h-24 rounded-full object-cover shadow-lg ring-2 ring-gray-200 dark:ring-gray-700"
                />
              )}
            </div>

            {/* Name */}
            <h3 className="text-lg font-semibold text-center mb-1 text-gray-900 dark:text-white">
              {student.name}
            </h3>

            {/* Email */}
            <p className="text-sm text-muted-foreground text-center mb-4 truncate max-w-full px-2">
              {student.email}
            </p>

            {/* Actions */}
            <div className="flex gap-2 w-full mt-auto">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={(e) => handleEditRequest(e, student)}
              >
                {t('common.edit', 'Edit')}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={(e) => handleDeleteRequest(e, student.id)}
              >
                {t('common.delete', 'Delete')}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };


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
            <h1 className="text-3xl font-bold">{t('nav.students')}</h1>
            <p className="text-muted-foreground mt-1">{t('students.subtitle', 'View and manage all student profiles.')}</p>
          </div>
          <Button onClick={() => setAddStudentModalOpen(true)} className="w-full sm:w-auto">
            <PlusCircle className="w-4 h-4 mr-2" />
            {t('students.addStudent')}
          </Button>
        </motion.div>

        {/* Student Data Table */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle>{t('students.listTitle', 'Student List')}</CardTitle>
            </CardHeader>
            <CardContent>{renderContent()}</CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Add Student Modal */}
      <AnimatePresence>
        {isAddStudentModalOpen && (
          <Dialog open={isAddStudentModalOpen} onOpenChange={setAddStudentModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                <DialogHeader><DialogTitle>{t('students.addStudent')}</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">{t('students.form.name', 'Name')}</Label>
                    <Input id="name" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">{t('students.form.email', 'Email')}</Label>
                    <Input id="email" type="email" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddStudentModalOpen(false)}>
                    {t('common.cancel', 'Cancel')}
                  </Button>
                  <Button onClick={handleAddStudent} disabled={addStudentMutation.isPending}>
                    {addStudentMutation.isPending ? t('common.saving', 'Saving...') : t('common.save', 'Save')}
                  </Button>
                </DialogFooter>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Edit Student Modal */}
      <AnimatePresence>
        {isEditModalOpen && studentToEdit && (
          <Dialog open={isEditModalOpen} onOpenChange={setEditModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <DialogHeader>
                  <DialogTitle>Edit Student</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-name" className="text-right">Name</Label>
                    <Input
                      id="edit-name"
                      value={studentToEdit.name}
                      onChange={(e) =>
                        setStudentToEdit({ ...studentToEdit, name: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-email" className="text-right">Email</Label>
                    <Input
                      id="edit-email"
                      value={studentToEdit.email}
                      onChange={(e) =>
                        setStudentToEdit({ ...studentToEdit, email: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-avatar" className="text-right">Avatar URL</Label>
                    <Input
                      id="edit-avatar"
                      value={studentToEdit.avatar || ""}
                      onChange={(e) =>
                        setStudentToEdit({ ...studentToEdit, avatar: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      editStudentMutation.mutate({
                        id: studentToEdit.id,
                        data: studentToEdit,
                      })
                    }
                    disabled={editStudentMutation.isPending}
                  >
                    {editStudentMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {studentToDelete && (
          <Dialog open={!!studentToDelete} onOpenChange={() => setStudentToDelete(null)}>
            <DialogContent className="sm:max-w-[425px]">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="text-destructive" /> {t('students.delete.title', 'Are you sure?')}
                  </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p>{t('students.delete.description', 'This action cannot be undone. This will permanently delete the student account.')}</p>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setStudentToDelete(null)}>{t('common.cancel', 'Cancel')}</Button>
                  <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleteStudentMutation.isPending}>
                    {deleteStudentMutation.isPending ? t('common.deleting', 'Deleting...') : t('common.delete', 'Delete')}
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