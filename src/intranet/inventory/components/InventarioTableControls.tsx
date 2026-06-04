import type { FC, ReactNode } from "react";
import { ChevronLeft, ChevronRight, Search, Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useInventario } from "../hooks/useInventario";
import type { InventarioStatusFilter } from "../context/ListInventarioContext";

export const InventarioTableControls: FC<{
  children: ReactNode;
  onAdd: () => void;
}> = ({ children, onAdd }) => {
  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    result,
    items,
    page,
    setPage,
    limit,
    setLimit,
    totalItems,
    totalPages,
  } = useInventario();

  const currentPage = page;
  const paginationDisabled =
    result.isPending || result.isFetching || result.isError;
  const hasItems = totalItems > 0 && items.length > 0;
  const startIndex = hasItems ? (currentPage - 1) * limit + 1 : 0;
  const endIndex = hasItems ? (currentPage - 1) * limit + items.length : 0;

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) {
      return;
    }

    setPage(nextPage);
  };

  return (
    <div className="flex flex-1 flex-col gap-5 min-h-0">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="md:col-span-6 space-y-1">
          <p className="text-xs text-transparent select-none">Buscar</p>
          <div className="relative">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre, fabricante o serie"
              className="pl-8"
              disabled={result.isFetching}
            />
            <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-gray-400">
              <Search className="h-4 w-4" />
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-2 md:col-span-6 md:justify-end">
          <div className="w-full max-w-[220px] space-y-1">
            <p className="text-xs text-muted-foreground">Estado</p>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as InventarioStatusFilter)
              }
              disabled={result.isFetching}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Disponibles</SelectItem>
                <SelectItem value="unavailable">No disponibles</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={onAdd}
            className="gap-2"
            disabled={result.isFetching}
          >
            <Plus className="h-4 w-4" />
            Nuevo objeto
          </Button>
        </div>
      </div>

      {children}

      {result.data && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Tamaño de Página
              </span>
              <Select
                value={String(limit)}
                onValueChange={(value) => {
                  const parsed = Number(value);
                  if (!Number.isFinite(parsed)) {
                    return;
                  }
                  setLimit(parsed);
                }}
                disabled={paginationDisabled}
              >
                <SelectTrigger className="h-8 w-24">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25" disabled={totalItems <= 10}>
                    25
                  </SelectItem>
                  <SelectItem value="50" disabled={totalItems <= 25}>
                    50
                  </SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">
                {startIndex}-{endIndex} de {totalItems}
              </span>
            </div>
          </div>
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={paginationDisabled || currentPage === 1}
                className="h-8 gap-1 px-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      disabled={paginationDisabled}
                      className="h-8 w-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  ),
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={paginationDisabled || currentPage === totalPages}
                className="h-8 gap-1 px-2"
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
