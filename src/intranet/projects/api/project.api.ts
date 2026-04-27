import type { GetProjectsQP } from "../interfaces/query-params.dto";
import type { GetProjectsResponse } from "../interfaces/responses.dto";
import type { Project } from "../interfaces/project";

// Datos mock para el front-end (sin backend)
const MOCK_PROJECTS: Project[] = [
  {
    ID: 1,
    nombre: "PROY 1",
    fecha_inicio: "2026-09-04",
    fecha_finalizacion: "2026-09-06",
    cliente: "Qroma",
    estado: "En ejecución",
    Id_servicio: "SRV-001",
    Id_informe: "INF-001",
    trabajadores_count: 5,
    incidencias_count: 2,
  },
  {
    ID: 2,
    nombre: "PROY 2",
    fecha_inicio: "2026-09-04",
    fecha_finalizacion: "2026-09-07",
    cliente: "Famesa",
    estado: "Pendiente",
    Id_servicio: "SRV-002",
    Id_informe: undefined,
    trabajadores_count: 3,
    incidencias_count: 0,
  },
  {
    ID: 3,
    nombre: "PROY 3",
    fecha_inicio: "2026-08-15",
    fecha_finalizacion: "2026-09-01",
    cliente: "Backus",
    estado: "Completado",
    Id_servicio: "SRV-003",
    Id_informe: "INF-003",
    trabajadores_count: 8,
    incidencias_count: 1,
  },
  {
    ID: 4,
    nombre: "PROY 4",
    fecha_inicio: "2026-07-01",
    fecha_finalizacion: "2026-08-30",
    cliente: "ENGIE",
    estado: "En proceso legal",
    Id_servicio: "SRV-004",
    Id_informe: "INF-004",
    trabajadores_count: 6,
    incidencias_count: 4,
  },
];

export async function getAllProjects(
  params: GetProjectsQP
): Promise<GetProjectsResponse> {
  // Simula un delay de red
  await new Promise((r) => setTimeout(r, 400));

  let filtered = [...MOCK_PROJECTS];

  if (params.project_name) {
    filtered = filtered.filter((p) =>
      p.nombre.toLowerCase().includes(params.project_name!.toLowerCase())
    );
  }

  if (params.status) {
    filtered = filtered.filter((p) => p.estado === params.status);
  }

  if (params.start_date) {
    filtered = filtered.filter(
      (p) => new Date(p.fecha_inicio) >= new Date(params.start_date!)
    );
  }

  if (params.end_date) {
    filtered = filtered.filter(
      (p) => new Date(p.fecha_finalizacion) <= new Date(params.end_date!)
    );
  }

  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return {
    data,
    pagination: { total, page, limit, totalPages },
  };
}
