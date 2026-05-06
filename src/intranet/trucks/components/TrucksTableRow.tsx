import type { FC } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import { Eye, Wrench } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/lib/utils";
import type { Truck } from "../interfaces/truck.interface";
import { EditTruckDialog } from "./EditTruckDialog";
import {
  formatTruckTableDate,
  getTruckEstadoBadge,
  getSoatStatus,
} from "../lib/trucks-table.utils";

export const TrucksTableRow: FC<{
  camion: Truck;
  fabricanteLabel: string;
  onOpenMaintenance: (placa: string) => void;
}> = ({ camion, fabricanteLabel, onOpenMaintenance }) => {
  const navigate = useNavigate();
  const soatStatus = getSoatStatus(camion.soat_dia_pago);
  const estadoBadge = getTruckEstadoBadge(camion.Estado);

  return (
    <TableRow className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <TableCell className="font-medium py-3">{camion.Placa}</TableCell>
      <TableCell className="text-gray-700">{camion.nombre}</TableCell>
      <TableCell className="text-gray-700">{camion.ano_fabricacion}</TableCell>
      <TableCell className="text-gray-700">{camion.modelo}</TableCell>
      <TableCell className="text-center">
        <Badge
          variant={estadoBadge.variant}
          className={cn(
            "block mx-auto rounded-full px-3 py-1 text-[14px] font-medium border",
            estadoBadge.className,
          )}
        >
          {estadoBadge.label}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge
          variant={soatStatus.variant}
          className={cn(
            "block mx-auto rounded-full px-3 py-1 text-[14px] font-medium border",
            soatStatus.className,
          )}
        >
          {soatStatus.label}
        </Badge>
      </TableCell>
      <TableCell className="text-gray-700">
        {formatTruckTableDate(camion.fecha_prox_revision)}
      </TableCell>
      <TableCell className="text-gray-700">{fabricanteLabel}</TableCell>
      <TableCell className="text-gray-700">{camion.soat_n_poliza}</TableCell>
      <TableCell className="text-gray-700">{camion.soat_empresa}</TableCell>
      <TableCell className="text-gray-700">
        {formatTruckTableDate(camion.soat_dia_pago)}
      </TableCell>
      <TableCell className="text-center">
        <div className="flex justify-center gap-2">
          <EditTruckDialog camion={camion} />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-blue-500 hover:border hover:border-blue-500 hover:text-blue-600 transition-colors hover:bg-blue-50"
                onClick={() => navigate(`/intranet/trucks/inventory/${camion.Placa}`)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              className="bg-white border-[1.5px] border-blue-500 text-blue-500 font-normal text-center"
              align="center"
            >
              Ver Inventario
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-green-500 hover:border hover:border-green-500 hover:text-green-600 transition-colors hover:bg-green-50"
                onClick={() => onOpenMaintenance(camion.Placa)}
              >
                <Wrench className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              className="bg-white border-[1.5px] border-green-500 text-green-500 font-normal text-center"
              align="center"
            >
              Mantenimientos
            </TooltipContent>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
};
