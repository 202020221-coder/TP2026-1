import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getQuotationForAdmin, type AdminQuotationDetailsData } from "../api/quotation.api";

export const useViewQuotationPage = () => {
  const { quotationId } = useParams<{ quotationId: string }>();
  const [data, setData] = useState<AdminQuotationDetailsData | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!quotationId) return;

    let mounted = true;
    setIsPending(true);
    setIsError(false);

    getQuotationForAdmin(Number(quotationId))
      .then((data) => {
        if (mounted) {
          setData(data);
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
  }, [quotationId]);

  return {
    quotationId: quotationId,
    data,
    isPending,
    isError,
  };
};
