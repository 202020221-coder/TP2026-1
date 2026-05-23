import type { FC } from "react";
import { PickupCardView } from "./PickupCardView";
import { useQuotationPickupStore } from "@/intranet/quotation/hooks/stores/quotation.pickup.store.provider";
export const CreateQuotationPickupSection: FC = () => {
  const pickupDate = useQuotationPickupStore((s) => s.pickupDate);
  const pickupCost = useQuotationPickupStore((s) => s.pickupCost);
  const pickupAddress = useQuotationPickupStore((s) => s.pickupAddress);
  const update = useQuotationPickupStore((s) => s.update);
  return (
    <PickupCardView
      pickupCost={pickupCost}
      pickupDate={pickupDate}
      pickupAddress={pickupAddress}
      onPickupCostChange={(cost) => update("pickupCost", cost)}
      onPickupDateChange={(date) => update("pickupDate", date)}
      onPickupAddressChange={(addr) => update("pickupAddress", addr)}
    />
  );
};
