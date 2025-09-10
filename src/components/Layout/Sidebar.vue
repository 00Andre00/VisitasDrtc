<template>
  <aside class="w-64 bg-white border-r border-gray-200">
    <nav class="mt-6">
      <router-link 
        to="/registrar-visita" 
        class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
        :class="{ 'bg-primary-50 text-primary-600': currentRoute === '/registrar-visita' }"
      >
        <i class="fas fa-user-plus mr-3"></i>
        Registrar Visita
      </router-link>
      
      <router-link 
        to="/visitas-activas" 
        class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
        :class="{ 'bg-primary-50 text-primary-600': currentRoute === '/visitas-activas' }"
      >
        <i class="fas fa-users mr-3"></i>
        Visitas Activas
      </router-link>
      
      <router-link 
        to="/historial" 
        class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
        :class="{ 'bg-primary-50 text-primary-600': currentRoute === '/historial' }"
      >
        <i class="fas fa-history mr-3"></i>
        Historial Completo
      </router-link>

      <!-- Enlace para vista pública (abre en nueva pestaña) -->
      <a 
        :href="publicUrl"
        target="_blank"
        class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
      >
        <i class="fas fa-external-link-alt mr-3"></i>
        Vista Pública
      </a>
    </nav>
  </aside>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'Sidebar',
  setup() {
    const route = useRoute();
    
    const currentRoute = computed(() => route.path);
    const publicUrl = computed(() => `${window.location.origin}/historial-publico`);

    return {
      currentRoute,
      publicUrl
    };
  }
});
</script>