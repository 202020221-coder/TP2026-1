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
      <div className="bg-card rounded-xl shadow-xl w-full max-w-5xl mx-4 flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Servicios Desactivados</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {serviciosDesactivados.length} servicio{serviciosDesactivados.length !== 1 ? "s" : ""} desactivado{serviciosDesactivados.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="overflow-auto flex-1 px-6 py-4">
          {result.isPending ? (
            <div className="flex justify-center items-center py-16 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Cargando...
            </div>
          ) : serviciosDesactivados.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">
              No hay servicios desactivados.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold text-foreground">Nombre</TableHead>
                  <TableHead className="font-semibold text-foreground">Descripción</TableHead>
                  <TableHead className="font-semibold text-foreground">Precio Regular</TableHead>
                  <TableHead className="font-semibold text-foreground">Condicional de Precio</TableHead>
                  <TableHead className="font-semibold text-foreground">Observaciones</TableHead>
                  <TableHead className="font-semibold text-foreground text-center">Estado</TableHead>
                  <TableHead className="font-semibold text-foreground text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviciosDesactivados.map((servicio) => {
                  const isTogglingThis =
                    toggleActivoMutation.isPending &&
                    (toggleActivoMutation.variables as { id: number }).id === servicio.id;

                  return (
                    <TableRow key={servicio.id} className="border-b border-border hover:bg-muted/50 opacity-70">
                      <TableCell className="font-medium py-3">{servicio.nombre}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[180px] truncate">{servicio.descripcion}</TableCell>
                      <TableCell className="text-muted-foreground">S/ {servicio.precio_regular.toFixed(2)}</TableCell>
                      <TableCell className="text-muted-foreground">{servicio.condicional_precio}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">{servicio.observaciones}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="destructive">
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
