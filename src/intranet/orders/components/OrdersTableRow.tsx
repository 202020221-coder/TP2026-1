import { /*useState,*/ useState, type FC } from "react";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Eye,
  FileArchive,
  FileText,
  Mail,
  MapPin,
  Trash2 /*FolderOpen, Send */,
} from "lucide-react";
import { OrderStatesRecord, type OrderState } from "../enum/order-state.record";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import type { Order } from "../interfaces/order";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import OrderRejectionMessageDialog from "./OrderRejectionMessageDialog";
import { toSearchParams } from "@/shared/lib/to-search-params";
import { useNavigate } from "react-router";
import { RolesRecord } from "@/security/session/enum/roles.enum";
export const OrderTableRow: FC<{
  order: Order;
}> = ({ order }) => {
  const user = useSession((state) => state.loggedUser);
  const Navigate = useNavigate();
  const [rejectionMsgModalOpen, setRejectionMsgModalOpen] = useState(false);

  const statusStyles = new Map<OrderState, string>([
    [
      OrderStatesRecord.approved,
      "bg-green-200 text-green-600 border-green-400",
    ],
    [OrderStatesRecord.rejected, "bg-red-200 text-red-600 border-red-400"],
    [
      OrderStatesRecord.pending,
      "bg-yellow-200 text-yellow-600 border-yellow-400",
    ],
  ]);
  return (
    <TableRow className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <TableCell className="font-medium py-3">{order.ID}</TableCell>
      {user?.rol === RolesRecord.projectAdmin && (
        <TableCell className="text-gray-700">
          <div className="space-y-1">
            <div className="font-medium text-gray-900">
              {order.Cliente_Nombre}
            </div>
            <div className="text-xs text-gray-500">ID: {order.Id_Cliente}</div>
          </div>
        </TableCell>
      )}
      <TableCell className="text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <FileText className="mt-0.5 aspect-square w-5 shrink-0 text-gray-400" />
          <span className="block max-w-[220px] text-sm text-gray-600 line-clamp-2 wrap-break-word overflow-x-auto py-4">
            {order.descripcion}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-gray-700">
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
          <span className="line-clamp-2">{order.ubicacion}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          className={`block mx-auto rounded-full px-3 py-1 text-[14px] font-medium border ${statusStyles.get(
            order.estado,
          )}`}
        >
          {order.estado.charAt(0).toUpperCase() + order.estado.slice(1)}
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
              >
                <Eye className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              className="bg-white border-[1.5px] border-blue-500 text-blue-500 font-normal text-center"
              align="center"
            >
              Ver Solicitud
            </TooltipContent>
          </Tooltip>
          {user?.rol === RolesRecord.projectAdmin &&
            order.estado === OrderStatesRecord.pending && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-full aspect-square text-green-500 hover:border hover:border-green-500 hover:text-green-600 transition-colors hover:bg-green-50"
                    onClick={() =>
                      Navigate(
                        `/intranet/cotizaciones/crear?${toSearchParams({ orderId: order.ID })}`,
                      )
                    }
                  >
                    <FileArchive className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  className="bg-white border-[1.5px] border-green-500 text-green-500 font-normal text-center"
                  align="center"
                >
                  Crear Cotización
                </TooltipContent>
              </Tooltip>
            )}

          {user?.rol === RolesRecord.projectAdmin &&
            order.estado === OrderStatesRecord.pending && (
              <>
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
                    Rechazar Solicitud
                  </TooltipContent>
                </Tooltip>
              </>
            )}

          {user?.rol === RolesRecord.client &&
            order.estado === OrderStatesRecord.rejected && (
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
        <OrderRejectionMessageDialog
          open={rejectionMsgModalOpen}
          onOpenChange={(open) => {
            setRejectionMsgModalOpen(open);
          }}
          rejectionMessage={order.Respuesta}
        />
      </TableCell>
    </TableRow>
  );
};
