import { useEffect, useState, type FC, type ReactNode } from "react";
import { Input } from "@/shared/components/ui/input";
import { ArrowLeft, ArrowRight, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";
import { useServicios } from "../hooks/useServicios";
import { useDebounced } from "@/shared/hooks/useDebounced";
import { ServicioFilterPanel } from "./ServicioFilterPanel";
import type { ServicioFilters } from "../interfaces/service-filters";

interface Props {
  children: ReactNode;
  onAddClick: () => void;
  onEliminadosClick: () => void;
  // ── props del filtro ──────────────────────────────────────────────────────
  filters: ServicioFilters;
  activeFilterCount: number;
  filterOpen: boolean;
  onFilterOpenChange: (v: boolean) => void;
  onUpdateFilter: <K extends keyof ServicioFilters>(
    key: K,
    value: ServicioFilters[K]
  ) => void;
  onResetFilters: () => void;
}

export const ServiciosTableControls: FC<Props> = ({
  children,
  onAddClick,
  onEliminadosClick,
  filters,
  activeFilterCount,
  filterOpen,
  onFilterOpenChange,
  onUpdateFilter,
  onResetFilters,
}) => (
  <div className="flex flex-1 flex-col space-y-5 min-h-0">
    <TopControls
      onAddClick={onAddClick}
      onEliminadosClick={onEliminadosClick}
      filters={filters}
      activeFilterCount={activeFilterCount}
      filterOpen={filterOpen}
      onFilterOpenChange={onFilterOpenChange}
      onUpdateFilter={onUpdateFilter}
      onResetFilters={onResetFilters}
    />
    {children}
    <BottomControls />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

interface TopProps {
  onAddClick: () => void;
  onEliminadosClick: () => void;
  filters: ServicioFilters;
  activeFilterCount: number;
  filterOpen: boolean;
  onFilterOpenChange: (v: boolean) => void;
  onUpdateFilter: <K extends keyof ServicioFilters>(
    key: K,
    value: ServicioFilters[K]
  ) => void;
  onResetFilters: () => void;
}

const TopControls: FC<TopProps> = ({
  onAddClick,
  onEliminadosClick,
  filters,
  activeFilterCount,
  filterOpen,
  onFilterOpenChange,
  onUpdateFilter,
  onResetFilters,
}) => {
  const { search, setSearch, result } = useServicios();
  const [searchValue, setSearchValue] = useState(search ?? "");

  const debouncedSearch = useDebounced((value: string) => {
    setSearch(value || undefined);
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    debouncedSearch(e.target.value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      {/* Búsqueda + Filtros */}
      <div className="col-span-1 md:col-span-3 flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Buscar por nombre"
            className="pl-8"
            value={searchValue}
            onChange={handleSearchChange}
            disabled={result.isFetching}
          />
          <Search
            className="absolute top-1/2 -translate-y-1/2 left-2 text-gray-400"
            size={16}
          />
        </div>

        {/* Panel de filtros */}
        <ServicioFilterPanel
          filters={filters}
          activeCount={activeFilterCount}
          open={filterOpen}
          onOpenChange={onFilterOpenChange}
          onUpdateFilter={onUpdateFilter}
          onReset={onResetFilters}
          disabled={result.isFetching}
        />
      </div>

      {/* Botones de acción */}
      <div className="col-span-1 md:col-span-4 flex justify-end gap-2">
        <Button
          onClick={onEliminadosClick}
          variant="outline"
          className="gap-2 border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          <Trash2 className="w-4 h-4" /> Eliminados
        </Button>
        <Button
          onClick={onAddClick}
          className="gap-2 bg-red-500 hover:bg-red-600 text-white"
        >
          <Plus className="w-4 h-4" /> Agregar Servicio
        </Button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const BottomControls: FC = () => {
  const {
    result,
    page,
    pageSize,
    totalPages,
    totalItems,
    setPage,
    setPageSize,
  } = useServicios();
  const [pseudoPageStr, setPseudoPageStr] = useState("1");

  useEffect(() => {
    setPseudoPageStr(page.toString());
  }, [page]);

  const debouncedSetPage = useDebounced((v: string) => {
    setPage(v === "" ? 1 : Number(v));
  }, 1000);

  const nextDisabled =
    result.isPending || result.isError || page >= totalPages;

  const backDisabled =
    result.isPending || result.isError || page <= 1;

  return result.data ? (
    <div className="grid grid-cols-1 md:grid-cols-4">
      <div className="col-span-1 flex gap-x-2 items-center">
        <Label>Tamaño de Página:</Label>
        <Select
          onValueChange={(v) => setPageSize(Number(v))}
          value={pageSize.toString()}
        >
          <SelectTrigger className="w-20">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="15" disabled={totalItems <= 10}>
              15
            </SelectItem>
            <SelectItem value="20" disabled={totalItems <= 15}>
              20
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="col-span-2 flex justify-center gap-x-2">
        <Button
          className="w-40"
          variant="secondary"
          disabled={backDisabled}
          onClick={() => setPage(page - 1)}
        >
          <ArrowLeft /> Anterior
        </Button>
        <Button
          className="w-40"
          disabled={nextDisabled}
          onClick={() => setPage(page + 1)}
        >
          Siguiente <ArrowRight />
        </Button>
      </div>

      <div className="col-span-1 flex gap-x-2 items-center w-fit">
        <p>Página</p>
        <Input
          type="number"
          step={1}
          min={1}
          max={totalPages}
          value={pseudoPageStr}
          onChange={(e) => {
            setPseudoPageStr(e.target.value);
            debouncedSetPage(e.target.value);
          }}
          disabled={totalPages === 1}
          className="w-16"
        />
        <p>de</p>
        <p>{totalPages}</p>
      </div>
    </div>
  ) : null;
};
