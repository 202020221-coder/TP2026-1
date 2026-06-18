export interface Informe {
  id: number;
  nombre: string;
  fecha: string | null;
  hora: string;
  DNI_autor: string;
  descripcion: string | null;
  evidencia: string | null;
  ubicacion: string | null;
  id_incidencia: number | null;
  id_proyecto_etapa: number | null;
  id_proyecto_actividad: number | null;
  id_Proyecto: number;
  fecha_registro: string;
  relacion: string;
  autor_nombre: string | null;
  Proyecto_Nombre?: string;
  etapa: InformeEtapa | null;
  actividad: InformeActividad | null;
  Incidencia_Nombre?: string | null;
  Incidencia_Estado?: string | null;
  implicancia?: "ninguno" | "colateral" | "principal";
  tiempo_perdido?: number | null;
}

export interface InformeEtapa {
  id: number;
  codigo: string | null;
  nombre: string;
  estado: string;
}

export interface InformeActividad {
  id: number;
  codigo: string | null;
  nombre: string;
  estado: string;
  id_proyecto_etapa?: number;
}

export interface ProyectoEtapa {
  id: number;
  id_Proyecto: number;
  tipo: string;
  codigo: string | null;
  nombre: string;
  descripcion: string | null;
  duracion: number;
  orden: number;
  estado: string;
  actividades: ProyectoActividad[];
}

export interface ProyectoActividad {
  id: number;
  id_proyecto_etapa: number;
  id_Proyecto: number;
  codigo: string | null;
  nombre: string;
  orden: number;
  estado: string;
}

export interface IncidenciaResumen {
  id_incidencia: number;
  nombre_incidencia: string | null;
  estado: string | null;
}

export interface InformeRowData {
  /** Negative IDs = unsaved new rows */
  id: number;
  fecha: string;
  hora: string;
  descripcion: string;
  id_incidencia: number | null;
  id_proyecto_etapa: number | null;
  id_proyecto_actividad: number | null;
  evidenciaFile: File | null;
  evidenciaUrl: string | null;
  isNew: boolean;
  isSaving: boolean;
  isEditing?: boolean;
  implicancia?: "ninguno" | "colateral" | "principal";
  tiempo_perdido?: number | null;
}
