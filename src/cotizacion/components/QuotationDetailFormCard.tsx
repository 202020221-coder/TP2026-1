import type { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Textarea } from "@/shared/components/ui/textarea";
import type { QuotationDetailForm } from "../schemas/quotation-detail-form";

type QuotationDetailFormCardProps = {
  form: UseFormReturn<QuotationDetailForm>;
  isPending: boolean;
};

export function QuotationDetailFormCard({ form, isPending }: QuotationDetailFormCardProps) {
  return (
    <Card className="border shadow-none">
      <CardHeader>
        <CardTitle>Formulario de Cotizacion</CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Cargando informacion de la cotizacion...
            </div>
          </div>
        ) : (
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" readOnly {...form.register("nombre")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="version">Version</Label>
              <Input id="version" readOnly {...form.register("version")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idSolicitud">ID Solicitud</Label>
              <Input id="idSolicitud" readOnly {...form.register("idSolicitud")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dniOrRuc">DNI / RUC</Label>
              <Input id="dniOrRuc" readOnly {...form.register("dniOrRuc")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
              <Input id="fechaInicio" readOnly {...form.register("fechaInicio")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="precioTotal">Precio Total</Label>
              <Input id="precioTotal" readOnly {...form.register("precioTotal")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Input id="estado" readOnly {...form.register("estado")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mensajes">Mensajes</Label>
              <Input id="mensajes" readOnly {...form.register("mensajes")} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="comentarioCliente">Comentario del Cliente</Label>
              <Textarea
                id="comentarioCliente"
                readOnly
                className="min-h-28 resize-none"
                {...form.register("comentarioCliente")}
              />
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}