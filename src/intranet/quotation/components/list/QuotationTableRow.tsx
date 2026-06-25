import { useState, type FC } from "react";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Eye, Mail, Pencil, Trash2, Send, Calculator, FileCheck2, CalendarClock, ShieldCheck, FileStack } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { useNavigate } from "react-router";
import type { Quotation } from "../../interfaces/quotation";
import {
  QuotationStatesRecord,
} from "../../enum/quotation-state.record";
import {
  getQuotationStateBadgeClass,
  getQuotationStateLabel,
} from "../../lib/resolve-quotation-state-display";
import { resolveQuotationDisplayState } from "../../lib/client-quotation-state";
import QuotationRejectionMessageDialog from "./QuotationRejectionMessageDialog";
import { QuotationChatStatusCell } from "./QuotationChatStatusCell";
import { QuotationPaymentTermsCells } from "./QuotationPaymentTermsCells";
import { RolesRecord } from "@/security/session/enum/roles.enum";
import { formatPEDate } from "@/shared/lib/format-date";
import { formatCurrency } from "@/shared/lib/format-currency";
import { canNegotiateQuotation } from "../../lib/can-negotiate-quotation";
import {
  canApprovePurchaseOrder,
  hasPendingPurchaseOrderApproval,
} from "../../lib/can-approve-purchase-order";
import { canApproveInternally } from "../../lib/can-approve-internally";
import { useApproveQuotationInternally } from "../../hooks/useApproveQuotationInternally";
import { canClientUploadPurchaseOrder } from "../../lib/quotation-workflow";
import { getOriginalQuotation } from "../../api/quotation.api";
import { toast } from "sonner";
import { QuotationPurchaseOrderRejectionAlert } from "./QuotationPurchaseOrderRejectionAlert";
import { QuotationInternalApprovalBadges } from "./QuotationInternalApprovalBadges";
import {
  canEditCommercialQuotation,
  canEditIncidentQuotation,
} from "../../lib/can-edit-quotation";

export const QuotationTableRow: FC<{
  quotation: Quotation;
  viewingUnapproved: boolean;
  onOpenPresupuesto: (quotation: Quotation) => void;
  onReviewPurchaseOrder: (quotation: Quotation) => void;
  onUploadPurchaseOrder: (quotationId: number) => void;
  onEditPaymentTerms: (quotation: Quotation) => void;
}> = ({
  quotation,
  viewingUnapproved,
  onOpenPresupuesto,
  onReviewPurchaseOrder,
  onUploadPurchaseOrder,
  onEditPaymentTerms,
}) => {
  const user = useSession((state) => state.loggedUser);
  const Navigate = useNavigate();
  const [rejectionMsgModalOpen, setRejectionMsgModalOpen] = useState(false);
  const [isLoadingOriginal, setIsLoadingOriginal] = useState(false);
  const approveInternallyMutation = useApproveQuotationInternally();

  const handleModalSend = () => {
    onUploadPurchaseOrder(quotation.ID);
  };

  const handleNavigateDetails = () => {
    Navigate(`/intranet/cotizaciones/detalles/${quotation.ID}`);
  };

  const handleNavigateEdit = () => {
    Navigate(`/intranet/cotizaciones/editar/${quotation.ID}`);
  };

  const handleNegotiateClick = () => {
    if (user?.rol === RolesRecord.client) {
      handleNavigateDetails();
    } else {
      handleNavigateEdit();
    }
  };

  const canNegotiate = canNegotiateQuotation(quotation, user?.rol);
  const showApproveOrderAction =
    canApprovePurchaseOrder(user?.rol) &&
    hasPendingPurchaseOrderApproval(quotation);
  const showApproveInternallyAction = canApproveInternally(
    user?.rol,
    quotation,
    viewingUnapproved,
  );

  const handleApproveInternally = () => {
    approveInternallyMutation.mutate(quotation.ID);
  };

  const handleViewOriginalQuotation = async () => {
    setIsLoadingOriginal(true);
    try {
      const result = await getOriginalQuotation(quotation.ID);
      Navigate(
        `/intranet/cotizaciones/detalles/${result.id_cotizacion_original}`,
        {
          state: {
            returnTo: "/intranet/cotizaciones",
            proyectoNombre: result.proyecto_nombre,
          },
        },
      );
    } catch {
      toast.error("No se pudo cargar la cotización original del proyecto.");
    } finally {
      setIsLoadingOriginal(false);
    }
  };

  const showLawyerEdit = canEditIncidentQuotation(user?.rol, quotation);

  const showCommercialEdit = canEditCommercialQuotation(user?.rol, quotation);

  const showOriginalQuotationAction =
    user?.rol === RolesRecord.lawyer &&
    quotation.esCotizacionIncidencia === true;

  const showClientUploadOc = canClientUploadPurchaseOrder(quotation);
  const displayEstado = resolveQuotationDisplayState(quotation, user?.rol);
  return (
    <>
      <TableRow className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <TableCell className="font-medium py-3">{quotation.ID}</TableCell>
        <TableCell className="font-medium py-3">
          {quotation.nombre}
        </TableCell>
        <TableCell className="text-gray-700">{quotation.version}</TableCell>
        <TableCell className="text-gray-700">
          {formatPEDate(quotation.condiciones.fechaEmision)}
        </TableCell>
        <TableCell className="text-gray-700">
          {formatPEDate(quotation.condiciones.fechaVigencia)}
        </TableCell>
        <TableCell className="font-medium py-3">
          {formatCurrency(quotation.precioTotal, "PEN", 2)}
        </TableCell>
        <QuotationPaymentTermsCells quotationId={quotation.ID} />
        <TableCell className="">
          <div className="flex flex-col items-center gap-1">
          <Badge
            className={`block mx-auto rounded-full px-3 py-1 text-[14px] font-medium border ${getQuotationStateBadgeClass(
              displayEstado,
              user?.rol,
            )}`}
          >
            {getQuotationStateLabel(quotation, user?.rol)}
          </Badge>
          {user?.rol === RolesRecord.client && (
            <QuotationPurchaseOrderRejectionAlert
              quotation={quotation}
              compact
            />
          )}
          <QuotationInternalApprovalBadges
            quotation={quotation}
            viewingUnapproved={viewingUnapproved}
          />
          </div>
        </TableCell>

        <TableCell>
          <div className="flex justify-center items-center gap-2">
            {(user?.rol === RolesRecord.projectAdmin ||
              user?.rol === RolesRecord.manager) && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-full aspect-square text-teal-600 hover:border hover:border-teal-600 hover:text-teal-700 transition-colors hover:bg-teal-50"
                      onClick={() => onEditPaymentTerms(quotation)}
                    >
                      <CalendarClock className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    className="bg-white border-[1.5px] border-teal-600 text-teal-600 font-normal text-center"
                    align="center"
                  >
                    Editar plazos y pagos
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-full aspect-square text-green-600 hover:border hover:border-green-600 hover:text-green-700 transition-colors hover:bg-green-50"
                      onClick={() => onOpenPresupuesto(quotation)}
                    >
                      <Calculator className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    className="bg-white border-[1.5px] border-green-600 text-green-600 font-normal text-center"
                    align="center"
                  >
                    Presupuesto
                  </TooltipContent>
                </Tooltip>
              </>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-full aspect-square text-blue-500 hover:border hover:border-blue-500 hover:text-blue-600 transition-colors hover:bg-blue-50"
                  onClick={() => handleNavigateDetails()}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                className="bg-white border-[1.5px] border-blue-500 text-blue-500 font-normal text-center"
                align="center"
              >
                Ver Cotizacion
              </TooltipContent>
            </Tooltip>

            {showApproveInternallyAction && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-full aspect-square text-emerald-600 hover:border hover:border-emerald-600 hover:text-emerald-700 transition-colors hover:bg-emerald-50"
                    onClick={handleApproveInternally}
                    disabled={approveInternallyMutation.isPending}
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  className="bg-white border-[1.5px] border-emerald-600 text-emerald-600 font-normal text-center"
                  align="center"
                >
                  Aprobar cotización
                </TooltipContent>
              </Tooltip>
            )}

            {showOriginalQuotationAction && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-full aspect-square text-slate-600 hover:border hover:border-slate-600 hover:text-slate-700 transition-colors hover:bg-slate-50"
                    onClick={() => void handleViewOriginalQuotation()}
                    disabled={isLoadingOriginal}
                  >
                    <FileStack className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  className="bg-white border-[1.5px] border-slate-600 text-slate-600 font-normal text-center"
                  align="center"
                >
                  Cotización original
                </TooltipContent>
              </Tooltip>
            )}

            {showLawyerEdit && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-full aspect-square text-amber-500 hover:border hover:border-amber-500 hover:text-amber-600 transition-colors hover:bg-amber-50"
                    onClick={handleNavigateEdit}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  className="bg-white border-[1.5px] border-amber-500 text-amber-500 font-normal text-center"
                  align="center"
                >
                  Editar cotización de incidencia
                </TooltipContent>
              </Tooltip>
            )}

            {showApproveOrderAction && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-full aspect-square text-violet-600 hover:border hover:border-violet-600 hover:text-violet-700 transition-colors hover:bg-violet-50"
                    onClick={() => onReviewPurchaseOrder(quotation)}
                  >
                    <FileCheck2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  className="bg-white border-[1.5px] border-violet-600 text-violet-600 font-normal text-center"
                  align="center"
                >
                  Revisar orden de compra
                </TooltipContent>
              </Tooltip>
            )}

            {user?.rol === RolesRecord.client && showClientUploadOc && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-full aspect-square text-emerald-500 hover:border hover:border-emerald-500 hover:text-emerald-600 transition-colors hover:bg-emerald-50"
                      onClick={() => handleModalSend()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    className="bg-white border-[1.5px] border-blue-500 text-blue-500 font-normal text-center"
                    align="center"
                  >
                    Enviar Orden de Compra
                  </TooltipContent>
                </Tooltip>
              )}

            {showCommercialEdit && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-full aspect-square text-amber-500 hover:border hover:border-amber-500 hover:text-amber-600 transition-colors hover:bg-amber-50"
                    onClick={handleNavigateEdit}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  className="bg-white border-[1.5px] border-amber-500 text-amber-500 font-normal text-center"
                  align="center"
                >
                  Editar cotización
                </TooltipContent>
              </Tooltip>
            )}

            {user?.rol === RolesRecord.projectAdmin &&
              quotation.estado === QuotationStatesRecord.pending &&
              !quotation.esCotizacionIncidencia && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-full aspect-square text-red-500 hover:border hover:border-red-500 hover:text-red-600 transition-colors hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    className="bg-white border-[1.5px] border-red-500 text-red-500 font-normal text-center"
                    align="center"
                  >
                    Rechazar Cotizacion
                  </TooltipContent>
                </Tooltip>
              )}

            {user?.rol === RolesRecord.client &&
              quotation.estado === QuotationStatesRecord.rejected && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-full aspect-square text-red-500 hover:border hover:border-red-500 hover:text-red-600 transition-colors hover:bg-red-50"
                        onClick={() => setRejectionMsgModalOpen(true)}
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      className="bg-white border-[1.5px] border-red-500 text-red-500 font-normal text-center"
                      align="center"
                    >
                      Ver Mensaje de Declinación
                    </TooltipContent>
                  </Tooltip>
                  <QuotationRejectionMessageDialog
                    open={rejectionMsgModalOpen}
                    onOpenChange={(open) => setRejectionMsgModalOpen(open)}
                    quotationId={quotation.ID}
                  />
                </>
              )}
          </div>
        </TableCell>

        <TableCell className="text-center">
          <QuotationChatStatusCell
            quotation={quotation}
            canNegotiate={canNegotiate}
            onOpenChat={handleNegotiateClick}
          />
        </TableCell>
      </TableRow>
    </>
  );
};
