import { useQuotationPickupStore } from "@/intranet/quotation/hooks/stores/quotation.pickup.store.provider";
import { useQuotationProductStore } from "@/intranet/quotation/hooks/stores/quotation.products.store.provider";
import { formatCurrency } from "@/shared/lib/format-currency";
import { useMemo } from "react";

export const useSummaryCard = () => {
  const products = useQuotationProductStore((s) => s.items);
  const pickupCost = useQuotationPickupStore((s) => s.pickupCost);

  const subtotal = useMemo(() => {
    return Object.values(products).reduce((acc, item) => {
      const unitPrice = Number(item.precio_unitario) || 0;
      const quantity = Number(item.cantidad) || 0;
      if (item.intencion === "alquilar") {
        const days = Number(item.dias_alquilados) || 1;
        return acc + unitPrice * quantity * days;
      }
      return acc + unitPrice * quantity;
    }, 0);
  }, [products]);

  //TODO: pickupCost & subtotal passed as string but disguised by typescript
  const total = useMemo(
    () => Number(pickupCost) + Number(subtotal),
    [pickupCost, subtotal],
  );
  return {
    subtotal: formatCurrency(subtotal, "USD", 2),
    total: formatCurrency(total, "USD", 2),
    pickupCost: formatCurrency(pickupCost, "USD", 2),
  };
};
