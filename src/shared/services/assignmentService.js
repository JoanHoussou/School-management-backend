import axiosInstance from './axiosConfig';

const assignmentService = {
  // Récupérer la liste des devoirs
  getAllAssignments: async () => {
    try {
      const response = await axiosInstance.get('/assignments');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des devoirs:', error);
      throw error.response?.data || error.message;
    }
  },

  // Créer un nouveau devoir
  createAssignment: async (assignmentData) => {
    try {
      const response = await axiosInstance.post('/assignments', assignmentData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du devoir:', error);
      throw error.response?.data || error.message;
    }
  },

  // Modifier un devoir existant
  updateAssignment: async (id, assignmentData) => {
    try {
      const response = await axiosInstance.put(`/assignments/${id}`, assignmentData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la modification du devoir:', error);
      throw error.response?.data || error.message;
    }
  },

  // Supprimer un devoir
  deleteAssignment: async (id) => {
    try {
      const response = await axiosInstance.delete(`/assignments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression du devoir:', error);
      throw error.response?.data || error.message;
    }
  },

  // Soumettre un devoir (pour les élèves)
  submitAssignment: async (id, submissionData) => {
    try {
      const response = await axiosInstance.post(`/assignments/${id}/submit`, submissionData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la soumission du devoir:', error);
      throw error.response?.data || error.message;
    }
  },

  // Noter un devoir (pour les professeurs)
  gradeAssignment: async (id, gradeData) => {
    try {
      const response = await axiosInstance.put(`/assignments/${id}/grade`, gradeData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la notation du devoir:', error);
      throw error.response?.data || error.message;
    }
  }
};

export default assignmentService;