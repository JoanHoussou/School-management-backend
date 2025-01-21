import axiosInstance from './axiosConfig';

const userService = {
  // Récupérer tous les professeurs
  getAllTeachers: async () => {
    try {
      const response = await axiosInstance.get('/users/teachers');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des professeurs:', error);
      throw new Error(error.response?.data?.message || 'Échec de la récupération des professeurs');
    }
  },

  // Récupérer tous les étudiants
  getAllStudents: async () => {
    try {
      const response = await axiosInstance.get('/users/students');
      if (response.data) {
        // Log pour débogage
        console.log('Étudiants récupérés:', response.data);
      }
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des étudiants:', error);
      throw new Error(error.response?.data?.message || 'Échec de la récupération des étudiants');
    }
  }
};

export default userService;