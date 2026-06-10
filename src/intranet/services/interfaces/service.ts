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
// Clave compuesta: (ID_Servicio, Id_Objeto) — NO hay id autoincremental
// Endpoint: /servicios/{id}/inventario-requerido

export interface InventarioRequerido {
  // id = Id_Objeto (usado como identificador único en la UI)
  id: number;
  Id_Objeto: number;
  ID_Servicio: number;
  nombre_objeto: string;
  cantidad: number;
  estancia: string;         // ✏️ editable (antes llamado razon/metodo_traslado)
}

// POST: { Id_Objeto, cantidad, estancia }
export interface CreateInventarioObjetoRequeridoDTO {
  Id_Objeto: number;
  cantidad: number;          // backend valida > 0
  estancia: string;
}

// PUT: { cantidad, estancia }
export interface UpdateInventarioRequeridoDTO {
  cantidad?: number;
  estancia?: string;
}
