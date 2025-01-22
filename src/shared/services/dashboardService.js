import axiosConfig from './axiosConfig';

const dashboardService = {
  async getDashboardData() {
    try {
      const response = await axiosConfig.get('/dashboard');
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des données du tableau de bord:', error);
      throw error;
    }
  },

  async getSchoolStats() {
    try {
      const response = await axiosConfig.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      throw error;
    }
  },

  async getStaffOverview() {
    try {
      const response = await axiosConfig.get('/dashboard/staff');
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des données du personnel:', error);
      throw error;
    }
  },

  async getAcademicPerformance() {
    try {
      const response = await axiosConfig.get('/dashboard/academic');
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des performances académiques:', error);
      throw error;
    }
  },

  async getClassesOverview() {
    try {
      const response = await axiosConfig.get('/dashboard/classes');
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des données des classes:', error);
      throw error;
    }
  }
};

export default dashboardService;