import { useState, type FC } from "react";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Eye, Mail } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import type { Order } from "../../interfaces/order";
import type { OrderState } from "../../enum/order-state.record";
import { ClientOrderDetailsDialog } from "./ClientOrderDetailsDialog";
import { ClientOrderObservationDialog } from "./ClientOrderObservationDialog";

const statusStyles = new Map<OrderState, string>([
    ["Aprobada", "bg-green-200 text-green-600 border-green-400"],
    ["Rechazada", "bg-red-200 text-red-600 border-red-400"],
    ["Pendiente", "bg-yellow-200 text-yellow-600 border-yellow-400"],
]);

const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

export const ClientOrderTableRow: FC<{
    order: Order;
}> = ({ order }) => {
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [observationOpen, setObservationOpen] = useState(false);

    return (
        <TableRow className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <TableCell className="font-medium py-3">{order.ID}</TableCell>
            <TableCell className="text-gray-700">{order.Id_Cliente ?? "-"}</TableCell>
            <TableCell className="text-gray-700">{order.ubicacion}</TableCell>
            <TableCell className="text-gray-700">{formatDate(order.fecha_inicio)}</TableCell>
            <TableCell>
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
                                onClick={() => setDetailsOpen(true)}
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
                </div>
            </TableCell>
            <TableCell>
                <div className="flex justify-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-full aspect-square text-red-500 hover:border hover:border-red-500 hover:text-red-600 transition-colors hover:bg-red-50"
                                onClick={() => setObservationOpen(true)}
                            >
                                <Mail className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent
                            className="bg-white border-[1.5px] border-red-500 text-red-500 font-normal text-center"
                            align="center"
                        >
                            Ver Observación
                        </TooltipContent>
                    </Tooltip>
                </div>
            </TableCell>

            <ClientOrderDetailsDialog
                order={order}
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
            />
            <ClientOrderObservationDialog
                order={order}
                open={observationOpen}
                onOpenChange={setObservationOpen}
            />
        </TableRow>
    );
};