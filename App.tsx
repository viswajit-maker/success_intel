import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { Insights } from './pages/Insights';
import { Reports } from './pages/Reports';
import { StudentDashboard } from './pages/StudentDashboard';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { ParentDashboard } from './pages/ParentDashboard';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Import new modules
import { StudentAssignments } from './pages/StudentAssignments';
import { StudentPerformance } from './pages/StudentPerformance';
import { StudentNotifications } from './pages/StudentNotifications';
import { TeacherAnalytics } from './pages/TeacherAnalytics';
import { ParentProgress } from './pages/ParentProgress';
import { ParentAttendance } from './pages/ParentAttendance';
import { ParentMeetings } from './pages/ParentMeetings';
import { AdminTeachers } from './pages/AdminTeachers';
import { AdminDepartments } from './pages/AdminDepartments';
import { Timetable } from './pages/Timetable';
import { Exams } from './pages/Exams';
import { CareerHub } from './pages/CareerHub';

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Root Redirect */}
      <Route 
        path="/" 
        element={
          isAuthenticated && user ? (
            <Navigate to={`/${user.role}/dashboard`} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />

      {/* Protected Routes wrapped in Layout */}
      <Route element={<Layout><Outlet /></Layout>}>
        
        {/* Student Routes */}
        <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/assignments" element={<ProtectedRoute allowedRoles={['student']}><StudentAssignments /></ProtectedRoute>} />
        <Route path="/student/performance" element={<ProtectedRoute allowedRoles={['student']}><StudentPerformance /></ProtectedRoute>} />
        <Route path="/student/notifications" element={<ProtectedRoute allowedRoles={['student']}><StudentNotifications /></ProtectedRoute>} />
        <Route path="/student/timetable" element={<ProtectedRoute allowedRoles={['student']}><Timetable /></ProtectedRoute>} />
        <Route path="/student/exams" element={<ProtectedRoute allowedRoles={['student']}><Exams /></ProtectedRoute>} />
        <Route path="/student/career-hub" element={<ProtectedRoute allowedRoles={['student']}><CareerHub /></ProtectedRoute>} />

        {/* Teacher Routes */}
        <Route path="/teacher/dashboard" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/teacher/students" element={<ProtectedRoute allowedRoles={['teacher']}><Students /></ProtectedRoute>} />
        <Route path="/teacher/analytics" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherAnalytics /></ProtectedRoute>} />
        <Route path="/teacher/reports" element={<ProtectedRoute allowedRoles={['teacher']}><Reports /></ProtectedRoute>} />
        <Route path="/teacher/timetable" element={<ProtectedRoute allowedRoles={['teacher']}><Timetable /></ProtectedRoute>} />
        <Route path="/teacher/exams" element={<ProtectedRoute allowedRoles={['teacher']}><Exams /></ProtectedRoute>} />
        <Route path="/teacher/career-hub" element={<ProtectedRoute allowedRoles={['teacher']}><CareerHub /></ProtectedRoute>} />

        {/* Parent Routes */}
        <Route path="/parent/dashboard" element={<ProtectedRoute allowedRoles={['parent']}><ParentDashboard /></ProtectedRoute>} />
        <Route path="/parent/progress" element={<ProtectedRoute allowedRoles={['parent']}><ParentProgress /></ProtectedRoute>} />
        <Route path="/parent/attendance" element={<ProtectedRoute allowedRoles={['parent']}><ParentAttendance /></ProtectedRoute>} />
        <Route path="/parent/meetings" element={<ProtectedRoute allowedRoles={['parent']}><ParentMeetings /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/students" element={<ProtectedRoute allowedRoles={['admin']}><Students /></ProtectedRoute>} />
        <Route path="/admin/teachers" element={<ProtectedRoute allowedRoles={['admin']}><AdminTeachers /></ProtectedRoute>} />
        <Route path="/admin/departments" element={<ProtectedRoute allowedRoles={['admin']}><AdminDepartments /></ProtectedRoute>} />
        <Route path="/admin/insights" element={<ProtectedRoute allowedRoles={['admin']}><Insights /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><Reports /></ProtectedRoute>} />
        <Route path="/admin/timetable" element={<ProtectedRoute allowedRoles={['admin']}><Timetable /></ProtectedRoute>} />
        <Route path="/admin/exams" element={<ProtectedRoute allowedRoles={['admin']}><Exams /></ProtectedRoute>} />
        <Route path="/admin/career-hub" element={<ProtectedRoute allowedRoles={['admin']}><CareerHub /></ProtectedRoute>} />

      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
