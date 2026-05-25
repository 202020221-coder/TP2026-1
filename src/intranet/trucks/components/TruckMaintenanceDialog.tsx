import { useEffect, useMemo, useRef, useState, type FC } from "react";
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
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Download, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import type { TruckMaintenance } from "../interfaces/truck.interface";
import { trucksMaintenanceApi } from "../api/trucks.maintenance.api";
import {
  downloadMaintenancePdfUrl,
  openMaintenancePdfUrl,
} from "../lib/maintenance-pdf";
import { formatTruckTableDate } from "../lib/trucks-table.utils";

type MaintenanceFormState = {
  fecha_ultimo_mant: string;
  responsable: string;
  razon: string;
  contacto_responsable: string;
};

const INITIAL_FORM: MaintenanceFormState = {
  fecha_ultimo_mant: "",
  responsable: "",
  razon: "",
  contacto_responsable: "",
};

const hasText = (value: string) => value.trim().length > 0;

const isPdfFile = (file: File) => {
  if (file.type === "application/pdf") {
    return true;
  }

  return file.name.toLowerCase().endsWith(".pdf");
};

export const TruckMaintenanceDialog: FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placa: string | null;
  mantenimientos: TruckMaintenance[];
  isLoading: boolean;
  error: string | null;
  onRefresh?: () => Promise<void> | void;
}> = ({
  open,
  onOpenChange,
  placa,
  mantenimientos,
  isLoading,
  error,
  onRefresh,
}) => {
  const [form, setForm] = useState<MaintenanceFormState>(INITIAL_FORM);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const isFormValid = useMemo(() => {
    const requiredText = [
      form.fecha_ultimo_mant,
      form.responsable,
      form.contacto_responsable,
    ];

    return requiredText.every(hasText) && !pdfError;
  }, [form, pdfError]);

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setPdfFile(null);
    setPdfError(null);
    setFormError(null);
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (!open) {
      setIsRegisterOpen(false);
      resetForm();
    }
  }, [open]);

  const handleRegisterOpenChange = (nextOpen: boolean) => {
    setIsRegisterOpen(nextOpen);
    if (!nextOpen) {
      resetForm();
    }
  };

  const handlePdfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setPdfFile(null);
      setPdfError(null);
      return;
    }

    if (!isPdfFile(file)) {
      setPdfFile(null);
      setPdfError("Solo se permiten archivos PDF.");
      return;
    }

    setPdfFile(file);
    setPdfError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!placa) {
      setFormError("No se encontró la placa del camión.");
      return;
    }

    if (!isFormValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        fecha_ultimo_mant: form.fecha_ultimo_mant,
        responsable: form.responsable.trim(),
        razon: form.razon.trim() || null,
        contacto_responsable: form.contacto_responsable.trim(),
      };

      const response = await trucksMaintenanceApi.createMantenimiento(
        placa,
        payload,
      );

      if (pdfFile && typeof response.id === "number") {
        await trucksMaintenanceApi.uploadMantenimientoPdf(
          placa,
          response.id,
          pdfFile,
        );
      }

      toast.success("Mantenimiento registrado correctamente.");
      resetForm();
      setIsRegisterOpen(false);
      await onRefresh?.();
    } catch {
      setFormError("No se pudo registrar el mantenimiento.");
      toast.error("No se pudo registrar el mantenimiento.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(92vh,56rem)] w-[calc(100vw-1.5rem)] max-w-none flex-col gap-4 overflow-hidden p-6 sm:max-w-6xl lg:max-w-7xl">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl">
            Mantenimientos del camión {placa ?? ""}
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-start">
          <Button
            type="button"
            onClick={() => setIsRegisterOpen(true)}
            disabled={!placa}
          >
            Registrar mantenimiento
          </Button>
        </div>

        {error && (
          <p className="shrink-0 text-sm text-destructive">{error}</p>
        )}

        <Dialog open={isRegisterOpen} onOpenChange={handleRegisterOpenChange}>
          <DialogContent className="w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-xl">Registrar mantenimiento</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Completa los datos para agregar un nuevo mantenimiento al camión.
              </p>
            </DialogHeader>

            <form
              onSubmit={handleSubmit}
              className="grid gap-4"
            >
              {formError && (
                <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {formError}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="maintenance-fecha">Fecha ultimo mantenimiento</Label>
                <Input
                  id="maintenance-fecha"
                  type="date"
                  value={form.fecha_ultimo_mant}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      fecha_ultimo_mant: event.target.value,
                    }))
                  }
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="maintenance-responsable">Responsable</Label>
                <Input
                  id="maintenance-responsable"
                  value={form.responsable}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      responsable: event.target.value,
                    }))
                  }
                  placeholder="Nombre del responsable"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="maintenance-contacto">Contacto responsable</Label>
                <Input
                  id="maintenance-contacto"
                  value={form.contacto_responsable}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      contacto_responsable: event.target.value,
                    }))
                  }
                  placeholder="Telefono o correo"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="maintenance-razon">Razon</Label>
                <Textarea
                  id="maintenance-razon"
                  value={form.razon}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      razon: event.target.value,
                    }))
                  }
                  placeholder="Motivo o detalle del mantenimiento"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1.5">
                <Label>PDF de mantenimiento</Label>
                <div className="flex flex-col gap-2 rounded-md border border-dashed border-gray-200 p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => pdfInputRef.current?.click()}
                      disabled={isSubmitting}
                    >
                      Subir PDF
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {pdfFile ? pdfFile.name : "Sin archivo seleccionado"}
                    </span>
                  </div>
                  {pdfError && (
                    <p className="text-xs text-destructive">{pdfError}</p>
                  )}
                </div>
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handlePdfChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleRegisterOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={!isFormValid || isSubmitting}>
                  {isSubmitting ? "Registrando..." : "Registrar mantenimiento"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <div className="min-h-0 flex-1 overflow-auto">
          <Table containerClassname="min-w-[720px]">
            <TableHeader className="[&_tr]:border-b border-gray-200">
              <TableRow className="hover:bg-white">
                <TableHead className="w-[80px] whitespace-nowrap text-gray-500 font-medium">ID</TableHead>
                <TableHead className="w-[120px] whitespace-nowrap text-gray-500 font-medium">Placa</TableHead>
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
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Cargando mantenimientos...
                  </TableCell>
                </TableRow>
              ) : mantenimientos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No hay mantenimientos registrados.
                  </TableCell>
                </TableRow>
              ) : (
                mantenimientos.map((mantenimiento, index) => {
                  const pdfUrl = mantenimiento.pdf_mantenimiento?.trim() ?? "";
                  const razon = mantenimiento.razon?.trim() || "-";
                  const contacto = mantenimiento.contacto_responsable?.trim() || "-";
                  const responsable = mantenimiento.responsable?.trim() || "-";

                  return (
                  <TableRow
                    key={`${mantenimiento.id ?? index}-${mantenimiento.fecha_ultimo_mant}`}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="align-top whitespace-nowrap text-gray-700">
                      {mantenimiento.id ?? "-"}
                    </TableCell>
                    <TableCell className="align-top whitespace-nowrap text-gray-700">
                      {mantenimiento.Placa ?? placa ?? "-"}
                    </TableCell>
                    <TableCell className="align-top whitespace-nowrap text-gray-700">
                      {formatTruckTableDate(mantenimiento.fecha_ultimo_mant)}
                    </TableCell>
                    <TableCell className="align-top text-gray-700">{responsable}</TableCell>
                    <TableCell className="align-top text-sm leading-relaxed text-gray-700">
                      {razon}
                    </TableCell>
                    <TableCell className="align-top text-sm text-gray-700">{contacto}</TableCell>
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
