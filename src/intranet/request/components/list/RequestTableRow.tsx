import { type FC } from "react";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { FileText, MapPin, Eye, CirclePlus, XCircle } from "lucide-react";
import type { ResponseRequestDTO } from "../../interfaces";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { Button } from "@/shared/components/ui/button";

export const RequestTableRow: FC<{ request: ResponseRequestDTO }> = ({
  request,
}) => {
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
          <div className="font-medium text-gray-900">
            {request.Cliente_Nombre}
          </div>
          <div className="text-xs text-gray-500">
            ID cliente: {request.Id_Cliente}
          </div>
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
          <span className="line-clamp-2">
            {request.ubicacion || "Sin ubicación"}
          </span>
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
        <div className="flex justify-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-full aspect-square text-blue-500 hover:border hover:border-blue-500 hover:text-blue-600 transition-colors hover:bg-blue-50"
                // onClick={() => handleNavigateDetails()}
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-full aspect-square text-emerald-500 hover:border hover:border-emerald-500 hover:text-emerald-600 transition-colors hover:bg-emerald-50"
                // onClick={() => handleNavigateDetails()}
              >
                <CirclePlus className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              className="bg-white border-[1.5px] border-emerald-500 text-emerald-600 font-normal text-center"
              align="center"
            >
              Crear Cotizacion
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-full aspect-square text-rose-500 hover:border hover:border-rose-500 hover:text-rose-600 transition-colors hover:bg-rose-50"
                // onClick={() => handleNavigateDetails()}
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              className="bg-white border-[1.5px] border-rose-500 text-rose-600 font-normal text-center"
              align="center"
            >
              Rechazar Solicitud
            </TooltipContent>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default RequestTableRow;
