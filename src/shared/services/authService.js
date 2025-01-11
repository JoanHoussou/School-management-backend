import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const authService = {
  login: async (credentials) => {
    try {
      // Simulation d'une API - À remplacer par votre véritable endpoint
      // const response = await axios.post(`${API_URL}/auth/login`, credentials);
      // return response.data;
      
      // Simulation de réponse
      const users = {
        'student-1': { id: 1, username: 'student-1', role: 'student', name: 'Thomas Dubois' },
        'parent-1': { id: 2, username: 'parent-1', role: 'parent', name: 'M. Dubois' },
        'teacher-1': { id: 3, username: 'teacher-1', role: 'teacher', name: 'Prof. Martin' },
        'admin-1': { id: 4, username: 'admin-1', role: 'admin', name: 'Admin' }
      };

      const user = users[credentials.username];
      if (!user) throw new Error('Utilisateur non trouvé');

      return {
        user,
        token: 'fake-jwt-token'
      };
    } catch (error) {
      throw new Error('Échec de la connexion');
    }
  },

  logout: async () => {
    try {
      // Simulation d'une API
      // await axios.post(`${API_URL}/auth/logout`);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  },

  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem('auth_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('auth_token');
      delete axios.defaults.headers.common['Authorization'];
    }
  }
};

export default authService; 