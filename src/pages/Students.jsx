// src/pages/students.jsx
import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusCircle, Users, AlertTriangle } from 'lucide-react'
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
import { DataTable } from '@/components/students/DataTable'
import { getColumns } from '@/components/students/Columns'

export default function Students() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const [isAddStudentModalOpen, setAddStudentModalOpen] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState(null)
  const [newStudent, setNewStudent] = useState({ name: '', email: '' })

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

  const handleAddStudent = () => {
    // Basic validation
    if (!newStudent.name || !newStudent.email) {
      toast({ type: 'warning', title: 'Missing Information', description: 'Please fill out all fields.' })
      return
    }
    addStudentMutation.mutate(newStudent)
  }

  const handleDeleteRequest = (id) => {
    setStudentToDelete(id)
  }

  const handleConfirmDelete = () => {
    if (studentToDelete) {
      deleteStudentMutation.mutate(studentToDelete)
    }
  }

  // Memoize columns to prevent re-rendering DataTable unnecessarily
  const columns = useMemo(() => getColumns(handleDeleteRequest), [])

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-64"><p>{t('common.loading', 'Loading...')}</p></div>
    }
    if (error) {
      return <div className="flex justify-center items-center h-64"><p className="text-red-500">{t('common.error', 'Error loading students.')}</p></div>
    }
    if (students.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
          <Users className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{t('students.noData', 'No students found. Add one to get started.')}</p>
        </div>
      )
    }
    return <DataTable columns={columns} data={students} />
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
            <h1 className="text-3xl font-bold">{t('nav.students')}</h1>
            <p className="text-muted-foreground mt-1">{t('students.subtitle', 'View and manage all student profiles.')}</p>
          </div>
          <Button onClick={() => setAddStudentModalOpen(true)}>
            <PlusCircle className="w-4 h-4 mr-2" />
            {t('students.addStudent')}
          </Button>
        </motion.div>

        {/* Student Data Table */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader><CardTitle>{t('students.listTitle', 'Student List')}</CardTitle></CardHeader>
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
                  <Button onClick={handleAddStudent} disabled={addStudentMutation.isPending}>
                    {addStudentMutation.isPending ? t('common.saving', 'Saving...') : t('common.save', 'Save')}
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