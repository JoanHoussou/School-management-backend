import axiosInstance from './axiosConfig';

const classService = {
  // Récupérer toutes les classes
  getAllClasses: async () => {
    try {
      const response = await axiosInstance.get('/classes');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des classes:', error);
      throw error;
    }
  },

  // Récupérer une classe spécifique
  getClassById: async (id) => {
    try {
      const response = await axiosInstance.get(`/classes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la classe:', error);
      throw error;
    }
  },

  // Créer une nouvelle classe
  createClass: async (classData) => {
    try {
      const response = await axiosInstance.post('/classes', classData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la classe:', error);
      throw error;
    }
  },

  // Mettre à jour une classe existante
  updateClass: async (id, classData) => {
    try {
      const response = await axiosInstance.put(`/classes/${id}`, classData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la classe:', error);
      throw error;
    }
  },

  // Supprimer une classe
  deleteClass: async (id) => {
    try {
      const response = await axiosInstance.delete(`/classes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de la classe:', error);
      throw error;
    }
  },

  // Récupérer tous les niveaux disponibles
  getLevels: async () => {
    try {
      const response = await axiosInstance.get('/academic/levels');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des niveaux:', error);
      throw error;
    }
  },

  createLevel: async (levelData) => {
    try {
      const response = await axiosInstance.post('/academic/levels', levelData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du niveau:', error);
      throw error;
    }
  },

  updateLevel: async (id, levelData) => {
    try {
      const response = await axiosInstance.put(`/academic/levels/${id}`, levelData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du niveau:', error);
      throw error;
    }
  },

  deleteLevel: async (id) => {
    try {
      const response = await axiosInstance.delete(`/academic/levels/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression du niveau:', error);
      throw error;
    }
  }
};

export default classService;