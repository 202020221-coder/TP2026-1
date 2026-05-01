import { Input } from "@/shared/components/ui/input";
import { /*ArrowLeft, ArrowRight,*/ ArrowLeft, ArrowRight, Eraser, Search } from "lucide-react";
import { /*useEffect, useState,*/ useEffect, useState, type FC, type ReactNode } from "react";
// import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
// import { useDebouncedCallback } from "@src/shared/hooks/useDebouncedCallback";
import { useOrders } from "../hooks/useOrders";
import { OrderStatesRecord, type OrderState } from "../enum/order-state.record";
import { Label } from "@/shared/components/ui/label";
import { useDebounced } from "@/shared/hooks/useDebounced";

export const OrdersTableControls: FC<{ children: ReactNode }> = ({
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
  const { query, queryParams, result } = useOrders();  
  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
      <div className="col-span-1 md:col-span-3 relative">
        <Input placeholder="Buscar por nombre" className="pl-8" disabled={result.isFetching}/>
        <Search
          className="absolute top-1/2 -translate-y-1/2 w-8 text-gray-400"
          size={20}
        />
      </div>
      <div className="col-span-1 md:col-span-2 flex gap-x-2">
        <Select
          onValueChange={(value) => {
            query({ ...queryParams, page: 1, status: value as OrderState });
          }}
          value={queryParams.status || ""}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Estados</SelectLabel>
              {Object.values(OrderStatesRecord).map((status,i) => (
                <SelectItem key={`${i}-${status}`} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          size={"icon"}
          onClick={() => {
            query({ ...queryParams, page: 1, status: undefined });
          }}
          disabled={!queryParams.status}
        >
          <Eraser />
        </Button>
      </div>
    </div>
  );
};

const BottomControls: FC = () => {
  const { query, queryParams, result } = useOrders();

  const [pseudoPagestr, setPseudoPagestr] = useState("1");

  useEffect(() => {
    setPseudoPagestr(
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
    result.data.pagination.page === result.data.pagination.totalPages;
  const backDisabled =
    result.isPending ||
    result.isFetching ||
    result.isError ||
    result.data.pagination.page === 1;

  return (
    result.data && (
      <div className="grid grid-cols-1 md:grid-cols-4">
        <div className="col-span-1 flex gap-x-2">
          <Label htmlFor="query-size">Tamaño de Página:</Label>
          <Select
            onValueChange={(value) => {
              query({ ...queryParams, page: 1, limit: Number(value) });
            }}
            value={queryParams.limit?.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un tamaño de página" />
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
            variant={"secondary"}
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
            value={pseudoPagestr}
            onChange={(e) => {
              setPseudoPagestr(e.target.value);
              debouncedSetPage(e.target.value);
            }}
            disabled={result.data.pagination.totalPages === 1}
          />
          <p>de</p>
          <p>{Math.max(result.data.pagination.totalPages,1)}</p>
        </div>
      </div>
    )
  );
};
