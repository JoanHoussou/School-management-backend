import axiosInstance from './axiosConfig';

const userService = {
  // Récupérer tous les utilisateurs
  getAllUsers: async () => {
    try {
      const response = await axiosInstance.get('/users');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw new Error(error.response?.data?.message || 'Échec de la récupération des utilisateurs');
    }
  },

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
  },

  // Récupérer tous les parents
  getAllParents: async () => {
    try {
      const response = await axiosInstance.get('/users/parents');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des parents:', error);
      throw new Error(error.response?.data?.message || 'Échec de la récupération des parents');
    }
  },

  // Créer un nouvel utilisateur
  createUser: async (userData) => {
    try {
      const response = await axiosInstance.post('/users', userData);
      console.log('Utilisateur créé:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw new Error(error.response?.data?.message || 'Échec de la création de l\'utilisateur');
    }
  },

  // Supprimer un utilisateur
  deleteUser: async (userId) => {
    try {
      await axiosInstance.delete(`/users/${userId}`);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw new Error(error.response?.data?.message || 'Échec de la suppression de l\'utilisateur');
    }
  }
};

export default userService;