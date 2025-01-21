import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const gradeService = {
  // Récupérer les notes d'un élève
  getStudentGrades: async (studentId) => {
    try {
      const response = await axios.get(`${API_URL}/grades/student/${studentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Récupérer les notes d'une classe
  getClassGrades: async (classId, filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = `${API_URL}/grades/class/${classId}${queryParams ? `?${queryParams}` : ''}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Récupérer les statistiques d'une classe
  getClassStats: async (classId, filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = `${API_URL}/grades/stats/class/${classId}${queryParams ? `?${queryParams}` : ''}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Ajouter une note
  createGrade: async (gradeData) => {
    try {
      const response = await axios.post(`${API_URL}/grades`, gradeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Modifier une note
  updateGrade: async (gradeId, gradeData) => {
    try {
      const response = await axios.put(`${API_URL}/grades/${gradeId}`, gradeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default gradeService;