import { /*useState,*/ useState, type FC } from "react";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Eye,
  FileArchive,
  Mail,
  Trash2 /*FolderOpen, Send */,
} from "lucide-react";
import type { OrderState } from "../enum/order-state.record";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import type { Order } from "../interfaces/order";
import { useSession } from "@/profile/hooks/stores/useSession.store";
import OrderRejectionMessageDialog from "./OrderRejectionMessageDialog";
import { toSearchParams } from "@/shared/lib/to-search-params";
import { useNavigate } from "react-router";
import { RolesRecord } from "@/profile/enum/roles.enum";
export const OrderTableRow: FC<{
  order: Order;
}> = ({ order }) => {
  const user = useSession((state) => state.loggedUser);
  const Navigate = useNavigate();
  const [rejectionMsgModalOpen, setRejectionMsgModalOpen] = useState(false);
  //   const [clientLink, setClientLink] = useState("");
  //   const queryClient = useQueryClient();
  //   const navigate = useNavigate();
  //   const statuses: Record<OrderState, string> = {
  //     DRAFT: "Borrador",
  //     SENT: "Enviado",
  //     ACCEPTED: "Aceptado",
  //     REJECTED: "Rechazado",
  //     EXPIRED: "Expirado",
  //     SUPERSEDED: "Reemplazado",
  //   };

  const statusStyles = new Map<OrderState, string>([
    ["Aprobada", "bg-green-200 text-green-600 border-green-400"],
    ["Rechazada", "bg-red-200 text-red-600 border-red-400"],
    ["Pendiente", "bg-yellow-200 text-yellow-600 border-yellow-400"],
  ]);

  //   const sendToClient = useMutation({
  //     mutationKey: ["Order-to-client", Order.id],
  //     mutationFn: sendOrderToClient,
  //     onSuccess: (OrderSentResponse) => {
  //       setClientLink(OrderSentResponse.public_link); // O el campo que devuelva
  //       setDialogOpen(true);
  //     },
  //   });

  //   const createNewVersion = useMutation({
  //     mutationKey: ["create-new-Order-version", Order.id],
  //     mutationFn: createOrderVersion,
  //     onSuccess: () => {
  //       alert("Nueva version creada con exito!");
  //       queryClient.invalidateQueries({
  //         queryKey: ["admin-Orders"],
  //       });
  //     },
  //   });
  return (
    <TableRow className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <TableCell className="font-medium py-3">{order.ID}</TableCell>
      <TableCell className="text-gray-700">
        {user?.rol === RolesRecord.projectAdmin && order.Id_Cliente}
        {user?.rol === RolesRecord.client && order.Id_Company}
      </TableCell>
      <TableCell className="text-gray-700">{order.ubicacion}</TableCell>
      <TableCell className="text-gray-700">
        {new Date(order.fecha_inicio).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </TableCell>
      <TableCell className="">
        <Badge
          className={`block mx-auto rounded-full px-3 py-1 text-[14px] font-medium border ${statusStyles.get(
            order.estado,
          )}`}
        >
          {order.estado}
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
                // onClick={() => navigate(`detalles/${Order.id}`)}
                // disabled={sendToClient.isPending}
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
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-full aspect-square text-amber-400 hover:border hover:border-amber-500 hover:text-amber-600 transition-colors"
              >
                <FolderOpen className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              className="bg-white border-[1.5px] border-amber-500 text-amber-500 font-normal text-center"
              align="center"
            >
              Ver historial de versiones
            </TooltipContent>
          </Tooltip> */}

          {user?.rol === RolesRecord.projectAdmin &&
            order.estado === "Pendiente" && (
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
                    // disabled={sendToClient.isPending}
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
            order.estado === "Pendiente" && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-full aspect-square text-red-500 hover:border hover:border-red-500 hover:text-red-600 transition-colors hover:bg-red-50"
                      // onClick={() => createNewVersion.mutate(Order.id)}
                      // disabled={createNewVersion.isPending}
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

          {user?.rol === RolesRecord.client && order.estado === "Rechazada" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-full aspect-square text-red-500 hover:border hover:border-red-500 hover:text-red-600 transition-colors hover:bg-red-50"
                  onClick={() => setRejectionMsgModalOpen(true)}
                  // disabled={createNewVersion.isPending}
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
          orderId={order.ID}
        />
      </TableCell>
    </TableRow>
  );
};
