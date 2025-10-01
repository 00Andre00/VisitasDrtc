export interface Persona {
  id: number;
  dni: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  created_at?: string;
}

export interface Visita {
  id: number;
  persona_id: number;
  area_visita: string;
  motivo: string;
  observaciones?: string;
  fecha_entrada: string;
  fecha_salida?: string;
  dni?: string;
  nombres?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
}

export interface VisitaRegistro {
  dni: string;
  area_visita: string;
  motivo: string;
  observaciones?: string;
}

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface VisitState {
  activeVisits: Visita[];
  visitHistory: Visita[];
  loading: boolean;
  error: string | null;
}