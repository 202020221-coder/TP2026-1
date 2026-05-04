import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Skeleton } from "@/shared/components/ui/skeleton";
import type { FC } from "react";
import type { DetailedQuotation } from "../../interfaces/quotation";

type QuotationDetailFormCardProps = {
  isPending: boolean;
  quotation: DetailedQuotation;
};

export function QuotationDetailFormCard({
  isPending,
  quotation,
}: QuotationDetailFormCardProps) {
  return (
    <Card className="border shadow-none">
      <CardHeader>
        <CardTitle>Formulario de Cotizacion</CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <FormSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" readOnly value={quotation.nombre} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaInicio">Fecha de Emisión</Label>
              <Input
                id="fechaInicio"
                readOnly
                value={quotation.condiciones.fechaEmision}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="precioTotal">Precio Total</Label>
              <Input id="precioTotal" readOnly value={quotation.precioTotal} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Input id="estado" readOnly value={quotation.estado} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mensajes">Mensajes</Label>
              <Input id="mensajes" readOnly value={quotation.mensajes} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export const FormSkeleton: FC = () => {
  return (
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
  );
};
