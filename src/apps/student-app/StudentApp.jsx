import { Routes, Route } from 'react-router-dom';
import StudentDashboard from './components/StudentDashboard';
import Schedule from './components/Schedule';
import Assignments from './components/Assignments';
import Messages from './components/Messages';
import Grades from './components/Grades';
import Courses from './components/Courses';

const StudentApp = () => {
  return (
    <Routes>
      <Route path="/" element={<StudentDashboard />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/assignments" element={<Assignments />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/grades" element={<Grades />} />
      <Route path="/courses" element={<Courses />} />
    </Routes>
  );
};

export default StudentApp; 