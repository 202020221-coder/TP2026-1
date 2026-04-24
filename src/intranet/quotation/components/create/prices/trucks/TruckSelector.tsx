import { RadioGroup } from "@/shared/components/ui/radio-group";
import { TruckCard } from "./TruckCard";
import { useQuery } from "@tanstack/react-query";
import { getAvailableTrucks } from "@/intranet/quotation/api/order.api";
import { TruckCardSkeleton } from "./TruckCardSkeleton";
import { useState } from "react";
import { PaginationControls } from "./PaginationControls";
import { useTruck } from "@/intranet/quotation/hooks/stores/orderTruckStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { AlertCircle, Truck } from "lucide-react";

export function TruckSelector() {
  const [page, setPage] = useState(1);
  const selectedTruck = useTruck((s) => s.selectedTruck);
  const update = useTruck((s) => s.update);
  const { status, data, isLoading } = useQuery({
    queryKey: ["trucks", page],
    queryFn: () => getAvailableTrucks({ page, limit: 3 }),
  });

  const CardHeaderContent = () => (
    <CardHeader className="pb-0">
      <CardTitle className="flex flex-row items-end gap-x-1.5 mx-auto sm:mx-0">
        <Truck className="text-primary" />
        <span className="pb-0.5 font-[375] text-[18px]">
          {" "}
          Selección de camión
        </span>
      </CardTitle>
      <CardDescription className="tracking-[0.5px] text-[14px] text-center sm:text-left">
        Selecciona el camión que va estar vinculado a la cotización.
      </CardDescription>
    </CardHeader>
  );

  if (status === "pending") {
    return (
      <Card className="gap-4 border bg-card shadow-none">
        <CardHeaderContent />
        <CardContent>
          <div className="rounded-lg border border-border bg-background p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <TruckCardSkeleton />
              <TruckCardSkeleton />
              <TruckCardSkeleton />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === "error") {
    return (
      <Card className="gap-4 border bg-card shadow-none">
        <CardHeaderContent />
        <CardContent>
          <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            Error al cargar camiones
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gap-4 border bg-card shadow-none">
      <CardHeaderContent />
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-border bg-background p-4">
          <RadioGroup
            value={JSON.stringify(selectedTruck)}
            onValueChange={(jsonTruck) => update("selectedTruck", JSON.parse(jsonTruck))}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.data.map((truck) => (
                <TruckCard key={truck.Placa} truck={truck} />
              ))}
            </div>
          </RadioGroup>
        </div>
        <div className="rounded-lg border border-border bg-muted/20 p-3">
          <PaginationControls
            currentPage={data.pagination.page}
            onPageChange={setPage}
            isLoading={isLoading}
            totalPages={data.pagination.totalPages}
          />
        </div>
      </CardContent>
    </Card>
  );
}
