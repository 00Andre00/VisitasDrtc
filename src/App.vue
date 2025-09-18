<template>
  <!-- Layout Público (sin sidebar) -->
  <PublicLayout v-if="$route.meta.public">
    <router-view />
  </PublicLayout>

  <!-- Layout Normal (con sidebar) -->
  <div v-else class="min-h-screen flex flex-col bg-gray-50">
    <ResponsiveSidebar 
      :is-mobile-menu-open="isMobileMenuOpen" 
      @close-mobile-menu="isMobileMenuOpen = false"
      @open-mobile-menu="isMobileMenuOpen = true"
      :is-authenticated="isAuthenticated"
      :current-user="currentUser"
      @logout="handleLogout"
    />
    
    <main class="flex-1 transition-all duration-300" :class="{
      'lg:ml-64 pt-16': isAuthenticated,
      'pt-0': !isAuthenticated
    }">
      <div class="container mx-auto p-4 lg:p-6">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import ResponsiveSidebar from './components/Layout/Sidebar.vue';
import PublicLayout from './components/Layout/PublicLayout.vue';
import { useAuth } from './composables/useAuth';
import authService from './services/authService';

export default defineComponent({
  name: 'App',
  components: {
    ResponsiveSidebar,
    PublicLayout
  },
  setup() {
    const router = useRouter();
    const { isAuthenticated, currentUser } = useAuth();
    const isMobileMenuOpen = ref(false);

    const handleLogout = () => {
      if (confirm('¿Está seguro que desea cerrar sesión?')) {
        authService.logout();
        router.push('/login');
      }
    };

    // Escuchar cambios de autenticación
    const handleAuthChange = () => {
      console.log('Auth changed - re-rendering App');
    };

    onMounted(() => {
      authService.onAuthChange(handleAuthChange);
    });

    onUnmounted(() => {
      authService.offAuthChange(handleAuthChange);
    });
    
    return {
      isMobileMenuOpen,
      isAuthenticated,
      currentUser,
      handleLogout
    };
  }
});
</script>

<style>
.mobile-menu-open {
  overflow: hidden;
}
</style>