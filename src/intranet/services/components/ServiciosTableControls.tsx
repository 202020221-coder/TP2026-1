import {
  useEffect,
  useState,
  type FC,
  type ReactNode,
} from "react";
import { Input } from "@/shared/components/ui/input";
import { ArrowLeft, ArrowRight, Plus, Search } from "lucide-react";
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

export const ServiciosTableControls: FC<{ children: ReactNode }> = ({
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
  const { query, queryParams, result } = useServicios();
  const [searchValue, setSearchValue] = useState(queryParams.search ?? "");

  const debouncedSearch = useDebounced((value: string) => {
    query({ ...queryParams, page: 1, search: value || undefined });
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    debouncedSearch(e.target.value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
      <div className="col-span-1 md:col-span-3 relative">
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
      <div className="col-span-1 md:col-span-4 flex justify-end">
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Agregar Servicio
        </Button>
      </div>
    </div>
  );
};

const BottomControls: FC = () => {
  const { query, queryParams, result } = useServicios();
  const [pseudoPageStr, setPseudoPageStr] = useState("1");

  useEffect(() => {
    setPseudoPageStr(
      result.data ? result.data.pagination.page.toString() : "1",
    );
  }, [result.data?.pagination.page]);

  const handlePageChange = (pageNumber: string) => {
    query({
      ...queryParams,
      page: pageNumber === "" ? 1 : Number(pageNumber),
    });
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
          <Label>Tamaño de Página:</Label>
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
            onChange={(e) => {
              setPseudoPageStr(e.target.value);
              debouncedSetPage(e.target.value);
            }}
            disabled={result.data.pagination.totalPages === 1}
            className="w-16"
          />
          <p>de</p>
          <p>{result.data.pagination.totalPages}</p>
        </div>
      </div>
    )
  );
};
