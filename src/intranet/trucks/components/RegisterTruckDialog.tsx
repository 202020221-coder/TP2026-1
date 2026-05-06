import { useMemo, useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { trucksBaseApi } from "../api/trucks.base.api";
import type { RegisterTruckPayload, TruckEstado } from "../interfaces/truck.interface";
import { TRUCK_ESTADO_OPTIONS } from "../lib/trucks-table.utils";

type RegisterTruckFormState = {
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

const INITIAL_FORM: RegisterTruckFormState = {
  Placa: "",
  nombre: "",
  ano_fabricacion: "",
  modelo: "",
  color: "",
  Estado: "",
  caracteristicas: "",
  revision_tecnica: "",
  fecha_prox_revision: "",
  ID_Fabricante: "",
  tarjeta_propiedad: "",
  vencimiento_tarjeta: "",
  soat_n_poliza: "",
  soat_empresa: "",
  soat_precio: "",
  soat_dia_pago: "",
};

const hasText = (value: string) => value.trim().length > 0;

const hasValidNumber = (value: string, min = 0) => {
  if (value.trim() === "") {
    return false;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= min;
};

export const RegisterTruckDialog = ({ disabled = false }: { disabled?: boolean }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<RegisterTruckFormState>(INITIAL_FORM);
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

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setErrorMessage(null);
    setIsSubmitting(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      resetForm();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const payload: RegisterTruckPayload = {
      Placa: form.Placa.trim(),
      nombre: form.nombre.trim(),
      ano_fabricacion: Number(form.ano_fabricacion),
      modelo: form.modelo.trim(),
      color: form.color.trim(),
      Estado: form.Estado as TruckEstado,
      caracteristicas: form.caracteristicas.trim(),
      revision_tecnica: form.revision_tecnica.trim(),
      fecha_prox_revision: form.fecha_prox_revision,
      ID_Fabricante: Number(form.ID_Fabricante),
      tarjeta_propiedad: form.tarjeta_propiedad.trim(),
      vencimiento_tarjeta: form.vencimiento_tarjeta,
      soat_n_poliza: form.soat_n_poliza.trim(),
      soat_empresa: form.soat_empresa.trim(),
      soat_precio: Number(form.soat_precio),
      soat_dia_pago: form.soat_dia_pago,
    };

    try {
      await trucksBaseApi.registerTruck(payload);
      await queryClient.invalidateQueries({ queryKey: ["trucks", "list"] });
      toast.success("Camion registrado correctamente.");
      handleOpenChange(false);
    } catch {
      setErrorMessage("No se pudo registrar el camion. Intentalo nuevamente.");
      toast.error("No se pudo registrar el camion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="w-full sm:w-auto"
          disabled={disabled}
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar camion
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Registrar camion</DialogTitle>
        </DialogHeader>

        {errorMessage && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="truck-placa">Placa</Label>
              <Input
                id="truck-placa"
                value={form.Placa}
                onChange={(event) =>
                  setForm((current) => ({ ...current, Placa: event.target.value }))
                }
                placeholder="ABC-123"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="truck-nombre">Nombre</Label>
              <Input
                id="truck-nombre"
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
              <Label htmlFor="truck-ano">Ano de fabricacion</Label>
              <Input
                id="truck-ano"
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
              <Label htmlFor="truck-modelo">Modelo</Label>
              <Input
                id="truck-modelo"
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
              <Label htmlFor="truck-color">Color</Label>
              <Input
                id="truck-color"
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
              <Label htmlFor="truck-estado">Estado</Label>
              <Select
                value={form.Estado}
                onValueChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    Estado: value as TruckEstado,
                  }))
                }
                disabled={isSubmitting}
              >
                <SelectTrigger id="truck-estado" className="w-full">
                  <SelectValue placeholder="Selecciona estado" />
                </SelectTrigger>
                <SelectContent>
                  {TRUCK_ESTADO_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="truck-fecha-revision">Fecha prox. revision</Label>
              <Input
                id="truck-fecha-revision"
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
              <Label htmlFor="truck-id-fabricante">ID fabricante</Label>
              <Input
                id="truck-id-fabricante"
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
              <Label htmlFor="truck-tarjeta">Tarjeta de propiedad</Label>
              <Input
                id="truck-tarjeta"
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
              <Label htmlFor="truck-vencimiento">Vencimiento tarjeta</Label>
              <Input
                id="truck-vencimiento"
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
              <Label htmlFor="truck-soat-poliza">No. poliza SOAT</Label>
              <Input
                id="truck-soat-poliza"
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
              <Label htmlFor="truck-soat-empresa">Empresa SOAT</Label>
              <Input
                id="truck-soat-empresa"
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
              <Label htmlFor="truck-soat-precio">Precio SOAT</Label>
              <Input
                id="truck-soat-precio"
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
              <Label htmlFor="truck-soat-pago">Dia de pago SOAT</Label>
              <Input
                id="truck-soat-pago"
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
              <Label htmlFor="truck-caracteristicas">Caracteristicas</Label>
              <Textarea
                id="truck-caracteristicas"
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
              <Label htmlFor="truck-revision">Revision tecnica</Label>
              <Textarea
                id="truck-revision"
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
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? "Registrando..." : "Registrar camion"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
