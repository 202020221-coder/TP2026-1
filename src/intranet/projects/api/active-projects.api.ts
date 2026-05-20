import type { Project } from "../interfaces/project";
import axiosInstance from "@/shared/api/axios.config";

export async function getActiveCompletedProjects(): Promise<Project[]> {
  const response = await axiosInstance.get<Project[]>(
    "/proyectos/activos-completados"
  );
  return response.data;
}