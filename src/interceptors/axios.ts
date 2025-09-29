// src/config/axios.ts
import axios from 'axios';
import authService from '../services/authService';
import router from '../router';

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de peticiones - agregar token
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('🚀 Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      baseURL: config.baseURL
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor de respuestas - manejar errores de auth
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.error || error.message
    });

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

export default apiClient;