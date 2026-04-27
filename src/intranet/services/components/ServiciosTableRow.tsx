import type { FC } from "react";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Pencil, Trash2, UserCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import type { Servicio } from "../interfaces/service";

export const ServicioTableRow: FC<{ servicio: Servicio }> = ({ servicio }) => {
  return (
    <TableRow className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <TableCell className="font-medium py-3">{servicio.nombre}</TableCell>
      <TableCell className="text-gray-700 max-w-[180px] truncate">
        {servicio.descripcion}
      </TableCell>
      <TableCell className="text-gray-700">
        S/ {servicio.precio_regular.toFixed(2)}
      </TableCell>
      <TableCell className="text-gray-700">
        {servicio.condicional_precio}
      </TableCell>
      <TableCell className="text-gray-700 max-w-[200px] truncate">
        {servicio.observaciones}
      </TableCell>
      <TableCell className="text-center">
        {servicio.persona_requerida ? (
          <Badge className="mx-auto rounded-full px-3 py-1 text-[13px] font-medium border bg-green-100 text-green-700 border-green-300">
            {servicio.persona_requerida}
          </Badge>
        ) : (
          <span className="text-gray-400 text-sm">—</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex justify-center gap-2">
          {/* Editar */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-full aspect-square text-blue-500 hover:border hover:border-blue-500 hover:text-blue-600 transition-colors hover:bg-blue-50"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-white border-[1.5px] border-blue-500 text-blue-500 font-normal text-center">
              Editar Servicio
            </TooltipContent>
          </Tooltip>

          {/* Persona requerida */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-full aspect-square text-green-500 hover:border hover:border-green-500 hover:text-green-600 transition-colors hover:bg-green-50"
              >
                <UserCheck className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-white border-[1.5px] border-green-500 text-green-500 font-normal text-center">
              Persona Requerida
            </TooltipContent>
          </Tooltip>

          {/* Borrar */}
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
            <TooltipContent className="bg-white border-[1.5px] border-red-500 text-red-500 font-normal text-center">
              Borrar Servicio
            </TooltipContent>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
};
