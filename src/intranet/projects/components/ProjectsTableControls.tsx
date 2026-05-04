import {
  ArrowLeft,
  ArrowRight,
  Eraser,
  Search,
  CalendarRange,
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

  const debouncedSearch = useDebounced((value: string) => {
    query({ ...queryParams, page: 1, buscar: value || undefined });
  }, 600);

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

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <CalendarRange size={16} className="text-gray-400 shrink-0" />
          <Input
            type="date"
            className="w-36 text-sm"
            disabled={result.isFetching}
            value={queryParams.fecha_inicio ?? ""}
            max={queryParams.fecha_fin ?? ""}
            onKeyDown={(e) => e.preventDefault()}
            onChange={(e) => {
              const val = e.target.value;
              if (queryParams.fecha_fin && val > queryParams.fecha_fin) return;
              query({
                ...queryParams,
                page: 1,
                fecha_inicio: val || undefined,
              });
            }}
          />
          <span className="text-gray-400 text-sm">—</span>
          <Input
            type="date"
            className="w-36 text-sm"
            disabled={result.isFetching}
            value={queryParams.fecha_fin ?? ""}
            min={queryParams.fecha_inicio ?? ""}
            onKeyDown={(e) => e.preventDefault()}
            onChange={(e) => {
              const val = e.target.value;
              if (queryParams.fecha_inicio && val < queryParams.fecha_inicio)
                return;
              query({ ...queryParams, page: 1, fecha_fin: val || undefined });
            }}
          />
        </div>
      </div>

      {/* Filtro de estado + botón limpiar */}
      <div className="flex gap-x-2">
        <Select
          onValueChange={(value) => {
            query({ ...queryParams, page: 1, estado: value as ProjectState });
          }}
          value={queryParams.estado ?? ""}
        >
          {/* Corregido: w-52 para que quepa "Seleccione un estado" completo */}
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
          onClick={() => {
            setNameInput("");

            query({ page: 1, limit: queryParams.limit });
          }}
          disabled={
            !queryParams.estado &&
            !queryParams.buscar &&
            !queryParams.fecha_inicio &&
            !queryParams.fecha_fin
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
