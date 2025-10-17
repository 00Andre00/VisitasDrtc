<template>
  <div class="max-w-7xl mx-auto">
    <div class="bg-white shadow rounded-lg">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold text-gray-800">Historial Completo de Visitas</h2>
          <span class="text-sm text-gray-500">{{ currentDate }}</span>
        </div>
      </div>

      <!-- Filtros y Búsqueda -->
      <div class="p-6 border-b border-gray-200">
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
      <div class="p-6 bg-gray-50 border-b border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
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
      </div>

      <!-- Tabla de visitas -->
      <div class="overflow-hidden">
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
              <tr v-for="visit in visits" :key="visit.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ visit.nombres }} {{ visit.apellido_paterno }} {{ visit.apellido_materno }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{{ visit.dni }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ visit.area_visita }}</td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ visit.motivo }}</td>
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
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-700">
              Mostrando {{ visits.length }} de {{ allVisitsCount }} visitas
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-8 text-center">
        <i class="fas fa-spinner fa-spin text-blue-500 text-2xl mb-2"></i>
        <p class="text-gray-600">Cargando historial de visitas...</p>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && visits.length === 0" class="p-8 text-center">
        <i class="fas fa-inbox text-gray-300 text-4xl mb-4"></i>
        <h3 class="text-lg font-medium text-gray-600 mb-2">No hay visitas registradas</h3>
        <p class="text-gray-500">No se encontraron visitas con los filtros aplicados</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useVisitStore } from '@/stores/visitStore';
import type { Visita } from '@/types';

export default defineComponent({
  name: 'VisitHistoryView',
  setup() {
    const visitStore = useVisitStore();
    const searchDni = ref('');
    const searchName = ref('');
    const dateFilter = ref('month');

    const allVisits = ref<Visita[]>([]);

    const loadVisits = async (): Promise<void> => {
      await visitStore.fetchVisitHistory();
      allVisits.value = visitStore.visitHistory;
    };

    const visits = computed(() => {
      return allVisits.value.filter(visit => {
        // Filtro por DNI
        if (searchDni.value && !visit.dni?.includes(searchDni.value)) {
          return false;
        }

        // Filtro por nombre
        if (searchName.value) {
          const searchTerm = searchName.value.toLowerCase();
          const fullName = `${visit.nombres} ${visit.apellido_paterno} ${visit.apellido_materno}`.toLowerCase();
          if (!fullName.includes(searchTerm)) {
            return false;
          }
        }

        // Filtro por fecha
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

    const allVisitsCount = computed(() => allVisits.value.length);

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
      visits,
      allVisitsCount,
      searchDni,
      searchName,
      dateFilter,
      stats,
      currentDate,
      formatDateTime,
      calculateDuration,
      loading: computed(() => visitStore.loading)
    };
  }
});
</script>