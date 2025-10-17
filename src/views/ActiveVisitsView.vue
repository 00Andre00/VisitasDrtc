<template>
  <div class="max-w-6xl mx-auto">
    <div class="bg-white shadow rounded-lg">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold text-gray-800">Visitas Activas</h2>
          <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {{ visits.length }} visitas activas
          </span>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="p-8 text-center">
        <i class="fas fa-spinner fa-spin text-blue-500 text-2xl mb-2"></i>
        <p class="text-gray-600">Cargando visitas activas...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="visits.length === 0" class="p-8 text-center">
        <i class="fas fa-users-slash text-gray-300 text-4xl mb-4"></i>
        <h3 class="text-lg font-medium text-gray-600 mb-2">No hay visitas activas</h3>
        <p class="text-gray-500">No hay visitantes actualmente en la institución</p>
      </div>

      <!-- Visitas Activas -->
      <div v-else class="divide-y divide-gray-200">
        <div v-for="visit in visits" :key="visit.id" class="p-6 hover:bg-gray-50 transition-colors">
          <div class="flex justify-between items-start">
            <!-- Información del visitante -->
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-800">
                {{ visit.nombres }} {{ visit.apellido_paterno }} {{ visit.apellido_materno }}
              </h3>
              <div class="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div>
                  <span class="font-medium">DNI:</span> {{ visit.dni }}
                </div>
                <div>
                  <span class="font-medium">Área:</span> {{ visit.area_visita }}
                </div>
                <div>
                  <span class="font-medium">Motivo:</span> {{ visit.motivo }}
                </div>
                <div class="md:col-span-3">
                  <span class="font-medium">Hora de entrada:</span> 
                  {{ formatDateTime(visit.fecha_entrada) }}
                </div>
                <div v-if="visit.observaciones" class="md:col-span-3">
                  <span class="font-medium">Observaciones:</span> {{ visit.observaciones }}
                </div>
              </div>
            </div>

            <!-- Acciones -->
            <div class="ml-4 flex flex-col space-y-2">
              <button
                @click="registerExit(visit.dni!)"
                class="btn-primary whitespace-nowrap"
                :disabled="exiting"
              >
                <i class="fas fa-sign-out-alt mr-2"></i>Registrar Salida
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'; // Añadido computed
import { useVisitStore } from '@/stores/visitStore';
import type { Visita } from '@/types';

export default defineComponent({
  name: 'ActiveVisitsView',
  setup() {
    const visitStore = useVisitStore();
    const exiting = ref(false);
    const visits = ref<Visita[]>([]);

    const loadVisits = async (): Promise<void> => {
      await visitStore.fetchActiveVisits();
      visits.value = visitStore.activeVisits;
    };

    const registerExit = async (dni: string): Promise<void> => {
      exiting.value = true;
      try {
        await visitStore.registerExit(dni);
        await loadVisits(); // Recargar la lista
      } catch (error) {
        console.error('Error registrando salida:', error);
      } finally {
        exiting.value = false;
      }
    };

    const formatDateTime = (dateString: string): string => {
      return new Date(dateString).toLocaleString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    onMounted(() => {
      loadVisits();
    });

    return {
      visits,
      loading: computed(() => visitStore.loading),
      error: computed(() => visitStore.error),
      exiting,
      registerExit,
      formatDateTime
    };
  }
});
</script>