import axiosInstance from './axiosConfig';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'; // A conserver temporairement pour la transition

const classService = {
  // Récupérer toutes les classes
  getAllClasses: async () => {
    try {
      const response = await axiosInstance.get('/classes');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des classes:', error);
      throw new Error(error.response?.data?.message || 'Échec de la récupération des classes');
    }
  },

  // Récupérer une classe spécifique
  getClassById: async (classId) => {
    try {
      const response = await axios.get(`${API_URL}/classes/${classId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la classe:', error);
      throw new Error(error.response?.data?.message || 'Échec de la récupération de la classe');
    }
  },

  // Créer une nouvelle classe
  createClass: async (classData) => {
    try {
      console.log('Envoi des données de classe:', classData);
      const response = await axios.post(`${API_URL}/classes`, classData);
      console.log('Réponse du serveur:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur détaillée:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      throw new Error(error.response?.data?.message || error.message || 'Échec de la création de la classe');
    }
  },

  // Mettre à jour une classe existante
  updateClass: async (classId, classData) => {
    try {
      const response = await axios.put(`${API_URL}/classes/${classId}`, classData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la classe:', error);
      throw new Error(error.response?.data?.message || 'Échec de la mise à jour de la classe');
    }
  },

  // Supprimer une classe
  deleteClass: async (classId) => {
    try {
      const response = await axiosInstance.delete(`/classes/${classId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de la classe:', error);
      throw new Error(error.response?.data?.message || 'Échec de la suppression de la classe');
    }
  },

  // Récupérer tous les niveaux disponibles
  getLevels: async () => {
    try {
      const response = await axios.get(`${API_URL}/classes/config/levels`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des niveaux:', error);
      throw error.response?.data || error.message;
    }
  }
};

export default classService;