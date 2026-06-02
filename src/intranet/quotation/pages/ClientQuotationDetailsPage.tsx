import { useNavigate, useParams } from "react-router";
import { QuotationDetailState } from "../components/list/QuotationDetailState";
import { QuotationDetailHeader } from "../components/list/QuotationDetailHeader";
import { QuotationDetailFormCard } from "../components/list/QuotationDetailFormCard";
import type { FC } from "react";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { NegotiationChatFloating } from "../components/negotiation/NegotiationChatFloating";
import { useViewQuotationPage } from "../hooks/useViewQuotationPage";

export function ClientQuotationDetailsPage() {
  const navigate = useNavigate();
  const params = useParams();
  const quotationId = Number(params["quotationId"]);
  const { data, isPending, isError } = useViewQuotationPage()
  if (isError) {
    return (
      <QuotationDetailState
        message={"hubo un error"}
        onBack={() => navigate("/intranet/cotizaciones")}
      />
    );
  }
  if (isPending) {
    return <PageSkeleton />;
  }
  return (
    <div className="p-8 space-y-6">
      <QuotationDetailHeader
        onBack={() => navigate("/intranet/cotizaciones")}
      />
      <QuotationDetailFormCard quotation={data!} />

      <NegotiationChatFloating
        quotationId={quotationId}
        quotationEstado={data!.status}
      />
    </div>
  );
}

const PageSkeleton: FC = () => {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="space-y-6">
        {/* Title & Status */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>

        {/* Products card */}
        <Card className="border bg-card shadow-none">
          <CardHeader className="pb-0">
            <div className="flex flex-row items-end gap-x-1.5 mx-auto sm:mx-0">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-40" />
            </div>
            <Skeleton className="h-4 w-56 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border border-border">
              <div className="p-4 space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Truck card */}
        <Card className="border bg-card shadow-none">
          <CardHeader className="pb-3">
            <div className="flex flex-row items-end gap-x-1.5 mx-auto sm:mx-0">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-36" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full rounded-lg" />
          </CardContent>
        </Card>

        {/* Pickup card */}
        <Card className="border bg-card shadow-none">
          <CardHeader className="pb-0">
            <div className="flex flex-row items-end gap-x-1.5 mx-auto sm:mx-0">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-4 w-48 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex-2 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conditions card */}
        <Card className="border bg-card shadow-none">
          <CardHeader className="pb-0">
            <div className="flex flex-row items-end gap-x-1.5 mx-auto sm:mx-0">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-28" />
            </div>
            <Skeleton className="h-4 w-40 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exchange Rate card */}
        <Card className="border bg-card shadow-none">
          <CardHeader className="pb-0">
            <div className="flex flex-row items-end gap-x-1.5 mx-auto sm:mx-0">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-4 w-52 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-14 w-full rounded-lg" />
          </CardContent>
        </Card>

        {/* Summary card */}
        <Card className="border bg-card shadow-none">
          <CardHeader className="pb-0">
            <div className="flex flex-row items-end gap-x-1.5 mx-auto sm:mx-0">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-36" />
            </div>
            <Skeleton className="h-4 w-32 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-14 w-full rounded-lg" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              <Skeleton className="h-px w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
