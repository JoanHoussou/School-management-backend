import { Routes, Route } from 'react-router-dom';
import ParentDashboard from './components/ParentDashboard';
import PerformanceOverview from './components/PerformanceOverview';
import AttendanceRecords from './components/AttendanceRecords';
import Messages from './components/Messages';

const ParentApp = () => {
  return (
    <Routes>
      <Route path="/" element={<ParentDashboard />} />
      <Route path="/performance" element={<PerformanceOverview />} />
      <Route path="/attendance" element={<AttendanceRecords />} />
      <Route path="/messages" element={<Messages />} />
    </Routes>
  );
};

export default ParentApp; 