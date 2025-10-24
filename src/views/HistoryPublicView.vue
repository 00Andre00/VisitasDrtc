<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header Público -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Historial de Visitas DRTC HUÁNUCO</h1>
      <p class="text-gray-600">{{ currentDate }}</p>
    </div>

    <!-- Filtros y Búsqueda -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Búsqueda por DNI -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Buscar por DNI</label>
          <input
            v-model="searchDni"
            placeholder="Ingrese DNI"
            class="input-field"
            @input="searchDni = searchDni.replace(/[^0-9]/g, '')"
          />
        </div>

        <!-- Búsqueda por nombre -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Buscar por nombre</label>
          <input
            v-model="searchName"
            placeholder="Ingrese nombre"
            class="input-field"
          />
        </div>

        <!-- Rango de fechas -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
          <select v-model="dateFilter" class="input-field">
            <option value="today">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="all">Todos</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Estadísticas -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-4 text-center">
        <div class="text-2xl font-bold text-blue-600">{{ stats.total }}</div>
        <div class="text-sm text-gray-600">Total visitas</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4 text-center">
        <div class="text-2xl font-bold text-green-600">{{ stats.today }}</div>
        <div class="text-sm text-gray-600">Visitas hoy</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4 text-center">
        <div class="text-2xl font-bold text-purple-600">{{ stats.thisWeek }}</div>
        <div class="text-sm text-gray-600">Esta semana</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4 text-center">
        <div class="text-2xl font-bold text-orange-600">{{ stats.thisMonth }}</div>
        <div class="text-sm text-gray-600">Este mes</div>
      </div>
    </div>

    <!-- Tabla de visitas -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitante</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motivo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrada</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salida</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duración</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="visit in paginatedVisits" :key="visit.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ visit.nombres }} {{ visit.apellido_paterno }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{{ visit.dni }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ visit.area_visita }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ visit.motivo || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDateTime(visit.fecha_entrada) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ visit.fecha_salida ? formatDateTime(visit.fecha_salida) : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ visit.fecha_salida ? calculateDuration(visit.fecha_entrada, visit.fecha_salida) : '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div class="text-sm text-gray-700">
            Mostrando {{ startIndex + 1 }} a {{ endIndex }} de {{ filteredVisitsCount }} visitas
            <span v-if="filteredVisitsCount !== allVisitsCount" class="text-gray-500">
              (filtrado de {{ allVisitsCount }} total)
            </span>
          </div>
          
          <div class="flex items-center gap-2">
            <!-- Registros por página -->
            <select 
              v-model="itemsPerPage" 
              class="border border-gray-300 rounded px-2 py-1 text-sm"
              @change="currentPage = 1"
            >
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
            
            <!-- Botones de paginación -->
            <button
              @click="currentPage = 1"
              :disabled="currentPage === 1"
              class="px-3 py-1 rounded bg-white border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Primero
            </button>
            
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-1 rounded bg-white border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Anterior
            </button>
            
            <span class="px-3 py-1 text-sm text-gray-700">
              Página {{ currentPage }} de {{ totalPages }}
            </span>
            
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 rounded bg-white border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Siguiente
            </button>
            
            <button
              @click="currentPage = totalPages"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 rounded bg-white border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Último
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <i class="fas fa-spinner fa-spin text-blue-500 text-2xl mb-2"></i>
      <p class="text-gray-600">Cargando historial de visitas...</p>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && filteredVisitsCount === 0" class="text-center py-8">
      <i class="fas fa-inbox text-gray-300 text-4xl mb-4"></i>
      <h3 class="text-lg font-medium text-gray-600 mb-2">No hay visitas registradas</h3>
      <p class="text-gray-500">No se encontraron visitas con los filtros aplicados</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import type { Visita } from '@/types';

export default defineComponent({
  name: 'HistoryPublicView',
  setup() {
    const searchDni = ref('');
    const searchName = ref('');
    const dateFilter = ref('month');
    const allVisits = ref<Visita[]>([]);
    const loading = ref(true);
    const currentPage = ref(1);
    const itemsPerPage = ref(25);

    const loadVisits = async (): Promise<void> => {
      try {
        loading.value = true;
        const API_URL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${API_URL}/visitas/public/historial`);
        
        if (!response.ok) {
          throw new Error('Error al cargar visitas');
        }
        
        const data = await response.json();
        allVisits.value = data;
      } catch (error) {
        console.error('Error loading visits:', error);
      } finally {
        loading.value = false;
      }
    };

    const filteredVisits = computed(() => {
      return allVisits.value.filter(visit => {
        if (searchDni.value && !visit.dni?.includes(searchDni.value)) {
          return false;
        }

        if (searchName.value) {
          const searchTerm = searchName.value.toLowerCase();
          const fullName = `${visit.nombres} ${visit.apellido_paterno} ${visit.apellido_materno}`.toLowerCase();
          if (!fullName.includes(searchTerm)) {
            return false;
          }
        }

        const visitDate = new Date(visit.fecha_entrada);
        const now = new Date();
        
        switch (dateFilter.value) {
          case 'today':
            return visitDate.toDateString() === now.toDateString();
          case 'week':
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            startOfWeek.setHours(0, 0, 0, 0);
            return visitDate >= startOfWeek;
          case 'month':
            return visitDate.getMonth() === now.getMonth() && 
                   visitDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    });

    const filteredVisitsCount = computed(() => filteredVisits.value.length);
    const allVisitsCount = computed(() => allVisits.value.length);

    const totalPages = computed(() => {
      return Math.ceil(filteredVisitsCount.value / itemsPerPage.value) || 1;
    });

    const startIndex = computed(() => {
      return (currentPage.value - 1) * itemsPerPage.value;
    });

    const endIndex = computed(() => {
      return Math.min(startIndex.value + itemsPerPage.value, filteredVisitsCount.value);
    });

    const paginatedVisits = computed(() => {
      return filteredVisits.value.slice(startIndex.value, endIndex.value);
    });

    // Reset a página 1 cuando cambien los filtros
    watch([searchDni, searchName, dateFilter], () => {
      currentPage.value = 1;
    });

    const stats = computed(() => {
      const now = new Date();
      const today = now.toDateString();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      return {
        total: allVisits.value.length,
        today: allVisits.value.filter(v => new Date(v.fecha_entrada).toDateString() === today).length,
        thisWeek: allVisits.value.filter(v => new Date(v.fecha_entrada) >= startOfWeek).length,
        thisMonth: allVisits.value.filter(v => 
          new Date(v.fecha_entrada).getMonth() === now.getMonth() && 
          new Date(v.fecha_entrada).getFullYear() === now.getFullYear()
        ).length
      };
    });

    const formatDateTime = (dateString: string): string => {
      return new Date(dateString).toLocaleString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const calculateDuration = (start: string, end: string): string => {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const diffMs = endDate.getTime() - startDate.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const hours = Math.floor(diffMins / 60);
      const minutes = diffMins % 60;
      
      return `${hours}h ${minutes}m`;
    };

    const currentDate = ref(new Date().toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));

    onMounted(() => {
      loadVisits();
    });

    return {
      paginatedVisits,
      filteredVisitsCount,
      allVisitsCount,
      searchDni,
      searchName,
      dateFilter,
      stats,
      currentDate,
      formatDateTime,
      calculateDuration,
      loading,
      currentPage,
      itemsPerPage,
      totalPages,
      startIndex,
      endIndex
    };
  }
});
</script>
