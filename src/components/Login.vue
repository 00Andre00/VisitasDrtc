<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <div class="mx-auto h-12 w-12 flex items-center justify-center bg-blue-600 rounded-lg">
            <i class="fas fa-user-check text-white text-xl"></i>
          </div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sistema de Visitas DRTC
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Ingrese sus credenciales para acceder
          </p>
        </div>

        <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
          <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            <span class="block sm:inline">{{ errorMessage }}</span>
          </div>

          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="username" class="sr-only">Usuario</label>
              <input
                id="username"
                v-model="credentials.username"
                type="text"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Usuario"
                :disabled="isLoading"
              />
            </div>
            
            <div class="relative">
              <label for="password" class="sr-only">Contraseña</label>
              <input
                id="password"
                v-model="credentials.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                :disabled="isLoading"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                @click="showPassword = !showPassword"
                :disabled="isLoading"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="h-4 w-4 text-gray-400"></i>
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading || !credentials.username || !credentials.password"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <span v-if="isLoading" class="mr-2">
                <i class="fas fa-spinner fa-spin"></i>
              </span>
              {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
            </button>
          </div>

        </form>
      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/authService';

export default defineComponent({
  name: 'LoginView',
  components: {
  },
  setup() {
    const router = useRouter();
    
    const credentials = ref({
      username: '',
      password: ''
    });

    const errorMessage = ref('');
    const isLoading = ref(false);
    const showPassword = ref(false);

    const handleLogin = async () => {
      try {
        isLoading.value = true;
        errorMessage.value = '';

        await authService.login(credentials.value.username, credentials.value.password);
        
        router.push('/');
        
      } catch (error: any) {
        errorMessage.value = error.message || 'Error al iniciar sesión';
      } finally {
        isLoading.value = false;
      }
    };

    return {
      credentials,
      errorMessage,
      isLoading,
      showPassword,
      handleLogin
    };
  }
});
</script>