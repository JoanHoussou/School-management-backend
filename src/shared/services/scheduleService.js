import axiosInstance from './axiosConfig';

const scheduleService = {
  // Récupérer l'emploi du temps d'une classe
  getClassSchedule: async (classId) => {
    try {
      const response = await axiosInstance.get(`/schedule/class/${classId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'emploi du temps de la classe:', error);
      throw error.response?.data || error.message;
    }
  },

  // Récupérer l'emploi du temps d'un professeur
  getTeacherSchedule: async (teacherId) => {
    try {
      const response = await axiosInstance.get(`/schedule/teacher/${teacherId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'emploi du temps du professeur:', error);
      throw error.response?.data || error.message;
    }
  },

  // Ajouter un créneau
  createSchedule: async (scheduleData) => {
    try {
      const response = await axiosInstance.post('/schedule', scheduleData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du créneau:', error);
      throw error.response?.data || error.message;
    }
  },

  // Modifier un créneau
  updateSchedule: async (id, scheduleData) => {
    try {
      const response = await axiosInstance.put(`/schedule/${id}`, scheduleData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la modification du créneau:', error);
      throw error.response?.data || error.message;
    }
  },

  // Supprimer un créneau
  deleteSchedule: async (id) => {
    try {
      const response = await axiosInstance.delete(`/schedule/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression du créneau:', error);
      throw error.response?.data || error.message;
    }
  }
};

export default scheduleService;