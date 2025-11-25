import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusCircle, Users, AlertTriangle, UserCircle, Trash2, Edit2 } from 'lucide-react'
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
import { studentsService, guardiansService } from '@/services/api'
import { QUERY_KEYS } from '@/constants'

export default function Students() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const [isAddModalOpen, setAddModalOpen] = useState(false)
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState(null)
  const [studentToEdit, setStudentToEdit] = useState(null)
  const [imageErrors, setImageErrors] = useState({})

  const [formData, setFormData] = useState({
    name: '',
    date_of_birth: '',
    gender: '',
    guardian_id: ''
  })

  // Fetch students with React Query
  const {
    data: students = [],
    isLoading: studentsLoading,
    error: studentsError,
  } = useQuery({
    queryKey: [QUERY_KEYS.STUDENTS],
    queryFn: () => studentsService.getAll().then((res) => (Array.isArray(res.data) ? res.data : [])),
    staleTime: 5 * 60 * 1000,
  })

  // Fetch guardians
  const {
    data: guardians = [],
    isLoading: guardiansLoading,
  } = useQuery({
    queryKey: [QUERY_KEYS.GUARDIANS],
    queryFn: () => guardiansService.getAll().then((res) => (Array.isArray(res.data) ? res.data : [])),
    staleTime: 5 * 60 * 1000,
  })

  // Mutation for adding a new student
  const addStudentMutation = useMutation({
    mutationFn: studentsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS] })
      setAddModalOpen(false)
      resetForm()
      toast({ 
        type: 'success', 
        title: 'Student Added', 
        description: 'The new student has been added successfully.' 
      })
    },
    onError: (error) => {
      toast({ 
        type: 'error', 
        title: 'Error Adding Student', 
        description: error.message || 'An unknown error occurred.' 
      })
    },
  })

  // Mutation for updating a student
  const editStudentMutation = useMutation({
    mutationFn: ({ id, data }) => studentsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS] })
      setEditModalOpen(false)
      setStudentToEdit(null)
      toast({ 
        type: 'success', 
        title: 'Student Updated', 
        description: 'Student information updated successfully.' 
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

  // Mutation for deleting a student
  const deleteStudentMutation = useMutation({
    mutationFn: studentsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS] })
      setStudentToDelete(null)
      toast({ 
        type: 'success', 
        title: 'Student Deleted', 
        description: 'The student has been removed successfully.' 
      })
    },
    onError: (error) => {
      toast({ 
        type: 'error', 
        title: 'Error Deleting Student', 
        description: error.message || 'An unknown error occurred.' 
      })
    },
  })

  const resetForm = () => {
    setFormData({
      name: '',
      date_of_birth: '',
      gender: '',
      guardian_id: ''
    })
  }

  const handleAddStudent = () => {
    if (!formData.name || !formData.date_of_birth || !formData.guardian_id) {
      toast({ 
        type: 'warning', 
        title: 'Missing Information', 
        description: 'Please fill out all required fields.' 
      })
      return
    }

    addStudentMutation.mutate(formData)
  }

  const handleEditStudent = () => {
    if (!studentToEdit.name || !studentToEdit.date_of_birth || !studentToEdit.guardian_id) {
      toast({ 
        type: 'warning', 
        title: 'Missing Information', 
        description: 'Please fill out all required fields.' 
      })
      return
    }

    editStudentMutation.mutate({
      id: studentToEdit.id,
      data: {
        name: studentToEdit.name,
        date_of_birth: studentToEdit.date_of_birth,
        gender: studentToEdit.gender,
        guardian_id: studentToEdit.guardian_id
      }
    })
  }

  const handleDeleteStudent = () => {
    if (!studentToDelete) return
    deleteStudentMutation.mutate(studentToDelete)
  }

  const handleImageError = (studentId) => {
    setImageErrors(prev => ({ ...prev, [studentId]: true }))
  }

  const openEditModal = (e, student) => {
    e.stopPropagation()
    setStudentToEdit({ ...student })
    setEditModalOpen(true)
  }

  const openDeleteModal = (e, id) => {
    e.stopPropagation()
    setStudentToDelete(id)
  }

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A'
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const getGuardianName = (guardianId) => {
    const guardian = guardians.find(g => g.id === guardianId)
    return guardian ? guardian.name : 'Unknown'
  }

  const isLoading = studentsLoading || guardiansLoading

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Students</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage all student profiles</p>
          </div>
          <Button
            onClick={() => setAddModalOpen(true)}
            className="w-full sm:w-auto"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </motion.div>

        {/* Student Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Student List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              </div>
            ) : studentsError ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                  <p className="text-red-500 font-medium">Error loading students.</p>
                  <p className="text-sm text-muted-foreground mt-1">{studentsError.message}</p>
                </div>
              </div>
            ) : students.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
                <Users className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No students found. Add one to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {students.map((student) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 p-6 flex flex-col items-center hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                  >
                    {/* Profile Image */}
                    <div className="relative mb-4">
                      {imageErrors[student.id] || !student.avatar ? (
                        <div className={`w-24 h-24 rounded-full ${
                          student.gender === 'female'
                            ? 'bg-gradient-to-br from-pink-400 to-pink-600'
                            : 'bg-gradient-to-br from-blue-400 to-blue-600'
                        } flex items-center justify-center shadow-lg`}>
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

                    {/* Age and Gender */}
                    {student.date_of_birth && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        {calculateAge(student.date_of_birth)} years old
                        {student.gender && ` • ${student.gender}`}
                      </p>
                    )}

                    {/* Guardian */}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                      Guardian: {getGuardianName(student.guardian_id)}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2 w-full mt-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={(e) => openEditModal(e, student)}
                      >
                        <Edit2 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={(e) => openDeleteModal(e, student.id)}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Student Modal */}
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
                  <DialogTitle>Add New Student</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="col-span-3"
                      placeholder="Enter student name"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dob" className="text-right">Date of Birth *</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="gender" className="text-right">Gender</Label>
                    <select
                      id="gender"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="guardian" className="text-right">Guardian *</Label>
                    <select
                      id="guardian"
                      value={formData.guardian_id}
                      onChange={(e) => setFormData({ ...formData, guardian_id: e.target.value })}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select guardian</option>
                      {guardians.map(guardian => (
                        <option key={guardian.id} value={guardian.id}>
                          {guardian.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => { setAddModalOpen(false); resetForm(); }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddStudent}
                    disabled={addStudentMutation.isPending}
                  >
                    {addStudentMutation.isPending ? 'Adding...' : 'Add Student'}
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
                    <Label htmlFor="edit-name" className="text-right">Name *</Label>
                    <Input
                      id="edit-name"
                      value={studentToEdit.name}
                      onChange={(e) => setStudentToEdit({ ...studentToEdit, name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-dob" className="text-right">Date of Birth *</Label>
                    <Input
                      id="edit-dob"
                      type="date"
                      value={studentToEdit.date_of_birth}
                      onChange={(e) => setStudentToEdit({ ...studentToEdit, date_of_birth: e.target.value })}
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-gender" className="text-right">Gender</Label>
                    <select
                      id="edit-gender"
                      value={studentToEdit.gender || ''}
                      onChange={(e) => setStudentToEdit({ ...studentToEdit, gender: e.target.value })}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-guardian" className="text-right">Guardian *</Label>
                    <select
                      id="edit-guardian"
                      value={studentToEdit.guardian_id}
                      onChange={(e) => setStudentToEdit({ ...studentToEdit, guardian_id: e.target.value })}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select guardian</option>
                      {guardians.map(guardian => (
                        <option key={guardian.id} value={guardian.id}>
                          {guardian.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => { setEditModalOpen(false); setStudentToEdit(null); }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEditStudent}
                    disabled={editStudentMutation.isPending}
                  >
                    {editStudentMutation.isPending ? 'Saving...' : 'Save Changes'}
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
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="text-destructive" />
                    Confirm Deletion
                  </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                  <p>Are you sure you want to delete this student? This action cannot be undone.</p>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setStudentToDelete(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteStudent}
                    disabled={deleteStudentMutation.isPending}
                  >
                    {deleteStudentMutation.isPending ? 'Deleting...' : 'Delete'}
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