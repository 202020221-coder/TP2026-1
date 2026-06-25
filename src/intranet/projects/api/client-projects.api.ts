import axiosInstance from "@/shared/api/axios.config";
import type { Project } from "../interfaces/project";

function unwrapProjects(payload: unknown): Project[] {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") {
    const record = payload as { data?: unknown; proyectos?: unknown };
    if (Array.isArray(record.data)) return record.data;
    if (Array.isArray(record.proyectos)) return record.proyectos;
  }
  return [];
}

export async function getClientProjects(dni: string): Promise<Project[]> {
  try {
    const response = await axiosInstance.get<unknown>(
      `/perfiles/${encodeURIComponent(dni)}/proyectos`,
    );
    const unique = unwrapProjects(response.data).filter(
      (p, index, self) =>
        index === self.findIndex((t) => t.id_Proyecto === p.id_Proyecto),
    );
    return unique;
  } catch {
    return [];
  }
}