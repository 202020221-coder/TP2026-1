"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { XCircle, Save, ArrowLeft } from "lucide-react";
import type {
  InventarioEstado,
  InventarioItem,
  InventarioMantRequerimiento,
} from "../interfaces/inventory.interface";
import { inventoryApi } from "../api/inventory.api";

type InventarioFormState = {
  nombre_objeto: string;
  ID_Fabricante: string;
  lugar_almacenaje: string;
  cantidad: string;
  estado: InventarioEstado | "";
  orden_compra: string;
  fecha_compra: string;
  factura: string;
  garantia: string;
  numero_serial: string;
  ano_fabricacion: string;
  peso: string;
  precio_compra: string;
  precio_envio: string;
  responsable_envio: string;
  precio_comercial: string;
  mant_requerimiento: InventarioMantRequerimiento | "";
  mant_ultimo: string;
  mant_fecha_caducidad: string;
  mant_responsable: string;
  mant_contacto: string;
  merma_perdida: string;
  razon: string;
};

const INITIAL_FORM: InventarioFormState = {
  nombre_objeto: "",
  ID_Fabricante: "",
  lugar_almacenaje: "",
  cantidad: "0",
  estado: "disponible",
  orden_compra: "",
  fecha_compra: "",
  factura: "",
  garantia: "",
  numero_serial: "",
  ano_fabricacion: "",
  peso: "",
  precio_compra: "",
  precio_envio: "",
  responsable_envio: "",
  precio_comercial: "",
  mant_requerimiento: "no",
  mant_ultimo: "",
  mant_fecha_caducidad: "",
  mant_responsable: "",
  mant_contacto: "",
  merma_perdida: "0",
  razon: "",
};

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

const mapItemToForm = (item: InventarioItem): InventarioFormState => ({
  nombre_objeto: item.nombre_objeto ?? "",
  ID_Fabricante: toStringValue(item.ID_Fabricante),
  lugar_almacenaje: item.lugar_almacenaje ?? "",
  cantidad: toStringValue(item.cantidad),
  estado: (item.estado ?? "") as InventarioEstado | "",
  orden_compra: item.orden_compra ?? "",
  fecha_compra: item.fecha_compra ?? "",
  factura: item.factura ?? "",
  garantia: item.garantia ?? "",
  numero_serial: item.numero_serial ?? "",
  ano_fabricacion: toStringValue(item.ano_fabricacion),
  peso: toStringValue(item.peso),
  precio_compra: toStringValue(item.precio_compra),
  precio_envio: toStringValue(item.precio_envio),
  responsable_envio: item.responsable_envio ?? "",
  precio_comercial: toStringValue(item.precio_comercial),
  mant_requerimiento: (item.mant_requerimiento ?? "") as
    | InventarioMantRequerimiento
    | "",
  mant_ultimo: item.mant_ultimo ?? "",
  mant_fecha_caducidad: item.mant_fecha_caducidad ?? "",
  mant_responsable: item.mant_responsable ?? "",
  mant_contacto: item.mant_contacto ?? "",
  merma_perdida: toStringValue(item.merma_perdida),
  razon: "",
});

const toNullableString = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const toNullableNumber = (value: string) => {
  if (value.trim() === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export function InventarioForm({
  itemId,
  onCancel,
}: {
  itemId: number | null;
  onCancel: () => void;
}) {
  const isEditing = typeof itemId === "number";
  const title = isEditing ? `Editar Objeto: ${itemId}` : "Registrar Nuevo Objeto";
  const queryClient = useQueryClient();

  const [form, setForm] = useState<InventarioFormState>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: itemData, isFetching } = useQuery({
    queryKey: ["inventario", "detail", itemId],
    queryFn: () => inventoryApi.getById(itemId as number),
    enabled: isEditing,
  });

  useEffect(() => {
    if (itemData && isEditing) {
      setForm(mapItemToForm(itemData));
    }
  }, [itemData, isEditing]);

  const isFormValid = useMemo(() => {
    return (
      hasText(form.nombre_objeto) &&
      hasValidNumber(form.ID_Fabricante, 1) &&
      hasValidNumber(form.cantidad, 0)
    );
  }, [form]);

  const isBusy = isSubmitting || (isEditing && isFetching);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      lugar_almacenaje: toNullableString(form.lugar_almacenaje),
      cantidad: Number(form.cantidad),
      nombre_objeto: form.nombre_objeto.trim(),
      ID_Fabricante: Number(form.ID_Fabricante),
      orden_compra: toNullableString(form.orden_compra),
      fecha_compra: toNullableString(form.fecha_compra),
      factura: toNullableString(form.factura),
      garantia: toNullableString(form.garantia),
      numero_serial: toNullableString(form.numero_serial),
      ano_fabricacion: toNullableNumber(form.ano_fabricacion),
      peso: toNullableNumber(form.peso),
      estado: form.estado || "disponible",
      precio_compra: toNullableNumber(form.precio_compra),
      precio_envio: toNullableNumber(form.precio_envio),
      responsable_envio: toNullableString(form.responsable_envio),
      precio_comercial: toNullableNumber(form.precio_comercial),
      mant_requerimiento: form.mant_requerimiento || "no",
      mant_ultimo: toNullableString(form.mant_ultimo),
      mant_fecha_caducidad: toNullableString(form.mant_fecha_caducidad),
      mant_responsable: toNullableString(form.mant_responsable),
      mant_contacto: toNullableString(form.mant_contacto),
      ...(isEditing ? { razon: toNullableString(form.razon) } : {}),
    };

    try {
      if (isEditing) {
        await inventoryApi.update(itemId as number, payload);
        toast.success("Objeto actualizado correctamente.");
      } else {
        await inventoryApi.create(payload);
        toast.success("Objeto registrado correctamente.");
      }

      await queryClient.invalidateQueries({ queryKey: ["inventario", "list"] });
      onCancel();
    } catch (error: unknown) {
      const err = error as any;
      const rawMessage =
        err?.response?.data?.message ??
        err?.response?.data ??
        err?.message ??
        "No se pudo guardar el objeto.";
      const apiMessage =
        typeof rawMessage === "string" ? rawMessage : JSON.stringify(rawMessage);
      setErrorMessage(apiMessage);
      toast.error(apiMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b border-border">
        <div className="p-6 space-y-4">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
            type="button"
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <div className="space-x-2">
              <Button variant="outline" onClick={onCancel} type="button">
                <XCircle className="w-4 h-4 mr-2" /> Cancelar
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                type="submit"
                form="inventario-form"
                disabled={!isFormValid || isBusy}
              >
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? "Actualizar" : "Registrar"}
              </Button>
            </div>
          </div>
          {errorMessage && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        <form id="inventario-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="inv-nombre">Nombre del objeto</Label>
              <Input
                id="inv-nombre"
                value={form.nombre_objeto}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    nombre_objeto: event.target.value,
                  }))
                }
                placeholder="Ej: Extintor CO2"
                required
                disabled={isBusy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-fabricante">ID fabricante</Label>
              <Input
                id="inv-fabricante"
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
                placeholder="Ej: 12"
                required
                disabled={isBusy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-lugar">Lugar de almacenaje</Label>
              <Input
                id="inv-lugar"
                value={form.lugar_almacenaje}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    lugar_almacenaje: event.target.value,
                  }))
                }
                placeholder="Camion, deposito..."
                disabled={isBusy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-cantidad">Cantidad</Label>
              <Input
                id="inv-cantidad"
                type="number"
                min={0}
                step={1}
                value={form.cantidad}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    cantidad: event.target.value,
                  }))
                }
                required
                disabled={isBusy}
              />
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select
                value={form.estado}
                onValueChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    estado: value as InventarioEstado,
                  }))
                }
                disabled={isBusy}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="en mantenimiento">En mantenimiento</SelectItem>
                  <SelectItem value="malogrado">Malogrado</SelectItem>
                  <SelectItem value="en trabajo">En trabajo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-orden">Orden de compra</Label>
              <Input
                id="inv-orden"
                value={form.orden_compra}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    orden_compra: event.target.value,
                  }))
                }
                placeholder="OC-2024-001"
                disabled={isBusy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-fecha-compra">Fecha de compra</Label>
              <Input
                id="inv-fecha-compra"
                type="date"
                value={form.fecha_compra}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    fecha_compra: event.target.value,
                  }))
                }
                disabled={isBusy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-factura">Factura</Label>
              <Input
                id="inv-factura"
                value={form.factura}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    factura: event.target.value,
                  }))
                }
                placeholder="F-000123"
                disabled={isBusy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-garantia">Garantia</Label>
              <Input
                id="inv-garantia"
                value={form.garantia}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    garantia: event.target.value,
                  }))
                }
                placeholder="12 meses"
                disabled={isBusy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-serial">Numero de serie</Label>
              <Input
                id="inv-serial"
                value={form.numero_serial}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    numero_serial: event.target.value,
                  }))
                }
                placeholder="SN12345"
                disabled={isBusy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-ano">Ano de fabricacion</Label>
              <Input
                id="inv-ano"
                type="number"
                min={1900}
                step={1}
                value={form.ano_fabricacion}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    ano_fabricacion: event.target.value,
                  }))
                }
                placeholder="2023"
                disabled={isBusy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-peso">Peso (kg)</Label>
              <Input
                id="inv-peso"
                type="number"
                min={0}
                step="0.01"
                value={form.peso}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    peso: event.target.value,
                  }))
                }
                placeholder="12.5"
                disabled={isBusy}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="inv-precio-compra">Precio de compra</Label>
              <Input
                id="inv-precio-compra"
                type="number"
                min={0}
                step="0.01"
                value={form.precio_compra}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    precio_compra: event.target.value,
                  }))
                }
                placeholder="150.00"
                disabled={isBusy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-precio-envio">Precio de envio</Label>
              <Input
                id="inv-precio-envio"
                type="number"
                min={0}
                step="0.01"
                value={form.precio_envio}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    precio_envio: event.target.value,
                  }))
                }
                placeholder="20.00"
                disabled={isBusy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-responsable-envio">Responsable de envio</Label>
              <Input
                id="inv-responsable-envio"
                value={form.responsable_envio}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    responsable_envio: event.target.value,
                  }))
                }
                placeholder="Nombre del responsable"
                disabled={isBusy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-precio-comercial">Precio comercial</Label>
              <Input
                id="inv-precio-comercial"
                type="number"
                min={0}
                step="0.01"
                value={form.precio_comercial}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    precio_comercial: event.target.value,
                  }))
                }
                placeholder="180.00"
                disabled={isBusy}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Mantenimiento requerido</Label>
              <Select
                value={form.mant_requerimiento}
                onValueChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    mant_requerimiento: value as InventarioMantRequerimiento,
                  }))
                }
                disabled={isBusy}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="si">Si</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-mant-ultimo">Ultimo mantenimiento</Label>
              <Input
                id="inv-mant-ultimo"
                type="date"
                value={form.mant_ultimo}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    mant_ultimo: event.target.value,
                  }))
                }
                disabled={isBusy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-mant-cad">Vencimiento mantenimiento</Label>
              <Input
                id="inv-mant-cad"
                type="date"
                value={form.mant_fecha_caducidad}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    mant_fecha_caducidad: event.target.value,
                  }))
                }
                disabled={isBusy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-mant-responsable">Responsable mantenimiento</Label>
              <Input
                id="inv-mant-responsable"
                value={form.mant_responsable}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    mant_responsable: event.target.value,
                  }))
                }
                placeholder="Nombre del responsable"
                disabled={isBusy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-mant-contacto">Contacto mantenimiento</Label>
              <Input
                id="inv-mant-contacto"
                value={form.mant_contacto}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    mant_contacto: event.target.value,
                  }))
                }
                placeholder="Telefono o correo"
                disabled={isBusy}
              />
            </div>
            {isEditing && (
              <div className="space-y-2">
                <Label htmlFor="inv-merma">Merma/Perdida</Label>
                <Input
                  id="inv-merma"
                  value={form.merma_perdida}
                  disabled
                />
              </div>
            )}
          </div>

          {isEditing && (
            <div className="space-y-2">
              <Label htmlFor="inv-razon">Razon de ajuste</Label>
              <Textarea
                id="inv-razon"
                value={form.razon}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    razon: event.target.value,
                  }))
                }
                placeholder="Motivo del cambio de cantidad (opcional)"
                disabled={isBusy}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
