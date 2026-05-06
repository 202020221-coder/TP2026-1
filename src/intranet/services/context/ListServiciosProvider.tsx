import { useState, useCallback, type FC, type ReactNode } from "react";
import { type GetServiciosQP } from "../interfaces/query-params.dto";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getServicios,
  createServicio,
  updateServicio,
} from "../api/service.api";
import { ListServiciosContext } from "./ListServiciosContext";
import type { CreateServicioDTO, UpdateServicioDTO, Servicio } from "../interfaces/service";
import type { GetServiciosResponse } from "../interfaces/responses.dto";
import { toast } from "sonner";

// Clave base estable — no depende del objeto queryParams completo
const SERVICIOS_BASE_KEY = "servicios";

export const ListServiciosProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [queryParams, setQueryParams] = useState<GetServiciosQP>({ page: 1, limit: 10 });

  const queryKey = [SERVICIOS_BASE_KEY, queryParams] as const;

  const result = useQuery({
    queryKey,
    queryFn: () => getServicios(queryParams),
    staleTime: 0,
    // Mantiene datos anteriores visibles mientras refetchea (evita parpadeo)
    placeholderData: (prev) => prev,
  });

  const query = (params: GetServiciosQP) => setQueryParams(params);

  // Invalida y refetchea sin mostrar skeleton
  const softRefetch = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: [SERVICIOS_BASE_KEY] });
  }, [queryClient]);

  // ── CREATE ────────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (dto: CreateServicioDTO) => createServicio(dto),
    onSuccess: async (newServicio) => {
      // Actualización optimista inmediata en caché
      queryClient.setQueryData<GetServiciosResponse>(queryKey, (old) => {
        if (!old) return old;
        return { ...old, data: [...old.data, newServicio] };
      });
      toast.success("Servicio creado correctamente");
      // Sincroniza con servidor en background (sin mostrar loading)
      await softRefetch();
    },
    onError: () => toast.error("Error al crear el servicio"),
  });

  // ── UPDATE ────────────────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateServicioDTO }) =>
      updateServicio(id, dto),
    onSuccess: async (updatedServicio) => {
      // Actualización optimista inmediata en caché
      queryClient.setQueryData<GetServiciosResponse>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((s) =>
            s.id === updatedServicio.id ? { ...s, ...updatedServicio } : s
          ),
        };
      });
      toast.success("Servicio actualizado correctamente");
      await softRefetch();
    },
    onError: () => toast.error("Error al actualizar el servicio"),
  });

  // ── TOGGLE ACTIVO LOCAL (sin backend) ────────────────────────────────────
  // Stub requerido por el contexto — el toggle real ocurre en toggleActivoLocal
  const toggleActivoMutation = useMutation({
    mutationFn: async (_id: number) => { throw new Error("PENDING_BACKEND"); },
    onError: () => {},
  });

  const toggleActivoLocal = useCallback(
    (id: number) => {
      queryClient.setQueryData<GetServiciosResponse>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((s: Servicio) =>
            s.id === id ? { ...s, activo: !s.activo } : s
          ),
        };
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [queryClient, JSON.stringify(queryParams)]
  );

  return (
    <ListServiciosContext.Provider
      value={{
        result,
        query,
        queryParams,
        createMutation,
        updateMutation,
        toggleActivoMutation,
        toggleActivoLocal,
      }}
    >
      {children}
    </ListServiciosContext.Provider>
  );
};
