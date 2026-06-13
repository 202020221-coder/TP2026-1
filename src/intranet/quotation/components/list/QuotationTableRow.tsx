import { useState, type FC } from "react";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Eye, Mail, Pencil, Trash2, Send, MessageCircle } from "lucide-react";
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
import QuotationOrderPurchaseDialog from "./QuotationOrderPurchaseDialog";
import { RolesRecord } from "@/security/session/enum/roles.enum";
import { formatPEDate } from "@/shared/lib/format-date";
import { formatCurrency } from "@/shared/lib/format-currency";
import { canNegotiateQuotation } from "../../lib/can-negotiate-quotation";
import { cn } from "@/shared/lib/utils";

export const QuotationTableRow: FC<{
  quotation: Quotation;
  onOpenPresupuesto: (quotation: Quotation) => void;
}> = ({ quotation, onOpenPresupuesto }) => {
  const user = useSession((state) => state.loggedUser);
  const Navigate = useNavigate();
  const [orderPurchaseModalOpen, setOrderPurchaseModalOpen] = useState(false);
  const [rejectionMsgModalOpen, setRejectionMsgModalOpen] = useState(false);

  const quotationDisplayName =
    quotation.nombre.split(" - ").slice(1).join(" - ") || quotation.nombre;

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
    setOrderPurchaseModalOpen(true);
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

  type ChatStatus = "first_time" | "active" | "closed";

  let chatStatus: ChatStatus;
  if (!canNegotiate) {
    chatStatus = "closed";
  } else if (quotation.chat === "no") {
    chatStatus = "first_time";
  } else {
    chatStatus = "active";
  }
  return (
    <>
      <TableRow className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <TableCell className="font-medium py-3">{quotation.ID}</TableCell>
        <TableCell className="font-medium py-3">
          {quotationDisplayName}
        </TableCell>
        <TableCell className="text-gray-700">
          {formatPEDate(quotation.condiciones.fechaEmision)}
        </TableCell>
        <TableCell className="text-gray-700">
          {formatPEDate(quotation.condiciones.fechaVigencia)}
        </TableCell>
        <TableCell className="font-medium py-3">
          {formatCurrency(quotation.precioTotal, "PEN", 2)}
        </TableCell>
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
              <Button
                type="button"
                size="sm"
                onClick={() => onOpenPresupuesto(quotation)}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                Presupuesto
              </Button>
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
          {chatStatus !== "closed" ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleNegotiateClick}
                  className={cn(
                    "mx-auto inline-flex max-w-[200px] items-center justify-center rounded-full border px-3 py-1 text-xs font-medium leading-snug transition-colors cursor-pointer hover:opacity-90 focus-visible:outline-none focus-visible:ring-2",
                    chatStatus === "first_time"
                      ? "border-sky-300 bg-sky-50 text-sky-800 focus-visible:ring-sky-400"
                      : "border-green-300 bg-green-50 text-green-700 focus-visible:ring-green-400",
                  )}
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  {chatStatus === "first_time"
                    ? "Iniciar negociación"
                    : "Abrir chat"}
                </button>
              </TooltipTrigger>
              <TooltipContent
                className={`bg-white border-[1.5px] ${
                  chatStatus === "first_time"
                    ? "border-sky-500 text-sky-600"
                    : "border-green-500 text-green-600"
                } font-normal text-center`}
                align="center"
              >
                {chatStatus === "first_time"
                  ? "Abrir chat por primera vez"
                  : "Abrir chat de negociación"}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Badge
              variant="outline"
              className="mx-auto max-w-[200px] whitespace-normal text-center text-xs font-medium leading-snug bg-gray-100 text-gray-500 border-gray-300"
            >
              Negociación cerrada
            </Badge>
          )}
        </TableCell>
      </TableRow>
      <QuotationOrderPurchaseDialog
        quotationId={quotation.ID}
        open={orderPurchaseModalOpen}
        onOpenChange={setOrderPurchaseModalOpen}
      />
    </>
  );
};
