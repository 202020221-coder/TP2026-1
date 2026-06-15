import { useQuotationPickupStore } from "@/intranet/quotation/hooks/stores/quotation.pickup.store.provider";
import { useQuotationProductStore } from "@/intranet/quotation/hooks/stores/quotation.products.store.provider";
import { useQuotationServiceStore } from "@/intranet/quotation/hooks/stores/quotation.services.store.provider";
import { useQuotationReferenceStore } from "@/intranet/quotation/hooks/stores/quotation.reference.store.provider";
import {
  computeServiceCost,
  computeServiceDates,
} from "@/intranet/quotation/lib/quotationSchedule";
import { formatCurrency } from "@/shared/lib/format-currency";
import { useMemo } from "react";

export const useSummaryCard = () => {
  const products = useQuotationProductStore((s) => s.items);
  const services = useQuotationServiceStore((s) => s.items);
  const pickupCost = useQuotationPickupStore((s) => s.pickupCost);
  const phases = useQuotationReferenceStore((s) => s.phases);
  const projectStartDate = useQuotationReferenceStore(
    (s) => s.projectStartDate,
  );

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

  // Pago por servicio: si pago_por_dia es true → precio × días en que ocurre el
  // servicio; si no → solo el precio comercial.
  const servicesSubtotal = useMemo(() => {
    return Object.values(services).reduce((acc, item) => {
      const { days } = computeServiceDates(item, projectStartDate, phases);
      return acc + computeServiceCost(item, days);
    }, 0);
  }, [services, projectStartDate, phases]);

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
