import { Routes, Route } from 'react-router-dom';
import TeacherDashboard from './components/TeacherDashboard';
import AssignmentsManager from './components/AssignmentsManager';
import CourseManager from './components/CourseManager';
import Schedule from './components/Schedule';
import Messaging from './components/Messaging';
import ClassList from './components/ClassList';

const TeacherApp = () => {
  return (
    <Routes>
      <Route path="/" element={<TeacherDashboard />} />
      <Route path="/assignments" element={<AssignmentsManager />} />
      <Route path="/course" element={<CourseManager />} />
      <Route path="/classes" element={<ClassList />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/messages" element={<Messaging />} />
    </Routes>
  );
};

export default TeacherApp; 