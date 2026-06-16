import { useEffect, useRef, useState, type FC } from "react";
import { ExternalLink, FileCheck2, Loader2 } from "lucide-react";
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
} from "../../api/purchase_order.api";
import { useApproveQuotation } from "../../hooks/useApproveQuotation";

type QuotationApproveOrderDialogProps = {
  quotation: Quotation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const QuotationApproveOrderDialog: FC<
  QuotationApproveOrderDialogProps
> = ({ quotation, open, onOpenChange }) => {
  const approveMutation = useApproveQuotation();
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [publicPdfUrl, setPublicPdfUrl] = useState<string | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const blobUrlRef = useRef<string | null>(null);

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
      return;
    }

    let cancelled = false;

    const loadPdf = async () => {
      setIsLoadingPdf(true);
      setPdfError(null);
      revokeBlobUrl();

      const directUrl =
        resolvePurchaseOrderPublicUrl(quotation.ordenCompra) ||
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
  }, [open, quotation.ID, quotation.ordenCompra]);

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
            <div className="flex gap-2">
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
                disabled={approveMutation.isPending || isLoadingPdf}
              >
                Aceptar orden de servicio
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogDescription>
              Se aprobará la orden de compra y se creará el proyecto con sus
              trabajos asociados. Esta acción no se puede deshacer.
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
              disabled={approveMutation.isPending}
            >
              {approveMutation.isPending ? "Aprobando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
