import axiosInstance from './axiosConfig';

const gradeService = {
  // Récupérer les notes d'un élève
  getStudentGrades: async (studentId) => {
    try {
      const response = await axiosInstance.get(`/grades/student/${studentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Récupérer les notes d'une classe
  getClassGrades: async (classId, filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = `/grades/class/${classId}${queryParams ? `?${queryParams}` : ''}`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Récupérer les statistiques d'une classe
  getClassStats: async (classId, filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = `/grades/stats/class/${classId}${queryParams ? `?${queryParams}` : ''}`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Ajouter une note
  createGrade: async (gradeData) => {
    try {
      const response = await axiosInstance.post('/grades', gradeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Modifier une note
  updateGrade: async (gradeId, gradeData) => {
    try {
      const response = await axiosInstance.put(`/grades/${gradeId}`, gradeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default gradeService;