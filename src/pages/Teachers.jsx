import { useEffect, useState } from "react";
import { teachersService } from "@/services/api";
import { Button } from "@/components/ui/index";
import { Input } from "@/components/ui/index";
import { Card, CardContent } from "@/components/ui/index";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [newTeacher, setNewTeacher] = useState({ name: "", subject: "" });
  const [editingTeacher, setEditingTeacher] = useState(null);

  // Fetch all teachers
  const fetchTeachers = async () => {
    try {
      const { data } = await teachersService.getAll();
      setTeachers(data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Handle Add Teacher
  const handleAddTeacher = async () => {
    try {
      await teachersService.create(newTeacher);
      setNewTeacher({ name: "", subject: "" });
      fetchTeachers();
    } catch (error) {
      console.error("Error adding teacher:", error);
    }
  };

  // Handle Update Teacher
  const handleUpdateTeacher = async () => {
    try {
      await teachersService.update(editingTeacher.id, editingTeacher);
      setEditingTeacher(null);
      fetchTeachers();
    } catch (error) {
      console.error("Error updating teacher:", error);
    }
  };

  // Handle Delete Teacher
  const handleDeleteTeacher = async (id) => {
    try {
      await teachersService.delete(id);
      fetchTeachers();
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Teachers Management</h1>

      {/* Add New Teacher */}
      <Card className="mb-6">
        <CardContent className="p-4 space-y-2">
          <h2 className="font-semibold">Add Teacher</h2>
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
          <Button onClick={handleAddTeacher}>Add</Button>
        </CardContent>
      </Card>

      {/* Teacher List */}
      <div className="grid gap-4">
        {teachers.map((teacher) => (
          <Card key={teacher.id}>
            <CardContent className="p-4 flex justify-between items-center">
              {editingTeacher?.id === teacher.id ? (
                <div className="space-x-2">
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
                  <Button onClick={handleUpdateTeacher}>Save</Button>
                  <Button
                    variant="secondary"
                    onClick={() => setEditingTeacher(null)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <div>
                    <p className="font-semibold">{teacher.name}</p>
                    <p className="text-sm text-gray-500">
                      {teacher.subject}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setEditingTeacher(teacher)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteTeacher(teacher.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
