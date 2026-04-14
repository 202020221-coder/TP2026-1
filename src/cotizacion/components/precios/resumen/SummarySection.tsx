import { getExchangeRate } from "@/cotizacion/api/exchange-rate.api";
import { useOrderInventoryStore } from "@/cotizacion/hooks/stores/orderInventoryStore";
import { useOrderPickup } from "@/cotizacion/hooks/stores/orderPickupStore";
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
    <Card className="shadow-none border-blue-400 bg-blue-100 sm:col-span-2 flex flex-col">
      <CardHeader>
        <CardTitle className="flex flex-row items-end gap-x-1.5 mx-auto sm:mx-0">
          <ReceiptText className="text-blue-600" />
          <span className="pb-0.5 font-[375] text-[18px]">
            Resumen de Costos
          </span>
        </CardTitle>
        <CardDescription className="tracking-[0.5px] text-[14px] text-center sm:text-left">
          Resultado total de costos.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1 overflow-y-auto">
        {/* Exchange Rate Section */}
        <div className="bg-white/60 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center gap-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <p className="text-sm font-medium text-blue-800">
              Tipo de Cambio (USD/PEN)
            </p>
          </div>

          {isPending ? (
            <div className="flex items-center gap-2 text-blue-600/70">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs">Cargando tasas...</span>
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs">Error al cargar tasas</span>
            </div>
          ) : data ? (
            <div className="flex flex-row gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-blue-600/70">Compra</span>
                <span className="text-sm font-semibold text-blue-800">
                  {formatPEN(data.tasa_compra)}
                </span>
              </div>
              <div className="w-[0.5px] bg-blue-300" />
              <div className="flex flex-col">
                <span className="text-xs text-blue-600/70">Venta</span>
                <span className="text-sm font-semibold text-blue-800">
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

        <div className="w-full h-[0.5px] bg-blue-600" />

        <div className="flex flex-row justify-between min-w-full">
          <p className="text-xl font-bold text-blue-800">Total:</p>
          <p className="text-xl font-bold text-blue-800">
            {formatCurrency(total)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
