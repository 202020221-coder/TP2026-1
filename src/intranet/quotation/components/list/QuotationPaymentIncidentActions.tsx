import { useRef, useState, type FC } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FileCheck2, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import type { Quotation } from "../../interfaces/quotation";
import {
  checkPurchaseOrderExists,
  parsePurchaseOrderFileName,
  storePurchaseOrderFileName,
  uploadPurchaseOrder,
} from "../../api/purchase_order.api";
import { usePayIncidentQuotation } from "../../hooks/usePayIncidentQuotation";
import { useApproveQuotation } from "../../hooks/useApproveQuotation";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { canRejectPurchaseOrder } from "../../lib/can-reject-purchase-order";
import { RejectPurchaseOrderDialog } from "./RejectPurchaseOrderDialog";
import {
  canCreateProjectFromQuotation,
  canPayIncidentQuotation,
  hasPurchaseOrderUploaded,
  isAwaitingProjectCreation,
} from "../../lib/quotation-workflow";
import { QuotationStatesRecord } from "../../enum/quotation-state.record";

type QuotationPaymentIncidentActionsProps = {
  quotation: Quotation;
  canManage: boolean;
};

export const QuotationPaymentIncidentActions: FC<
  QuotationPaymentIncidentActionsProps
> = ({ quotation, canManage }) => {
  const role = useSession((state) => state.loggedUser?.rol);
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const payIncidentMutation = usePayIncidentQuotation();
  const approveProjectMutation = useApproveQuotation();
  const showRejectAction = canRejectPurchaseOrder(role, quotation);

  const ocQuery = useQuery({
    queryKey: ["quotation", "orden-compra-check", quotation.ID, "incident"],
    queryFn: () =>
      checkPurchaseOrderExists(quotation.ID, {
        context: "incident",
        metadataIndicatesOc: hasPurchaseOrderUploaded(quotation),
      }),
    enabled: canManage && quotation.esCotizacionIncidencia === true,
  });

  if (!canManage || !quotation.esCotizacionIncidencia) {
    return null;
  }

  const ocExists =
    hasPurchaseOrderUploaded(quotation) ||
    ocQuery.data?.availability === "available";
  const ocMessage =
    ocQuery.data?.message || "No existe orden de compra";

  const handleUpload = async (file: File) => {
    if (!/\.pdf$/i.test(file.name) && file.type !== "application/pdf") {
      toast.error("Solo se permiten archivos PDF.");
      return;
    }

    setIsUploading(true);
    try {
      const response = await uploadPurchaseOrder(quotation.ID, file);
      if (response?.ruta) {
        storePurchaseOrderFileName(
          quotation.ID,
          parsePurchaseOrderFileName(response.ruta),
        );
      }
      await queryClient.invalidateQueries({ queryKey: ["quotations"] });
      await queryClient.invalidateQueries({
        queryKey: ["quotation", "orden-compra-check", quotation.ID],
      });
      toast.success("Orden de compra subida correctamente.");
    } catch {
      toast.error("Error al subir la orden de compra.");
    } finally {
      setIsUploading(false);
    }
  };

  const showPayIncident = canPayIncidentQuotation(quotation);
  const showCreateProject =
    canCreateProjectFromQuotation(quotation) ||
    (isAwaitingProjectCreation(quotation) &&
      quotation.aprobado === "YES" &&
      ocExists);

  return (
    <>
    <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">
          Orden de compra (incidencia)
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Opcional para incidencias. Requerida solo si desea crear un proyecto.
        </p>
      </div>

      {ocQuery.isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Verificando orden de compra...
        </div>
      ) : ocExists ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-emerald-700">
            <FileCheck2 className="h-4 w-4" />
            Orden de compra registrada
          </div>
          {showRejectAction && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-destructive border-destructive/40 hover:bg-destructive/5"
              onClick={() => setRejectOpen(true)}
            >
              Rechazar orden de compra
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{ocMessage}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void handleUpload(file);
              }
              event.currentTarget.value = "";
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="mr-2 h-4 w-4" />
            )}
            Subir orden de compra
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {showPayIncident && (
          <Button
            type="button"
            variant="secondary"
            disabled={payIncidentMutation.isPending}
            onClick={() => payIncidentMutation.mutate(quotation.ID)}
          >
            {payIncidentMutation.isPending
              ? "Procesando..."
              : "Dar como pagado y finalizado"}
          </Button>
        )}

        {showCreateProject &&
          quotation.estado !== QuotationStatesRecord.incidentPaid && (
            <Button
              type="button"
              disabled={approveProjectMutation.isPending || !ocExists}
              onClick={() => approveProjectMutation.mutate(quotation.ID)}
            >
              {approveProjectMutation.isPending
                ? "Creando proyecto..."
                : "Crear proyecto"}
            </Button>
          )}
      </div>

      {showCreateProject && !ocExists && (
        <p className="text-xs text-amber-700">
          Para crear el proyecto debe subir primero la orden de compra.
        </p>
      )}
    </div>
    <RejectPurchaseOrderDialog
      quotationId={quotation.ID}
      quotationName={quotation.nombre}
      open={rejectOpen}
      onOpenChange={setRejectOpen}
      onRejected={() => {
        void queryClient.invalidateQueries({
          queryKey: ["quotation", "orden-compra-check", quotation.ID],
        });
      }}
    />
    </>
  );
};
