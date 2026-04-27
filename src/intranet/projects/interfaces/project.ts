import type { ProjectState } from "../enum/project-state.record";

export interface Project {
  ID: number;
  nombre: string;
  fecha_inicio: string;
  fecha_finalizacion: string;
  cliente: string;
  estado: ProjectState;
  Id_servicio?: string;
  Id_informe?: string;
  trabajadores_count?: number;
  incidencias_count?: number;
}
