<template>
  <div class="max-w-6xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Columna izquierda: Registrar Entrada -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">
          <i class="fas fa-sign-in-alt text-green-500 mr-2"></i>Registrar Entrada
        </h2>
        
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- DNI Input -->
          <div>
            <label for="dni" class="block text-sm font-medium text-gray-700 mb-2">DNI del Visitante</label>
            <div class="flex space-x-3">
              <input
                id="dni"
                v-model="dni"
                type="text"
                maxlength="8"
                placeholder="Ingrese DNI (8 dígitos)"
                class="input-field flex-1"
                :class="{ 'border-red-500': dniError }"
                @blur="validateDni"
                @input="dni = dni.replace(/[^0-9]/g, '')"
              />
              <button
                type="button"
                @click="searchPerson"
                class="btn-primary whitespace-nowrap"
                :disabled="!dniValid || searchingPerson"
              >
                <span v-if="searchingPerson">
                  <i class="fas fa-spinner fa-spin mr-2"></i>Buscando...
                </span>
                <span v-else>
                  <i class="fas fa-search mr-2"></i>Buscar
                </span>
              </button>
            </div>
            <p v-if="dniError" class="mt-1 text-sm text-red-600">{{ dniError }}</p>
          </div>

          <!-- Person Info -->
          <div v-if="personData" class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-green-800">Datos del visitante:</h3>
                <p class="mt-1 text-lg font-semibold">
                  {{ personData.nombres }} {{ personData.apellido_paterno }} {{ personData.apellido_materno }}
                </p>
                <p class="text-sm text-green-600">DNI: {{ personData.dni }}</p>
              </div>
              <i class="fas fa-check-circle text-green-500 text-2xl"></i>
            </div>
          </div>

          <div v-if="personData" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Área de visita -->
            <div>
              <label for="area_visita" class="block text-sm font-medium text-gray-700 mb-2">Área de visita</label>
              <select
                id="area_visita"
                v-model="visitData.area_visita"
                class="input-field"
                required
              >
                <option value="">Seleccione un área</option>
                <option value="Administración">Administración</option>
                <option value="Contabilidad">Contabilidad</option>
                <option value="Recursos Humanos">Recursos Humanos</option>
                <option value="Sistemas">Sistemas</option>
                <option value="Gerencia">Gerencia</option>
                <option value="Recepción">Recepción</option>
              </select>
            </div>

            <!-- Motivo de visita -->
            <div>
              <label for="motivo" class="block text-sm font-medium text-gray-700 mb-2">Motivo de visita</label>
              <select
                id="motivo"
                v-model="visitData.motivo"
                class="input-field"
                required
              >
                <option value="">Seleccione motivo</option>
                <option value="Reunión">Reunión</option>
                <option value="Entrega de documentos">Entrega de documentos</option>
                <option value="Consulta">Consulta</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Entrevista">Entrevista</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <!-- Observaciones -->
            <div class="md:col-span-2">
              <label for="observaciones" class="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
              <textarea
                id="observaciones"
                v-model="visitData.observaciones"
                rows="3"
                placeholder="Observaciones adicionales"
                class="input-field"
              ></textarea>
            </div>

            <!-- Botones -->
            <div class="md:col-span-2 flex justify-end space-x-4 pt-4">
              <button
                type="button"
                @click="resetForm"
                class="btn-secondary"
              >
                <i class="fas fa-times mr-2"></i>Cancelar
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="btn-primary"
              >
                <span v-if="loading">
                  <i class="fas fa-spinner fa-spin mr-2"></i>Registrando...
                </span>
                <span v-else>
                  <i class="fas fa-check mr-2"></i>Registrar Entrada
                </span>
              </button>
            </div>
          </div>
        </form>

        <!-- Mensajes de estado -->
        <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-center">
            <i class="fas fa-exclamation-circle text-red-500 mr-3"></i>
            <p class="text-red-700">{{ error }}</p>
          </div>
        </div>

        <div v-if="successMessage" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-center">
            <i class="fas fa-check-circle text-green-500 mr-3"></i>
            <p class="text-green-700">{{ successMessage }}</p>
          </div>
        </div>
      </div>

      <!-- Columna derecha: Registrar Salida -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">
          <i class="fas fa-sign-out-alt text-red-500 mr-2"></i>Registrar Salida
        </h2>
        
        <form @submit.prevent="handleExitSubmit" class="space-y-6">
          <!-- DNI Input para salida -->
          <div>
            <label for="exitDni" class="block text-sm font-medium text-gray-700 mb-2">DNI para registrar salida</label>
            <div class="flex space-x-3">
              <input
                id="exitDni"
                v-model="exitDni"
                type="text"
                maxlength="8"
                placeholder="Ingrese DNI (8 dígitos)"
                class="input-field flex-1"
                :class="{ 'border-red-500': exitDniError }"
                @blur="validateExitDni"
                @input="exitDni = exitDni.replace(/[^0-9]/g, '')"
              />
              <button
                type="button"
                @click="checkActiveVisit"
                class="btn-secondary whitespace-nowrap"
                :disabled="!exitDniValid || checkingVisit"
              >
                <span v-if="checkingVisit">
                  <i class="fas fa-spinner fa-spin mr-2"></i>Verificando...
                </span>
                <span v-else>
                  <i class="fas fa-search mr-2"></i>Verificar
                </span>
              </button>
            </div>
            <p v-if="exitDniError" class="mt-1 text-sm text-red-600">{{ exitDniError }}</p>
          </div>

          <!-- Información de visita activa -->
          <div v-if="activeVisitData" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-blue-800">Visita activa encontrada:</h3>
                <p class="mt-1 font-semibold">
                  {{ activeVisitData.nombres }} {{ activeVisitData.apellido_paterno }}
                </p>
                <div class="text-sm text-blue-600 mt-2">
                  <p><span class="font-medium">Entrada:</span> {{ formatDateTime(activeVisitData.fecha_entrada) }}</p>
                  <p><span class="font-medium">Área:</span> {{ activeVisitData.area_visita }}</p>
                  <p><span class="font-medium">Motivo:</span> {{ activeVisitData.motivo }}</p>
                </div>
              </div>
              <i class="fas fa-user-clock text-blue-500 text-2xl"></i>
            </div>
          </div>

          <div v-if="activeVisitData" class="flex justify-end pt-4">
            <button
              type="submit"
              :disabled="exiting"
              class="btn-primary bg-red-600 hover:bg-red-700"
            >
              <span v-if="exiting">
                <i class="fas fa-spinner fa-spin mr-2"></i>Registrando...
              </span>
              <span v-else>
                <i class="fas fa-sign-out-alt mr-2"></i>Registrar Salida
              </span>
            </button>
          </div>
        </form>

        <!-- Mensajes de estado para salida -->
        <div v-if="exitError" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-center">
            <i class="fas fa-exclamation-circle text-red-500 mr-3"></i>
            <p class="text-red-700">{{ exitError }}</p>
          </div>
        </div>

        <div v-if="exitSuccessMessage" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-center">
            <i class="fas fa-check-circle text-green-500 mr-3"></i>
            <p class="text-green-700">{{ exitSuccessMessage }}</p>
          </div>
        </div>

        <!-- Mensaje cuando no hay visita activa -->
        <div v-if="noActiveVisit" class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div class="flex items-center">
            <i class="fas fa-exclamation-triangle text-yellow-500 mr-3"></i>
            <p class="text-yellow-700">No se encontró una visita activa para este DNI</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useVisitStore } from '@/stores/visitStore';
import type { Persona, Visita } from '@/types';

interface VisitFormData {
  area_visita: string;
  motivo: string;
  observaciones: string;
}

export default defineComponent({
  name: 'RegisterVisitView',
  setup() {
    const visitStore = useVisitStore();
    
    // Variables para entrada
    const dni = ref('');
    const dniError = ref('');
    const personData = ref<Persona | null>(null);
    const searchingPerson = ref(false);
    const successMessage = ref('');
    const error = ref('');
    
    const visitData = ref<VisitFormData>({
      area_visita: '',
      motivo: '',
      observaciones: ''
    });

    // Variables para salida
    const exitDni = ref('');
    const exitDniError = ref('');
    const activeVisitData = ref<Visita | null>(null);
    const checkingVisit = ref(false);
    const exiting = ref(false);
    const exitSuccessMessage = ref('');
    const exitError = ref('');
    const noActiveVisit = ref(false);

    const dniValid = computed(() => /^\d{8}$/.test(dni.value));
    const exitDniValid = computed(() => /^\d{8}$/.test(exitDni.value));

    const validateDni = (): void => {
      if (!dni.value) {
        dniError.value = 'El DNI es requerido';
      } else if (!dniValid.value) {
        dniError.value = 'El DNI debe tener exactamente 8 dígitos';
      } else {
        dniError.value = '';
      }
    };

    const validateExitDni = (): void => {
      if (!exitDni.value) {
        exitDniError.value = 'El DNI es requerido';
      } else if (!exitDniValid.value) {
        exitDniError.value = 'El DNI debe tener exactamente 8 dígitos';
      } else {
        exitDniError.value = '';
      }
    };

    const searchPerson = async (): Promise<void> => {
      if (!dniValid.value) return;
      
      searchingPerson.value = true;
      try {
        const response = await visitStore.findOrCreatePerson(dni.value);
        if (response && response.persona) {
          personData.value = response.persona;
          successMessage.value = '';
          error.value = '';
        }
      } catch (err: any) {
        error.value = err.response?.data?.error || 'Error al buscar persona';
      } finally {
        searchingPerson.value = false;
      }
    };

    const checkActiveVisit = async (): Promise<void> => {
      if (!exitDniValid.value) return;
      
      checkingVisit.value = true;
      noActiveVisit.value = false;
      exitError.value = '';
      
      try {
        await visitStore.fetchActiveVisits();
        const activeVisit = visitStore.activeVisits.find(
          (visit: Visita) => visit.dni === exitDni.value
        );
        
        if (activeVisit) {
          activeVisitData.value = activeVisit;
        } else {
          noActiveVisit.value = true;
          activeVisitData.value = null;
        }
      } catch (err: any) {
        exitError.value = 'Error al verificar visitas activas';
      } finally {
        checkingVisit.value = false;
      }
    };

    const handleSubmit = async (): Promise<void> => {
      if (!personData.value) return;
      
      try {
        const fullVisitData = {
          dni: dni.value,
          ...visitData.value
        };
        
        await visitStore.registerEntry(fullVisitData);
        
        successMessage.value = '✅ Visita registrada exitosamente';
        error.value = '';
        
        resetForm();
        
      } catch (err: any) {
        error.value = err.response?.data?.error || 'Error al registrar visita';
        successMessage.value = '';
      }
    };

    const handleExitSubmit = async (): Promise<void> => {
      if (!activeVisitData.value) return;
      
      exiting.value = true;
      try {
        await visitStore.registerExit(exitDni.value);
        
        exitSuccessMessage.value = '✅ Salida registrada exitosamente';
        exitError.value = '';
        noActiveVisit.value = false;
        
        // Resetear formulario de salida después de 2 segundos
        setTimeout(() => {
          exitDni.value = '';
          activeVisitData.value = null;
          exitSuccessMessage.value = '';
        }, 2000);
        
      } catch (err: any) {
        exitError.value = err.response?.data?.error || 'Error al registrar salida';
      } finally {
        exiting.value = false;
      }
    };

    const resetForm = (): void => {
      dni.value = '';
      dniError.value = '';
      personData.value = null;
      visitData.value = {
        area_visita: '',
        motivo: '',
        observaciones: ''
      };
      successMessage.value = '';
      error.value = '';
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

    return {
      // Entrada
      dni,
      dniError,
      dniValid,
      personData,
      searchingPerson,
      visitData,
      loading: computed(() => visitStore.loading),
      error,
      successMessage,
      
      // Salida
      exitDni,
      exitDniError,
      exitDniValid,
      activeVisitData,
      checkingVisit,
      exiting,
      exitSuccessMessage,
      exitError,
      noActiveVisit,
      
      // Métodos
      validateDni,
      validateExitDni,
      searchPerson,
      checkActiveVisit,
      handleSubmit,
      handleExitSubmit,
      resetForm,
      formatDateTime
    };
  }
});
</script>