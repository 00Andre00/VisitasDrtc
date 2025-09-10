<template>
  <header class="bg-white shadow-sm border-b border-gray-200 relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center h-16 relative">
        <!-- Texto centrado -->
        <h1 class="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-gray-900">
          Sistema de Gestión de Visitas
        </h1>

        <!-- Reloj alineado a la derecha -->
        <span class="ml-auto text-sm text-gray-500">{{ currentTime }}</span>
      </div>
    </div>
  </header>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';

export default defineComponent({
  name: 'Header',
  setup() {
    const currentTime = ref('');

    const updateTime = () => {
      currentTime.value = new Date().toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    };

    let interval: NodeJS.Timeout; // Cambiado a NodeJS.Timeout
    onMounted(() => {
      updateTime();
      interval = setInterval(updateTime, 1000);
    });

    onUnmounted(() => {
      clearInterval(interval);
    });

    return {
      currentTime
    };
  }
});
</script>