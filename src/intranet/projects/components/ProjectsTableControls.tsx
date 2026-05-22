import {
  ArrowLeft,
  ArrowRight,
  Eraser,
  Search,
  CalendarRange,
  Filter,
} from "lucide-react";
import { useEffect, useState, type FC, type ReactNode } from "react";
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
import { useProjects } from "../hooks/useProjects";
import {
  ProjectStatesRecord,
  type ProjectState,
} from "../enum/project-state.record";
import { useDebounced } from "@/shared/hooks/useDebounced";

export const ProjectsTableControls: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex flex-1 flex-col space-y-3">
      <TopControls />
      {children}
      <BottomControls />
    </div>
  );
};

const TopControls: FC = () => {
  const { query, queryParams, result } = useProjects();

  const [nameInput, setNameInput] = useState(queryParams.buscar ?? "");
  const [localFechaInicio, setLocalFechaInicio] = useState(queryParams.fecha_inicio ?? "");
  const [localFechaFin, setLocalFechaFin] = useState(queryParams.fecha_fin ?? "");

  const debouncedSearch = useDebounced((value: string) => {
    query({ ...queryParams, page: 1, buscar: value || undefined });
  }, 600);

  const handleAplicarFechas = () => {
    query({
      ...queryParams,
      page: 1,
      fecha_inicio: localFechaInicio || undefined,
      fecha_fin: localFechaFin || undefined,
    });
  };

  const handleLimpiar = () => {
    setNameInput("");
    setLocalFechaInicio("");
    setLocalFechaFin("");
    query({ page: 1, limit: queryParams.limit });
  };

  return (
    <div className="flex flex-wrap gap-2 items-start justify-between">
      {/* Buscar por nombre */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Input
          placeholder="Buscar por nombre"
          className="pl-8"
          disabled={result.isFetching}
          value={nameInput}
          onChange={(e) => {
            setNameInput(e.target.value);
            debouncedSearch(e.target.value);
          }}
        />
        <Search
          className="absolute top-1/2 -translate-y-1/2 left-2 text-gray-400"
          size={16}
        />
      </div>

      {/* Rango de fechas */}
      <div className="flex items-center gap-2">
        <CalendarRange size={16} className="text-gray-400 shrink-0" />
        <Input
          type="date"
          className="w-36 text-sm"
          disabled={result.isFetching}
          value={localFechaInicio}
          onKeyDown={(e) => e.preventDefault()}
          onChange={(e) => setLocalFechaInicio(e.target.value)}
        />
        <span className="text-gray-400 text-sm">—</span>
        <Input
          type="date"
          className="w-36 text-sm"
          disabled={result.isFetching}
          value={localFechaFin}
          onKeyDown={(e) => e.preventDefault()}
          onChange={(e) => setLocalFechaFin(e.target.value)}
        />
        <Button
          size="icon"
          variant="outline"
          onClick={handleAplicarFechas}
          disabled={!localFechaInicio && !localFechaFin}
          title="Aplicar filtro de fechas"
        >
          <Filter size={16} />
        </Button>
      </div>

      {/* Filtro de estado + botón limpiar */}
      <div className="flex gap-x-2">
        <Select
          onValueChange={(value) => {
            query({ ...queryParams, page: 1, estado: value as ProjectState });
          }}
          value={queryParams.estado ?? ""}
        >
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Seleccione un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Estados</SelectLabel>
              {Object.values(ProjectStatesRecord).map((status, i) => (
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
          onClick={handleLimpiar}
          disabled={
            !queryParams.estado &&
            !queryParams.buscar &&
            !queryParams.fecha_inicio &&
            !queryParams.fecha_fin &&
            !localFechaInicio &&
            !localFechaFin
          }
          title="Limpiar filtros"
        >
          <Eraser size={16} />
        </Button>
      </div>
    </div>
  );
};

const BottomControls: FC = () => {
  const { query, queryParams, result } = useProjects();

  const [pseudoPageStr, setPseudoPageStr] = useState("1");

  useEffect(() => {
    setPseudoPageStr(
      result.data ? result.data.pagination.page.toString() : "1",
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
      <div className="flex flex-col gap-3 sm:grid sm:grid-cols-4">
        <div className="flex gap-x-2 items-center sm:col-span-1">
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

        <div className="flex justify-center gap-x-2 sm:col-span-2">
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

        <div className="flex gap-x-2 items-center w-fit sm:col-span-1">
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
