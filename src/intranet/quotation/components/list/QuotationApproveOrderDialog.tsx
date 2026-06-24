import { useEffect, useRef, useState, type FC } from "react";
import { CircleDollarSign, ExternalLink, FileCheck2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { formatCurrency } from "@/shared/lib/format-currency";
import type { Quotation } from "../../interfaces/quotation";
import {
  fetchPurchaseOrderBlobUrl,
  getPurchaseOrderJsonUrl,
  resolvePurchaseOrderPublicUrl,
  checkPurchaseOrderExists,
} from "../../api/purchase_order.api";
import { useApproveQuotation } from "../../hooks/useApproveQuotation";
import { useQuotationPaymentTerms } from "../../hooks/useQuotationPaymentTerms";
import { getInitialPaymentAmount, getInitialPaymentPercentage } from "../../lib/quotation-initial-payment";
import { canRejectPurchaseOrder } from "../../lib/can-reject-purchase-order";
import { hasPurchaseOrderUploaded } from "../../lib/quotation-workflow";
import { RejectPurchaseOrderDialog } from "./RejectPurchaseOrderDialog";
import { useSession } from "@/security/session/hooks/stores/useSession.store";

type QuotationApproveOrderDialogProps = {
  quotation: Quotation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const QuotationApproveOrderDialog: FC<
  QuotationApproveOrderDialogProps
> = ({ quotation, open, onOpenChange }) => {
  const role = useSession((state) => state.loggedUser?.rol);
  const approveMutation = useApproveQuotation();
  const { terms, isLoading: isLoadingPaymentTerms } = useQuotationPaymentTerms(
    quotation.ID,
    { enabled: open },
  );
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [publicPdfUrl, setPublicPdfUrl] = useState<string | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const blobUrlRef = useRef<string | null>(null);
  const isCommercial = quotation.esCotizacionIncidencia !== true;
  const metadataIndicatesOc = hasPurchaseOrderUploaded(quotation);
  const showRejectAction =
    canRejectPurchaseOrder(role, quotation) ||
    Boolean(pdfError && metadataIndicatesOc && isCommercial);

  const revokeBlobUrl = () => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  };

  useEffect(() => {
    if (!open) {
      revokeBlobUrl();
      setPdfPreviewUrl(null);
      setPublicPdfUrl(null);
      setPdfError(null);
      setConfirmOpen(false);
      setRejectOpen(false);
      return;
    }

    let cancelled = false;

    const loadPdf = async () => {
      setIsLoadingPdf(true);
      setPdfError(null);
      revokeBlobUrl();

      const ocCheck = await checkPurchaseOrderExists(quotation.ID, {
        context: isCommercial ? "commercial" : "incident",
        metadataIndicatesOc,
      }).catch(() => null);

      if (cancelled) {
        return;
      }

      if (ocCheck && !ocCheck.exists) {
        setPdfError(ocCheck.message);
        setIsLoadingPdf(false);
        return;
      }

      const directUrl =
        resolvePurchaseOrderPublicUrl(quotation.ordenCompra) ||
        ocCheck?.url ||
        (await getPurchaseOrderJsonUrl(quotation.ID));

      if (!cancelled && directUrl) {
        setPublicPdfUrl(directUrl);
      }

      try {
        const blobUrl = await fetchPurchaseOrderBlobUrl(quotation.ID);
        if (cancelled) {
          URL.revokeObjectURL(blobUrl);
          return;
        }
        blobUrlRef.current = blobUrl;
        setPdfPreviewUrl(blobUrl);
      } catch {
        if (!cancelled) {
          if (directUrl) {
            setPdfPreviewUrl(directUrl);
          } else if (isCommercial && metadataIndicatesOc) {
            setPdfError(
              "El archivo de la orden de compra no está disponible o está dañado. Puede rechazarla para que el cliente envíe una nueva.",
            );
          } else if (isCommercial) {
            setPdfError(
              "No se encontró la orden de compra registrada para esta cotización comercial.",
            );
          } else {
            setPdfError("No se pudo cargar el PDF de la orden de compra.");
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoadingPdf(false);
        }
      }
    };

    void loadPdf();

    return () => {
      cancelled = true;
    };
  }, [open, quotation.ID, quotation.ordenCompra, isCommercial, metadataIndicatesOc]);

  useEffect(() => () => revokeBlobUrl(), []);

  const handleOpenChange = (nextOpen: boolean) => {
    if (approveMutation.isPending) {
      return;
    }
    onOpenChange(nextOpen);
  };

  const handleConfirmApprove = async () => {
    try {
      await approveMutation.mutateAsync(quotation.ID);
      setConfirmOpen(false);
      handleOpenChange(false);
    } catch {
      setConfirmOpen(false);
    }
  };

  const openInNewTab = () => {
    const url = publicPdfUrl ?? pdfPreviewUrl;
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const requiresInitialPaymentConfirmation =
    terms?.requiere_confirmacion_pago_inicial ?? false;
  const initialPaymentPercentage = getInitialPaymentPercentage(terms);
  const initialPaymentAmount = getInitialPaymentAmount(
    quotation.precioTotal,
    terms,
  );
  const initialPaymentLabel =
    initialPaymentAmount != null
      ? formatCurrency(initialPaymentAmount, "PEN", 2)
      : "—";

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Revisar orden de compra — Cotización #{quotation.ID}
            </DialogTitle>
            <DialogDescription className="space-y-1 pt-1">
              <span className="block font-medium text-foreground">
                {quotation.nombre}
              </span>
              {quotation.nombreCliente && (
                <span className="block">Cliente: {quotation.nombreCliente}</span>
              )}
              <span className="block">
                Total: {formatCurrency(quotation.precioTotal, "PEN", 2)}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-[320px] rounded-lg border bg-muted/30 overflow-hidden">
            {isLoadingPdf ? (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-sm">Cargando PDF...</p>
              </div>
            ) : pdfError ? (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-2 p-6 text-center text-muted-foreground">
                <FileCheck2 className="h-10 w-10" />
                <p className="text-sm">{pdfError}</p>
              </div>
            ) : pdfPreviewUrl ? (
              <iframe
                title={`Orden de compra cotización ${quotation.ID}`}
                src={pdfPreviewUrl}
                className="h-[min(55vh,480px)] w-full bg-white"
              />
            ) : null}
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={openInNewTab}
              disabled={!pdfPreviewUrl && !publicPdfUrl}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Abrir en nueva pestaña
            </Button>
            <div className="flex flex-wrap gap-2">
              {showRejectAction && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setRejectOpen(true)}
                  disabled={approveMutation.isPending || isLoadingPdf}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Rechazar orden de compra
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={approveMutation.isPending}
              >
                Cerrar
              </Button>
              <Button
                type="button"
                onClick={() => setConfirmOpen(true)}
                disabled={
                  approveMutation.isPending ||
                  isLoadingPdf ||
                  (Boolean(pdfError) && !pdfPreviewUrl)
                }
              >
                Aceptar orden de servicio
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <RejectPurchaseOrderDialog
        quotationId={quotation.ID}
        quotationName={quotation.nombre}
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        onRejected={() => handleOpenChange(false)}
      />

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-3 text-sm text-muted-foreground">
                {requiresInitialPaymentConfirmation && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50/80 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-amber-800">
                      <CircleDollarSign className="h-5 w-5 shrink-0" />
                      <span className="text-sm font-semibold">
                        Confirmación de pago inicial
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-amber-950/90">
                      ¿La persona ha pagado el{" "}
                      <span className="inline-flex items-center rounded-full border border-amber-300 bg-white px-2 py-0.5 text-sm font-bold text-amber-700">
                        {initialPaymentPercentage != null
                          ? `${initialPaymentPercentage}%`
                          : "—"}
                      </span>{" "}
                      de la cotización ya?
                    </p>
                    <div className="flex items-center justify-between rounded-md border border-amber-200 bg-white px-4 py-3">
                      <span className="text-sm text-muted-foreground">
                        Pago inicial
                      </span>
                      <span className="text-lg font-bold text-amber-700">
                        {initialPaymentLabel}
                      </span>
                    </div>
                  </div>
                )}
                <p>
                  La cotización está en estado pendiente (aprobada internamente).
                  Se creará el proyecto con sus trabajos asociados. Esta acción no
                  se puede deshacer.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={approveMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => void handleConfirmApprove()}
              disabled={
                approveMutation.isPending ||
                (requiresInitialPaymentConfirmation && isLoadingPaymentTerms)
              }
            >
              {approveMutation.isPending
                ? "Aprobando..."
                : requiresInitialPaymentConfirmation && isLoadingPaymentTerms
                  ? "Cargando..."
                  : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
