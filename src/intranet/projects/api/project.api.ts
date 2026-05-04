import type { GetProjectsQP } from "../interfaces/query-params.dto";
import type { GetProjectsResponse } from "../interfaces/responses.dto";
import type { ProjectState } from "../enum/project-state.record";
import axiosInstance from "@/shared/api/axios.config";
import { toSearchParams } from "@/shared/lib/to-search-params";

interface UpdateProjectBody {
  id: number;
  newState: ProjectState;
}

export async function updateProjectState({
  id,
  newState,
}: UpdateProjectBody): Promise<void> {
  await axiosInstance.put(`/proyectos/${id}`, { estado: newState });
}

export async function getAllProjects(params: GetProjectsQP) {
  const response = await axiosInstance.get<GetProjectsResponse>(
    `/proyectos?${toSearchParams(params)}`,
  );
  return response.data;
}
