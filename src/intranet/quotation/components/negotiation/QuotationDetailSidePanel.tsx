import type { FC } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Separator } from "@/shared/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { formatPEDate } from "@/shared/lib/format-date";
import { formatCurrency } from "@/shared/lib/format-currency";
import type { DetailedQuotation } from "../../interfaces/quotation";
import { getQuotationMessageStateLabel } from "../../enum/quotation-message-state.record";

type QuotationDetailSidePanelProps = {
  quotation: DetailedQuotation;
};

export const QuotationDetailSidePanel: FC<QuotationDetailSidePanelProps> = ({
  quotation,
}) => {
  const displayName =
    quotation.nombre.split(" - ").slice(1).join(" - ") || quotation.nombre;

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border border-blue-100 bg-white">
      <div className="rounded-t-2xl border-b border-blue-100 bg-blue-50 px-5 py-4">
        <p className="text-center text-sm font-bold tracking-wide text-blue-900">
          {displayName.toUpperCase()}
        </p>
      </div>
      <div className="border-b border-blue-50 px-5 py-3">
        <h2 className="text-sm font-semibold text-blue-900">
          Detalle de la Cotización
        </h2>
      </div>
      <ScrollArea className="min-h-0 flex-1 px-5 py-4">
        <QuotationDetailContent quotation={quotation} />
      </ScrollArea>
    </div>
  );
};

const QuotationDetailContent: FC<{ quotation: DetailedQuotation }> = ({
  quotation,
}) => (
  <div className="space-y-5 pb-2">
    <section className="grid grid-cols-2 gap-3 text-sm">
      <DetailField
        label="Emisión"
        value={formatPEDate(quotation.condiciones.fechaEmision)}
      />
      <DetailField
        label="Vigencia"
        value={formatPEDate(quotation.condiciones.fechaVigencia)}
      />
      <DetailField label="Estado" value={quotation.estado} />
      <DetailField
        label="Total"
        value={formatCurrency(quotation.precioTotal, "PEN", 2)}
      />
    </section>

    <Separator />

    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Productos
      </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ítem</TableHead>
            <TableHead className="text-right">Cant.</TableHead>
            <TableHead className="text-right">P. unit.</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotation.productos.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.nombre}</TableCell>
              <TableCell className="text-right">{product.cantidad}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(product.precio_unitario, "PEN", 2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>

    <Separator />

    <section className="space-y-2 text-sm">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        Recojo
      </h3>
      <p className="text-gray-700">{quotation.costoRecojo.direccionRecojo}</p>
      <p className="text-gray-600">
        {formatPEDate(quotation.costoRecojo.fechaRecojo)} ·{" "}
        {formatCurrency(quotation.costoRecojo.costo, "PEN", 2)}
      </p>
    </section>

    <section className="space-y-2 text-sm">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        Camión asignado
      </h3>
      <p className="font-medium text-gray-800">
        {quotation.camionEspecificado.nombre}
      </p>
      <p className="text-gray-600">
        Placa: {quotation.camionEspecificado.Placa}
      </p>
    </section>

    <section className="space-y-2 text-sm">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        Condiciones
      </h3>
      <p className="whitespace-pre-wrap text-gray-700">
        {quotation.condiciones.condiciones}
      </p>
      {quotation.condiciones.observaciones && (
        <p className="whitespace-pre-wrap text-gray-600">
          <span className="font-medium">Observaciones: </span>
          {quotation.condiciones.observaciones}
        </p>
      )}
    </section>

    <Badge variant="outline">
      {getQuotationMessageStateLabel(quotation.mensajes)}
    </Badge>
  </div>
);

const DetailField: FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value}</p>
  </div>
);
