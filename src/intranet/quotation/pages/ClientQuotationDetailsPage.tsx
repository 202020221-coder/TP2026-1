import { useNavigate, useParams } from "react-router";
import { QuotationDetailState } from "../components/list/QuotationDetailState";
import { useQuery } from "@tanstack/react-query";
import { getQuotation } from "../api/quotation.api";
import { QuotationDetailHeader } from "../components/list/QuotationDetailHeader";
import { QuotationDetailFormCard } from "../components/list/QuotationDetailFormCard";
import type { FC } from "react";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function QuotationDetailsClientPage() {
  const navigate = useNavigate();
  const params = useParams();
  const quotationId = Number(params["quotationId"]);
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["quotation", "details", quotationId],
    queryFn: () => getQuotation(quotationId),
  });
  if (isError) {
    return (
      <QuotationDetailState
        message={error.message}
        onBack={() => navigate("/intranet/cotizaciones")}
      />
    );
  }
  if (isPending) {
    return <CardSkeleton />;
  }
  return (
    <div className="p-8 space-y-6">
      <QuotationDetailHeader
        onBack={() => navigate("/intranet/cotizaciones")}
      />
      <QuotationDetailFormCard quotation={data} />
    </div>
  );
}

const CardSkeleton: FC = () => {
  return (
    <Card className="border shadow-none">
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
