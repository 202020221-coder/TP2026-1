import { useState, type FC } from "react";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Pencil, Trash2, UserCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import type { Servicio } from "../interfaces/service";
import { useServicios } from "../hooks/useServicios";
import { ServicioFormModal } from "./ServicioFormModal";
import { PersonalRequeridoModal } from "./PersonalRequeridoModal";

export const ServicioTableRow: FC<{ servicio: Servicio }> = ({ servicio }) => {
  const { toggleActivoLocal } = useServicios();
  const [editOpen, setEditOpen]         = useState(false);
  const [personalOpen, setPersonalOpen] = useState(false);

  const handleToggleActivo = () => {
    toggleActivoLocal(servicio.id);
  };

  return (
    <>
      <TableRow
        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${!servicio.activo ? "opacity-60" : ""}`}
      >
        <TableCell className="font-medium py-3">{servicio.nombre}</TableCell>
        <TableCell className="text-gray-700 max-w-[180px] truncate">{servicio.descripcion}</TableCell>
        <TableCell className="text-gray-700">S/ {servicio.precio_regular.toFixed(2)}</TableCell>
        <TableCell className="text-gray-700">{servicio.condicional_precio}</TableCell>
        <TableCell className="text-gray-700 max-w-[200px] truncate">{servicio.observaciones}</TableCell>

        {/* Columna Estado */}
        <TableCell className="text-center">
          <Badge
            className={
              servicio.activo
                ? "bg-green-100 text-green-700 border border-green-300 hover:bg-green-100"
                : "bg-red-100 text-red-600 border border-red-300 hover:bg-red-100"
            }
          >
            {servicio.activo ? "Activo" : "Desactivo"}
          </Badge>
        </TableCell>

        <TableCell>
          <div className="flex justify-center gap-2">
            {/* Editar */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditOpen(true)}
                  className="h-full aspect-square text-blue-500 hover:border hover:border-blue-500 hover:text-blue-600 transition-colors hover:bg-blue-50"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-white border-[1.5px] border-blue-500 text-blue-500 font-normal">
                Editar Servicio
              </TooltipContent>
            </Tooltip>

            {/* Personal Requerido */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPersonalOpen(true)}
                  className="h-full aspect-square text-green-500 hover:border hover:border-green-500 hover:text-green-600 transition-colors hover:bg-green-50"
                >
                  <UserCheck className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-white border-[1.5px] border-green-500 text-green-500 font-normal">
                Personal Requerido
              </TooltipContent>
            </Tooltip>

            {/* Desactivar/Activar servicio — toggle local, cambia Estado en UI */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleToggleActivo}
                  className={`h-full aspect-square transition-colors ${
                    servicio.activo
                      ? "text-red-500 hover:border hover:border-red-500 hover:text-red-600 hover:bg-red-50"
                      : "text-green-500 hover:border hover:border-green-500 hover:text-green-600 hover:bg-green-50"
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                className={`bg-white font-normal ${
                  servicio.activo
                    ? "border-[1.5px] border-red-400 text-red-500"
                    : "border-[1.5px] border-green-400 text-green-500"
                }`}
              >
                {servicio.activo ? "Desactivar Servicio" : "Activar Servicio"}
              </TooltipContent>
            </Tooltip>
          </div>
        </TableCell>
      </TableRow>

      {editOpen && (
        <ServicioFormModal mode="edit" servicio={servicio} onClose={() => setEditOpen(false)} />
      )}

      {personalOpen && (
        <PersonalRequeridoModal servicio={servicio} onClose={() => setPersonalOpen(false)} />
      )}
    </>
  );
};
