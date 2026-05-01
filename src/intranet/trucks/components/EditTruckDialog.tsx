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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { trucksBaseApi } from "../api/trucks.base.api";
import type { Truck } from "../interfaces/truck.interface";

type EditTruckFormState = {
  Placa: string;
  nombre: string;
  modelo: string;
  color: string;
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

const toStringValue = (value: number | null | undefined) =>
  typeof value === "number" && Number.isFinite(value) ? String(value) : "";

const mapTruckToForm = (camion: Truck): EditTruckFormState => ({
  Placa: camion.Placa ?? "",
  nombre: camion.nombre ?? "",
  modelo: camion.modelo ?? "",
  color: camion.color ?? "",
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
      form.nombre,
      form.modelo,
      form.color,
      form.soat_n_poliza,
      form.soat_empresa,
    ];

    const requiredDates = [form.soat_dia_pago];

    return (
      requiredText.every(hasText) &&
      requiredDates.every(hasText) &&
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
      const { Fabricante_Nombre: _, ...baseFields } = camion;
      const payload = {
        ...baseFields,
        nombre: form.nombre.trim(),
        modelo: form.modelo.trim(),
        color: form.color.trim(),
        soat_n_poliza: form.soat_n_poliza.trim(),
        soat_empresa: form.soat_empresa.trim(),
        soat_precio: Number(form.soat_precio),
        soat_dia_pago: form.soat_dia_pago,
      };

      await trucksBaseApi.updateTruck(camion.Placa, payload);
    } catch (error: unknown) {
      const err = error as any;
      const serverError = err?.response?.data?.error ?? "";
      const isKnownBackendBug =
        err?.response?.status === 500 &&
        typeof serverError === "string" &&
        serverError.includes("is not iterable");

      if (!isKnownBackendBug) {
        const rawMessage =
          err?.response?.data?.message ?? err?.response?.data ?? err?.message ?? "No se pudo actualizar el camion.";
        const apiMessage =
          typeof rawMessage === "string" ? rawMessage : JSON.stringify(rawMessage);
        setErrorMessage(apiMessage);
        toast.error(apiMessage);
        setIsSubmitting(false);
        return;
      }
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
