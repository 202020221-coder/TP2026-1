import { Input } from "@/shared/components/ui/input";
import { Eraser, Search } from "lucide-react";
import {type FC, type ReactNode } from "react";
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
import { useQuotation } from "../../hooks/useQuotations";
import { QuotationStatesRecord, type QuotationState } from "../../enum/quotation-state.record";

export const QuotationTableControls: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <div className="space-y-3">
      <TopControls />
      {children}
    </div>
  );
};

const TopControls: FC = () => {
  const { query, queryParams, result } = useQuotation();
  console.log("ESTADO", queryParams.status);
  
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
            query({ ...queryParams, page: 1, status: value as QuotationState });
          }}
          value={queryParams.status || ""}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Estados</SelectLabel>
              {Object.values(QuotationStatesRecord).map((status,i) => (
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