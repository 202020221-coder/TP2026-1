import axiosInstance from "@/shared/api/axios.config";
import type {
  InventarioRequerido,
  CreateInventarioObjetoRequeridoDTO,
  UpdateInventarioRequeridoDTO,
} from "../interfaces/service";

// ─────────────────────────────────────────────────────────────────────────────
// Normalización
// El backend usa clave compuesta (ID_Servicio + Id_Objeto) — NO hay id propio.
// El campo {idObjeto} en la URL es siempre Id_Objeto.
// ─────────────────────────────────────────────────────────────────────────────

type RawItem = Record<string, unknown>;

const toInventarioRequerido = (raw: RawItem, servicioId: number): InventarioRequerido => ({
  // ✅ id = Id_Objeto (clave compuesta con ID_Servicio — único por registro)
  id: (raw.Id_Objeto ?? raw.id_objeto ?? 0) as number,
  Id_Objeto: (raw.Id_Objeto ?? raw.id_objeto ?? 0) as number,
  ID_Servicio: (raw.ID_Servicio ?? servicioId) as number,
  nombre_objeto: (raw.nombre_objeto ?? "") as string,
  cantidad: Number(raw.cantidad ?? 0),
  estancia: (raw.estancia ?? "") as string,
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /servicios/{id}/inventario-requerido
// ─────────────────────────────────────────────────────────────────────────────
export const getInventarioRequerido = async (
  servicioId: number,
): Promise<InventarioRequerido[]> => {
  const response = await axiosInstance.get(`/servicios/${servicioId}/inventario-requerido`);
  const raw = response.data;
  const arr: RawItem[] = Array.isArray(raw) ? raw : (raw?.data ?? []);
  return arr.map((r) => toInventarioRequerido(r, servicioId));
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /servicios/{id}/inventario-requerido
// Body: { Id_Objeto, cantidad, estancia }
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// PUT /servicios/{id}/inventario-requerido/{idObjeto}
// idObjeto = Id_Objeto   Body: { cantidad, estancia }
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /servicios/{id}/inventario-requerido/{idObjeto}
// idObjeto = Id_Objeto
// ─────────────────────────────────────────────────────────────────────────────
export const deleteInventarioRequerido = async (
  servicioId: number,
  idObjeto: number,
): Promise<void> => {
  await axiosInstance.delete(`/servicios/${servicioId}/inventario-requerido/${idObjeto}`);
};

// ─────────────────────────────────────────────────────────────────────────────
// Catálogos externos
// ─────────────────────────────────────────────────────────────────────────────

export interface CatalogoInventarioItem {
  Id_Objeto: number;
  nombre_objeto: string;
  cantidad: number;
  lugar_almacenaje: string;
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
  let arr: RawItem[] = [];
  if (Array.isArray(raw)) arr = raw;
  else if (Array.isArray(raw?.data)) arr = raw.data;
  else if (Array.isArray(raw?.data?.data)) arr = raw.data.data;
  else if (raw?.pagination?.data) arr = raw.pagination.data;
  return arr.map((r) => ({
    Placa: (r.Placa ?? r.placa ?? "") as string,
    nombre: (r.nombre ?? r.Camion_Nombre ?? "") as string,
    Estado: (r.Estado ?? r.estado ?? "") as string,
  }));
};
