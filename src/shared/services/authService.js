import axiosInstance from './axiosConfig';

const authService = {
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials, {
        withCredentials: true
      });
      
      const { user, token } = response.data;
      
      // Stockage du token et des informations utilisateur
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Configuration du token pour les futures requêtes
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return response.data;
    } catch (error) {
      console.error('Erreur de connexion:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Échec de la connexion');
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout', {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyage local même en cas d'erreur
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  },

  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem('auth_token', token);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('auth_token');
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  },

  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData, {
        withCredentials: true
      });
      
      const { user, token } = response.data;
      
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return response.data;
    } catch (error) {
      console.error('Erreur d\'inscription:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Échec de l\'inscription');
    }
  },

  getProfile: async () => {
    try {
      const response = await axiosInstance.get('/auth/profile', {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Échec de la récupération du profil');
    }
  }
};

export default authService;