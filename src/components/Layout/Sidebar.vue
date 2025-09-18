<template>
  <div>
    <!-- Header móvil (solo visible en móvil) -->
    <header class="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 h-16 flex items-center px-4">
      <button
        @click="openMobileMenu"
        class="bg-white border border-gray-200 rounded-lg p-2 mr-3"
      >
        <i class="fas fa-bars text-xl"></i>
      </button>
      <h1 class="text-xl font-semibold text-gray-800">Control de Visitas</h1>
      
      <!-- Información de usuario en móvil -->
      <div v-if="isAuthenticated && currentUser" class="ml-auto flex items-center">
        <span class="text-sm text-gray-600 mr-2 hidden sm:block">{{ currentUser.nombre }}</span>
        <span 
          v-if="currentUser.rol" 
          class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize"
        >
          {{ currentUser.rol }}
        </span>
        <button
          @click="handleLogout"
          class="ml-2 p-2 text-gray-500 hover:text-red-500 transition-colors"
          title="Cerrar Sesión"
        >
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </header>

    <!-- Desktop Sidebar (hidden on mobile) -->
    <aside v-if="isAuthenticated" class="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-shrink-0 fixed left-0 top-0 h-full">
      <nav class="w-full mt-8">
        <div class="px-4 mb-6">
          <h2 class="text-lg font-semibold text-gray-800">Control de Visitas</h2>
          <!-- Información de usuario en desktop -->
          <div v-if="currentUser" class="mt-2 text-sm text-gray-600">
            <p>{{ currentUser.nombre }}</p>
            <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize">
              {{ currentUser.rol }}
            </span>
          </div>
        </div>
        
        <router-link 
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path" 
          class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors duration-200 mx-2 rounded-lg"
          :class="{ 'bg-blue-50 text-blue-600': currentRoute === item.path }"
        >
          <i :class="item.icon" class="mr-3 text-lg w-6 text-center"></i>
          {{ item.title }}
        </router-link>

        <!-- Enlace externo para vista pública -->
        <a 
          :href="publicUrl"
          target="_blank"
          class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors duration-200 mx-2 rounded-lg"
        >
          <i class="fas fa-external-link-alt mr-3 text-lg w-6 text-center"></i>
          Vista Pública
        </a>

        <!-- Botón de logout en desktop -->
        <button
          @click="handleLogout"
          class="flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 mx-2 rounded-lg mt-4"
        >
          <i class="fas fa-sign-out-alt mr-3 text-lg w-6 text-center"></i>
          Cerrar Sesión
        </button>
      </nav>
    </aside>

    <!-- Mobile Menu Overlay -->
    <div 
      v-if="isMobileMenuOpen"
      class="fixed inset-0 z-40 lg:hidden"
    >
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-black/50 transition-opacity duration-300"
        @click="closeMobileMenu"
      />

      <!-- Menu Panel -->
      <div class="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto transition-transform duration-300">
        <div class="flex flex-col h-full">
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 class="text-xl font-bold text-gray-800">Control de Visitas</h2>
            <button 
              class="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
              @click="closeMobileMenu"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <!-- Navigation -->
          <div class="flex-1 overflow-y-auto py-4">
            <div class="space-y-1 px-2">
              <router-link
                v-for="item in menuItems"
                :key="item.path"
                :to="item.path"
                @click="closeMobileMenu"
                class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                :class="{ 'bg-blue-50 text-blue-600': currentRoute === item.path }"
              >
                <i :class="item.icon" class="mr-3 text-lg w-6 text-center"></i>
                <div>
                  <div class="font-medium">{{ item.title }}</div>
                  <div class="text-sm text-gray-500">{{ item.description }}</div>
                </div>
              </router-link>

              <!-- Enlace externo para vista pública -->
              <a
                :href="publicUrl"
                target="_blank"
                @click="closeMobileMenu"
                class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <i class="fas fa-external-link-alt mr-3 text-lg w-6 text-center"></i>
                <div>
                  <div class="font-medium">Vista Pública</div>
                  <div class="text-sm text-gray-500">Acceso externo al historial</div>
                </div>
              </a>

              <!-- Botón de logout en móvil -->
              <button
                @click="handleLogoutMobile"
                class="flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 w-full"
              >
                <i class="fas fa-sign-out-alt mr-3 text-lg w-6 text-center"></i>
                <div>
                  <div class="font-medium">Cerrar Sesión</div>
                  <div class="text-sm text-gray-500">Salir del sistema</div>
                </div>
              </button>
            </div>
          </div>

          <!-- Footer -->
          <div class="border-t border-gray-200 p-4">
            <div class="text-center text-sm text-gray-500">
              Sistema de Control de Visitas
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, onUnmounted, PropType } from 'vue';
import { useRoute } from 'vue-router';

interface MenuItem {
  title: string;
  path: string;
  icon: string;
  description: string;
}

interface User {
  nombre?: string;
  rol?: string;
}

export default defineComponent({
  name: 'ResponsiveSidebar',
  props: {
    isMobileMenuOpen: {
      type: Boolean,
      required: true
    },
    isAuthenticated: {
      type: Boolean,
      required: true
    },
    currentUser: {
      type: Object as PropType<User | null>,
      required: true
    }
  },
  emits: ['close-mobile-menu', 'open-mobile-menu', 'logout'],
  setup(props, { emit }) {
    const route = useRoute();
    
    const currentRoute = computed(() => route.path);
    const publicUrl = computed(() => `${window.location.origin}/historial-publico`);

    const menuItems: MenuItem[] = [
      {
        title: 'Registrar Visita',
        path: '/registrar-visita',
        icon: 'fas fa-user-plus',
        description: 'Registro de entradas y salidas'
      },
      {
        title: 'Visitas Activas',
        path: '/visitas-activas',
        icon: 'fas fa-users',
        description: 'Visitantes actualmente en el edificio'
      },
      {
        title: 'Historial Completo',
        path: '/historial',
        icon: 'fas fa-history',
        description: 'Historial de todas las visitas'
      }
    ];

    const closeMobileMenu = () => {
      emit('close-mobile-menu');
    };

    const openMobileMenu = () => {
      emit('open-mobile-menu');
    };

    const handleLogout = () => {
      emit('logout');
    };

    const handleLogoutMobile = () => {
      closeMobileMenu();
      handleLogout();
    };

    // Cerrar menú móvil cuando cambia la ruta
    watch(currentRoute, () => {
      if (props.isMobileMenuOpen) {
        closeMobileMenu();
      }
    });

    // Cerrar menú móvil con ESC
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && props.isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    // Event listeners para teclado
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeydown);
    }

    onUnmounted(() => {
      window.removeEventListener('keydown', handleKeydown);
    });

    return {
      currentRoute,
      publicUrl,
      menuItems,
      closeMobileMenu,
      openMobileMenu,
      handleLogout,
      handleLogoutMobile
    };
  }
});
</script>

<style scoped>
/* Animaciones personalizadas */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: transform 0.3s ease-out;
}

.mobile-menu-enter-from {
  transform: translateX(-100%);
}

.mobile-menu-leave-to {
  transform: translateX(-100%);
}

/* Prevenir scroll del body cuando el menú está abierto */
.mobile-menu-open {
  overflow: hidden;
}

/* Mejoras de accesibilidad */
@media (max-width: 1023px) {
  body.mobile-menu-open {
    overflow: hidden;
  }
}

/* Estilos para focus visible */
.focus\:ring-2:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.5);
}
</style>