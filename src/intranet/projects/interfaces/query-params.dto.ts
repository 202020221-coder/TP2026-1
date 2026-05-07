import type { ProjectState } from "../enum/project-state.record";

export interface GetProjectsQP {
  buscar?: string;
  page?: number;
  limit?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  estado?: ProjectState;
}
