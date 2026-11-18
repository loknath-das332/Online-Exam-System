
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import StudentDashboard from "./StudentDashboard";
import AdminDashboard from "./AdminDashboard";
import StartExam from "./StartExam";

// Check Login and User Role
function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    if (user.role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }

    return <Navigate to="/student-dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/start-exam/:examId"
          element={
            <ProtectedRoute allowedRole="student">
              <StartExam />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
