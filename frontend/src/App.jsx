import { useEffect, useState } from "react";
import { callApi } from "./lib.js";

const emptyForm = {
  studentId: "",
  name: "",
  email: "",
  department: ""
};

export default function App() {
  const [form, setForm] = useState(emptyForm);
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadStudents() {
    try {
      const result = await callApi("GET", "/students/all");
      setStudents(result.students);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const isEditing = editingId !== null;
      const endpoint = isEditing
        ? `/students/update/${editingId}`
        : "/students/insert";

      const result = await callApi(isEditing ? "PUT" : "POST", endpoint, form);
      setMessage(result.message);
      setForm(emptyForm);
      setEditingId(null);
      await loadStudents();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(student) {
    setForm({
      studentId: student.studentId,
      name: student.name,
      email: student.email,
      department: student.department
    });
    setEditingId(student.id);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteStudent(id) {
    if (!window.confirm("Delete this student?")) return;
    setMessage("");
    setError("");

    try {
      const result = await callApi("DELETE", `/students/delete/${id}`);
      setMessage(result.message);
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }
      await loadStudents();
    } catch (err) {
      setError(err.message);
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
  }

  return (
    <main className="page">
      <header className="hero">
        <div className="badge">FULL STACK LAB</div>
        <h1>Student Management System</h1>
        <p>Insert, update, and delete student records</p>
        <div className="connection"><span /> React Frontend ↔ Express Backend</div>
      </header>

      <section className="card form-card">
        <h2>{editingId !== null ? "Update Student" : "Insert Student"}</h2>
        <p className="subtext">Fill in all four fields below.</p>

        {message && <div className="alert success" role="status">{message}</div>}
        {error && <div className="alert error" role="alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Student ID
              <input
                name="studentId"
                value={form.studentId}
                onChange={handleChange}
                placeholder="e.g. STU101"
                required
              />
            </label>
            <label>
              Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter student name"
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="student@example.com"
                required
              />
            </label>
            <label>
              Department
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="e.g. CSE"
                required
              />
            </label>
          </div>
          <div className="actions">
            <button className="primary" type="submit" disabled={loading}>
              {loading ? "Please wait..." : editingId !== null ? "Update Student" : "Insert Student"}
            </button>
            {editingId !== null && (
              <button className="secondary" type="button" onClick={cancelEdit}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card table-card">
        <div className="table-heading">
          <div>
            <h2>Student Records</h2>
            <p className="subtext">Records currently stored by the backend</p>
          </div>
          <span className="count">{students.length} {students.length === 1 ? "student" : "students"}</span>
        </div>

        {students.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">＋</div>
            <strong>No students yet</strong>
            <p>Insert a student using the form above to see the output here.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td><span className="student-id">{student.studentId}</span></td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.department}</td>
                    <td className="row-actions">
                      <button className="edit-btn" onClick={() => startEdit(student)}>Edit</button>
                      <button className="delete-btn" onClick={() => deleteStudent(student.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer>Student Management System · React + Express · No database required</footer>
    </main>
  );
}
