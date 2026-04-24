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
import type { QuotationState } from "../../enum/quotation-state.record";
import QuotationRejectionMessageDialog from "./QuotationRejectionMessageDialog";
import { RolesRecord } from "@/security/session/enum/roles.enum";

export const QuotationTableRow: FC<{
  quotation: Quotation;
}> = ({ quotation }) => {
  const user = useSession((state) => state.loggedUser);
  const Navigate = useNavigate();
  const [rejectionMsgModalOpen, setRejectionMsgModalOpen] = useState(false);

  const quotationDisplayName =
    quotation.nombre.split(" - ").slice(1).join(" - ") || quotation.nombre;

  const statusStyles = new Map<QuotationState, string>([
    ["Aprobada", "bg-green-200 text-green-600 border-green-400"],
    ["Rechazada", "bg-red-200 text-red-600 border-red-400"],
    ["Pendiente", "bg-yellow-200 text-yellow-600 border-yellow-400"],
  ]);

  return (
    <TableRow className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <TableCell className="font-medium py-3">{quotationDisplayName}</TableCell>
      <TableCell className="text-gray-700">
        {new Date(quotation.fecha_inicio).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </TableCell>
      <TableCell className="font-medium py-3">
        s/. {quotation.precio_total}
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

      {/* Columna de acciones */}
      <TableCell>
        <div className="flex justify-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-full aspect-square text-blue-500 hover:border hover:border-blue-500 hover:text-blue-600 transition-colors hover:bg-blue-50"
                onClick={() =>
                  Navigate(
                    `/intranet/cotizaciones/detalle?${toSearchParams({ quotationId: quotation.ID })}`,
                  )
                }
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
            quotation.estado === "Pendiente" && (
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
            )}

          {user?.rol === RolesRecord.projectAdmin &&
            quotation.estado === "Pendiente" && (
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
            quotation.estado === "Rechazada" && (
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
            )}
        </div>
        <QuotationRejectionMessageDialog
          open={rejectionMsgModalOpen}
          onOpenChange={(open) => setRejectionMsgModalOpen(open)}
          quotationId={quotation.ID}
        />
      </TableCell>

      {/* Columna de mensajes */}
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
