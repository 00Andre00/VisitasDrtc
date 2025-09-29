import { defineStore } from 'pinia';
import { visitService } from '@/services/visits';
import type { VisitState, VisitaRegistro } from '@/types';

export const useVisitStore = defineStore('visits', {
  state: (): VisitState => ({
    activeVisits: [],
    visitHistory: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async registerEntry(visitData: VisitaRegistro) {
      this.loading = true;
      this.error = null;
      try {
        const response = await visitService.registerEntry(visitData);
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Error al registrar entrada';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async registerExit(dni: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await visitService.registerExit(dni);
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Error al registrar salida';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchActiveVisits() {
      this.loading = true;
      this.error = null;
      try {
        const response = await visitService.getActiveVisits();
        this.activeVisits = response.data || [];
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Error al obtener visitas activas';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchVisitHistory() {
      this.loading = true;
      this.error = null;
      try {
        const response = await visitService.getVisitHistory();
        this.visitHistory = response.data || [];
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Error al obtener historial';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async findOrCreatePerson(dni: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await visitService.findOrCreatePerson(dni);
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Error al buscar persona';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});