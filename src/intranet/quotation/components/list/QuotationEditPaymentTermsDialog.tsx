import { useEffect, useState, type FC } from "react";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import type { Quotation } from "../../interfaces/quotation";
import { getQuotationPaymentTerms } from "../../api/quotation.api";
import { useUpdateQuotationPaymentTerms } from "../../hooks/useUpdateQuotationPaymentTerms";
import { QuotationPaymentTermsCard } from "../conditions/QuotationPaymentTermsCard";
import {
  DEFAULT_PLAZOS_PAGO,
  plazosPagoFromInstallments,
  plazosPagoToApiBody,
  updatePlazoPagoAtOrden,
  type QuotationPlazosPagoPair,
} from "../../lib/quotation-plazos-pago";
import { QuotationStatesRecord } from "../../enum/quotation-state.record";
import { getQuotationStateLabel } from "../../lib/resolve-quotation-state-display";
import { isAwaitingProjectCreation } from "../../lib/quotation-workflow";
import { canApprovePurchaseOrder } from "../../lib/can-approve-purchase-order";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { QuotationPaymentIncidentActions } from "./QuotationPaymentIncidentActions";
import { QuotationPaymentCommercialActions } from "./QuotationPaymentCommercialActions";
import { QuotationPurchaseOrderRejectionAlert } from "./QuotationPurchaseOrderRejectionAlert";

type QuotationEditPaymentTermsDialogProps = {
  quotation: Quotation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const QuotationEditPaymentTermsDialog: FC<
  QuotationEditPaymentTermsDialogProps
> = ({ quotation, open, onOpenChange }) => {
  const role = useSession((state) => state.loggedUser?.rol);
  const canManage = canApprovePurchaseOrder(role);
  const updateMutation = useUpdateQuotationPaymentTerms();
  const [plazosPago, setPlazosPago] =
    useState<QuotationPlazosPagoPair>(DEFAULT_PLAZOS_PAGO);

  const termsQuery = useQuery({
    queryKey: ["quotation", "payment-terms", quotation.ID],
    queryFn: () => getQuotationPaymentTerms(quotation.ID),
    enabled: open && quotation.ID > 0,
  });

  useEffect(() => {
    if (!open) {
      setPlazosPago(DEFAULT_PLAZOS_PAGO);
      return;
    }

    if (termsQuery.data?.plazos_pago?.length) {
      setPlazosPago(plazosPagoFromInstallments(termsQuery.data.plazos_pago));
    }
  }, [open, termsQuery.data]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (updateMutation.isPending) {
      return;
    }
    onOpenChange(nextOpen);
  };

  const handleSave = async () => {
    const installmentsToSave = plazosPagoToApiBody(plazosPago);
    const missingIds = installmentsToSave.some((plazo) => plazo.id == null);
    if (missingIds) {
      toast.error(
        "Esta cotización no tiene plazos registrados para editar.",
      );
      return;
    }

    try {
      await updateMutation.mutateAsync({
        quotationId: quotation.ID,
        plazos_pago: installmentsToSave,
      });
      handleOpenChange(false);
    } catch {
      /* toast handled in mutation */
    }
  };

  const installmentsToSave = plazosPagoToApiBody(plazosPago);
  const isLoading = termsQuery.isLoading;
  const isError = termsQuery.isError;
  const canSave =
    installmentsToSave.length > 0 &&
    installmentsToSave.every((plazo) => plazo.id != null);

  const estadoLabel = getQuotationStateLabel(quotation, role);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Plazos y pagos — Cotización #{quotation.ID}</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-2 pt-1">
              <span className="block">{quotation.nombre}</span>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{estadoLabel}</Badge>
                {isAwaitingProjectCreation(quotation) && (
                  <span className="text-xs text-muted-foreground">
                    Aprobada internamente; falta crear el proyecto con la
                    orden de compra.
                  </span>
                )}
                {quotation.estado === QuotationStatesRecord.notApproved && (
                  <span className="text-xs text-muted-foreground">
                    El cliente puede revisar y comentar. Tras la aprobación
                    interna podrá subir su orden de compra.
                  </span>
                )}
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <QuotationPurchaseOrderRejectionAlert quotation={quotation} />

        {isLoading ? (
          <div className="flex min-h-[240px] flex-col items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">Cargando plazos de pago...</p>
          </div>
        ) : isError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            No se pudieron cargar los plazos de pago de esta cotización.
          </div>
        ) : (
          <>
            {!canSave && (
              <p className="text-sm text-amber-700 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                Esta cotización no tiene plazos registrados en el sistema.
              </p>
            )}
            <QuotationPaymentTermsCard
              plazosPago={plazosPago}
              onUpdatePlazoPago={(orden, patch) =>
                setPlazosPago((current) =>
                  updatePlazoPagoAtOrden(current, orden, patch),
                )
              }
              embedded
              readOnly={!canManage}
            />

            <QuotationPaymentIncidentActions
              quotation={quotation}
              canManage={canManage}
            />
            <QuotationPaymentCommercialActions
              quotation={quotation}
              canManage={canManage}
            />
          </>
        )}

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={updateMutation.isPending}
          >
            Cerrar
          </Button>
          {canManage && (
            <Button
              type="button"
              onClick={() => void handleSave()}
              disabled={
                updateMutation.isPending || isLoading || isError || !canSave
              }
            >
              {updateMutation.isPending ? "Guardando..." : "Guardar plazos"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
