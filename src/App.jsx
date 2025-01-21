import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import { Spin } from 'antd';
import PrivateRoute from './shared/components/PrivateRoute';
import Login from './shared/components/Login';
import Unauthorized from './shared/components/Unauthorized';

// Import standard des applications
import StudentApp from './apps/student-app/StudentApp';
import ParentApp from './apps/parent-app/ParentApp';
import TeacherApp from './apps/teacher-app/TeacherApp';
import AdminApp from './apps/admin-app/AdminApp';

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
