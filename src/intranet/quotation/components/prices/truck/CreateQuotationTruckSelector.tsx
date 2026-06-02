import type { FC } from "react";
import { TruckSelector } from "./TruckSelector";
import { useQuotationTruckStore } from "@/intranet/quotation/hooks/stores/quotation.truck.store.provider";

export const CreateQuotationTruckSelector: FC = () => {
  const selectedTrucks = useQuotationTruckStore((s) => s.selectedTrucks);
  const setSelectedTrucks = useQuotationTruckStore((s) => s.setSelectedTrucks);
  return (
    <TruckSelector
      selectedTrucks={selectedTrucks}
      onSelectedTrucks={setSelectedTrucks}
      readOnly={false}
    />
  );
};
