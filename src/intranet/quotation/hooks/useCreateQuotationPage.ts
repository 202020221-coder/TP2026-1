import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { getOrder } from "@/intranet/orders/api/order.api";
import type { DetailedOrder } from "@/intranet/orders/interfaces/order";

export const useCreateQuotationPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [orderData, setOrderData] = useState<DetailedOrder | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [isError, setIsError] = useState(false);

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

  return {
    orderId,
    orderData,
    isPending,
    isError,
  };
};
