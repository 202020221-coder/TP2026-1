export interface Proyecto {
  id_Proyecto: number;
  descripcion_servicio: string | null;
  ubicacion: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  estado: string;
  Cliente_Nombre: string | null;
  ID_Trabajo: number | null;
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
