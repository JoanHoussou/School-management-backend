import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Récupérer le token initial
const token = localStorage.getItem('auth_token');

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': token ? `Bearer ${token}` : ''
  }
});

// Intercepteur pour le token d'authentification
axiosInstance.interceptors.request.use(
  (config) => {
    const currentToken = localStorage.getItem('auth_token');
    if (currentToken) {
      config.headers.Authorization = `Bearer ${currentToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;