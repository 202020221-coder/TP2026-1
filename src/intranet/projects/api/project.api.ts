import type { GetProjectsQP } from "../interfaces/query-params.dto";
import type { GetProjectsResponse } from "../interfaces/responses.dto";
import type { ProjectState } from "../enum/project-state.record";
import axiosInstance from "@/shared/api/axios.config";
import { toSearchParams } from "@/shared/lib/to-search-params";

interface UpdateProjectStateBody {
  id: number;
  newState: ProjectState;
}

export interface UpdateProjectBody {
  id: number;
  descripcion_servicio?: string;
  ubicacion?: string;
  estado?: ProjectState;
  fecha_inicio?: string;
  fecha_fin?: string;
  observaciones?: string;
}

export async function updateProjectState({
  id,
  newState,
}: UpdateProjectStateBody): Promise<void> {
  await axiosInstance.put(`/proyectos/${id}`, { estado: newState });
}

export async function updateProject(body: UpdateProjectBody): Promise<void> {
  const { id, ...rest } = body;
  await axiosInstance.put(`/proyectos/${id}`, rest);
}

export async function getAllProjects(params: GetProjectsQP) {
  const response = await axiosInstance.get<GetProjectsResponse>(
    `/proyectos?${toSearchParams(params)}`,
  );
  return response.data;
}