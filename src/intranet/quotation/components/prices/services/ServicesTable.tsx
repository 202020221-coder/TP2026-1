import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
} from "@/shared/components/ui/table";
import { memo, useMemo, type FC } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { Bird, Eraser } from "lucide-react";
import type { ServiceItem } from "@/intranet/quotation/interfaces/quotation";
import { formatCurrency } from "@/shared/lib/format-currency";

type UpdateQuantityHandler = (
  id: ServiceItem["id"],
  quantity: ServiceItem["cantidad"],
) => void;
type UpdateUnitPriceHandler = (
  id: ServiceItem["id"],
  quantity: ServiceItem["precio_unitario"],
) => void;
type DeleteHandler = (id: ServiceItem["id"]) => void;
type OptionalProps =
  | {
      readOnly: true;
      onUpdateQuantity: undefined;
      onUpdateUnitPrice: undefined;
      onDelete: undefined;
    }
  | {
      readOnly: false;
      onUpdateQuantity: UpdateQuantityHandler;
      onUpdateUnitPrice: UpdateUnitPriceHandler;
      onDelete: DeleteHandler;
    };

type ServicesTableProps = {
  items: ServiceItem[];
} & OptionalProps;

export const QuotationServicesTable: FC<ServicesTableProps> = memo(
  ({ items, ...rest }) => {
    const readOnly = rest.readOnly;
    const colCount = readOnly ? 5 : 6;
    return (
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted/70 backdrop-blur supports-backdrop-filter:bg-muted/60 overflow-hidden">
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead className="w-[400px] overflow-hidden">
                Nombre
              </TableHead>
              <TableHead className="text-center">Cantidad</TableHead>
              <TableHead className="text-center">P.Unit</TableHead>
              <TableHead className="text-right">Subtotal {"($)"}</TableHead>
              {!readOnly && (
                <TableHead className="text-center">Acción</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colCount} className="bg-gray-50 h-56">
                  <div className="h-full flex flex-col">
                    <Bird className="flex-1 w-auto stroke-1 text-gray-400" />
                    <div className="text-center space-y-1">
                      <h2 className="font-bold text-lg text-gray-500">
                        Sin Servicios
                      </h2>
                      <p className="text-md text-gray-500">
                        No hay servicios registrados en esta cotización.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <ServiceRow key={item.id} service={item} {...rest} />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    );
  },
);

type ServiceRowProps = { service: ServiceItem } & OptionalProps;
const ServiceRow: FC<ServiceRowProps> = memo(
  ({
    service,
    readOnly,
    onUpdateQuantity,
    onUpdateUnitPrice,
    onDelete,
  }) => {
    const formattedSubtotal = useMemo(() => {
      const subtotal = service.precio_unitario * service.cantidad;
      return formatCurrency(subtotal, "USD", 2);
    }, [service.precio_unitario, service.cantidad]);
    return (
      <TableRow
        key={service.id}
        className="hover:bg-muted/40 transition-colors"
      >
        <TableCell>{service.id}</TableCell>
        <TableCell className="whitespace-break-spaces">
          {service.nombre}
        </TableCell>
        <TableCell className="text-center">
          {readOnly ? (
            <span className="text-sm text-foreground">{service.cantidad}</span>
          ) : (
            <Input
              type="number"
              min={0}
              value={service.cantidad}
              className="h-9 border-border bg-background text-sm"
              onChange={(e) =>
                onUpdateQuantity?.(service.id, Number(e.target.value))
              }
              disabled={readOnly}
            />
          )}
        </TableCell>
        <TableCell className="text-center">
          {readOnly ? (
            <span className="text-sm text-foreground">
              ${service.precio_unitario}
            </span>
          ) : (
            <Input
              type="number"
              value={service.precio_unitario}
              className="h-9 border-border bg-background text-sm"
              onChange={(e) =>
                onUpdateUnitPrice?.(service.id, Number(e.target.value))
              }
              disabled={readOnly}
            />
          )}
        </TableCell>
        <TableCell className="text-right font-medium">
          {formattedSubtotal}
        </TableCell>
        {!readOnly && (
          <TableCell className="text-center">
            <Button
              size="icon"
              variant="ghost"
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={() => onDelete?.(service.id)}
              disabled={readOnly}
            >
              <Eraser className="h-4 w-4" />
            </Button>
          </TableCell>
        )}
      </TableRow>
    );
  },
);
