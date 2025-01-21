import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getStudents = async () => {
  try {
    const response = await axios.get(`${API_URL}/students`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des étudiants:', error);
    throw error;
  }
};

const addStudentToClass = async (classId, studentId) => {
  try {
    const response = await axios.post(
      `${API_URL}/classes/${classId}/students`,
      { studentIds: [studentId] },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'étudiant à la classe:', error);
    throw error;
  }
};

const removeStudentFromClass = async (classId, studentId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/classes/${classId}/students/${studentId}`
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'étudiant de la classe:', error);
    throw error;
  }
};

export default {
  getStudents,
  addStudentToClass,
  removeStudentFromClass
};