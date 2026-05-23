import { useQuotationPickupStore } from "@/intranet/quotation/hooks/stores/quotation.pickup.store.provider";
import { useQuotationProductStore } from "@/intranet/quotation/hooks/stores/quotation.products.store.provider";
import { formatCurrency } from "@/shared/lib/format-currency";
import { useMemo } from "react";

export const useSummaryCard = () => {
  const products = useQuotationProductStore((s) => s.items);
  const pickupCost = useQuotationPickupStore((s) => s.pickupCost);

  const subtotal = useMemo(() => {
    return Object.values(products).reduce(
      (acc, item) => acc + (item.precio_unitario ?? 0) * (item.cantidad ?? 0),
      0,
    );
  }, [products]);

  const total = useMemo(() => pickupCost + subtotal, [pickupCost, subtotal]);
  return {
    subtotal: formatCurrency(subtotal, "USD", 2),
    total: formatCurrency(total, "USD", 2),
    pickupCost: formatCurrency(pickupCost, "USD", 2),
  };
};
