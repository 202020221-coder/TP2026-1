import { RadioGroup } from "@/shared/components/ui/radio-group";
import { TruckCard } from "./TruckCard";
import { useQuery } from "@tanstack/react-query";
import { getAvailableTrucks } from "@/cotizacion/api/order.api";
import { TruckCardSkeleton } from "./TruckCardSkeleton";
import { useState } from "react";
import { PaginationControls } from "./PaginationControls";
import { useTruck } from "@/cotizacion/hooks/stores/orderTruckStore";

export function TruckSelector() {
  const [page, setPage] = useState(1);
  const selectedTruckPlate = useTruck((s) => s.selectedTruckPlate);
  const update = useTruck(s=>s.update)
  const { status, data, isLoading } = useQuery({
    queryKey: ["trucks", page],
    queryFn: () => getAvailableTrucks({ page, limit: 3 }),
  });

  if (status === "pending") {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <TruckCardSkeleton />
        <TruckCardSkeleton />
        <TruckCardSkeleton />
      </div>
    );
  }

  if (status === "error") {
    return <p className="text-destructive">error al cargar camiones</p>;
  }

  return (
    <>
      <RadioGroup value={selectedTruckPlate} onValueChange={(plate) => update("selectedTruckPlate", plate)}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.data.map((truck) => (
            <TruckCard key={truck.Placa} truck={truck} />
          ))}
        </div>
      </RadioGroup>
      <PaginationControls
        currentPage={data.pagination.page}
        onPageChange={setPage}
        isLoading={isLoading}
        totalPages={data.pagination.totalPages}
      />
    </>
  );
}
