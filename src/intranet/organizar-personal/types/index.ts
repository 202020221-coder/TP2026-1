export interface Proyecto {
  id_Proyecto: number;
  descripcion_servicio: string | null;
  ubicacion: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  estado: string;
  Cliente_Nombre: string | null;
  ID_Trabajo: number | null;
  id_cotizacion?: number | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export type Asistencia = "Programada" | "Cancelada" | "Realizada";

/**
 * Slot de trabajo (tabla TRABAJO). Se genera automáticamente al aprobar la
 * cotización según el personal requerido de cada servicio. La jornada
 * (`horario_entrada`/`horario_salida`), `profesion`, `dia` e `ID_Servicio` se
 * heredan y no se editan aquí: solo se asigna `DNI_Trabajador`, `asistencia`
 * y `comentario`.
 */
export interface Trabajo {
  Id_trabajo: number;
  Id_Proyecto: number;
  dia: string; // YYYY-MM-DD
  horario_entrada: string; // HH:mm:ss
  horario_salida: string; // HH:mm:ss
  DNI_Trabajador: string | null;
  profesion: string;
  ID_Servicio: number | null;
  comentario: string | null;
  asistencia: Asistencia | null;
  Trabajador_Nombre: string | null;
  Trabajador_Apellido: string | null;
}

/** Shape permisivo del backend (casing mixto) para TRABAJO. */
export interface TrabajoRaw {
  Id_trabajo?: number | string;
  id_trabajo?: number | string;
  id?: number | string;
  Id_Proyecto?: number | string;
  id_proyecto?: number | string;
  dia?: string;
  fecha?: string;
  horario_entrada?: string;
  horario_salida?: string;
  DNI_Trabajador?: string | null;
  dni_trabajador?: string | null;
  profesion?: string | null;
  ID_Servicio?: number | string | null;
  id_servicio?: number | string | null;
  comentario?: string | null;
  asistencia?: string | null;
  Trabajador_Nombre?: string | null;
  trabajador_nombre?: string | null;
  nombre?: string | null;
  Trabajador_Apellido?: string | null;
  trabajador_apellido?: string | null;
  apellido?: string | null;
  apellidos?: string | null;
}

/** Trabajador disponible devuelto por GET /perfiles/disponibles. */
export interface PerfilDisponible {
  DNI: string;
  Nombre: string;
  Apellido: string;
  profesion_clasificacion: string;
  rol: string | null;
  estado: "disponible" | "en trabajo" | "inhabilitado";
}

export interface PerfilDisponibleRaw {
  DNI?: string;
  dni?: string;
  Nombre?: string;
  nombre?: string;
  Apellido?: string;
  apellido?: string;
  apellidos?: string;
  profesion_clasificacion?: string | null;
  profesion?: string | null;
  rol?: string | null;
  estado?: string | null;
}

/** Cuerpo aceptado por PUT /trabajos/:id. */
export interface UpdateTrabajoBody {
  DNI_Trabajador?: string | null;
  asistencia?: Asistencia | null;
  comentario?: string | null;
}
