# Student Management System (No MongoDB)

This project connects a React frontend to a Node.js + Express backend.
It supports **Insert, Update, Delete**, and displays all students in a table.
Student data is stored in backend memory, so it resets when you stop/restart the backend.
No MongoDB is needed.

## Requirements
- Node.js installed

## 1. Open the project folder in VS Code
Extract this ZIP, then open the `Student_Management_No_MongoDB` folder.

## 2. Start the backend
Open a terminal in VS Code and run:

```bash
cd backend
npm install
npm run dev
```

You should see:
`Backend running at http://localhost:5000`

Keep this terminal running.

## 3. Start the frontend
Open a **second terminal** in VS Code and run:

```bash
cd frontend
npm install
npm run dev
```

Vite will show a local address, usually:
`http://localhost:5173`

Open that address in your browser.

## How to use
- Enter Student ID, Name, Email, and Department, then click **Insert Student**.
- Click **Edit** in a table row to load the student into the form. Change details and click **Update Student**.
- Click **Delete** to remove a student.
- Click **Cancel Edit** to stop editing.

## Important
- Start the backend first, then the frontend.
- Keep both terminal windows running.
- This version uses in-memory data instead of MongoDB. Students disappear when the backend restarts.
