import { useState, useEffect, useCallback } from 'react';
import dashboardService from '../services/dashboardService';

const useDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    staffOverview: null,
    academicPerformance: null,
    classesOverview: null
  });

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [stats, staff, academic, classes] = await Promise.all([
        dashboardService.getSchoolStats(),
        dashboardService.getStaffOverview(),
        dashboardService.getAcademicPerformance(),
        dashboardService.getClassesOverview()
      ]);

      setDashboardData({
        stats,
        staffOverview: staff,
        academicPerformance: academic,
        classesOverview: classes
      });
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors du chargement des données');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(() => {
    return fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchDashboardData();

    // Rafraîchir les données toutes les 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  return {
    loading,
    error,
    data: dashboardData,
    refreshData
  };
};

export default useDashboard;