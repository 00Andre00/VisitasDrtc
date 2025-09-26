<template>
  <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-14 md:h-16">
        <!-- Botón de menú móvil y título -->
        <div class="flex items-center space-x-2 md:space-x-4 min-w-0 flex-1">
          <!-- Botón de menú móvil -->
          <button
            @click="$emit('toggle-sidebar')"
            class="lg:hidden bg-white border border-gray-200 rounded-lg p-2 shadow-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
          >
            <i class="fas fa-bars text-lg"></i>
          </button>
          
          <!-- Título -->
          <h1 class="text-lg md:text-xl font-semibold text-gray-900 truncate">
            Sistema de Gestión de Visitas
          </h1>
        </div>

        <!-- Reloj -->
        <div class="flex-shrink-0">
          <span class="text-sm md:text-base text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-lg hidden sm:block">
            {{ currentTime }}
          </span>
          <span class="text-xs text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded-lg sm:hidden">
            {{ currentTimeShort }}
          </span>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';

export default defineComponent({
  name: 'Header',
  emits: ['toggle-sidebar'],
  setup() {
    const currentTime = ref('');
    const currentTimeShort = ref('');

    const updateTime = () => {
      const now = new Date();
      
      currentTime.value = now.toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      
      currentTimeShort.value = now.toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    let interval: number;
    onMounted(() => {
      updateTime();
      interval = setInterval(updateTime, 1000) as unknown as number;
    });

    onUnmounted(() => {
      clearInterval(interval);
    });

    return {
      currentTime,
      currentTimeShort
    };
  }
});
</script>