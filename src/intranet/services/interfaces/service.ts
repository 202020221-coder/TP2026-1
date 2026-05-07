export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio_regular: number;
  condicional_precio: string;
  observaciones: string;
  activo: boolean;
}

export interface CreateServicioDTO {
  nombre: string;
  descripcion: string;
  precio_regular: number;
  condicional_precio: string;
  observaciones: string;
}

export type UpdateServicioDTO = Partial<CreateServicioDTO & { activo: boolean }>;

// ── Personal Requerido ────────────────────────────────────────────────────────
export interface PersonalRequerido {
  id: number;
  ID_Servicio: number;
  profesion: string;
  cantidad: number;
  disponibilidad: string;
  requerimiento_legal: string;
}

export interface CreatePersonalRequeridoDTO {
  profesion: string;
  cantidad: number;
  disponibilidad: string;
  requerimiento_legal: string;
}

export type UpdatePersonalRequeridoDTO = Partial<CreatePersonalRequeridoDTO>;
