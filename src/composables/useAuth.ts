// src/composables/useAuth.ts
import { ref, computed, watchEffect } from 'vue';
import authService from '../services/authService';

export interface User {
  id: number;
  username: string;
  nombre: string;
  rol: string;
}

// Estado reactivo global
const isAuthenticated = ref(authService.isAuthenticated());
const currentUser = ref(authService.getUser());

// Escuchar cambios en localStorage
const setupAuthListener = () => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'auth_token' || e.key === 'auth_user') {
      isAuthenticated.value = authService.isAuthenticated();
      currentUser.value = authService.getUser();
    }
  };

  window.addEventListener('storage', handleStorageChange);
  
  // También escuchar eventos personalizados de authService
  authService.onAuthChange(() => {
    isAuthenticated.value = authService.isAuthenticated();
    currentUser.value = authService.getUser();
  });

  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};

export function useAuth() {
  // Inicializar el listener solo una vez
  let cleanupListener: (() => void) | null = null;
  
  if (!cleanupListener) {
    cleanupListener = setupAuthListener();
  }

  const isAdmin = computed(() => currentUser.value?.rol === 'admin');
  const isRecepcion = computed(() => currentUser.value?.rol === 'recepcion');
  const isSeguridad = computed(() => currentUser.value?.rol === 'seguridad');

  // Forzar actualización inicial
  watchEffect(() => {
    isAuthenticated.value;
    currentUser.value;
  });

  return {
    isAuthenticated: computed(() => isAuthenticated.value),
    currentUser: computed(() => currentUser.value),
    isAdmin,
    isRecepcion,
    isSeguridad
  };
}