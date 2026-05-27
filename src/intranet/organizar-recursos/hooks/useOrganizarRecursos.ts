import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { organizarRecursosApi } from "../api/organizarRecursos.api";
import type { InventarioRequestPayload, Incidencia } from "../interfaces/proyecto";
import { toast } from "sonner";

export const useInventarioDelProyecto = (projectId: number) => {
  return useQuery({
    queryKey: ["inventario-del-proyecto", projectId],
    queryFn: () => organizarRecursosApi.getInventarioDelProyecto(projectId),
    select: (data) => data.data,
    enabled: !!projectId,
  });
};

export const useProyectosList = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["proyectos", page, limit],
    queryFn: () => organizarRecursosApi.listProyectos(page, limit),
    select: (data) => data.data,
  });
};

export const useProyecto = (id: number) => {
  return useQuery({
    queryKey: ["proyecto", id],
    queryFn: () => organizarRecursosApi.getProyecto(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const useProyectoTodo = (id: number) => {
  return useQuery({
    queryKey: ["proyecto-todo", id],
    queryFn: () => organizarRecursosApi.getProyectoTodo(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const useInventarioList = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["inventario", page, limit],
    queryFn: () => organizarRecursosApi.listInventario(page, limit),
    select: (data) => data.data,
  });
};

export const useCamionesByProyecto = (projectId: number) => {
  return useQuery({
    queryKey: ["camiones-proyecto", projectId],
    queryFn: () => organizarRecursosApi.getCamionesByProyecto(projectId),
    select: (data) => data.data,
    enabled: !!projectId,
  });
};

// API devuelve array plano de Conductor[]
export const useConductoresDisponibles = (fecha: string) => {
  return useQuery({
    queryKey: ["conductores-disponibles", fecha],
    queryFn: () => organizarRecursosApi.getConductoresDisponibles(fecha),
    select: (data) => data.data,
    enabled: !!fecha,
  });
};

export const useIncidenciasByProyecto = (projectId: number) => {
  return useQuery({
    queryKey: ["incidencias-proyecto", projectId],
    queryFn: () => organizarRecursosApi.getIncidenciasByProyecto(projectId),
    select: (data) => data.data,
    enabled: !!projectId,
  });
};

export const useAllIncidencias = () => {
  return useQuery({
    queryKey: ["all-incidencias"],
    queryFn: () => organizarRecursosApi.getAllIncidencias(),
    select: (data): Incidencia[] => {
      const raw = data.data as unknown;
      if (Array.isArray(raw)) return raw as Incidencia[];
      if (raw && typeof raw === "object" && Array.isArray((raw as { data?: unknown }).data))
        return (raw as { data: Incidencia[] }).data;
      return [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Mutations
export const useAddInventarioToProyecto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      payload,
    }: {
      projectId: number;
      payload: InventarioRequestPayload;
    }) => organizarRecursosApi.addInventarioToProyecto(projectId, payload),
    onSettled: (_, __, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["proyecto-todo", projectId] });
      queryClient.invalidateQueries({ queryKey: ["inventario-del-proyecto", projectId] });
    },
    onSuccess: () => {
      toast.success("Inventario agregado exitosamente");
    },
  });
};

export const useRemoveInventarioFromProyecto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      inventoryId,
    }: {
      projectId: number;
      inventoryId: number;
    }) => organizarRecursosApi.removeInventarioFromProyecto(projectId, inventoryId),
    onSettled: (_, __, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["proyecto-todo", projectId] });
      queryClient.invalidateQueries({ queryKey: ["inventario-del-proyecto", projectId] });
    },
    onSuccess: () => {
      toast.success("Inventario eliminado exitosamente");
    },
  });
};

export const useAddCamionToProyecto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      payload,
    }: {
      projectId: number;
      payload: {
        Placa: string;
        personal_manejando: number;
        fecha_hora_salida: string;
        fecha_hora_entrada: string;
        razon: string;
        estado: string;
      };
    }) => organizarRecursosApi.addCamionToProyecto(projectId, payload),
    onSettled: (_, __, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["proyecto-todo", projectId] });
      queryClient.invalidateQueries({ queryKey: ["camiones-proyecto", projectId] });
    },
    onSuccess: () => {
      toast.success("Camión agregado exitosamente");
    },
  });
};

export const useRemoveCamionFromProyecto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      camionId,
    }: {
      projectId: number;
      camionId: number;
    }) => organizarRecursosApi.removeCamionFromProyecto(projectId, camionId),
    onSettled: (_, __, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["proyecto-todo", projectId] });
      queryClient.invalidateQueries({ queryKey: ["camiones-proyecto", projectId] });
    },
    onSuccess: () => {
      toast.success("Camión eliminado exitosamente");
    },
  });
};

export const useUpdateInventarioFromProyecto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      inventoryId,
      idObjeto,
      payload,
    }: {
      projectId: number;
      inventoryId: number;
      idObjeto: number;
      payload: Omit<InventarioRequestPayload, "Id_Objeto">;
    }) => organizarRecursosApi.updateInventarioFromProyecto(projectId, inventoryId, idObjeto, payload),
    onSettled: (_, __, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["inventario-del-proyecto", projectId] });
    },
    onSuccess: () => toast.success("Objeto actualizado"),
  });
};

export const useUpdateCamionFromProyecto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      camionId,
      payload,
    }: {
      projectId: number;
      camionId: number;
      payload: import("../interfaces/proyecto").CamionRequest;
    }) => organizarRecursosApi.updateCamionFromProyecto(projectId, camionId, payload),
    onSettled: (_, __, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["camiones-proyecto", projectId] });
      queryClient.invalidateQueries({ queryKey: ["proyecto-todo", projectId] });
    },
    onSuccess: () => toast.success("Camión actualizado"),
    onError: () =>
      toast.warning("No se pudo confirmar la actualización. Verifique si los cambios se guardaron."),
  });
};
