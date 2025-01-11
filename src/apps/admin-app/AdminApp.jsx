import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import UserManager from './components/UserManager';
import AcademicManager from './components/AcademicManager';
import Reports from './components/Reports';
import ClassManager from './components/ClassManager';

const AdminApp = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/users/*" element={<UserManager />} />
      <Route path="/academic" element={<AcademicManager />} />
      <Route path="/classes" element={<ClassManager />} />
      <Route path="/reports" element={<Reports />} />
    </Routes>
  );
};

export default AdminApp; 