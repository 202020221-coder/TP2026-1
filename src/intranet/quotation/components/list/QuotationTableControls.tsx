import { Input } from "@/shared/components/ui/input";
import { ArrowLeft, ArrowRight, Eraser, Search } from "lucide-react";
import { useEffect, useState, type FC, type ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useQuotation } from "../../hooks/useQuotations";
import {
  QuotationStatesRecord,
  type QuotationState,
} from "../../enum/quotation-state.record";
import { useDebounced } from "@/shared/hooks/useDebounced";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { canApprovePurchaseOrder } from "../../lib/can-approve-purchase-order";

export const QuotationTableControls: FC<{ children: ReactNode }> = ({
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
  const { query, queryParams, result } = useQuotation();
  const role = useSession((state) => state.loggedUser?.rol);
  const showPendingApprovalFilter = canApprovePurchaseOrder(role);
  const onNameChange = useDebounced((nameSearch: string) => {
    query({ ...queryParams, page: 1, nombre: nameSearch });
  }, 500);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
      <div className="col-span-1 md:col-span-3 relative">
        <Input
          placeholder="Buscar por nombre"
          className="pl-8"
          readOnly={result.isFetching}
          onChange={(e) => onNameChange(e.target.value)}
        />
        <Search
          className="absolute top-1/2 -translate-y-1/2 w-8 text-gray-400"
          size={20}
        />
      </div>
      <div className="col-span-1 md:col-span-2 flex gap-x-2">
        <Select
          onValueChange={(value) => {
            query({ ...queryParams, page: 1, estado: value as QuotationState });
          }}
          value={queryParams.estado || ""}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Estados</SelectLabel>
              {Object.values(QuotationStatesRecord).map((status, i) => (
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
            query({ ...queryParams, page: 1, estado: undefined });
          }}
          disabled={!queryParams.estado}
        >
          <Eraser />
        </Button>
      </div>
      </div>
      {showPendingApprovalFilter && (
        <div className="flex items-center gap-2">
          <Checkbox
            id="pendiente-aprobacion"
            checked={queryParams.pendiente_aprobacion === true}
            onCheckedChange={(checked) => {
              query({
                ...queryParams,
                page: 1,
                pendiente_aprobacion: checked === true ? true : undefined,
              });
            }}
          />
          <Label htmlFor="pendiente-aprobacion" className="font-normal cursor-pointer">
            Solo pendientes de aprobación de orden de compra
          </Label>
        </div>
      )}
    </div>
  );
};

const BottomControls: FC = () => {
  const { query, queryParams, result } = useQuotation();
  const pagination = result.data?.pagination;
  const [pseudoPageStr, setPseudoPageStr] = useState("1");

  useEffect(() => {
    setPseudoPageStr(
      pagination ? pagination.page.toString() : "1",
    );
  }, [pagination?.page]);

  const debouncedSetPage = useDebounced((pageNumber: string) => {
    query({
      ...queryParams,
      page: pageNumber === "" ? 1 : Number(pageNumber),
    });
  }, 1000);

  if (!pagination) return null;

  const totalPages = Math.max(pagination.totalPages, 1);

  const nextDisabled =
    result.isPending ||
    result.isFetching ||
    result.isError ||
    pagination.page >= totalPages;

  const backDisabled =
    result.isPending ||
    result.isFetching ||
    result.isError ||
    pagination.page <= 1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4">
      <div className="col-span-1 flex gap-x-2 items-center">
        <Label>Tamaño de Página:</Label>
        <Select
          onValueChange={(value) => {
            query({ ...queryParams, page: 1, per_page: Number(value) });
          }}
          value={(queryParams.per_page ?? pagination.limit).toString()}
        >
          <SelectTrigger className="w-20">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="15" disabled={pagination.total <= 10}>
              15
            </SelectItem>
            <SelectItem value="20" disabled={pagination.total <= 15}>
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
            query({ ...queryParams, page: pagination.page - 1 });
          }}
        >
          <ArrowLeft /> Anterior
        </Button>
        <Button
          className="w-40"
          disabled={nextDisabled}
          onClick={() => {
            query({ ...queryParams, page: pagination.page + 1 });
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
  );
};
