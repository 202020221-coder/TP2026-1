import {
  getExchangeRate,
  type ExchangeRate,
} from "@/intranet/quotation/api/exchange-rate.api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { ReceiptText, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { type FC } from "react";
import { useSummaryCard } from "./useSummaryCard";
import { formatCurrency } from "@/shared/lib/format-currency";

interface SummaryCardProps {
  getExchangeRateFn?: () => Promise<ExchangeRate>;
}
export const SummaryCard: FC<SummaryCardProps> = ({ getExchangeRateFn }) => {
  const { pickupCost, subtotal, total, rateQuery } = useSummaryCard(
    getExchangeRateFn ?? getExchangeRate,
  );
  const { data, isPending, error } = rateQuery;
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
          ) : (
            <div className="flex flex-row gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Compra</span>
                <span className="text-sm font-semibold text-foreground">
                  {formatCurrency(data.buyingRate, "PEN", 2)}
                </span>
              </div>
              <div className="w-px bg-border" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Venta</span>
                <span className="text-sm font-semibold text-foreground">
                  {formatCurrency(data.sellingRate, "PEN", 2)}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-row justify-between min-w-full">
          <p>Subtotal:</p>
          <p>{subtotal}</p>
        </div>
        <div className={`flex flex-row justify-between `}>
          <p>Costo de Recojo:</p>
          <div className="flex flex-row gap-x-2 items-center">
            <p>{pickupCost}</p>
          </div>
        </div>
        <div className="h-px w-full bg-border" />
        <div className="flex flex-row justify-between min-w-full">
          <p className="text-xl font-bold text-foreground">Total:</p>
          <p className="text-xl font-bold text-foreground">{total}</p>
        </div>
      </CardContent>
    </Card>
  );
};
