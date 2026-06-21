import { useEffect, useState, type FC } from "react";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
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

type QuotationEditPaymentTermsDialogProps = {
  quotation: Quotation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const QuotationEditPaymentTermsDialog: FC<
  QuotationEditPaymentTermsDialogProps
> = ({ quotation, open, onOpenChange }) => {
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
    const missingIds = plazosPago.some((plazo) => plazo.id == null);
    if (missingIds) {
      toast.error(
        "Esta cotización no tiene plazos registrados para editar.",
      );
      return;
    }

    try {
      await updateMutation.mutateAsync({
        quotationId: quotation.ID,
        plazos_pago: plazosPagoToApiBody(plazosPago),
      });
      handleOpenChange(false);
    } catch {
      /* toast handled in mutation */
    }
  };

  const isLoading = termsQuery.isLoading;
  const isError = termsQuery.isError;
  const canSave = plazosPago.every((plazo) => plazo.id != null);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Editar plazos — Cotización #{quotation.ID}
          </DialogTitle>
          <DialogDescription>
            {quotation.nombre}
          </DialogDescription>
        </DialogHeader>

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
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={() => void handleSave()}
            disabled={
              updateMutation.isPending || isLoading || isError || !canSave
            }
          >
            {updateMutation.isPending ? "Guardando..." : "Guardar plazos"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
