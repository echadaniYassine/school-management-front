import { useEffect, useState } from "react";
import { programsService } from "@/services/api";

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [form, setForm] = useState({
    level: "",
    grade: "",
    duration: "",
    subjects: [{ subject: "", teacher: "" }],
    is_active: true,
  });

  const [editing, setEditing] = useState(null);

  // ✅ Fetch programs
  const fetchPrograms = async () => {
    try {
      const res = await programsService.getAll();
      setPrograms(res.data.data);
    } catch (err) {
      console.error("Error fetching programs:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await programsService.update(editing.id, form);
      } else {
        await programsService.create(form);
      }
      fetchPrograms();
      resetForm();
    } catch (err) {
      console.error("Error saving program:", err);
    }
  };

  const resetForm = () => {
    setForm({
      level: "",
      grade: "",
      duration: "",
      subjects: [{ subject: "", teacher: "" }],
      is_active: true,
    });
    setEditing(null);
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this program?")) return;
    try {
      await programsService.delete(id);
      fetchPrograms();
    } catch (err) {
      console.error("Error deleting program:", err);
    }
  };

  // ✅ Add subject row
  const addSubjectRow = () => {
    setForm({
      ...form,
      subjects: [...form.subjects, { subject: "", teacher: "" }],
    });
  };

  // ✅ Update subject row
  const updateSubjectRow = (index, field, value) => {
    const newSubjects = [...form.subjects];
    newSubjects[index][field] = value;
    setForm({ ...form, subjects: newSubjects });
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  if (loading) return <p>Loading programs...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Programs Management</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Level (Primary, Collège, Lycée)"
            value={form.level}
            onChange={(e) => setForm({ ...form, level: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Grade (1ère année, 2ème année...)"
            value={form.grade}
            onChange={(e) => setForm({ ...form, grade: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Duration (e.g. 1 an)"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            className="border p-2 rounded"
            required
          />
        </div>

        {/* Subjects */}
        <h3 className="mt-4 font-semibold">Subjects & Teachers</h3>
        {form.subjects.map((subj, i) => (
          <div key={i} className="grid grid-cols-2 gap-2 mt-2">
            <input
              type="text"
              placeholder="Subject"
              value={subj.subject}
              onChange={(e) => updateSubjectRow(i, "subject", e.target.value)}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Teacher"
              value={subj.teacher}
              onChange={(e) => updateSubjectRow(i, "teacher", e.target.value)}
              className="border p-2 rounded"
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addSubjectRow}
          className="mt-2 px-3 py-1 bg-gray-200 rounded"
        >
          + Add Subject
        </button>

        <div className="mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            />
            <span className="ml-2">Active</span>
          </label>
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editing ? "Update Program" : "Add Program"}
        </button>
      </form>

      {/* List */}
      <div className="space-y-4">
        {programs.map((program) => (
          <div key={program.id} className="p-4 border rounded shadow-sm">
            <h2 className="text-lg font-bold">
              {program.level} - {program.grade}
            </h2>
            <p className="text-sm text-gray-600">Duration: {program.duration}</p>
            <ul className="mt-2 list-disc list-inside text-sm">
              {program.subjects.map((s, i) => (
                <li key={i}>
                  <span className="font-semibold">{s.subject}:</span> {s.teacher}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => {
                  setForm(program);
                  setEditing(program);
                }}
                className="px-3 py-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(program.id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
