import { getExchangeRate } from "@/intranet/quotation/api/exchange-rate.api";
import { useOrderInventoryStore } from "@/intranet/quotation/hooks/stores/orderInventoryStore";
import { useOrderPickup } from "@/intranet/quotation/hooks/stores/orderPickupStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ReceiptText, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import type { FC } from "react";

export const SummaryCard: FC = () => {
  const products = useOrderInventoryStore((s) => s.items);
  const pickupCost = useOrderPickup((s) => s.pickupCost);
  const { isPending, error, data } = useQuery({
    queryKey: ["exchange", "rate"],
    queryFn: () => getExchangeRate(),
  });

  const formatCurrency = (value?: number | string) => {
    const num = Number(value ?? 0);
    const currency = "USD";
    try {
      return Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }).format(num);
    } catch {
      const symbol = "$";
      return symbol + num.toFixed(2);
    }
  };

  const formatPEN = (value?: number | string) => {
    const num = Number(value ?? 0);
    try {
      return Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: "PEN",
        maximumFractionDigits: 2,
      }).format(num);
    } catch {
      return "S/ " + num.toFixed(2);
    }
  };

  const subtotal = Object.values(products).reduce(
    (acc, item) => acc + (item.precio_unitario ?? 0) * (item.cantidad ?? 0),
    0,
  );

  const total = subtotal + pickupCost;

  return (
    <Card className="sm:col-span-2 flex flex-col border shadow-none">
      <CardHeader>
        <CardTitle className="flex flex-row items-end gap-x-1.5 mx-auto sm:mx-0">
          <ReceiptText className="text-primary" />
          <span className="pb-0.5 font-[375] text-[18px]">
            Resumen de Costos
          </span>
        </CardTitle>
        <CardDescription className="tracking-[0.5px] text-[14px] text-center sm:text-left">
          Resultado total de costos.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 overflow-y-auto">
        {/* Exchange Rate Section */}
        <div className="rounded-lg border border-border bg-muted/30 p-3">
          <div className="flex items-center gap-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium text-foreground">
              Tipo de Cambio (USD/PEN)
            </p>
          </div>

          {isPending ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs">Cargando tasas...</span>
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs">Error al cargar tasas</span>
            </div>
          ) : data ? (
            <div className="flex flex-row gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Compra</span>
                <span className="text-sm font-semibold text-foreground">
                  {formatPEN(data.tasa_compra)}
                </span>
              </div>
              <div className="w-px bg-border" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Venta</span>
                <span className="text-sm font-semibold text-foreground">
                  {formatPEN(data.tasa_venta)}
                </span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-row justify-between min-w-full">
          <p>Subtotal:</p>
          <p>{formatCurrency(subtotal)}</p>
        </div>

        <div className={`flex flex-row justify-between `}>
          <p>Costo de Recojo:</p>
          <div className="flex flex-row gap-x-2 items-center">
            <p>{formatCurrency(pickupCost)}</p>
          </div>
        </div>

        <div className="h-px w-full bg-border" />

        <div className="flex flex-row justify-between min-w-full">
          <p className="text-xl font-bold text-foreground">Total:</p>
          <p className="text-xl font-bold text-foreground">
            {formatCurrency(total)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
