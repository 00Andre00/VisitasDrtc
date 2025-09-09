<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Registrar Nueva Visita</h2>
      
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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useVisitStore } from '@/stores/visitStore';
import type { Persona } from '@/types';

interface VisitFormData {
  area_visita: string;
  motivo: string;
  observaciones: string;
}

export default defineComponent({
  name: 'RegisterVisitView',
  setup() {
    const visitStore = useVisitStore();
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

    const dniValid = computed(() => {
      return /^\d{8}$/.test(dni.value);
    });

    const validateDni = (): void => {
      if (!dni.value) {
        dniError.value = 'El DNI es requerido';
      } else if (!dniValid.value) {
        dniError.value = 'El DNI debe tener exactamente 8 dígitos';
      } else {
        dniError.value = '';
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
        error.value = err.message || 'Error al buscar persona';
      } finally {
        searchingPerson.value = false;
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
        
        // Resetear solo parte del formulario
        visitData.value = {
          area_visita: '',
          motivo: '',
          observaciones: ''
        };
        
      } catch (err: any) {
        error.value = err.message || 'Error al registrar visita';
        successMessage.value = '';
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

    return {
      dni,
      dniError,
      dniValid,
      personData,
      searchingPerson,
      visitData,
      loading: computed(() => visitStore.loading),
      error,
      successMessage,
      validateDni,
      searchPerson,
      handleSubmit,
      resetForm
    };
  }
});
</script>