import type { FC } from "react";
import { TruckSelector } from "./TruckSelector";
import { useQuotationTruckStore } from "@/intranet/quotation/hooks/stores/quotation.truck.store.provider";

export const CreateQuotationTruckSelector: FC = () => {
  const selectedTruck = useQuotationTruckStore((s) => s.selectedTruck);
  const update = useQuotationTruckStore((s) => s.update);  
  return (
    <TruckSelector
      selectedTruck={selectedTruck}
      onSelectedTruck={(truck) => update("selectedTruck", truck)}
      readOnly={false}
    />
  );
};
