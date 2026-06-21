import { useState, type FC } from "react";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Eye, Mail, Pencil, Trash2, Send, Calculator, FileCheck2, CalendarClock } from "lucide-react";
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
  type QuotationState,
} from "../../enum/quotation-state.record";
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

export const QuotationTableRow: FC<{
  quotation: Quotation;
  onOpenPresupuesto: (quotation: Quotation) => void;
  onReviewPurchaseOrder: (quotation: Quotation) => void;
  onUploadPurchaseOrder: (quotationId: number) => void;
  onEditPaymentTerms: (quotation: Quotation) => void;
}> = ({
  quotation,
  onOpenPresupuesto,
  onReviewPurchaseOrder,
  onUploadPurchaseOrder,
  onEditPaymentTerms,
}) => {
  const user = useSession((state) => state.loggedUser);
  const Navigate = useNavigate();
  const [rejectionMsgModalOpen, setRejectionMsgModalOpen] = useState(false);

  const statusStyles = new Map<QuotationState, string>([
    [
      QuotationStatesRecord.approved,
      "bg-green-200 text-green-600 border-green-400",
    ],
    [QuotationStatesRecord.rejected, "bg-red-200 text-red-600 border-red-400"],
    [
      QuotationStatesRecord.pending,
      "bg-yellow-200 text-yellow-600 border-yellow-400",
    ],
  ]);

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
          <Badge
            className={`block mx-auto rounded-full px-3 py-1 text-[14px] font-medium border ${statusStyles.get(
              quotation.estado,
            )}`}
          >
            {quotation.estado}
          </Badge>
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
                    Editar plazos
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

            {user?.rol === RolesRecord.client &&
              quotation.estado !== QuotationStatesRecord.approved && (
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

            {user?.rol === RolesRecord.projectAdmin &&
              quotation.estado === QuotationStatesRecord.pending && (
                <>
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
                      Editar Cotizacion
                    </TooltipContent>
                  </Tooltip>
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
                </>
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
