import { type FC } from "react";
import { X, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { useServicios } from "../hooks/useServicios";

interface Props {
  onClose: () => void;
}

export const ServiciosEliminadosModal: FC<Props> = ({ onClose }) => {
  const { result, toggleActivoMutation, toggleActivoLocal } = useServicios();

  const serviciosDesactivados = result.data?.data.filter((s) => !s.activo) ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl mx-4 flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Servicios Desactivados</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {serviciosDesactivados.length} servicio{serviciosDesactivados.length !== 1 ? "s" : ""} desactivado{serviciosDesactivados.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="overflow-auto flex-1 px-6 py-4">
          {result.isPending ? (
            <div className="flex justify-center items-center py-16 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Cargando...
            </div>
          ) : serviciosDesactivados.length === 0 ? (
            <div className="text-center text-gray-400 py-16">
              No hay servicios desactivados.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Nombre</TableHead>
                  <TableHead className="font-semibold text-gray-700">Descripción</TableHead>
                  <TableHead className="font-semibold text-gray-700">Precio Regular</TableHead>
                  <TableHead className="font-semibold text-gray-700">Condicional de Precio</TableHead>
                  <TableHead className="font-semibold text-gray-700">Observaciones</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Estado</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviciosDesactivados.map((servicio) => {
                  const isTogglingThis =
                    toggleActivoMutation.isPending &&
                    (toggleActivoMutation.variables as { id: number }).id === servicio.id;

                  return (
                    <TableRow key={servicio.id} className="border-b border-gray-100 hover:bg-gray-50 opacity-70">
                      <TableCell className="font-medium py-3">{servicio.nombre}</TableCell>
                      <TableCell className="text-gray-700 max-w-[180px] truncate">{servicio.descripcion}</TableCell>
                      <TableCell className="text-gray-700">S/ {servicio.precio_regular.toFixed(2)}</TableCell>
                      <TableCell className="text-gray-700">{servicio.condicional_precio}</TableCell>
                      <TableCell className="text-gray-700 max-w-[200px] truncate">{servicio.observaciones}</TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-red-100 text-red-600 border border-red-300 hover:bg-red-100">
                          Desactivo
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleActivoLocal(servicio.id, servicio.activo)}
                                disabled={isTogglingThis}
                                className="h-full aspect-square text-green-500 hover:border hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-colors"
                              >
                                {isTogglingThis ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <RotateCcw className="w-4 h-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-white border-[1.5px] border-green-400 text-green-500 font-normal">
                              Activar Servicio
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};
