import { type FC } from "react";
import { Button } from "@/shared/components/ui/button";
import type { Quotation } from "../../interfaces/quotation";
import { useApproveQuotation } from "../../hooks/useApproveQuotation";
import {
  canCreateProjectFromQuotation,
  isAwaitingProjectCreation,
} from "../../lib/quotation-workflow";

type QuotationPaymentCommercialActionsProps = {
  quotation: Quotation;
  canManage: boolean;
};

export const QuotationPaymentCommercialActions: FC<
  QuotationPaymentCommercialActionsProps
> = ({ quotation, canManage }) => {
  const approveProjectMutation = useApproveQuotation();

  if (!canManage || quotation.esCotizacionIncidencia) {
    return null;
  }

  const showCreateProject =
    canCreateProjectFromQuotation(quotation) ||
    quotation.pendienteAprobacionOrden === true;

  if (!showCreateProject && !isAwaitingProjectCreation(quotation)) {
    return null;
  }

  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Crear proyecto</h3>
        <p className="text-xs text-muted-foreground mt-1">
          La cotización está aprobada internamente y en estado pendiente. Al
          crear el proyecto se confirma la orden de compra del cliente.
        </p>
      </div>

      {showCreateProject ? (
        <Button
          type="button"
          disabled={approveProjectMutation.isPending}
          onClick={() => approveProjectMutation.mutate(quotation.ID)}
        >
          {approveProjectMutation.isPending
            ? "Creando proyecto..."
            : "Crear proyecto desde orden de compra"}
        </Button>
      ) : (
        <p className="text-sm text-muted-foreground">
          Esperando que el cliente suba la orden de compra o que se registre en
          el sistema.
        </p>
      )}
    </div>
  );
};
