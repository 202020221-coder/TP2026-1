import { useMemo, useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { trucksBaseApi } from "../api/trucks.base.api";
import type { Truck, TruckEstado } from "../interfaces/truck.interface";
import { normalizeTruckEstado } from "../lib/trucks-table.utils";

type EditTruckFormState = {
  Placa: string;
  nombre: string;
  ano_fabricacion: string;
  modelo: string;
  color: string;
  Estado: TruckEstado | "";
  caracteristicas: string;
  revision_tecnica: string;
  fecha_prox_revision: string;
  ID_Fabricante: string;
  tarjeta_propiedad: string;
  vencimiento_tarjeta: string;
  soat_n_poliza: string;
  soat_empresa: string;
  soat_precio: string;
  soat_dia_pago: string;
};

interface EditTruckDialogProps {
  camion: Truck;
  disabled?: boolean;
}

const hasText = (value: string) => value.trim().length > 0;

const hasValidNumber = (value: string, min = 0) => {
  if (value.trim() === "") {
    return false;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= min;
};

const toStringValue = (value: number | string | null | undefined) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  if (typeof value === "string") {
    return value.trim();
  }

  return "";
};

const mapTruckToForm = (camion: Truck): EditTruckFormState => ({
  Placa: camion.Placa ?? "",
  nombre: camion.nombre ?? "",
  ano_fabricacion: toStringValue(camion.ano_fabricacion),
  modelo: camion.modelo ?? "",
  color: camion.color ?? "",
  Estado: normalizeTruckEstado(camion.Estado) ?? "",
  caracteristicas: camion.caracteristicas ?? "",
  revision_tecnica: camion.revision_tecnica ?? "",
  fecha_prox_revision: camion.fecha_prox_revision ?? "",
  ID_Fabricante: toStringValue(camion.ID_Fabricante),
  tarjeta_propiedad: camion.tarjeta_propiedad ?? "",
  vencimiento_tarjeta: camion.vencimiento_tarjeta ?? "",
  soat_n_poliza: camion.soat_n_poliza ?? "",
  soat_empresa: camion.soat_empresa ?? "",
  soat_precio: toStringValue(camion.soat_precio),
  soat_dia_pago: camion.soat_dia_pago ?? "",
});

export const EditTruckDialog = ({
  camion,
  disabled = false,
}: EditTruckDialogProps) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<EditTruckFormState>(() =>
    mapTruckToForm(camion),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isFormValid = useMemo(() => {
    const requiredText = [
      form.Placa,
      form.nombre,
      form.modelo,
      form.color,
      form.Estado,
      form.caracteristicas,
      form.revision_tecnica,
      form.tarjeta_propiedad,
      form.soat_n_poliza,
      form.soat_empresa,
    ];

    const requiredDates = [
      form.fecha_prox_revision,
      form.vencimiento_tarjeta,
      form.soat_dia_pago,
    ];

    return (
      requiredText.every(hasText) &&
      requiredDates.every(hasText) &&
      hasValidNumber(form.ano_fabricacion, 1) &&
      hasValidNumber(form.ID_Fabricante, 1) &&
      hasValidNumber(form.soat_precio, 0)
    );
  }, [form]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    setErrorMessage(null);
    setIsSubmitting(false);

    if (nextOpen) {
      setForm(mapTruckToForm(camion));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const payload = {
        nombre: form.nombre.trim(),
        ano_fabricacion: Number(form.ano_fabricacion),
        modelo: form.modelo.trim(),
        color: form.color.trim(),
        caracteristicas: form.caracteristicas.trim(),
        revision_tecnica: form.revision_tecnica.trim(),
        fecha_prox_revision: form.fecha_prox_revision,
        ID_Fabricante: Number(form.ID_Fabricante),
        tarjeta_propiedad: form.tarjeta_propiedad.trim(),
        vencimiento_tarjeta: form.vencimiento_tarjeta,
        Estado: form.Estado as TruckEstado,
        soat_n_poliza: form.soat_n_poliza.trim(),
        soat_empresa: form.soat_empresa.trim(),
        soat_precio: Number(form.soat_precio),
        soat_dia_pago: form.soat_dia_pago,
      };

      await trucksBaseApi.updateTruck(camion.Placa, payload);
    } catch (error: unknown) {
      const err = error as any;
      const rawMessage =
        err?.response?.data?.message ?? err?.response?.data ?? err?.message ?? "No se pudo actualizar el camion.";
      const apiMessage =
        typeof rawMessage === "string" ? rawMessage : JSON.stringify(rawMessage);
      setErrorMessage(apiMessage);
      toast.error(apiMessage);
      setIsSubmitting(false);
      return;
    }

    toast.success("Camion actualizado correctamente.");
    queryClient.invalidateQueries({ queryKey: ["trucks", "list"] });
    handleOpenChange(false);
    setIsSubmitting(false);
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-amber-500 hover:border hover:border-amber-500 hover:text-amber-600 transition-colors hover:bg-amber-50"
            onClick={() => handleOpenChange(true)}
            disabled={disabled}
            aria-label="Editar camion"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent
          className="bg-white border-[1.5px] border-amber-500 text-amber-500 font-normal text-center"
          align="center"
        >
          Editar camion
        </TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent aria-describedby={undefined} className="w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Editar camion</DialogTitle>
          </DialogHeader>

          {errorMessage && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="edit-truck-placa">Placa</Label>
                <Input
                  id="edit-truck-placa"
                  value={form.Placa}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      Placa: event.target.value,
                    }))
                  }
                  required
                  disabled
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-truck-nombre">Nombre</Label>
                <Input
                  id="edit-truck-nombre"
                  value={form.nombre}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, nombre: event.target.value }))
                  }
                  placeholder="Camion principal"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-truck-ano">Ano de fabricacion</Label>
                <Input
                  id="edit-truck-ano"
                  type="number"
                  min={1}
                  step={1}
                  value={form.ano_fabricacion}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      ano_fabricacion: event.target.value,
                    }))
                  }
                  placeholder="2022"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-truck-modelo">Modelo</Label>
                <Input
                  id="edit-truck-modelo"
                  value={form.modelo}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, modelo: event.target.value }))
                  }
                  placeholder="FH16"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-truck-color">Color</Label>
                <Input
                  id="edit-truck-color"
                  value={form.color}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, color: event.target.value }))
                  }
                  placeholder="Blanco"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-truck-estado">Estado</Label>
                <Input
                  id="edit-truck-estado"
                  value={form.Estado}
                  disabled
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-truck-fecha-revision">Fecha prox. revision</Label>
                <Input
                  id="edit-truck-fecha-revision"
                  type="date"
                  value={form.fecha_prox_revision}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      fecha_prox_revision: event.target.value,
                    }))
                  }
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-truck-id-fabricante">ID fabricante</Label>
                <Input
                  id="edit-truck-id-fabricante"
                  type="number"
                  min={1}
                  step={1}
                  value={form.ID_Fabricante}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      ID_Fabricante: event.target.value,
                    }))
                  }
                  placeholder="12"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-truck-tarjeta">Tarjeta de propiedad</Label>
                <Input
                  id="edit-truck-tarjeta"
                  value={form.tarjeta_propiedad}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      tarjeta_propiedad: event.target.value,
                    }))
                  }
                  placeholder="Codigo o referencia"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-truck-vencimiento">Vencimiento tarjeta</Label>
                <Input
                  id="edit-truck-vencimiento"
                  type="date"
                  value={form.vencimiento_tarjeta}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      vencimiento_tarjeta: event.target.value,
                    }))
                  }
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-truck-soat-poliza">No. poliza SOAT</Label>
                <Input
                  id="edit-truck-soat-poliza"
                  value={form.soat_n_poliza}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      soat_n_poliza: event.target.value,
                    }))
                  }
                  placeholder="SOAT-12345"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-truck-soat-empresa">Empresa SOAT</Label>
                <Input
                  id="edit-truck-soat-empresa"
                  value={form.soat_empresa}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      soat_empresa: event.target.value,
                    }))
                  }
                  placeholder="Rimac"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-truck-soat-precio">Precio SOAT</Label>
                <Input
                  id="edit-truck-soat-precio"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.soat_precio}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      soat_precio: event.target.value,
                    }))
                  }
                  placeholder="350.00"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-truck-soat-pago">Dia de pago SOAT</Label>
                <Input
                  id="edit-truck-soat-pago"
                  type="date"
                  value={form.soat_dia_pago}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      soat_dia_pago: event.target.value,
                    }))
                  }
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="edit-truck-caracteristicas">Caracteristicas</Label>
                <Textarea
                  id="edit-truck-caracteristicas"
                  value={form.caracteristicas}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      caracteristicas: event.target.value,
                    }))
                  }
                  placeholder="Detalle de caracteristicas"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="edit-truck-revision">Revision tecnica</Label>
                <Textarea
                  id="edit-truck-revision"
                  value={form.revision_tecnica}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      revision_tecnica: event.target.value,
                    }))
                  }
                  placeholder="Detalle de revision tecnica"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={!isFormValid || isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
