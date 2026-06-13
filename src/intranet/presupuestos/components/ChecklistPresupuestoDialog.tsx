import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { ClipboardList, Loader2, Download, CheckCircle2 } from "lucide-react";
import {
  useInventarioPorServicioPresupuesto,
  useExportarFaltantesInventario,
} from "../hooks/usePresupuestos";
import {
  isChecklistExported,
  markChecklistExported,
} from "../lib/checklist-export-storage";

interface ChecklistPresupuestoDialogProps {
  cotizacionId: number;
}

export function ChecklistPresupuestoDialog({
  cotizacionId,
}: ChecklistPresupuestoDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasExported, setHasExported] = useState(() =>
    isChecklistExported(cotizacionId),
  );

  useEffect(() => {
    setHasExported(isChecklistExported(cotizacionId));
  }, [cotizacionId]);

  const { data, isLoading } = useInventarioPorServicioPresupuesto(
    cotizacionId,
    isOpen
  );
  const { mutate: exportar, isPending: isExporting } =
    useExportarFaltantesInventario(cotizacionId);

  const inventarioSuficiente = (data?.costo_total_faltante ?? 0) === 0;

  const handleExportar = () => {
    if (hasExported) return;

    exportar(undefined, {
      onSuccess: () => {
        markChecklistExported(cotizacionId);
        setHasExported(true);
      },
    });
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => setIsOpen(true)}
      >
        <ClipboardList className="h-4 w-4" />
        Checklist
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[90vw] max-w-[90vw] sm:max-w-[90vw] max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-xl">
              Checklist de Inventario por Servicio
            </DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : data ? (
            <div className="flex flex-col gap-4 overflow-hidden min-h-0">
              <div className="grid grid-cols-2 gap-4 bg-muted/30 rounded-lg p-4 flex-shrink-0">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total de Objetos
                  </p>
                  <p className="text-2xl font-bold">{data.total_objetos}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Costo Total Faltante
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      data.costo_total_faltante > 0
                        ? "text-destructive"
                        : "text-green-600"
                    }`}
                  >
                    S/ {Number(data.costo_total_faltante).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="overflow-y-auto flex-1 min-h-0">
                <div className="rounded-lg border border-border">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold">Objeto</TableHead>
                        <TableHead className="font-semibold">Estancia</TableHead>
                        <TableHead className="text-center font-semibold">
                          Cant. Requerida
                        </TableHead>
                        <TableHead className="text-center font-semibold">
                          Cant. en Inventario
                        </TableHead>
                        <TableHead className="text-right font-semibold">
                          Precio Compra
                        </TableHead>
                        <TableHead className="font-semibold">Servicios</TableHead>
                        <TableHead className="text-right font-semibold">
                          Costo Faltante
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.data.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No hay objetos requeridos para esta cotización
                          </TableCell>
                        </TableRow>
                      ) : (
                        data.data.map((item) => (
                          <TableRow
                            key={item.id_inventario}
                            className={item.costo > 0 ? "bg-destructive/5" : ""}
                          >
                            <TableCell className="font-medium">
                              {item.nombre_objeto}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                                  item.estancia === "para inventario"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {item.estancia}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              {item.cantidad_requerida}
                            </TableCell>
                            <TableCell className="text-center">
                              <span
                                className={
                                  item.cantidad_en_inventario <
                                  item.cantidad_requerida
                                    ? "text-destructive font-semibold"
                                    : ""
                                }
                              >
                                {item.cantidad_en_inventario}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              S/ {Number(item.precio_compra).toFixed(2)}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                              <span title={item.servicios.join(", ")}>
                                {item.servicios.join(", ")}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <span
                                className={
                                  item.costo > 0
                                    ? "text-destructive font-semibold"
                                    : "text-muted-foreground"
                                }
                              >
                                S/ {Number(item.costo).toFixed(2)}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 flex-shrink-0">
                {hasExported && (
                  <span className="text-sm text-muted-foreground font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Los faltantes ya fueron exportados al presupuesto
                  </span>
                )}
                {inventarioSuficiente && !hasExported && (
                  <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Inventario suficiente
                  </span>
                )}
                <Button
                  onClick={handleExportar}
                  disabled={isExporting || inventarioSuficiente || hasExported}
                  variant={hasExported ? "secondary" : "default"}
                  className="gap-2"
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : hasExported ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {isExporting
                    ? "Exportando..."
                    : hasExported
                    ? "Ya exportado"
                    : "Exportar Faltantes al Presupuesto"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">
                No se pudo cargar el checklist
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
