import axiosInstance from "@/shared/api/axios.config";
import type {
  InventarioRequerido,
  CreateInventarioObjetoRequeridoDTO,
  CreateInventarioCamionRequeridoDTO,
  UpdateInventarioRequeridoDTO,
} from "../interfaces/service";

// ─────────────────────────────────────────────────────────────────────────────
// Normalización de respuesta
// ─────────────────────────────────────────────────────────────────────────────

type RawItem = Record<string, unknown>;

const toInventarioRequerido = (raw: RawItem, servicioId: number): InventarioRequerido => {
  // Determinar tipo por presencia de Placa
  const hasPlaca = !!(raw.Placa ?? raw.placa);
  const tipo: "objeto" | "camion" = hasPlaca ? "camion" : "objeto";

  // El `id` debe ser el ID del REGISTRO en la tabla SERVICIO_INVENTARIO_REQUERIDO,
  // NO el Id_Objeto del catálogo. El backend puede devolverlo como `id`, `ID`, o
  // `id_inventario_requerido`. Solo como último recurso usamos Id_Objeto (y lo
  // guardamos aparte en Id_Objeto para no mezclar los campos).
  const recordId = (raw.id ?? raw.ID ?? raw.id_inventario_requerido ?? raw.id_requerido ?? 0) as number;

  return {
    id: recordId,
    ID_Servicio: (raw.ID_Servicio ?? servicioId) as number,
    tipo,
    // Objeto
    Id_Objeto: (raw.Id_Objeto ?? raw.ID_Objeto ?? raw.idObjeto) as number | undefined,
    nombre_objeto: (raw.nombre_objeto ?? raw.Objeto_Nombre ?? "") as string,
    cantidad: Number(raw.cantidad_objeto ?? raw.cantidad ?? 0),
    metodo_traslado: (raw.metodo_traslado ?? "") as string,
    // Para objetos: estado viene del inventario; para camiones: del campo propio
    estado: (raw.estado ?? "") as string,
    razon: (raw.razon ?? "") as string,
    // Camión
    Placa: (raw.Placa ?? raw.placa ?? "") as string,
    nombre_camion: (raw.nombre_camion ?? raw.Camion_Nombre ?? "") as string,
    tipo_camion: (raw.tipo_camion ?? "") as string,
    estado_camion: (raw.estado_camion ?? raw.Estado ?? raw.estado ?? "") as string,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// INVENTARIO REQUERIDO DEL SERVICIO
// Endpoint base: /servicios/{id}/inventario-requerido
// ─────────────────────────────────────────────────────────────────────────────

export const getInventarioRequerido = async (
  servicioId: number,
): Promise<InventarioRequerido[]> => {
  const response = await axiosInstance.get(`/servicios/${servicioId}/inventario-requerido`);
  const raw = response.data;
  const arr: RawItem[] = Array.isArray(raw) ? raw : (raw?.data ?? []);
  // DEBUG: muestra en consola los campos reales que devuelve el backend
  if (arr.length > 0) {
    console.log("[InventarioRequerido] Primer item raw:", arr[0]);
    console.log("[InventarioRequerido] Campos disponibles:", Object.keys(arr[0]));
  }
  return arr.map((r) => toInventarioRequerido(r, servicioId));
};

// POST objeto: envía Id_Objeto + cantidad_objeto + metodo_traslado + estado + razon
export const createObjetoRequerido = async (
  servicioId: number,
  dto: CreateInventarioObjetoRequeridoDTO,
): Promise<InventarioRequerido> => {
  const response = await axiosInstance.post(
    `/servicios/${servicioId}/inventario-requerido`,
    dto,
  );
  const raw: RawItem = response.data?.data ?? response.data ?? {};
  return toInventarioRequerido(raw, servicioId);
};

// POST camión: envía solo Placa + tipo_camion + razon
export const createCamionRequerido = async (
  servicioId: number,
  dto: CreateInventarioCamionRequeridoDTO,
): Promise<InventarioRequerido> => {
  const response = await axiosInstance.post(
    `/servicios/${servicioId}/inventario-requerido`,
    dto,
  );
  const raw: RawItem = response.data?.data ?? response.data ?? {};
  return toInventarioRequerido(raw, servicioId);
};

// PUT: solo actualiza razon (objeto) o tipo_camion + razon (camión)
export const updateInventarioRequerido = async (
  servicioId: number,
  idObjeto: number,
  dto: UpdateInventarioRequeridoDTO,
): Promise<void> => {
  await axiosInstance.put(
    `/servicios/${servicioId}/inventario-requerido/${idObjeto}`,
    dto,
  );
};

export const deleteInventarioRequerido = async (
  servicioId: number,
  idObjeto: number,
): Promise<void> => {
  await axiosInstance.delete(`/servicios/${servicioId}/inventario-requerido/${idObjeto}`);
};

// ─────────────────────────────────────────────────────────────────────────────
// CATÁLOGOS EXTERNOS
// ─────────────────────────────────────────────────────────────────────────────

export interface CatalogoInventarioItem {
  Id_Objeto: number;
  nombre_objeto: string;
  cantidad: number;
  lugar_almacenaje: string; // usado como metodo_traslado
  estado: string;
}

export interface CatalogoCamion {
  Placa: string;
  nombre: string;
  Estado: string;
}

export const getCatalogoInventario = async (): Promise<CatalogoInventarioItem[]> => {
  const response = await axiosInstance.get("/inventario", { params: { page: 1, limit: 100 } });
  const raw = response.data;
  const arr: RawItem[] = Array.isArray(raw) ? raw : (raw?.data ?? []);
  return arr.map((r) => ({
    Id_Objeto: (r.Id_Objeto ?? r.id ?? 0) as number,
    nombre_objeto: (r.nombre_objeto ?? r.nombre ?? "") as string,
    cantidad: Number(r.cantidad ?? 0),
    lugar_almacenaje: (r.lugar_almacenaje ?? "") as string,
    estado: (r.estado ?? "") as string,
  }));
};

export const getCatalogoCamiones = async (): Promise<CatalogoCamion[]> => {
  const response = await axiosInstance.get("/camiones", { params: { page: 1, limit: 100 } });
  const raw = response.data;
  // El trucks.base.api.ts usa unwrapPagination: puede venir como { data: { data: [...] } } o { data: [...] }
  let arr: RawItem[] = [];
  if (Array.isArray(raw)) {
    arr = raw;
  } else if (Array.isArray(raw?.data)) {
    arr = raw.data;
  } else if (Array.isArray(raw?.data?.data)) {
    arr = raw.data.data;
  } else if (raw?.pagination?.data) {
    arr = raw.pagination.data;
  }
  return arr.map((r) => ({
    Placa: (r.Placa ?? r.placa ?? "") as string,
    nombre: (r.nombre ?? r.Camion_Nombre ?? "") as string,
    Estado: (r.Estado ?? r.estado ?? "") as string,
  }));
};
