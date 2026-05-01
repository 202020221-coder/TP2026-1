import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { organizarRecursosApi } from "../api/organizarRecursos.api";
import type { InventarioRequestPayload } from "../interfaces/proyecto";
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

// API devuelve array plano de Conductor[] (sin wrapper { data: [...] })
export const useConductoresDisponibles = (fecha: string) => {
  return useQuery({
    queryKey: ["conductores-disponibles", fecha],
    queryFn: () => organizarRecursosApi.getConductoresDisponibles(fecha),
    select: (data) => data.data,
    enabled: !!fecha,
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
    // onSettled refresca la tabla aunque el backend devuelva 500 (bug conocido del backend)
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
      };
    }) => organizarRecursosApi.addCamionToProyecto(projectId, payload),
    onSettled: (_, __, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: ["proyecto-todo", projectId],
      });
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
      queryClient.invalidateQueries({
        queryKey: ["proyecto-todo", projectId],
      });
    },
    onSuccess: () => {
      toast.success("Camión eliminado exitosamente");
    },
  });
};
