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
import type { QuotationProduct } from "@/intranet/quotation/interfaces/quotation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  QuotationProductIntentionsRecord,
  type QuotationProductIntention,
} from "@/intranet/quotation/enum/order-inventory-intention";
import { formatCurrency } from "@/shared/lib/format-currency";

type UpdateQuantityHandler = (
  id: QuotationProduct["id"],
  quantity: QuotationProduct["cantidad"],
) => void;
type UpdateUnitPriceHandler = (
  id: QuotationProduct["id"],
  quantity: QuotationProduct["precio_unitario"],
) => void;
type UpdateIntentionHandler = (
  id: QuotationProduct["id"],
  quantity: QuotationProduct["intencion"],
) => void;
type UpdateRentedDaysHandler = (
  id: QuotationProduct["id"],
  dias: QuotationProduct["dias_alquilados"],
) => void;
type DeleteHandler = (id: QuotationProduct["id"]) => void;
type OptionalProps =
  | {
      readOnly: true;
      onUpdateQuantity: undefined;
      onUpdateUnitPrice: undefined;
      onUpdateIntention: undefined;
      onUpdateRentedDays: undefined;
      onDelete: undefined;
    }
  | {
      readOnly: false;
      onUpdateQuantity: UpdateQuantityHandler;
      onUpdateUnitPrice: UpdateUnitPriceHandler;
      onUpdateIntention: UpdateIntentionHandler;
      onUpdateRentedDays: UpdateRentedDaysHandler;
      onDelete: DeleteHandler;
    };

type QuotationTableProps = {
  items: QuotationProduct[];
} & OptionalProps;
export const QuotationProductsTable: FC<QuotationTableProps> = memo(
  ({ items, ...rest }) => {
    return (
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted/70 backdrop-blur supports-backdrop-filter:bg-muted/60 overflow-hidden">
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead className="w-[400px] overflow-hidden">
                Nombre
              </TableHead>
              <TableHead>Intención</TableHead>
              <TableHead className="text-center">Días Alquilados</TableHead>
              <TableHead className="text-center">Cantidad</TableHead>
              <TableHead className="text-center">P.Unit</TableHead>
              <TableHead className="text-right">Subtotal {"($)"}</TableHead>
              <TableHead className="text-center">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="bg-gray-50 h-56">
                  <div className="h-full flex flex-col">
                    <Bird className="flex-1 w-auto stroke-1 text-gray-400" />
                    <div className="text-center space-y-1">
                      <h2 className="font-bold text-lg text-gray-500">
                        Sin Productos Escogidos
                      </h2>
                      <p className="text-md text-gray-500">
                        Puede escoger más productos haciendo click en el botón{" "}
                        <span className="font-black">Agregar Productos</span>.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <QuotationProductRow key={item.id} product={item} {...rest} />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    );
  },
);

type QuotationProductRowProps = { product: QuotationProduct } & OptionalProps;
const QuotationProductRow: FC<QuotationProductRowProps> = memo(
  ({
    product,
    readOnly,
    onUpdateQuantity,
    onUpdateUnitPrice,
    onUpdateIntention,
    onUpdateRentedDays,
    onDelete,
  }) => {
    const formattedSubtotal = useMemo(() => {
      const subtotal =
        product.intencion === "alquilar"
          ? product.precio_unitario *
            product.cantidad *
            (product.dias_alquilados ?? 1)
          : product.precio_unitario * product.cantidad;
      return formatCurrency(subtotal, "USD", 2);
    }, [
      product.precio_unitario,
      product.cantidad,
      product.intencion,
      product.dias_alquilados,
    ]);
    return (
      <TableRow
        key={product.id}
        className="hover:bg-muted/40 transition-colors"
      >
        <TableCell>{product.id}</TableCell>
        <TableCell className="whitespace-break-spaces">
          {product.nombre}
        </TableCell>
        <TableCell className="text-center">
          <Select
            defaultValue={product.intencion}
            onValueChange={(value: QuotationProductIntention) =>
              onUpdateIntention?.(product.id, value)
            }
            disabled={readOnly}
          >
            <SelectTrigger className="h-8 border-border bg-background text-xs min-w-32">
              <SelectValue placeholder="Seleccione la intención" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(QuotationProductIntentionsRecord).map(
                (value, i) => (
                  <SelectItem key={`${i}-${value}`} value={value}>
                    {value}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell className="text-center max-w-14">
          {product.intencion === "alquilar" ? (
            <Input
              type="number"
              min={1}
              value={product.dias_alquilados ?? 1}
              className="h-9 border-border bg-background text-sm"
              readOnly={readOnly}
              onChange={(e) =>
                onUpdateRentedDays?.(product.id, Number(e.target.value))
              }
            />
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </TableCell>

        <TableCell className="text-center max-w-14">
          <Input
            type="number"
            min={0}
            value={product.cantidad}
            className="h-9 border-border bg-background text-sm"
            readOnly={readOnly}
            onChange={(e) =>
              onUpdateQuantity?.(product.id, Number(e.target.value))
            }
          />
        </TableCell>
        <TableCell className="text-center max-w-14">
          <Input
            type="number"
            value={product.precio_unitario}
            className="h-9 border-border bg-background text-sm"
            readOnly={readOnly}
            onChange={(e) =>
              onUpdateUnitPrice?.(product.id, Number(e.target.value))
            }
          />
        </TableCell>
        <TableCell className="text-right font-medium">
          {formattedSubtotal}
        </TableCell>
        <TableCell className="text-center">
          <Button
            size="icon"
            variant="ghost"
            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete?.(product.id)}
            disabled={readOnly}
          >
            <Eraser className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    );
  },
);
