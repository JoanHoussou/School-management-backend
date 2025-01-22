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
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw new Error(error.response?.data?.message || 'Échec de la création de l\'utilisateur');
    }
  },

  // Mettre à jour un utilisateur
  updateUser: async (userId, userData) => {
    try {
      const response = await axiosInstance.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      throw new Error(error.response?.data?.message || 'Échec de la mise à jour');
    }
  },

  // Supprimer un utilisateur
  deleteUser: async (userId) => {
    try {
      await axiosInstance.delete(`/users/${userId}`);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw new Error(error.response?.data?.message || 'Échec de la suppression');
    }
  },

  // Récupérer un utilisateur par ID
  getUserById: async (userId) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération:', error);
      throw new Error(error.response?.data?.message || 'Échec de la récupération');
    }
  }
};

export default userService;