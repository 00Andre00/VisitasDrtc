import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

const clearSession = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  
  if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const status = error.response?.status;
    const errorMsg = error.response?.data?.error || error.message;

    if (status === 401) {
      if (errorMsg !== 'Token de acceso requerido') {
        alert('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
      }
      clearSession();
    } else if (status === 403) {
      alert('No tiene permisos para realizar esta acción.');
    }

    return Promise.reject(error);
  }
);

export default api;