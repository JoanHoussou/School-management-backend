import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getStudents = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/students`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des étudiants:', error);
    throw error;
  }
};

const addStudentToClass = async (classId, studentId) => {
  try {
    // Validation des paramètres
    if (!classId || !studentId) {
      throw new Error('ClassId et StudentId sont requis');
    }

    console.log('Tentative d\'ajout d\'étudiant:', {
      classId,
      studentId,
      token: !!localStorage.getItem('token')
    });

    const authToken = localStorage.getItem('auth_token');
    if (!authToken) {
      throw new Error('Veuillez vous connecter pour effectuer cette action');
    }

    console.log('Token d\'authentification:', {
      exists: !!authToken,
      prefix: authToken?.substring(0, 10) + '...'
    });

    const response = await axios.post(
      `${API_URL}/classes/${classId}/students`,
      { studentIds: [studentId.toString()] },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      }
    );

    if (response.data.results) {
      const result = response.data.results[0];
      if (!result.success) {
        throw new Error(result.message);
      }
    }

    console.log('Réponse détaillée du serveur:', {
      results: response.data.results,
      classStatus: response.data.classStatus
    });
    
    return {
      success: true,
      message: 'Inscription réussie',
      classStatus: response.data.classStatus
    };
  } catch (error) {
    console.error('Erreur détaillée lors de l\'ajout:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
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

export {
  getStudents,
  addStudentToClass,
  removeStudentFromClass
};