import type { FC } from "react";
import { PickupCardView } from "./PickupCardView";
import { useQuotationPickupStore } from "@/intranet/quotation/hooks/stores/quotation.pickup.store.provider";
export const CreateQuotationPickupSection: FC<{ address: string }> = ({
  address,
}) => {
  const pickupDate = useQuotationPickupStore((s) => s.pickupDate);
  const pickupCost = useQuotationPickupStore((s) => s.pickupCost);
  const update = useQuotationPickupStore((s) => s.update);
  return (
    <PickupCardView
      address={address}
      pickupCost={pickupCost}
      pickupDate={pickupDate}
      onPickupCostChange={(cost) => update("pickupCost", cost)}
      onPickupDateChange={(date) => update("pickupDate", date)}
    />
  );
};
