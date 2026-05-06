import axiosInstance from "@/shared/api/axios.config";
import type { GetServiciosQP } from "../interfaces/query-params.dto";
import type { GetServiciosResponse } from "../interfaces/responses.dto";
import type {
  Servicio,
  CreateServicioDTO,
  UpdateServicioDTO,
  PersonalRequerido,
  CreatePersonalRequeridoDTO,
  UpdatePersonalRequeridoDTO,
} from "../interfaces/service";

// ─────────────────────────────────────────────────────────────────────────────
// Tipos del backend (snake_case con ID_Servicio como PK)
// ─────────────────────────────────────────────────────────────────────────────
interface ServicioRaw {
  ID_Servicio?: number;
  id?: number; // por si el backend normaliza a lowercase
  nombre: string;
  descripcion: string;
  precio_regular: number;
  condicional_precio: string;
  observaciones: string;
  activo?: boolean;
}

// Extrae el objeto ServicioRaw de cualquier forma que devuelva el backend:
// - directamente: { ID_Servicio, nombre, ... }
// - envuelto en data: { data: { ID_Servicio, nombre, ... } }
// - envuelto en data array: { data: [{ ID_Servicio, nombre, ... }] }  (raro pero defensivo)
const extractRaw = (response: unknown): ServicioRaw => {
  if (!response || typeof response !== "object") {
    throw new Error("Respuesta vacía del servidor");
  }
  const r = response as Record<string, unknown>;

  // Caso: { data: { ... } }
  if (r.data && typeof r.data === "object" && !Array.isArray(r.data)) {
    return r.data as ServicioRaw;
  }
  // Caso: { data: [{ ... }] } — tomar el primero
  if (r.data && Array.isArray(r.data) && r.data.length > 0) {
    return r.data[0] as ServicioRaw;
  }
  // Caso: el objeto directo tiene ID_Servicio o id
  if (r.ID_Servicio !== undefined || r.id !== undefined) {
    return r as unknown as ServicioRaw;
  }
  // Último recurso: devolver lo que sea y dejar que toServicio maneje
  return r as unknown as ServicioRaw;
};

const toServicio = (raw: ServicioRaw): Servicio => ({
  id: raw.ID_Servicio ?? raw.id ?? 0,
  nombre: raw.nombre ?? "",
  descripcion: raw.descripcion ?? "",
  precio_regular: Number(raw.precio_regular ?? 0),
  condicional_precio: raw.condicional_precio ?? "",
  observaciones: raw.observaciones ?? "",
  activo: raw.activo ?? true,
});

// ─────────────────────────────────────────────────────────────────────────────
// SERVICIOS
// ─────────────────────────────────────────────────────────────────────────────
export const getServicios = async (
  params: GetServiciosQP,
): Promise<GetServiciosResponse> => {
  const { page, limit = 10, search } = params;
  const response = await axiosInstance.get<{
    data: ServicioRaw[];
    pagination: GetServiciosResponse["pagination"];
  }>("/servicios", {
    params: { page, limit, ...(search ? { search } : {}) },
  });

  return {
    data: response.data.data.map(toServicio),
    pagination: response.data.pagination,
  };
};

export const createServicio = async (dto: CreateServicioDTO): Promise<Servicio> => {
  const response = await axiosInstance.post("/servicios", dto);
  const raw = extractRaw(response.data);
  return toServicio(raw);
};

export const updateServicio = async (
  id: number,
  dto: UpdateServicioDTO,
): Promise<Servicio> => {
  const response = await axiosInstance.put(`/servicios/${id}`, dto);
  const raw = extractRaw(response.data);
  // Si el backend no devuelve el objeto actualizado, reconstruirlo con los datos enviados
  if (!raw.ID_Servicio && !raw.id) {
    return { id, ...dto, activo: true } as Servicio;
  }
  return toServicio(raw);
};

export const toggleServicioActivo = async (_id: number): Promise<Servicio> => {
  throw new Error("PENDING_BACKEND");
};

// ─────────────────────────────────────────────────────────────────────────────
// PERSONAL REQUERIDO
// ─────────────────────────────────────────────────────────────────────────────

interface PersonalRaw {
  id?: number;
  ID_Personal?: number;
  ID_Servicio?: number;
  profesion?: string;
  cantidad?: number;
  disponibilidad?: string;
  requerimiento_legal?: string;
}

const toPersonal = (raw: PersonalRaw): PersonalRequerido => ({
  id: raw.id ?? raw.ID_Personal ?? 0,
  ID_Servicio: raw.ID_Servicio ?? 0,
  profesion: raw.profesion ?? "",
  cantidad: raw.cantidad ?? 1,
  disponibilidad: raw.disponibilidad ?? "",
  requerimiento_legal: raw.requerimiento_legal ?? "",
});

export const getPersonalByServicio = async (
  servicioId: number,
): Promise<PersonalRequerido[]> => {
  const response = await axiosInstance.get(`/servicios/${servicioId}/personal`);
  const raw = response.data;
  // El backend puede devolver array directo o { data: [...] }
  const arr: PersonalRaw[] = Array.isArray(raw) ? raw : (raw?.data ?? []);
  return arr.map(toPersonal);
};

export const createPersonal = async (
  servicioId: number,
  dto: CreatePersonalRequeridoDTO,
): Promise<PersonalRequerido> => {
  const response = await axiosInstance.post(
    `/servicios/${servicioId}/personal`,
    dto,
  );
  const raw = extractRaw(response.data) as PersonalRaw;
  // Si el backend no devuelve el objeto creado, construirlo con un id temporal
  if (!raw.id && !raw.ID_Personal) {
    return {
      id: Date.now(), // id temporal hasta el próximo refetch
      ID_Servicio: servicioId,
      ...dto,
    };
  }
  return toPersonal(raw);
};

export const updatePersonal = async (
  id: number,
  dto: UpdatePersonalRequeridoDTO,
): Promise<PersonalRequerido> => {
  const response = await axiosInstance.put(`/personal/${id}`, dto);
  const raw = extractRaw(response.data) as PersonalRaw;
  if (!raw.id && !raw.ID_Personal) {
    return { id, ID_Servicio: 0, ...dto } as PersonalRequerido;
  }
  return toPersonal(raw);
};

export const deletePersonal = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/personal/${id}`);
};
