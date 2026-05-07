import type { Order } from "@/intranet/orders/interfaces/order";
import type { FC } from "react";
import { PickupCardView } from "./PickupCardView";
import { useQuotationPickupStore } from "@/intranet/quotation/hooks/stores/quotation.pickup.store.provider";
export const CreateQuotationPickupSection: FC<{ orderId: Order["ID"] }> = ({
  orderId,
}) => {
  const pickupDate = useQuotationPickupStore((s) => s.pickupDate);
  const pickupCost = useQuotationPickupStore((s) => s.pickupCost);
  const update = useQuotationPickupStore((s) => s.update);
  return (
    <PickupCardView
      orderId={orderId}
      pickupCost={pickupCost}
      pickupDate={pickupDate}
      onPickupCostChange={(cost) => update("pickupCost", cost)}
      onPickupDateChange={(date) => update("pickupDate", date)}
    />
  );
};
