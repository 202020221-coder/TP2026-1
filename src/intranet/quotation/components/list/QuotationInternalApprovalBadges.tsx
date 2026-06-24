import type { FC } from "react";
import type { Quotation } from "../interfaces/quotation";

type QuotationInternalApprovalBadgesProps = {
  quotation: Pick<
    Quotation,
    | "esCotizacionIncidencia"
    | "aprobado_por_abogado"
    | "aprobado_por_gerente"
    | "requiere_aprobacion_abogado"
    | "requiere_aprobacion_gerente"
  >;
  viewingUnapproved: boolean;
};

const badgeClass = (approved: boolean) =>
  approved
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : "bg-amber-50 text-amber-800 border-amber-200";

export const QuotationInternalApprovalBadges: FC<
  QuotationInternalApprovalBadgesProps
> = ({ quotation, viewingUnapproved }) => {
  if (!viewingUnapproved || !quotation.esCotizacionIncidencia) {
    return null;
  }

  return (
    <div className="mt-1 flex flex-wrap justify-center gap-1">
      <span
        className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${badgeClass(quotation.aprobado_por_abogado === "YES")}`}
      >
        Abogado: {quotation.aprobado_por_abogado === "YES" ? "OK" : "Pendiente"}
      </span>
      <span
        className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${badgeClass(quotation.aprobado_por_gerente === "YES")}`}
      >
        Gerente: {quotation.aprobado_por_gerente === "YES" ? "OK" : "Pendiente"}
      </span>
    </div>
  );
};
