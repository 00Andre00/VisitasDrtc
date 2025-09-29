<template>
  <div class="min-h-screen bg-gray-50">


    <main>
      <slot /> <!-- Aquí va el contenido de HistoryPublicView -->
    </main>

    <footer class="bg-white border-t border-gray-200 mt-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-wrap items-center justify-center text-center text-sm sm:text-base text-gray-500 gap-x-2">
          <p>
            © {{ new Date().getFullYear() }}
            <span class="font-semibold text-green-custom">DRTC Huánuco</span> — Todos los derechos reservados.
          </p>
          <span class="hidden sm:inline">|</span>
          <p>
            Desarrollado por 
            <a 
              href="https://github.com/00Andre00" 
              target="_blank" 
              rel="noopener noreferrer"
              class="text-green-custom hover:underline font-semibold"
            >
              Renzo André Panduro Moscoso
            </a>
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'PublicLayout',
  setup() {
    const institutionName = ref('DRTC Huánuco');
    const currentDate = ref(new Date().toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));

    return {
      institutionName,
      currentDate
    };
  }
});
</script>