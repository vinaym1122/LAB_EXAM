import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// In-memory storage: no MongoDB required.
// Data is reset whenever this backend process restarts.
let students = [];
let nextId = 1;

app.get("/", (_req, res) => {
  res.json({ success: true, message: "Student Management API is running." });
});

app.get("/students/all", (_req, res) => {
  res.json({ success: true, students });
});

app.post("/students/insert", (req, res) => {
  const { studentId, name, email, department } = req.body;

  if (!studentId || !name || !email || !department) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all fields."
    });
  }

  const duplicate = students.some(
    (student) => student.studentId.toLowerCase() === String(studentId).trim().toLowerCase()
  );
  if (duplicate) {
    return res.status(409).json({
      success: false,
      message: "That Student ID already exists."
    });
  }

  const student = {
    id: nextId++,
    studentId: String(studentId).trim(),
    name: String(name).trim(),
    email: String(email).trim(),
    department: String(department).trim()
  };

  students.push(student);
  res.status(201).json({ success: true, message: "Student inserted successfully.", student });
});

app.put("/students/update/:id", (req, res) => {
  const id = Number(req.params.id);
  const { studentId, name, email, department } = req.body;

  if (!studentId || !name || !email || !department) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all fields."
    });
  }

  const index = students.findIndex((student) => student.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Student not found." });
  }

  const duplicate = students.some(
    (student) =>
      student.id !== id &&
      student.studentId.toLowerCase() === String(studentId).trim().toLowerCase()
  );
  if (duplicate) {
    return res.status(409).json({
      success: false,
      message: "Another student already uses that Student ID."
    });
  }

  students[index] = {
    id,
    studentId: String(studentId).trim(),
    name: String(name).trim(),
    email: String(email).trim(),
    department: String(department).trim()
  };

  res.json({
    success: true,
    message: "Student updated successfully.",
    student: students[index]
  });
});

app.delete("/students/delete/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = students.findIndex((student) => student.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Student not found." });
  }

  students.splice(index, 1);
  res.json({ success: true, message: "Student deleted successfully." });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
