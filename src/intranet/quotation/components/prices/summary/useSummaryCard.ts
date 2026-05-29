import { useQuotationPickupStore } from "@/intranet/quotation/hooks/stores/quotation.pickup.store.provider";
import { useQuotationProductStore } from "@/intranet/quotation/hooks/stores/quotation.products.store.provider";
import { useQuotationServiceStore } from "@/intranet/quotation/hooks/stores/quotation.services.store.provider";
import { formatCurrency } from "@/shared/lib/format-currency";
import { useMemo } from "react";

export const useSummaryCard = () => {
  const products = useQuotationProductStore((s) => s.items);
  const services = useQuotationServiceStore((s) => s.items);
  const pickupCost = useQuotationPickupStore((s) => s.pickupCost);

  const productsSubtotal = useMemo(() => {
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

  const servicesSubtotal = useMemo(() => {
    return Object.values(services).reduce((acc, item) => {
      return acc + (Number(item.unitPrice) || 0);
    }, 0);
  }, [services]);

  const total = useMemo(
    () => Number(pickupCost) + productsSubtotal + servicesSubtotal,
    [pickupCost, productsSubtotal, servicesSubtotal],
  );

  return {
    productsSubtotal: formatCurrency(productsSubtotal, "USD", 2),
    servicesSubtotal: formatCurrency(servicesSubtotal, "USD", 2),
    total: formatCurrency(total, "USD", 2),
    pickupCost: formatCurrency(pickupCost, "USD", 2),
  };
};
