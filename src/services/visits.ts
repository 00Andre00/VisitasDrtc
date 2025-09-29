import api from './api';
import type { VisitaRegistro, ApiResponse } from '@/types';

export const visitService = {
  registerEntry: (visitData: VisitaRegistro): Promise<ApiResponse> => 
    api.post('/visitas/entrada', visitData),
  
  registerExit: (dni: string): Promise<ApiResponse> => 
    api.post('/visitas/salida', { dni }),
  
  getActiveVisits: (): Promise<ApiResponse> => 
    api.get('/visitas/activas'),
  
  getVisitHistory: (): Promise<ApiResponse> => 
    api.get('/visitas/historial'),
  
  findOrCreatePerson: (dni: string): Promise<ApiResponse> => 
    api.post('/personas/buscar', { dni }),
  
  getAllPersons: (): Promise<ApiResponse> => 
    api.get('/personas'),
};