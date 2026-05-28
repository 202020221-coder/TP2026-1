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

export interface Jornada {
  Id_Jornada: number;
  Id_Trabajo: number;
  DNI_Trabajador: string;
  dia: string;
  horario_entrada: string;
  horario_salida: string;
  Trabajador_Nombre: string;
  Trabajador_Apellido: string;
}

// Backend payloads have been observed with mixed casing
// (Id_Jornada / id_jornada / id). Keep a permissive raw shape and normalize.
export interface JornadaRaw {
  Id_Jornada?: number | string;
  id_jornada?: number | string;
  id?: number | string;
  Id_Trabajo?: number | string;
  id_trabajo?: number | string;
  DNI_Trabajador?: string;
  dni_trabajador?: string;
  dia?: string;
  fecha?: string;
  horario_entrada?: string;
  horario_salida?: string;
  Trabajador_Nombre?: string;
  trabajador_nombre?: string;
  nombre?: string;
  Trabajador_Apellido?: string;
  trabajador_apellido?: string;
  apellidos?: string;
  apellido?: string;
}

export interface TrabajadorDisponible {
  dni: string;
  nombre: string;
  apellidos: string;
  rol: string;
}

export interface CreateJornadaBody {
  DNI_Trabajador: string;
  dia: string;
  horario_entrada: string;
  horario_salida: string;
}
