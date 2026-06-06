import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { inventoryApi } from "../api/inventory.api";
import type { InventarioItem } from "../interfaces/inventory.interface";
import {
  ListInventarioContext,
  type InventarioStatusFilter,
} from "./ListInventarioContext";

// Se traen todos los objetos y la paginación se resuelve en el cliente, para
// que el "Tamaño de Página" cuente solo los ítems visibles tras los filtros
// (estado disponible/no disponible y búsqueda).
const FETCH_ALL_LIMIT = 1000;

export const ListInventarioProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [search, setSearchState] = useState("");
  const [statusFilter, setStatusFilterState] =
    useState<InventarioStatusFilter>("available");
  const [page, setPage] = useState(1);
  const [limit, setLimitState] = useState(10);

  const result = useQuery({
    queryKey: ["inventario", "list", "all"],
    queryFn: () => inventoryApi.getAll(1, FETCH_ALL_LIMIT),
    placeholderData: (prev) => prev,
  });

  const allItems = useMemo(() => result.data?.data ?? [], [result.data]);

  const filteredItems = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return allItems.filter((item: InventarioItem) => {
      const estado =
        typeof item.estado === "string" ? item.estado.trim().toLowerCase() : "";
      const statusMatches =
        statusFilter === "available"
          ? estado === "disponible"
          : estado !== "disponible";

      if (!statusMatches) {
        return false;
      }

      if (!searchTerm) {
        return true;
      }

      const fabricante = item.Fabricante_Nombre ?? "";
      const ordenCompra = item.orden_compra ?? "";
      const serial = item.numero_serial ?? "";

      return (
        item.nombre_objeto.toLowerCase().includes(searchTerm) ||
        fabricante.toLowerCase().includes(searchTerm) ||
        ordenCompra.toLowerCase().includes(searchTerm) ||
        serial.toLowerCase().includes(searchTerm) ||
        String(item.Id_Objeto).includes(searchTerm)
      );
    });
  }, [allItems, search, statusFilter]);

  // ── Paginación client-side sobre la lista ya filtrada ──────────────────────
  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const safePage = Math.min(page, totalPages);

  const items = useMemo(() => {
    const start = (safePage - 1) * limit;
    return filteredItems.slice(start, start + limit);
  }, [filteredItems, safePage, limit]);

  const setSearch = useCallback((value: string) => {
    setSearchState(value);
    setPage(1);
  }, []);

  const setStatusFilter = useCallback((value: InventarioStatusFilter) => {
    setStatusFilterState(value);
    setPage(1);
  }, []);

  const setLimit = useCallback((value: number) => {
    setLimitState(value);
    setPage(1);
  }, []);

  return (
    <ListInventarioContext.Provider
      value={{
        result,
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        page: safePage,
        setPage,
        limit,
        setLimit,
        items,
        totalItems,
        totalPages,
      }}
    >
      {children}
    </ListInventarioContext.Provider>
  );
};
