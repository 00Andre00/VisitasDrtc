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

      this.setToken(token);
      this.setUser(user);
      this.notifyListeners();

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Error al iniciar sesión');
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.notifyListeners();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAdmin(): boolean {
    return this.getUser()?.rol === 'admin';
  }

  isRecepcion(): boolean {
    return this.getUser()?.rol === 'recepcion';
  }

  isSeguridad(): boolean {
    return this.getUser()?.rol === 'seguridad';
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

  init(): void {
    // Método para inicialización si es necesario
  }
}

export default new AuthService();