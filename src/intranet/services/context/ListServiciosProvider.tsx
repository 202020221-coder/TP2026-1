import {
  useState,
  useCallback,
  useEffect,
  useMemo,
  type FC,
  type ReactNode,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getServicios,
  createServicio,
  updateServicio,
  toggleServicioActivo,
} from "../api/service.api";
import { ListServiciosContext } from "./ListServiciosContext";
import type { CreateServicioDTO, UpdateServicioDTO, Servicio } from "../interfaces/service";
import type { GetServiciosResponse } from "../interfaces/responses.dto";
import { useServicioFilters } from "../hooks/useServicioFilters";
import { toast } from "sonner";

// Clave base estable — no depende del objeto queryParams completo
const SERVICIOS_BASE_KEY = "servicios";
// Se traen todos los servicios y la paginación se resuelve en el cliente,
// para que el "Tamaño de Página" cuente solo los servicios activos visibles.
const FETCH_ALL_LIMIT = 1000;

export const ListServiciosProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  const [search, setSearchState] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(10);

  const queryKey = [SERVICIOS_BASE_KEY, { search }] as const;

  const result = useQuery({
    queryKey,
    queryFn: () => getServicios({ page: 1, limit: FETCH_ALL_LIMIT, search }),
    staleTime: 0,
    placeholderData: (prev) => prev,
  });

  const allServicios = useMemo(() => result.data?.data ?? [], [result.data]);

  const serviciosActivos = useMemo(
    () => allServicios.filter((s) => s.activo),
    [allServicios],
  );
  const serviciosDesactivados = useMemo(
    () => allServicios.filter((s) => !s.activo),
    [allServicios],
  );

  // Filtros de columna client-side (precio, tipo, condición) sobre activos
  const {
    filters,
    filteredServicios,
    updateFilter,
    resetFilters,
    activeCount,
    open: filterOpen,
    setOpen: setFilterOpen,
  } = useServicioFilters(serviciosActivos);

  // ── Paginación client-side sobre la lista activa ya filtrada ──────────────
  const totalItems = filteredServicios.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Si la página actual queda fuera de rango (al filtrar/cambiar tamaño), corrige
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const safePage = Math.min(page, totalPages);

  const servicios = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredServicios.slice(start, start + pageSize);
  }, [filteredServicios, safePage, pageSize]);

  const setSearch = useCallback((value: string | undefined) => {
    setSearchState(value);
    setPage(1);
  }, []);

  const setPageSize = useCallback((value: number) => {
    setPageSizeState(value);
    setPage(1);
  }, []);

  // Invalida y refetchea sin mostrar skeleton
  const softRefetch = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: [SERVICIOS_BASE_KEY] });
  }, [queryClient]);

  // ── CREATE ────────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (dto: CreateServicioDTO) => createServicio(dto),
    onSuccess: async (newServicio) => {
      queryClient.setQueryData<GetServiciosResponse>(queryKey, (old) => {
        if (!old) return old;
        return { ...old, data: [...old.data, newServicio] };
      });
      toast.success("Servicio creado correctamente");
      await softRefetch();
    },
    onError: () => toast.error("Error al crear el servicio"),
  });

  // ── UPDATE ────────────────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateServicioDTO }) =>
      updateServicio(id, dto),
    onSuccess: async (updatedServicio) => {
      queryClient.setQueryData<GetServiciosResponse>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((s) =>
            s.id === updatedServicio.id ? { ...s, ...updatedServicio } : s,
          ),
        };
      });
      toast.success("Servicio actualizado correctamente");
      await softRefetch();
    },
    onError: () => toast.error("Error al actualizar el servicio"),
  });

  // ── TOGGLE ACTIVO ─────────────────────────────────────────────────────────
  const toggleActivoMutation = useMutation({
    mutationFn: ({ id, currentActivo }: { id: number; currentActivo: boolean }) =>
      toggleServicioActivo(id, currentActivo),
    onMutate: async ({ id }: { id: number; currentActivo: boolean }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<GetServiciosResponse>(queryKey);
      queryClient.setQueryData<GetServiciosResponse>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((s: Servicio) =>
            s.id === id ? { ...s, activo: !s.activo } : s,
          ),
        };
      });
      return { previous };
    },
    onSuccess: async (updatedServicio, id) => {
      if (updatedServicio?.id) {
        queryClient.setQueryData<GetServiciosResponse>(queryKey, (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((s: Servicio) =>
              s.id === updatedServicio.id ? { ...s, ...updatedServicio } : s,
            ),
          };
        });
      }
      const cached = queryClient.getQueryData<GetServiciosResponse>(queryKey);
      const servicio = cached?.data.find(
        (s: Servicio) => s.id === (updatedServicio?.id ?? id),
      );
      const accion = servicio?.activo ? "activado" : "desactivado";
      toast.success(`Servicio ${accion} correctamente`);
      await softRefetch();
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
      toast.error("Error al cambiar el estado del servicio");
    },
  });

  const toggleActivoLocal = useCallback(
    (id: number, currentActivo: boolean) => {
      toggleActivoMutation.mutate({ id, currentActivo });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [toggleActivoMutation],
  );

  return (
    <ListServiciosContext.Provider
      value={{
        result,
        servicios,
        serviciosDesactivados,
        search,
        setSearch,
        filters,
        updateFilter,
        resetFilters,
        activeFilterCount: activeCount,
        filterOpen,
        setFilterOpen,
        page: safePage,
        pageSize,
        totalPages,
        totalItems,
        setPage,
        setPageSize,
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
