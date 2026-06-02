import { useState, useEffect, type FC, type ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { ArrowLeft, ArrowRight, Eraser, Search, Plus } from "lucide-react";
import { useIncidents } from "../hooks/useIncidents";
import { IncidentStatesRecord, type IncidentState } from "../enum/incident-state.record";
import { useDebounced } from "@/shared/hooks/useDebounced";
import { CreateIncidentModal } from "./CreateIncidentModal";

export const IncidentsTableControls: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex flex-1 flex-col space-y-5 min-h-0">
      <TopControls />
      {children}
      <BottomControls />
    </div>
  );
};

const TopControls: FC = () => {
  const { query, queryParams, result } = useIncidents();
  const [createOpen, setCreateOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(queryParams.buscar ?? "");

  const debouncedSearch = useDebounced((value: string) => {
    query({ ...queryParams, page: 1, buscar: value || undefined });
  }, 600);

  return (
    <>
      <CreateIncidentModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <div className="flex flex-wrap gap-4 items-start justify-between">
        {/* Buscar */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Input
            placeholder="Buscar por cliente o comentario"
            className="pl-8"
            disabled={result.isFetching}
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              debouncedSearch(e.target.value);
            }}
          />
          <Search
            className="absolute top-1/2 -translate-y-1/2 left-2 text-gray-400"
            size={16}
          />
        </div>

        {/* Filtro estado + limpiar + crear */}
        <div className="flex gap-x-2">
          <Select
            onValueChange={(value) => {
              query({ ...queryParams, page: 1, estado: value as IncidentState });
            }}
            value={queryParams.estado ?? ""}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Seleccione un estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Estados</SelectLabel>
                {Object.values(IncidentStatesRecord).map((status, i) => (
                  <SelectItem key={`${i}-${status}`} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              setSearchInput("");
              query({ page: 1, limit: queryParams.limit });
            }}
            disabled={!queryParams.estado && !queryParams.buscar}
            title="Limpiar filtros"
          >
            <Eraser size={16} />
          </Button>

          <Button
            onClick={() => setCreateOpen(true)}
            className="gap-1"
            title="Nueva incidencia"
          >
            <Plus size={16} />
            Nueva
          </Button>
        </div>
      </div>
    </>
  );
};

const BottomControls: FC = () => {
  const { query, queryParams, result } = useIncidents();
  const [pseudoPageStr, setPseudoPageStr] = useState("1");

  useEffect(() => {
    setPseudoPageStr(
      result.data ? result.data.pagination.page.toString() : "1"
    );
  }, [result.data?.pagination.page]);

  const handlePageChange = (pageNumber: string) => {
    query({ ...queryParams, page: pageNumber === "" ? 1 : Number(pageNumber) });
  };
  const debouncedSetPage = useDebounced(handlePageChange, 1000);

  const nextDisabled =
    result.isPending ||
    result.isFetching ||
    result.isError ||
    result.data?.pagination.page === result.data?.pagination.totalPages;

  const backDisabled =
    result.isPending ||
    result.isFetching ||
    result.isError ||
    result.data?.pagination.page === 1;

  return (
    result.data && (
      <div className="grid grid-cols-1 md:grid-cols-4">
        <div className="col-span-1 flex gap-x-2 items-center">
          <Label htmlFor="query-size">Tamaño de Página:</Label>
          <Select
            onValueChange={(value) => {
              query({ ...queryParams, page: 1, limit: Number(value) });
            }}
            value={queryParams.limit?.toString()}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem
                value="15"
                disabled={result.data.pagination.total <= 10}
              >
                15
              </SelectItem>
              <SelectItem
                value="20"
                disabled={result.data.pagination.total <= 15}
              >
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
            onClick={() => {
              query({
                ...queryParams,
                page: result.data.pagination.page - 1,
              });
            }}
          >
            <ArrowLeft /> Anterior
          </Button>
          <Button
            className="w-40"
            disabled={nextDisabled}
            onClick={() => {
              query({
                ...queryParams,
                page: result.data.pagination.page + 1,
              });
            }}
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
            max={result.data.pagination.totalPages}
            value={pseudoPageStr}
            className="w-16"
            onChange={(e) => {
              setPseudoPageStr(e.target.value);
              debouncedSetPage(e.target.value);
            }}
            disabled={result.data.pagination.totalPages === 1}
          />
          <p>de</p>
          <p>{result.data.pagination.totalPages}</p>
        </div>
      </div>
    )
  );
};
