import axios from 'axios';
import authService from '../services/authService';
import router from '../router';

axios.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      authService.logout();
      router.push('/login');
      
      if (error.response?.data?.error !== 'Token de acceso requerido') {
        alert('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
      }
    } else if (error.response?.status === 403) {
      alert('No tiene permisos para realizar esta acción.');
    }
    
    return Promise.reject(error);
  }
);

export default axios;