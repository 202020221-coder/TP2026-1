import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { organizarRecursosApi } from "../api/organizarRecursos.api";
import type { InventarioRequestPayload } from "../interfaces/proyecto";
import { toast } from "sonner";

export const useInventarioDelProyecto = (projectId: number) => {
  return useQuery({
    queryKey: ["inventario-del-proyecto", projectId],
    queryFn: () => organizarRecursosApi.getInventarioDelProyecto(projectId),
    select: (data) => data.data, // API devuelve array directo, no { data: [...] }
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

export const useConductoresDisponibles = (fecha: string) => {
  return useQuery({
    queryKey: ["conductores-disponibles", fecha],
    queryFn: () => organizarRecursosApi.getConductoresDisponibles(fecha),
    select: (data) => data.data.data,
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
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["proyecto-todo", projectId] });
      queryClient.invalidateQueries({ queryKey: ["inventario-del-proyecto", projectId] });
      toast.success("Inventario agregado exitosamente");
    },
    onError: () => {
      toast.error("Error al agregar inventario");
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
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["proyecto-todo", projectId] });
      queryClient.invalidateQueries({ queryKey: ["inventario-del-proyecto", projectId] });
      toast.success("Inventario eliminado exitosamente");
    },
    onError: () => {
      toast.error("Error al eliminar inventario");
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
        fecha_salida: string;
        fecha_entrada: string;
        id_conductor: number;
      };
    }) => organizarRecursosApi.addCamionToProyecto(projectId, payload),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: ["proyecto-todo", projectId],
      });
      toast.success("Camión agregado exitosamente");
    },
    onError: () => {
      toast.error("Error al agregar camión");
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
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: ["proyecto-todo", projectId],
      });
      toast.success("Camión eliminado exitosamente");
    },
    onError: () => {
      toast.error("Error al eliminar camión");
    },
  });
};
