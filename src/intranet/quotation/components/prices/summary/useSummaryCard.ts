import { useQuotationExchangeRate } from "@/intranet/quotation/hooks/stores/quotation.exchange.rate.store.provider";
import { useQuotationPickupStore } from "@/intranet/quotation/hooks/stores/quotation.pickup.store.provider";
import { useQuotationProductStore } from "@/intranet/quotation/hooks/stores/quotation.products.store.provider";
import { formatCurrency } from "@/shared/lib/format-currency";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import type { ExchangeRate } from "@/intranet/quotation/api/exchange-rate.api";

export const useSummaryCard = (rateQueryFn?: () => Promise<ExchangeRate>) => {
  const products = useQuotationProductStore((s) => s.items);
  const pickupCost = useQuotationPickupStore((s) => s.pickupCost);
  const exchangeRate = useQuotationExchangeRate((s) => s.rate);
  const initializeRate = useQuotationExchangeRate((s) => s.initialize);
  const rateInitialized = useQuotationExchangeRate((s) => s.initialized);
  const rateQuery = useQuery({
    initialData: exchangeRate,
    queryKey: ["exchange", "rate"],
    queryFn: rateQueryFn,
    enabled: !exchangeRate,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (rateQuery.data && !rateInitialized) {
      initializeRate(rateQuery.data);
    }
  }, [rateQuery.data]);

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
    rateQuery,
  };
};
