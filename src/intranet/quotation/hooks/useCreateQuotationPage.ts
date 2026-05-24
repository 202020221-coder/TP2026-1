import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { getOrder } from "@/intranet/orders/api/order.api";
import { getExchangeRate } from "@/intranet/quotation/api/exchange-rate.api";
import type { DetailedOrder } from "@/intranet/orders/interfaces/order";
import type { ExchangeRate } from "@/intranet/quotation/api/exchange-rate.api";

export const useCreateQuotationPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [orderData, setOrderData] = useState<DetailedOrder | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [isError, setIsError] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | undefined>();

  useEffect(() => {
    if (!orderId) return;

    let mounted = true;
    setIsPending(true);
    setIsError(false);

    getOrder(Number(orderId))
      .then((data) => {
        if (mounted) {
          setOrderData(data);
          setIsPending(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setIsError(true);
          setIsPending(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [orderId]);

  useEffect(() => {
    getExchangeRate()
      .then((rate) => setExchangeRate(rate))
      .catch(() => {
        // rate stays undefined, VisualizeTrigger bloquea
      });
  }, []);

  return {
    orderId,
    orderData,
    exchangeRate,
    isPending,
    isError,
  };
};
