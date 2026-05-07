import { type FC } from "react";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Package2, Truck, FileText, MapPin } from "lucide-react";
import type { ResponseRequestDTO } from "../../interfaces";

export const RequestTableRow: FC<{ request: ResponseRequestDTO }> = ({ request }) => {
    const statusLabel = (status: string | null) => {
        if (!status) return "Sin estado";
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const statusVariant = (status: string | null) => {
        if (status === "aceptado") return "default";
        if (status === "pendiente") return "secondary";
        if (status === "rechazado") return "destructive";
        return "secondary";
    };

    return (
        <TableRow className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <TableCell>
                <div className="space-y-1">
                    <div className="font-medium text-gray-900">{request.Cliente_Nombre}</div>
                    <div className="text-xs text-gray-500">ID cliente: {request.Id_Cliente}</div>
                </div>
            </TableCell>
            <TableCell className="text-sm text-gray-600">
                <div className="flex items-start gap-2">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                      <span className="block max-w-[220px] text-sm text-gray-600 line-clamp-2 wrap-break-word">
                        {request.descripcion || "Sin descripción"}
                    </span>
                </div>
            </TableCell>
            <TableCell className="text-sm text-gray-600">
                <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                    <span className="line-clamp-2">{request.ubicacion || "Sin ubicación"}</span>
                </div>
            </TableCell>
            <TableCell>
                <Badge
                    variant={statusVariant(request.estado)}
                    className="rounded-full px-3 py-1 text-xs font-medium"
                >
                    {statusLabel(request.estado)}
                </Badge>
            </TableCell>
            <TableCell className="text-sm text-gray-600">
                {request.FechaCreacion
                    ? new Date(request.FechaCreacion).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    })
                    : "Sin fecha"}
            </TableCell>
            <TableCell>
                <Badge
                    variant={request.ProductoEnvio ? "default" : "secondary"}
                    className="rounded-full px-3 py-1 text-xs font-medium"
                >
                    <Package2 className="mr-1.5 h-3.5 w-3.5" />
                    {request.ProductoEnvio ? "Con productos" : "Sin productos"}
                </Badge>
            </TableCell>
            <TableCell>
                <Badge
                    variant={request.CamionesEnvio ? "default" : "secondary"}
                    className="rounded-full px-3 py-1 text-xs font-medium"
                >
                    <Truck className="mr-1.5 h-3.5 w-3.5" />
                    {request.CamionesEnvio ? "Con camiones" : "Sin camiones"}
                </Badge>
            </TableCell>
        </TableRow>
    );
};

export default RequestTableRow;
