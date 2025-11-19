import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react'
import { teachersService } from "@/services/api";
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Layout } from '@/components/layout/Layout'
import { useToast } from '@/hooks/useToast'

export default function Teachers() {
  const { t } = useTranslation()
  const { showToast } = useToast()
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false)
  const [newTeacher, setNewTeacher] = useState({ name: "", subject: "" });
  const [editingTeacher, setEditingTeacher] = useState(null);

  // Fetch all teachers
  const fetchTeachers = async () => {
    try {
      setLoading(true)
      const response = await teachersService.getAll();
      const data = response.data?.data || response.data || []
      setTeachers(data);
    } catch (error) {
      showToast({
        title: 'Error',
        description: error.message || 'Failed to fetch teachers',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Handle Add Teacher
  const handleAddTeacher = async () => {
    if (!newTeacher.name.trim() || !newTeacher.subject.trim()) {
      showToast({
        title: 'Validation Error',
        description: 'Please fill in all fields',
        type: 'error'
      })
      return
    }

    try {
      await teachersService.create(newTeacher);
      setNewTeacher({ name: "", subject: "" });
      fetchTeachers();
      showToast({
        title: 'Success',
        description: 'Teacher added successfully',
        type: 'success'
      })
    } catch (error) {
      showToast({
        title: 'Error',
        description: error.message || 'Failed to add teacher',
        type: 'error'
      })
    }
  };

  // Handle Update Teacher
  const handleUpdateTeacher = async () => {
    if (!editingTeacher.name.trim() || !editingTeacher.subject.trim()) {
      showToast({
        title: 'Validation Error',
        description: 'Please fill in all fields',
        type: 'error'
      })
      return
    }

    try {
      await teachersService.update(editingTeacher.id, editingTeacher);
      setEditingTeacher(null);
      fetchTeachers();
      showToast({
        title: 'Success',
        description: 'Teacher updated successfully',
        type: 'success'
      })
    } catch (error) {
      showToast({
        title: 'Error',
        description: error.message || 'Failed to update teacher',
        type: 'error'
      })
    }
  };

  // Handle Delete Teacher
  const handleDeleteTeacher = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
      return
    }

    try {
      await teachersService.delete(id);
      fetchTeachers();
      showToast({
        title: 'Success',
        description: 'Teacher deleted successfully',
        type: 'success'
      })
    } catch (error) {
      showToast({
        title: 'Error',
        description: error.message || 'Failed to delete teacher',
        type: 'error'
      })
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold">{t('nav.teachers')}</h1>
            <p className="text-muted-foreground mt-1">
              Manage teachers and their subjects.
            </p>
          </div>
        </motion.div>

        {/* Add New Teacher */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5" />
              Add New Teacher
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Teacher Name"
                value={newTeacher.name}
                onChange={(e) =>
                  setNewTeacher({ ...newTeacher, name: e.target.value })
                }
              />
              <Input
                placeholder="Subject"
                value={newTeacher.subject}
                onChange={(e) =>
                  setNewTeacher({ ...newTeacher, subject: e.target.value })
                }
              />
            </div>
            <Button onClick={handleAddTeacher} className="w-full sm:w-auto">
              Add Teacher
            </Button>
          </CardContent>
        </Card>

        {/* Teacher List */}
        {loading ? (
          <Card>
            <CardContent className="flex justify-center items-center h-32">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Loading teachers...</span>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {teachers.map((teacher) => (
              <Card key={teacher.id}>
                <CardContent className="p-6">
                  {editingTeacher?.id === teacher.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          value={editingTeacher.name}
                          onChange={(e) =>
                            setEditingTeacher({
                              ...editingTeacher,
                              name: e.target.value,
                            })
                          }
                        />
                        <Input
                          value={editingTeacher.subject}
                          onChange={(e) =>
                            setEditingTeacher({
                              ...editingTeacher,
                              subject: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleUpdateTeacher} size="sm">
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setEditingTeacher(null)}
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">{teacher.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {teacher.subject}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingTeacher(teacher)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTeacher(teacher.id, teacher.name)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {teachers.length === 0 && !loading && (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">No teachers found. Add one to get started.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}