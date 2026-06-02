import axiosInstance from "@/shared/api/axios.config";
import type { Project } from "../interfaces/project";

export async function getClientProjects(dni: string): Promise<Project[]> {
  const response = await axiosInstance.get<Project[]>(
    `/perfiles/${dni}/proyectos`
  );
  // Eliminar duplicados por id_Proyecto
  const unique = response.data.filter(
    (p, index, self) =>
      index === self.findIndex((t) => t.id_Proyecto === p.id_Proyecto)
  );
  return unique;
}