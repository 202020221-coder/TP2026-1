import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { RolesRecord } from "@/security/session/enum/roles.enum";
import { getQuotation } from "../api/quotation.api";
import { QuotationDetailSidePanel } from "../components/negotiation/QuotationDetailSidePanel";
import { NegotiationChatPanel } from "../components/negotiation/NegotiationChatPanel";
import { QuotationDetailState } from "../components/list/QuotationDetailState";
import type { NegotiationAuthorRole } from "../interfaces/negotiation-message";
import { canNegotiateQuotation } from "../lib/can-negotiate-quotation";

export function QuotationNegotiationChatPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = useSession((state) => state.loggedUser);
  const quotationId = Number(searchParams.get("quotationId"));

  const goBack = () => navigate("/intranet/cotizaciones");

  const roleContext = useMemo(() => {
    if (user?.rol === RolesRecord.client) {
      return {
        currentUserRole: RolesRecord.client as NegotiationAuthorRole,
        currentUserName: user.correo ?? "Cliente",
        counterpartyName: "Asistente de Proyectos",
      };
    }
    if (user?.rol === RolesRecord.projectAdmin) {
      return {
        currentUserRole: RolesRecord.projectAdmin as NegotiationAuthorRole,
        currentUserName: "Asistente de Proyectos",
        counterpartyName: "Cliente",
      };
    }
    return null;
  }, [user]);

  const quotationQuery = useQuery({
    queryKey: ["quotation", "negotiation", quotationId],
    queryFn: () => getQuotation(quotationId),
    enabled: Number.isFinite(quotationId) && quotationId > 0,
  });

  if (!Number.isFinite(quotationId) || quotationId <= 0) {
    return (
      <QuotationDetailState
        message="No se encontró la cotización indicada."
        onBack={goBack}
      />
    );
  }

  if (!roleContext) {
    return (
      <QuotationDetailState
        message="Su rol no tiene acceso al chat de negociación."
        onBack={goBack}
      />
    );
  }

  if (quotationQuery.isError) {
    return (
      <QuotationDetailState
        message={quotationQuery.error.message}
        onBack={goBack}
      />
    );
  }

  if (quotationQuery.isPending) {
    return <NegotiationPageSkeleton onBack={goBack} />;
  }

  if (!canNegotiateQuotation(quotationQuery.data, user?.rol)) {
    return (
      <QuotationDetailState
        message="Esta cotización no está disponible para negociación en su estado actual."
        onBack={goBack}
      />
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] min-h-0 flex-col gap-4 p-6">
      <div className="flex shrink-0 items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Chat de negociación
          </h1>
          <p className="text-sm text-gray-500">
            Intercambie observaciones sobre la cotización con{" "}
            {roleContext.counterpartyName.toLowerCase()}.
          </p>
        </div>
        <Button variant="outline" onClick={goBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Regresar
        </Button>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px]">
        <QuotationDetailSidePanel quotation={quotationQuery.data} />
        <NegotiationChatPanel
          quotationId={quotationId}
          currentUserRole={roleContext.currentUserRole}
          currentUserName={roleContext.currentUserName}
          counterpartyName={roleContext.counterpartyName}
          onClose={goBack}
        />
      </div>
    </div>
  );
}

function NegotiationPageSkeleton({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-64" />
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Regresar
        </Button>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[1fr_420px]">
        <Skeleton className="h-full rounded-2xl" />
        <Skeleton className="h-full rounded-2xl" />
      </div>
    </div>
  );
}
