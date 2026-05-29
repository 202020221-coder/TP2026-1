import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { ReceiptText, TrendingUp } from "lucide-react";
import { type FC } from "react";
import { useSummaryCard } from "./useSummaryCard";
import { useQuotationExchangeRate } from "@/intranet/quotation/hooks/stores/quotation.exchange.rate.store.provider";
import { formatCurrency } from "@/shared/lib/format-currency";

export const SummaryCard: FC = () => {
  const { productsSubtotal, servicesSubtotal, pickupCost, total } =
    useSummaryCard();
  const rate = useQuotationExchangeRate((s) => s.rate);
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

          <div className="flex flex-row gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Compra</span>
              <span className="text-sm font-semibold text-foreground">
                {rate
                  ? formatCurrency(rate.buyingRate, "PEN", 2)
                  : "—"}
              </span>
            </div>
            <div className="w-px bg-border" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Venta</span>
              <span className="text-sm font-semibold text-foreground">
                {rate
                  ? formatCurrency(rate.sellingRate, "PEN", 2)
                  : "—"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between min-w-full">
          <p>Subtotal (Productos):</p>
          <p>{productsSubtotal}</p>
        </div>
        <div className="flex flex-row justify-between min-w-full">
          <p>Servicios:</p>
          <p>{servicesSubtotal}</p>
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
