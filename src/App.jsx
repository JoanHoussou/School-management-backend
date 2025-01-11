import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Spin } from 'antd';
import PrivateRoute from './shared/components/PrivateRoute';
import Login from './shared/components/Login';
import Unauthorized from './shared/components/Unauthorized';

// Lazy loading des applications
const StudentApp = lazy(() => import('./apps/student-app/StudentApp'));
const ParentApp = lazy(() => import('./apps/parent-app/ParentApp'));
const TeacherApp = lazy(() => import('./apps/teacher-app/TeacherApp'));
const AdminApp = lazy(() => import('./apps/admin-app/AdminApp'));

// Composant de chargement
const LoadingFallback = () => (
  <div className="h-screen flex items-center justify-center">
    <Spin size="large" tip="Chargement..." />
  </div>
);

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        <Route path="/student/*" 
          element={
            <PrivateRoute role="student">
              <StudentApp />
            </PrivateRoute>
          } 
        />
        
        <Route path="/parent/*" 
          element={
            <PrivateRoute role="parent">
              <ParentApp />
            </PrivateRoute>
          } 
        />
        
        <Route path="/teacher/*" 
          element={
            <PrivateRoute role="teacher">
              <TeacherApp />
            </PrivateRoute>
          } 
        />
        
        <Route path="/admin/*" 
          element={
            <PrivateRoute role="admin">
              <AdminApp />
            </PrivateRoute>
          } 
        />
        
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
