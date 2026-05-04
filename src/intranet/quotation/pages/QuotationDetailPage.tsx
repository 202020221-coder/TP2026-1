import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { getQuotation } from "../api/quotation.api";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { QuotationDetailHeader } from "../components/list/QuotationDetailHeader";
import { QuotationDetailState } from "../components/list/QuotationDetailState";
import { QuotationDetailFormCard } from "../components/list/QuotationDetailFormCard";
import { RolesRecord } from "@/security/session/enum/roles.enum";
import type { DetailedQuotation } from "../interfaces/quotation";

export function QuotationDetailsPage() {
  const user = useSession((s) => s.loggedUser);
  if (user?.rol === RolesRecord.client) {
    return <QuotationDetailsClientPage />;
  } else if (user?.rol === RolesRecord.projectAdmin) {
    return <p>PEpe</p>;
  } else {
    throw new Error(`Content not defined for user:  ${user?.rol}`);
  }
}

const QuotationDetailsClientPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const user = useSession((s) => s.loggedUser);
  const quotationId = Number(params["quotationId"]);
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["quotation", "details", quotationId],
    queryFn: () => getQuotation(quotationId, { dni: user?.dni_perfil }),
  });
  if (isError) {
    return (
      <QuotationDetailState
        message={error.message}
        onBack={() => navigate("/intranet/cotizaciones")}
      />
    );
  }
  return (
    <div className="p-8 space-y-6">
      <QuotationDetailHeader
        onBack={() => navigate("/intranet/cotizaciones")}
      />
      <QuotationDetailFormCard
        isPending={isPending}
        quotation={data as DetailedQuotation}
      />
    </div>
  );
};
