import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { presupuestosApi } from "../api/presupuestos.api";
import { toast } from "sonner";

export const usePresupuestosList = (page = 1, limit = 10) =>
  useQuery({
    queryKey: ["presupuestos", page, limit],
    queryFn: () => presupuestosApi.list(page, limit),
    select: (d) => d.data,
  });

export const useMaterialDirecto = (presupuestoId: number) =>
  useQuery({
    queryKey: ["presupuesto-material-directo", presupuestoId],
    queryFn: () => presupuestosApi.getMaterialDirecto(presupuestoId),
    select: (d) => d.data,
    enabled: !!presupuestoId,
  });

export const useManoObra = (presupuestoId: number) =>
  useQuery({
    queryKey: ["presupuesto-mano-obra", presupuestoId],
    queryFn: () => presupuestosApi.getManoObra(presupuestoId),
    select: (d) => d.data,
    enabled: !!presupuestoId,
  });

export const useServiciosPresupuesto = (presupuestoId: number) =>
  useQuery({
    queryKey: ["presupuesto-servicios", presupuestoId],
    queryFn: () => presupuestosApi.getServicios(presupuestoId),
    select: (d) => d.data,
    enabled: !!presupuestoId,
  });

export const useGastosAdmin = (presupuestoId: number) =>
  useQuery({
    queryKey: ["presupuesto-gastos-admin", presupuestoId],
    queryFn: () => presupuestosApi.getGastosAdmin(presupuestoId),
    select: (d) => d.data,
    enabled: !!presupuestoId,
  });

// --- Mutations: Material Directo ---
export const useAddMaterialDirecto = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      presupuestoId,
      payload,
    }: {
      presupuestoId: number;
      payload: { nombre: string; costo: number };
    }) => presupuestosApi.addMaterialDirecto(presupuestoId, payload),
    onSettled: (_, __, { presupuestoId }) => {
      qc.invalidateQueries({
        queryKey: ["presupuesto-material-directo", presupuestoId],
      });
    },
    onSuccess: () => toast.success("Material directo agregado"),
  });
};

export const useDeleteMaterialDirecto = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      presupuestoId,
      sid,
    }: {
      presupuestoId: number;
      sid: number;
    }) => presupuestosApi.deleteMaterialDirecto(presupuestoId, sid),
    onSettled: (_, __, { presupuestoId }) => {
      qc.invalidateQueries({
        queryKey: ["presupuesto-material-directo", presupuestoId],
      });
    },
    onSuccess: () => toast.success("Material directo eliminado"),
  });
};

// --- Mutations: Mano de Obra ---
export const useAddManoObra = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      presupuestoId,
      payload,
    }: {
      presupuestoId: number;
      payload: {
        profesion_ejercida: string;
        costo_x_hora: number;
        costo_general: number;
      };
    }) => presupuestosApi.addManoObra(presupuestoId, payload),
    onSettled: (_, __, { presupuestoId }) => {
      qc.invalidateQueries({
        queryKey: ["presupuesto-mano-obra", presupuestoId],
      });
    },
    onSuccess: () => toast.success("Mano de obra agregada"),
  });
};

export const useDeleteManoObra = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      presupuestoId,
      sid,
    }: {
      presupuestoId: number;
      sid: number;
    }) => presupuestosApi.deleteManoObra(presupuestoId, sid),
    onSettled: (_, __, { presupuestoId }) => {
      qc.invalidateQueries({
        queryKey: ["presupuesto-mano-obra", presupuestoId],
      });
    },
    onSuccess: () => toast.success("Mano de obra eliminada"),
  });
};

// --- Mutations: Servicios ---
export const useAddServicioPresupuesto = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      presupuestoId,
      payload,
    }: {
      presupuestoId: number;
      payload: { nombre_servicio: string; costo: number };
    }) => presupuestosApi.addServicio(presupuestoId, payload),
    onSettled: (_, __, { presupuestoId }) => {
      qc.invalidateQueries({
        queryKey: ["presupuesto-servicios", presupuestoId],
      });
    },
    onSuccess: () => toast.success("Servicio agregado"),
  });
};

export const useDeleteServicioPresupuesto = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      presupuestoId,
      sid,
    }: {
      presupuestoId: number;
      sid: number;
    }) => presupuestosApi.deleteServicio(presupuestoId, sid),
    onSettled: (_, __, { presupuestoId }) => {
      qc.invalidateQueries({
        queryKey: ["presupuesto-servicios", presupuestoId],
      });
    },
    onSuccess: () => toast.success("Servicio eliminado"),
  });
};

// --- Mutations: Gastos Admin ---
export const useAddGastoAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      presupuestoId,
      payload,
    }: {
      presupuestoId: number;
      payload: { nombre_gasto: string; costo: number };
    }) => presupuestosApi.addGastoAdmin(presupuestoId, payload),
    onSettled: (_, __, { presupuestoId }) => {
      qc.invalidateQueries({
        queryKey: ["presupuesto-gastos-admin", presupuestoId],
      });
    },
    onSuccess: () => toast.success("Gasto administrativo agregado"),
  });
};

export const useDeleteGastoAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      presupuestoId,
      sid,
    }: {
      presupuestoId: number;
      sid: number;
    }) => presupuestosApi.deleteGastoAdmin(presupuestoId, sid),
    onSettled: (_, __, { presupuestoId }) => {
      qc.invalidateQueries({
        queryKey: ["presupuesto-gastos-admin", presupuestoId],
      });
    },
    onSuccess: () => toast.success("Gasto administrativo eliminado"),
  });
};
