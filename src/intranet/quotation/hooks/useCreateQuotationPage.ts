import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getOrder } from "@/intranet/orders/api/order.api";
import { getExchangeRate } from "@/intranet/quotation/api/exchange-rate.api";

const STALE_TIME = Infinity;

export const useCreateQuotationPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const enabled = !!orderId;

  const orderQuery = useQuery({
    queryKey: ["order", "details", orderId],
    queryFn: () => getOrder(Number(orderId)),
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false,
    enabled,
  });

  const rateQuery = useQuery({
    queryKey: ["exchange-rate"],
    queryFn: () => getExchangeRate(),
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false,
    enabled,
  });

  return {
    orderId,
    orderData: orderQuery.data ?? null,
    exchangeRate: rateQuery.data,
    isPending: orderQuery.isPending || rateQuery.isPending,
    isError: orderQuery.isError || rateQuery.isError,
  };
};
