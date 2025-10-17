<template>
  <div class="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header responsive -->
      <div class="text-center mb-6 sm:mb-8">
        <h1
          class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2"
        >
          Sistema de Control de Visitas
        </h1>
        <p class="text-sm sm:text-base text-gray-600">
          Registro de entradas y salidas
        </p>
      </div>

      <!-- Layout adaptable: Stack en móviles, Grid en desktop -->
      <div
        class="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6 xl:gap-8"
      >
        <!-- Columna izquierda: Registrar Entrada -->
        <div class="bg-white shadow-lg rounded-xl p-4 sm:p-6 lg:p-6">
          <div class="flex items-center mb-4 sm:mb-6">
            <div class="bg-green-100 p-2 rounded-lg mr-3">
              <i
                class="fas fa-sign-in-alt text-green-600 text-lg sm:text-xl"
              ></i>
            </div>
            <h2 class="text-xl sm:text-2xl font-bold text-gray-800">
              Registrar Entrada
            </h2>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
            <!-- DNI Input -->
            <div>
              <label
                for="dni"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                DNI del Visitante
              </label>
              <div
                class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3"
              >
                <input
                  id="dni"
                  v-model="dni"
                  type="text"
                  maxlength="8"
                  placeholder="Ingrese DNI (8 dígitos)"
                  class="input-field flex-1 text-base sm:text-sm"
                  :class="{ 'border-red-500': dniError }"
                  @blur="validateDni"
                  @input="dni = dni.replace(/[^0-9]/g, '')"
                />
                <button
                  type="button"
                  @click="searchPerson"
                  class="btn-primary w-full sm:w-auto whitespace-nowrap px-4 py-2 sm:px-6"
                  :disabled="!dniValid || searchingPerson"
                >
                  <span
                    v-if="searchingPerson"
                    class="flex items-center justify-center"
                  >
                    <i class="fas fa-spinner fa-spin mr-2"></i>Buscando...
                  </span>
                  <span v-else class="flex items-center justify-center">
                    <i class="fas fa-search mr-2"></i>Buscar
                  </span>
                </button>
              </div>
              <p v-if="dniError" class="mt-2 text-sm text-red-600">
                {{ dniError }}
              </p>
            </div>

            <!-- Person Info - Responsive card -->
            <div
              v-if="personData"
              class="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4"
            >
              <div
                class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0"
              >
                <div class="flex-1">
                  <h3 class="font-medium text-green-800 text-sm sm:text-base">
                    Datos del visitante:
                  </h3>
                  <p
                    class="mt-1 text-base sm:text-lg font-semibold text-gray-900 break-words"
                  >
                    {{ personData.nombres }} {{ personData.apellido_paterno }}
                    {{ personData.apellido_materno }}
                  </p>
                  <p class="text-sm text-green-600">
                    DNI: {{ personData.dni }}
                  </p>
                </div>
                <div class="flex justify-end sm:justify-center">
                  <i
                    class="fas fa-check-circle text-green-500 text-xl sm:text-2xl"
                  ></i>
                </div>
              </div>
            </div>

            <div v-if="personData" class="space-y-4 sm:space-y-6">
              <!-- Grid responsive para los campos -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <!-- Área de visita -->
                <div class="sm:col-span-1">
                  <label
                    for="area_visita"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Área de visita
                  </label>
<select
  id="area_visita"
  v-model="visitData.area_visita"
  class="input-field w-full text-base sm:text-sm"
  required
>
  <option value="">Seleccione un área</option>
  <option value="Direccion Regional">Dirección Regional</option>
  <option value="Oficina Asesoria Juridica">Asesoría Jurídica</option>
  <option value="Integridad Institucional">Integridad Institucional</option>
  <option value="Oficina Planeamiento Presupuesto Modernizacion">
    Planeamiento y Presupuesto
  </option>
  <option value="Oficina Administracion">Administración</option>
  <option value="Unidad Contabilidad">Contabilidad</option>
  <option value="Unidad Talento Humano">Talento Humano</option>
  <option value="Unidad Logistica Servicios Auxiliares">
    Logística y Servicios
  </option>
  <option value="Unidad Patrimonio">Patrimonio</option>
  <option value="Unidad Tesoreria">Tesoreria</option>
  <option value="Direccion Caminos">Dirección de Caminos</option>
  <option value="Subdireccion Equipo Mecanico">Equipo Mecánico</option>
  <option value="Subdireccion Infraestructura Vial">Infraestructura Vial</option>
  <option value="Subdireccion Estudios Laboratorio">Estudios y Laboratorio</option>
  <option value="Direccion Circulacion Vial">Circulación Vial</option>
  <option value="Subdireccion Transporte Vial">Transporte Vial</option>
  <option value="Subdireccion Licencia Conducir">Licencia de Conducir</option>
  <option value="Subdireccion Seguridad Vial">Seguridad Vial</option>
  <option value="Direccion Telecomunicaciones">Telecomunicaciones</option>
  <option value="Oficina Tramite Documentario">Trámite Documentario</option>
  <option value="Oficina Archivo Central">Archivo Central</option>
  <option value="Oficina Seguridad Salud Trabajo">Seguridad y Salud</option>
  <option value="Centro Evaluacion">Centro de Evaluación</option>
  <option value="Unidad Servicio Orientacion Ciudadano">
    Orientación al Ciudadano
  </option>
  <option value="Informatica">Informática</option>
  <option value="Oficina Residencial Tingo Maria">Tingo María</option>
  <option value="Consejo Seguridad Vial Huanuco">Consejo Seguridad Vial</option>
</select>
                </div>

                <!-- Motivo de visita -->
                <div class="sm:col-span-1">
                  <label
                    for="motivo"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Motivo de visita
                  </label>
                  <select
                    id="motivo"
                    v-model="visitData.motivo"
                    class="input-field w-full text-base sm:text-sm"
                    required
                  >
                    <option value="">Seleccione motivo</option>
                    <option value="Reunión">Reunión</option>
                    <option value="Entrega de documentos">
                      Entrega de documentos
                    </option>
                    <option value="Consulta">Consulta</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Entrevista">Entrevista</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <!-- Observaciones - Full width -->
              <div>
                <label
                  for="observaciones"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Observaciones
                </label>
                <textarea
                  id="observaciones"
                  v-model="visitData.observaciones"
                  rows="3"
                  placeholder="Observaciones adicionales"
                  class="input-field w-full resize-none text-base sm:text-sm"
                ></textarea>
              </div>

              <!-- Botones responsive -->
              <div
                class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-2"
              >
                <button
                  type="button"
                  @click="resetForm"
                  class="btn-secondary w-full sm:w-auto order-2 sm:order-1"
                >
                  <i class="fas fa-times mr-2"></i>Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="loading"
                  class="btn-primary w-full sm:w-auto order-1 sm:order-2"
                >
                  <span v-if="loading" class="flex items-center justify-center">
                    <i class="fas fa-spinner fa-spin mr-2"></i>Registrando...
                  </span>
                  <span v-else class="flex items-center justify-center">
                    <i class="fas fa-check mr-2"></i>Registrar Entrada
                  </span>
                </button>
              </div>
            </div>
          </form>

          <!-- Mensajes de estado -->
          <div
            v-if="error"
            class="mt-4 sm:mt-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in"
          >
            <div class="flex items-center">
              <i class="fas fa-exclamation-circle text-red-500 text-xl mr-3 flex-shrink-0"></i>
              <p class="text-red-700 font-medium text-sm sm:text-base break-words">
                {{ error }}
              </p>
            </div>
          </div>

          <div
            v-if="successMessage"
            class="mt-4 sm:mt-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in"
          >
            <div class="flex items-center">
              <i class="fas fa-check-circle text-green-500 text-xl mr-3 flex-shrink-0"></i>
              <p class="text-green-700 font-medium text-sm sm:text-base break-words">
                {{ successMessage }}
              </p>
            </div>
          </div>
        </div>

        <!-- Columna derecha: Registrar Salida -->
        <div class="bg-white shadow-lg rounded-xl p-4 sm:p-6 lg:p-6">
          <div class="flex items-center mb-4 sm:mb-6">
            <div class="bg-red-100 p-2 rounded-lg mr-3">
              <i
                class="fas fa-sign-out-alt text-red-600 text-lg sm:text-xl"
              ></i>
            </div>
            <h2 class="text-xl sm:text-2xl font-bold text-gray-800">
              Registrar Salida
            </h2>
          </div>

          <form
            @submit.prevent="handleExitSubmit"
            class="space-y-4 sm:space-y-6"
          >
            <!-- DNI Input para salida -->
            <div>
              <label
                for="exitDni"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                DNI para registrar salida
              </label>
              <div
                class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3"
              >
                <input
                  id="exitDni"
                  v-model="exitDni"
                  type="text"
                  maxlength="8"
                  placeholder="Ingrese DNI (8 dígitos)"
                  class="input-field flex-1 text-base sm:text-sm"
                  :class="{ 'border-red-500': exitDniError }"
                  @blur="validateExitDni"
                  @input="exitDni = exitDni.replace(/[^0-9]/g, '')"
                />
                <button
                  type="button"
                  @click="checkActiveVisit"
                  class="btn-secondary w-full sm:w-auto whitespace-nowrap px-4 py-2 sm:px-6"
                  :disabled="!exitDniValid || checkingVisit"
                >
                  <span
                    v-if="checkingVisit"
                    class="flex items-center justify-center"
                  >
                    <i class="fas fa-spinner fa-spin mr-2"></i>Verificando...
                  </span>
                  <span v-else class="flex items-center justify-center">
                    <i class="fas fa-search mr-2"></i>Verificar
                  </span>
                </button>
              </div>
              <p v-if="exitDniError" class="mt-2 text-sm text-red-600">
                {{ exitDniError }}
              </p>
            </div>

            <!-- Información de visita activa -->
            <div
              v-if="activeVisitData"
              class="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4"
            >
              <div
                class="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0"
              >
                <div class="flex-1">
                  <h3 class="font-medium text-blue-800 text-sm sm:text-base">
                    Visita activa encontrada:
                  </h3>
                  <p class="mt-1 font-semibold text-gray-900 break-words">
                    {{ activeVisitData.nombres }}
                    {{ activeVisitData.apellido_paterno }}
                  </p>
                  <div class="text-sm text-blue-600 mt-2 space-y-1">
                    <p class="break-words">
                      <span class="font-medium">Entrada:</span>
                      {{ formatDateTime(activeVisitData.fecha_entrada) }}
                    </p>
                    <p class="break-words">
                      <span class="font-medium">Área:</span>
                      {{ activeVisitData.area_visita }}
                    </p>
                    <p class="break-words">
                      <span class="font-medium">Motivo:</span>
                      {{ activeVisitData.motivo }}
                    </p>
                  </div>
                </div>
                <div class="flex justify-end sm:justify-center">
                  <i
                    class="fas fa-user-clock text-blue-500 text-xl sm:text-2xl"
                  ></i>
                </div>
              </div>
            </div>

            <div v-if="activeVisitData" class="flex justify-end pt-2">
              <button
                type="submit"
                :disabled="exiting"
                class="btn-primary bg-red-600 hover:bg-red-700 focus:ring-red-500 w-full sm:w-auto"
              >
                <span v-if="exiting" class="flex items-center justify-center">
                  <i class="fas fa-spinner fa-spin mr-2"></i>Registrando...
                </span>
                <span v-else class="flex items-center justify-center">
                  <i class="fas fa-sign-out-alt mr-2"></i>Registrar Salida
                </span>
              </button>
            </div>
          </form>

          <!-- Mensajes de estado para salida -->
          <div
            v-if="exitError"
            class="mt-4 sm:mt-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in"
          >
            <div class="flex items-center">
              <i class="fas fa-exclamation-circle text-red-500 text-xl mr-3 flex-shrink-0"></i>
              <p class="text-red-700 font-medium text-sm sm:text-base break-words">
                {{ exitError }}
              </p>
            </div>
          </div>

          <div
            v-if="exitSuccessMessage"
            class="mt-4 sm:mt-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in"
          >
            <div class="flex items-center">
              <i class="fas fa-check-circle text-green-500 text-xl mr-3 flex-shrink-0"></i>
              <p class="text-green-700 font-medium text-sm sm:text-base break-words">
                {{ exitSuccessMessage }}
              </p>
            </div>
          </div>

          <!-- Mensaje cuando no hay visita activa -->
          <div
            v-if="noActiveVisit"
            class="mt-4 sm:mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg animate-fade-in"
          >
            <div class="flex items-center">
              <i class="fas fa-exclamation-triangle text-yellow-500 text-xl mr-3 flex-shrink-0"></i>
              <p class="text-yellow-700 font-medium text-sm sm:text-base">
                No se encontró una visita activa para este DNI
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useVisitStore } from "@/stores/visitStore";
import type { Persona, Visita } from "@/types";

interface VisitFormData {
  area_visita: string;
  motivo: string;
  observaciones: string;
}

export default defineComponent({
  name: "RegisterVisitView",
  setup() {
    const visitStore = useVisitStore();

    // Variables para entrada
    const dni = ref("");
    const dniError = ref("");
    const personData = ref<Persona | null>(null);
    const searchingPerson = ref(false);
    const successMessage = ref("");
    const error = ref("");

    const visitData = ref<VisitFormData>({
      area_visita: "",
      motivo: "",
      observaciones: "",
    });

    // Variables para salida
    const exitDni = ref("");
    const exitDniError = ref("");
    const activeVisitData = ref<Visita | null>(null);
    const checkingVisit = ref(false);
    const exiting = ref(false);
    const exitSuccessMessage = ref("");
    const exitError = ref("");
    const noActiveVisit = ref(false);

    const dniValid = computed(() => /^\d{8}$/.test(dni.value));
    const exitDniValid = computed(() => /^\d{8}$/.test(exitDni.value));

    const validateDni = (): void => {
      if (!dni.value) {
        dniError.value = "El DNI es requerido";
      } else if (!dniValid.value) {
        dniError.value = "El DNI debe tener exactamente 8 dígitos";
      } else {
        dniError.value = "";
      }
    };

    const validateExitDni = (): void => {
      if (!exitDni.value) {
        exitDniError.value = "El DNI es requerido";
      } else if (!exitDniValid.value) {
        exitDniError.value = "El DNI debe tener exactamente 8 dígitos";
      } else {
        exitDniError.value = "";
      }
    };

    const searchPerson = async (): Promise<void> => {
      if (!dniValid.value) return;

      searchingPerson.value = true;
      try {
        const response = await visitStore.findOrCreatePerson(dni.value);
        if (response && response.persona) {
          personData.value = response.persona;
          successMessage.value = "";
          error.value = "";
        }
      } catch (err: any) {
        error.value = err.response?.data?.error || "Error al buscar persona";
      } finally {
        searchingPerson.value = false;
      }
    };

    const checkActiveVisit = async (): Promise<void> => {
      if (!exitDniValid.value) return;

      checkingVisit.value = true;
      noActiveVisit.value = false;
      exitError.value = "";

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
        exitError.value = "Error al verificar visitas activas";
      } finally {
        checkingVisit.value = false;
      }
    };

const handleSubmit = async (): Promise<void> => {
  if (!personData.value) return;

  try {
    const fullVisitData = {
      dni: dni.value,
      ...visitData.value,
    };

    await visitStore.registerEntry(fullVisitData);

    successMessage.value = "✅ Visita registrada exitosamente";
    error.value = "";

    // Limpiar mensaje Y resetear formulario después de 2 segundos
    setTimeout(() => {
      successMessage.value = "";
      resetForm();  // ← Ahora está DENTRO del setTimeout
    }, 2000);

  } catch (err: any) {
    error.value = err.response?.data?.error || "Error al registrar visita";
    successMessage.value = "";
  }
};

    const handleExitSubmit = async (): Promise<void> => {
      if (!activeVisitData.value) return;

      exiting.value = true;
      try {
        await visitStore.registerExit(exitDni.value);

        exitSuccessMessage.value = "✅ Salida registrada exitosamente";
        exitError.value = "";
        noActiveVisit.value = false;

        // Resetear formulario de salida después de 2 segundos
        setTimeout(() => {
          exitDni.value = "";
          activeVisitData.value = null;
          exitSuccessMessage.value = "";
        }, 2000);
      } catch (err: any) {
        exitError.value =
          err.response?.data?.error || "Error al registrar salida";
      } finally {
        exiting.value = false;
      }
    };

    const resetForm = (): void => {
      dni.value = "";
      dniError.value = "";
      personData.value = null;
      visitData.value = {
        area_visita: "",
        motivo: "",
        observaciones: "",
      };
      successMessage.value = "";
      error.value = "";
    };

    const formatDateTime = (dateString: string): string => {
      return new Date(dateString).toLocaleString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
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
      formatDateTime,
    };
  },
});
</script>

<style scoped>
/* Estilos base para inputs y botones */
.input-field {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200;
}

.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
}

/* Mejoras de accesibilidad táctil para móviles */
@media (max-width: 640px) {
  .input-field {
    @apply py-3 text-base;
  }

  .btn-primary,
  .btn-secondary {
    @apply py-3 px-6 text-base;
    min-height: 48px;
  }
}

/* Optimizaciones para pantallas pequeñas */
@media (max-width: 374px) {
  .text-2xl {
    @apply text-xl;
  }

  .text-xl {
    @apply text-lg;
  }
}

/* Animaciones para mensajes */
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
