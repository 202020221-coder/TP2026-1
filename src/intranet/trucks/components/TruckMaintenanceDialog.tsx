import type { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Download, Eye } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import type { TruckMaintenance } from "../interfaces/truck.interface";
import {
  downloadMaintenancePdfUrl,
  openMaintenancePdfUrl,
} from "../lib/maintenance-pdf";
import { formatTruckTableDate } from "../lib/trucks-table.utils";

export const TruckMaintenanceDialog: FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placa: string | null;
  mantenimientos: TruckMaintenance[];
  isLoading: boolean;
  error: string | null;
}> = ({ open, onOpenChange, placa, mantenimientos, isLoading, error }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(92vh,56rem)] w-[calc(100vw-1.5rem)] max-w-none flex-col gap-4 overflow-hidden p-6 sm:max-w-6xl lg:max-w-7xl">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl">Mantenimientos del camión {placa ?? ""}</DialogTitle>
        </DialogHeader>

        {error && (
          <p className="shrink-0 text-sm text-destructive">{error}</p>
        )}

        <div className="min-h-0 flex-1 overflow-auto">
          <Table containerClassname="min-w-[720px]">
            <TableHeader className="[&_tr]:border-b border-gray-200">
              <TableRow className="hover:bg-white">
                <TableHead className="w-[120px] whitespace-nowrap text-gray-500 font-medium">Fecha</TableHead>
                <TableHead className="min-w-[140px] text-gray-500 font-medium">Responsable</TableHead>
                <TableHead className="min-w-[200px] text-gray-500 font-medium">Razón</TableHead>
                <TableHead className="min-w-[160px] text-gray-500 font-medium">Contacto</TableHead>
                <TableHead className="min-w-[140px] whitespace-nowrap text-center text-gray-500 font-medium">PDF</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Cargando mantenimientos...
                  </TableCell>
                </TableRow>
              ) : mantenimientos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No hay mantenimientos registrados.
                  </TableCell>
                </TableRow>
              ) : (
                mantenimientos.map((mantenimiento, index) => {
                  const pdfUrl = mantenimiento.pdf_mantenimiento?.trim() ?? "";

                  return (
                  <TableRow
                    key={`${mantenimiento.id ?? index}-${mantenimiento.fecha_ultimo_mant}`}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="align-top whitespace-nowrap text-gray-700">
                      {formatTruckTableDate(mantenimiento.fecha_ultimo_mant)}
                    </TableCell>
                    <TableCell className="align-top text-gray-700">{mantenimiento.responsable}</TableCell>
                    <TableCell className="align-top text-sm leading-relaxed text-gray-700">
                      {mantenimiento.razon}
                    </TableCell>
                    <TableCell className="align-top text-sm text-gray-700">{mantenimiento.contacto_responsable}</TableCell>
                    <TableCell className="align-top text-center">
                      {pdfUrl ? (
                        <div className="flex flex-wrap justify-center gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-blue-500 hover:border hover:border-blue-500 hover:text-blue-600 transition-colors hover:bg-blue-50"
                                onClick={() => openMaintenancePdfUrl(pdfUrl)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent
                              className="bg-white border-[1.5px] border-blue-500 text-blue-500 font-normal text-center"
                              align="center"
                            >
                              Ver PDF
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-green-500 hover:border hover:border-green-500 hover:text-green-600 transition-colors hover:bg-green-50"
                                onClick={() => void downloadMaintenancePdfUrl(pdfUrl)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent
                              className="bg-white border-[1.5px] border-green-500 text-green-500 font-normal text-center"
                              align="center"
                            >
                              Descargar PDF
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};
