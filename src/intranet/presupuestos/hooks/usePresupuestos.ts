import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { presupuestosApi } from "../api/presupuestos.api";
import type { AddPresupuestoItemPayload, TipoPresupuesto } from "../interfaces/presupuesto";
import { toast } from "sonner";

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
    select: (d) => d.data,
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
