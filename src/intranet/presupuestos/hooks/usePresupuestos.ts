import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { presupuestosApi } from "../api/presupuestos.api";
import type { AddPresupuestoItemPayload, GastoRealPayload, TipoPresupuesto } from "../interfaces/presupuesto";
import { toast } from "sonner";

export const useIncidencias = () =>
  useQuery({
    queryKey: ["incidencias-presupuesto"],
    queryFn: () => presupuestosApi.getIncidencias(),
    select: (d) => {
      const raw = d.data as unknown;
      if (Array.isArray(raw)) return raw;
      if (raw && typeof raw === "object" && Array.isArray((raw as { data?: unknown }).data))
        return (raw as { data: unknown[] }).data;
      return [];
    },
    staleTime: 5 * 60 * 1000,
  });

export const useUpdateGastoReal = (cotizacionId: number, tipo: TipoPresupuesto) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, payload, file }: { itemId: number; payload: GastoRealPayload; file?: File }) =>
      presupuestosApi.updateGastoReal(itemId, payload, file),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: itemsKey(cotizacionId, tipo) });
    },
    onSuccess: () => toast.success("Gasto real guardado"),
    onError: () => toast.error("Error al guardar"),
  });
};

export const useCotizacionesList = (page = 1, limit = 10) =>
  useQuery({
    queryKey: ["cotizaciones-presupuesto", page, limit],
    queryFn: () => presupuestosApi.listCotizaciones(page, limit),
    select: (d) => d.data,
  });

const itemsKey = (cotizacionId: number, tipo: TipoPresupuesto) =>
  ["presupuesto-items", cotizacionId, tipo] as const;

export const usePresupuestoItems = (cotizacionId: number, tipo: TipoPresupuesto) =>
  useQuery({
    queryKey: itemsKey(cotizacionId, tipo),
    queryFn: () => presupuestosApi.getItems(cotizacionId, tipo),
    select: (d): import("../interfaces/presupuesto").PresupuestoItem[] => {
      const raw = d.data as unknown;
      if (Array.isArray(raw)) return raw as import("../interfaces/presupuesto").PresupuestoItem[];
      if (raw && typeof raw === "object" && Array.isArray((raw as { data?: unknown }).data))
        return (raw as { data: import("../interfaces/presupuesto").PresupuestoItem[] }).data;
      return [];
    },
    enabled: !!cotizacionId,
  });

export const useAddPresupuestoItem = (tipo: TipoPresupuesto) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      cotizacionId,
      payload,
    }: {
      cotizacionId: number;
      payload: AddPresupuestoItemPayload;
    }) => presupuestosApi.addItem(cotizacionId, payload),
    onSettled: (_, __, { cotizacionId }) => {
      qc.invalidateQueries({ queryKey: itemsKey(cotizacionId, tipo) });
    },
    onSuccess: () => toast.success("Elemento agregado"),
  });
};

export const useDeletePresupuestoItem = (cotizacionId: number, tipo: TipoPresupuesto) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId: number) => presupuestosApi.deleteItem(itemId),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: itemsKey(cotizacionId, tipo) });
    },
    onSuccess: () => toast.success("Elemento eliminado"),
  });
};

export const useUpdatePresupuestoItem = (cotizacionId: number, tipo: TipoPresupuesto) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, payload }: { itemId: number; payload: Partial<AddPresupuestoItemPayload> }) =>
      presupuestosApi.updateItem(itemId, payload),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: itemsKey(cotizacionId, tipo) });
    },
    onSuccess: () => toast.success("Elemento actualizado"),
  });
};

export const useInventarioPorServicioPresupuesto = (
  cotizacionId: number,
  enabled: boolean = true
) =>
  useQuery({
    queryKey: ["inventario-por-servicio-cotizacion", cotizacionId],
    queryFn: () => presupuestosApi.getInventarioPorServicio(cotizacionId),
    select: (d) => d.data,
    enabled: !!cotizacionId && enabled,
  });

export const useExportarFaltantesInventario = (cotizacionId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => presupuestosApi.exportarFaltantesInventario(cotizacionId),
    onSettled: () => {
      qc.invalidateQueries({
        queryKey: ["inventario-por-servicio-cotizacion", cotizacionId],
      });
      qc.invalidateQueries({
        queryKey: itemsKey(cotizacionId, "Material Directo"),
      });
    },
    onSuccess: () => toast.success("Faltantes exportados al presupuesto exitosamente"),
    onError: () => toast.error("No se pudieron exportar los faltantes"),
  });
};
