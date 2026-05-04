import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import type { DetailedQuotation } from "../../interfaces/quotation";

type QuotationDetailFormCardProps = {
  quotation: DetailedQuotation;
};

export function QuotationDetailFormCard({
  quotation,
}: QuotationDetailFormCardProps) {
  return (
    <Card className="border shadow-none">
      <CardHeader>
        <CardTitle>Formulario de Cotizacion</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
