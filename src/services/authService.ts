// src/services/authService.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    nombre: string;
    rol: string;
  };
}

interface User {
  id: number;
  username: string;
  nombre: string;
  rol: string;
}

class AuthService {
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';
  private listeners: Set<() => void> = new Set();

async login(username: string, password: string): Promise<LoginResponse> {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username,
      password
    });
    
    const { token, user } = response.data;
    
    // Asegúrate de que estas líneas se ejecuten:
    this.setToken(token);
    this.setUser(user);
    this.setAuthHeader(token); // ← Esta es la más importante
    
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error al iniciar sesión');
  }
}

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.removeAuthHeader();
    
    // Notificar a todos los listeners
    this.notifyListeners();
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.rol === 'admin';
  }

  isRecepcion(): boolean {
    const user = this.getUser();
    return user?.rol === 'recepcion';
  }

  isSeguridad(): boolean {
    const user = this.getUser();
    return user?.rol === 'seguridad';
  }

  async verifyToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) return false;

      await axios.get(`${API_BASE_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  // Sistema de listeners para reactividad
  onAuthChange(callback: () => void): void {
    this.listeners.add(callback);
  }

  offAuthChange(callback: () => void): void {
    this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback());
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  private setAuthHeader(token: string): void {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  private removeAuthHeader(): void {
    delete axios.defaults.headers.common['Authorization'];
  }

  init(): void {
    const token = this.getToken();
    if (token) {
      this.setAuthHeader(token);
    }
  }
}

export default new AuthService();