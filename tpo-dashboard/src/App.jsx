import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import StudentDetail from "./pages/StudentDetail";
import ImportExcel from "./pages/ImportExcel";
import Companies from "./pages/Companies";
import CreateCompany from "./pages/CreateCompany";
import Drives from "./pages/Drives";
import CreateDrive from "./pages/CreateDrive";
import DriveDetail from "./pages/DriveDetail";
import Export from "./pages/Export";
import Analytics from "./pages/Analytics";
import CreateTPOAdmin from "./pages/CreateTPOAdmin";

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
        <Route path="/students/:rollNumber" element={<ProtectedRoute><StudentDetail /></ProtectedRoute>} />
        <Route path="/import" element={<ProtectedRoute><ImportExcel /></ProtectedRoute>} />
        <Route path="/companies" element={<ProtectedRoute><Companies /></ProtectedRoute>} />
        <Route path="/companies/create" element={<ProtectedRoute><CreateCompany /></ProtectedRoute>} />
        <Route path="/drives" element={<ProtectedRoute><Drives /></ProtectedRoute>} />
        <Route path="/drives/create" element={<ProtectedRoute><CreateDrive /></ProtectedRoute>} />
        <Route path="/drives/:driveId" element={<ProtectedRoute><DriveDetail /></ProtectedRoute>} />
        <Route path="/export" element={<ProtectedRoute><Export /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/admins/create" element={<ProtectedRoute><CreateTPOAdmin /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    <ToastContainer position="top-right" autoClose={3000} />
  </AuthProvider>
);

export default App;
