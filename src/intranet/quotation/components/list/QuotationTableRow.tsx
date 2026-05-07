import { useState, type FC } from "react";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Eye, Mail, MessageCircle, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { toSearchParams } from "@/shared/lib/to-search-params";
import { useNavigate } from "react-router";
import type { Quotation } from "../../interfaces/quotation";
import {
  QuotationStatesRecord,
  type QuotationState,
} from "../../enum/quotation-state.record";
import QuotationRejectionMessageDialog from "./QuotationRejectionMessageDialog";
import { RolesRecord } from "@/security/session/enum/roles.enum";
import { formatPEDate } from "@/shared/lib/format-date";
import { formatCurrency } from "@/shared/lib/format-currency";

export const QuotationTableRow: FC<{
  quotation: Quotation;
}> = ({ quotation }) => {
  const user = useSession((state) => state.loggedUser);
  const Navigate = useNavigate();
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

  const handleNavigateDetails = () => {
    Navigate(`/intranet/cotizaciones/detalles/${quotation.ID}`);
  };
  return (
    <TableRow className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <TableCell className="font-medium py-3">{quotationDisplayName}</TableCell>
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
        <div className="flex justify-center gap-2">
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

          {user?.rol === RolesRecord.projectAdmin &&
            quotation.estado === "pendiente" && (
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
        </div>
      </TableCell>

      <TableCell className="text-center">
        {user?.rol === RolesRecord.projectAdmin &&
        quotation.estado === "pendiente" ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-full aspect-square text-green-500 hover:border hover:border-green-500 hover:text-green-600 transition-colors hover:bg-green-50"
                onClick={() =>
                  Navigate(
                    `/intranet/cotizaciones/comentar?${toSearchParams({ quotationId: quotation.ID })}`,
                  )
                }
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              className="bg-white border-[1.5px] border-green-500 text-green-500 font-normal text-center"
              align="center"
            >
              Registrar Comentario
            </TooltipContent>
          </Tooltip>
        ) : user?.rol === RolesRecord.client &&
          quotation.estado === QuotationStatesRecord.rejected ? (
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
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex justify-center gap-2">
          {quotation.mensajes === "Enviado" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-full aspect-square text-green-500 hover:border hover:border-green-500 hover:text-green-600 transition-colors hover:bg-green-50"
                  onClick={() =>
                    Navigate(
                      `/intranet/cotizaciones/enviado?${toSearchParams({ quotationId: quotation.ID })}`,
                    )
                  }
                >
                  <Mail className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                className="bg-white border-[1.5px] border-green-500 text-green-500 font-normal text-center"
                align="center"
              >
                Mensajes Enviados
              </TooltipContent>
            </Tooltip>
          )}

          {quotation.mensajes === "Pendiente" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-full aspect-square text-red-500 hover:border hover:border-red-500 hover:text-red-600 transition-colors hover:bg-red-50"
                >
                  <Mail className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                className="bg-white border-[1.5px] border-red-500 text-red-500 font-normal text-center"
                align="center"
              >
                Ver Mensajes Pendientes
              </TooltipContent>
            </Tooltip>
          )}

          {quotation.mensajes === "No Iniciado" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-full aspect-square text-yellow-500 hover:border hover:border-yellow-500 hover:text-yellow-600 transition-colors hover:bg-red-50"
                >
                  <Mail className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                className="bg-white border-[1.5px] border-red-500 text-red-500 font-normal text-center"
                align="center"
              >
                Ver Mensajes Pendientes
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
