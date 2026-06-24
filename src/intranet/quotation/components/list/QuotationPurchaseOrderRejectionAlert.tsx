import { AlertCircle } from "lucide-react";
import type { FC } from "react";
import type { Quotation } from "../../interfaces/quotation";
import { getPurchaseOrderRejectionMessage } from "../../lib/quotation-workflow";

type QuotationPurchaseOrderRejectionAlertProps = {
  quotation: Pick<
    Quotation,
    | "orden_compra_rechazada"
    | "motivo_rechazo_orden_compra"
    | "mensaje_rechazo_orden_compra"
  >;
  compact?: boolean;
};

export const QuotationPurchaseOrderRejectionAlert: FC<
  QuotationPurchaseOrderRejectionAlertProps
> = ({ quotation, compact = false }) => {
  const message = getPurchaseOrderRejectionMessage(quotation);
  if (!message) {
    return null;
  }

  if (compact) {
    return (
      <span
        className="inline-flex items-center gap-1 text-xs font-medium text-red-700"
        title={message}
      >
        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
        OC rechazada
      </span>
    );
  }

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
      <div className="flex items-start gap-2">
        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Orden de compra rechazada</p>
          <p className="mt-1 text-red-700/90">{message}</p>
        </div>
      </div>
    </div>
  );
};
