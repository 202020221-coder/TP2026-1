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

// ── Inventario Requerido del Servicio ─────────────────────────────────────────
// Tabla: SERVICIO_INVENTARIO_REQUERIDO
// Endpoint: /servicios/{id}/inventario-requerido

export interface InventarioRequerido {
  id: number;
  ID_Servicio: number;
  tipo: "objeto" | "camion";
  // Objeto (readonly desde /inventario)
  Id_Objeto?: number;
  nombre_objeto: string;
  cantidad: number;
  metodo_traslado: string;
  estado: string;
  razon: string;           //  editable
  // Camión (readonly desde /camiones)
  Placa: string;
  nombre_camion: string;
  tipo_camion: string;     //  editable
  estado_camion: string;
}

// DTO objeto — POST body que acepta el backend
// Basado en patrón InventarioRequestPayload (organizar-recursos)
export interface CreateInventarioObjetoRequeridoDTO {
  Id_Objeto: number;
  cantidad_objeto: number;   // backend valida > 0
  metodo_traslado: string;
  estado: string;
  razon: string;
}

// DTO camión — POST body para camiones
export interface CreateInventarioCamionRequeridoDTO {
  Placa: string;
  tipo_camion: string;
  razon: string;
}

// PUT: solo los campos editables
export interface UpdateInventarioRequeridoDTO {
  razon?: string;
  tipo_camion?: string;
}
