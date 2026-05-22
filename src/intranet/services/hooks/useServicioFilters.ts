import { useState, useCallback, useMemo } from "react";
import type { Servicio } from "../interfaces/service";
import {
  type ServicioFilters,
  EMPTY_FILTERS,
  hasActiveFilters,
  clasificarTipoServicio,
} from "../interfaces/service-filters";

export const useServicioFilters = (servicios: Servicio[]) => {
  const [filters, setFilters] = useState<ServicioFilters>(EMPTY_FILTERS);
  const [open, setOpen] = useState(false);

  const filteredServicios = useMemo(() => {
    if (!hasActiveFilters(filters)) return servicios;

    return servicios.filter((s) => {
      // ── Rango de precio ──────────────────────────────────────────────────
      if (filters.precioMin !== "" && s.precio_regular < Number(filters.precioMin))
        return false;
      if (filters.precioMax !== "" && s.precio_regular > Number(filters.precioMax))
        return false;

      // ── Tipo de servicio ─────────────────────────────────────────────────
      if (filters.tiposServicio.length > 0) {
        const tipo = clasificarTipoServicio(s.nombre);
        if (!filters.tiposServicio.includes(tipo)) return false;
      }

      // ── Condición de precio ──────────────────────────────────────────────
      if (filters.condicionesPrecio.length > 0) {
        const condNorm = s.condicional_precio.toLowerCase();
        const match = filters.condicionesPrecio.some((c) =>
          condNorm.includes(c.toLowerCase())
        );
        if (!match) return false;
      }

      return true;
    });
  }, [servicios, filters]);

  const updateFilter = useCallback(
    <K extends keyof ServicioFilters>(key: K, value: ServicioFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetFilters = useCallback(() => setFilters(EMPTY_FILTERS), []);

  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.precioMin !== "" || filters.precioMax !== "") count++;
    if (filters.tiposServicio.length > 0) count++;
    if (filters.condicionesPrecio.length > 0) count++;
    return count;
  }, [filters]);

  return {
    filters,
    filteredServicios,
    updateFilter,
    resetFilters,
    activeCount,
    open,
    setOpen,
  };
};
