import { useMemo, useState, type FC, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { inventoryApi } from "../api/inventory.api";
import type { InventarioItem } from "../interfaces/inventory.interface";
import {
  ListInventarioContext,
  type InventarioStatusFilter,
} from "./ListInventarioContext";

export const ListInventarioProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<InventarioStatusFilter>("available");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const result = useQuery({
    queryKey: ["inventario", "list", page, limit],
    queryFn: () => inventoryApi.getAll(page, limit),
  });

  const filteredItems = useMemo(() => {
    if (!result.data) {
      return [];
    }

    const searchTerm = search.trim().toLowerCase();

    return result.data.data.filter((item: InventarioItem) => {
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
  }, [result.data, search, statusFilter]);

  return (
    <ListInventarioContext.Provider
      value={{
        result,
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        page,
        setPage,
        limit,
        setLimit,
        filteredItems,
      }}
    >
      {children}
    </ListInventarioContext.Provider>
  );
};
