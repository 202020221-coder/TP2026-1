import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Loader2, ReceiptText, RefreshCw, TrendingUp } from "lucide-react";
import { useState, type FC } from "react";
import { toast } from "sonner";
import { useSummaryCard } from "./useSummaryCard";
import { useQuotationExchangeRate } from "@/intranet/quotation/hooks/stores/quotation.exchange.rate.store.provider";
import {
  getExchangeRate,
  isExchangeRateLoaded,
} from "@/intranet/quotation/api/exchange-rate.api";
import { formatCurrency } from "@/shared/lib/format-currency";

const formatRateValue = (value: number | null | undefined) =>
  value != null && Number.isFinite(value) && value > 0
    ? formatCurrency(value, "PEN", 2)
    : "—";

type SummaryCardProps = {
  showUpdateRatesButton?: boolean;
};

export const SummaryCard: FC<SummaryCardProps> = ({
  showUpdateRatesButton = false,
}) => {
  const { productsSubtotal, servicesSubtotal, pickupCost, total } =
    useSummaryCard();
  const rate = useQuotationExchangeRate((s) => s.rate);
  const setRate = useQuotationExchangeRate((s) => s.setRate);
  const [isRefreshingRates, setIsRefreshingRates] = useState(false);

  const handleUpdateRates = async () => {
    setIsRefreshingRates(true);
    try {
      const latestRate = await getExchangeRate();
      if (!isExchangeRateLoaded(latestRate)) {
        throw new Error("Tasas inválidas");
      }

      setRate(latestRate);
      toast.success("Tasas de cambio actualizadas desde SUNAT.");
    } catch {
      toast.error("No se pudieron actualizar las tasas de cambio.");
    } finally {
      setIsRefreshingRates(false);
    }
  };
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
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-x-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium text-foreground">
                Tipo de Cambio (USD/PEN)
              </p>
            </div>
            {showUpdateRatesButton && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                disabled={isRefreshingRates}
                onClick={() => void handleUpdateRates()}
              >
                {isRefreshingRates ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                Actualizar tasas
              </Button>
            )}
          </div>

          <div className="flex flex-row gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Compra</span>
              <span className="text-sm font-semibold text-foreground">
                {formatRateValue(rate?.buyingRate)}
              </span>
            </div>
            <div className="w-px bg-border" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Venta</span>
              <span className="text-sm font-semibold text-foreground">
                {formatRateValue(rate?.sellingRate)}
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
          <p>Costo de envio:</p>
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
