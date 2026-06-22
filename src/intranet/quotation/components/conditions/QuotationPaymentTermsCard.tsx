import { useState, type FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { CalendarClock } from "lucide-react";
import type {
  QuotationPlazoPagoForm,
  QuotationPlazosPagoPair,
} from "../../lib/quotation-plazos-pago";
import { hasSecondInstallment } from "../../lib/quotation-plazos-pago";

type QuotationPaymentTermsCardProps = {
  plazosPago: QuotationPlazosPagoPair;
  embedded?: boolean;
  readOnly?: boolean;
  onUpdatePlazoPago?: (
    orden: 1 | 2,
    patch: Partial<Pick<QuotationPlazoPagoForm, "porcentaje" | "plazo_de_pago">>,
  ) => void;
};

const formatPlazoHint = (plazo: number) =>
  plazo === 0 ? "Antes del proyecto" : `${plazo} días después del proyecto`;

const parseNonNegativeInt = (raw: string): number => {
  const digits = raw.replace(/\D/g, "");
  if (digits === "") {
    return 0;
  }
  return Number.parseInt(digits, 10);
};

export const QuotationPaymentTermsCard: FC<QuotationPaymentTermsCardProps> = ({
  plazosPago,
  embedded = false,
  readOnly = false,
  onUpdatePlazoPago,
}) => {
  const [firstInstallment, secondInstallment] = plazosPago;
  const showSecondInstallment = hasSecondInstallment(plazosPago);
  const [isFirstPlazoLocked, setIsFirstPlazoLocked] = useState(false);

  const handleTogglePreServicePayment = () => {
    if (readOnly || !onUpdatePlazoPago) {
      return;
    }

    if (isFirstPlazoLocked) {
      setIsFirstPlazoLocked(false);
      onUpdatePlazoPago(1, { plazo_de_pago: 1 });
      return;
    }

    setIsFirstPlazoLocked(true);
    onUpdatePlazoPago(1, { plazo_de_pago: 0 });
  };

  const formContent = (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-foreground">
            Cuota 1 — Pago inicial
          </p>
          <Badge variant="secondary">Orden 1</Badge>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Porcentaje (%)
            </p>
            <Input
              type="text"
              inputMode="numeric"
              value={firstInstallment.porcentaje}
              disabled={readOnly}
              readOnly={readOnly}
              className={readOnly ? "bg-muted/50" : undefined}
              onFocus={(event) => event.target.select()}
              onChange={(event) =>
                onUpdatePlazoPago?.(1, {
                  porcentaje: parseNonNegativeInt(event.target.value),
                })
              }
            />
          </div>
          <div>
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-muted-foreground">
                Plazo (días)
              </p>
              {!readOnly && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={handleTogglePreServicePayment}
                >
                  {isFirstPlazoLocked
                    ? "Pago post servicio"
                    : "Pago previo al servicio"}
                </Button>
              )}
            </div>
            <Input
              type="text"
              inputMode="numeric"
              value={firstInstallment.plazo_de_pago}
              disabled={readOnly || isFirstPlazoLocked}
              readOnly={readOnly || isFirstPlazoLocked}
              className={readOnly || isFirstPlazoLocked ? "bg-muted/50" : undefined}
              onFocus={(event) => event.target.select()}
              onChange={(event) => {
                setIsFirstPlazoLocked(false);
                onUpdatePlazoPago?.(1, {
                  plazo_de_pago: parseNonNegativeInt(event.target.value),
                });
              }}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {formatPlazoHint(firstInstallment.plazo_de_pago)}
            </p>
          </div>
        </div>
      </div>

      {showSecondInstallment && (
        <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-foreground">
              Cuota 2 — Saldo restante
            </p>
            <Badge variant="outline">Orden 2 · calculado</Badge>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Porcentaje (%)
              </p>
              <Input
                type="text"
                inputMode="numeric"
                value={secondInstallment.porcentaje}
                disabled
                readOnly
                className="bg-muted/50"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Plazo (días)
              </p>
              <Input
                type="text"
                inputMode="numeric"
                value={secondInstallment.plazo_de_pago}
                disabled={readOnly}
                readOnly={readOnly}
                className={readOnly ? "bg-muted/50" : undefined}
                onFocus={(event) => event.target.select()}
                onChange={(event) =>
                  onUpdatePlazoPago?.(2, {
                    plazo_de_pago: parseNonNegativeInt(event.target.value),
                  })
                }
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {formatPlazoHint(secondInstallment.plazo_de_pago)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (embedded) {
    return formContent;
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex flex-row items-end gap-x-1.5 mx-auto sm:mx-0">
          <CalendarClock className="text-primary" />
          <span className="pb-0.5 font-[375] text-[18px]">Plazos de pago</span>
        </CardTitle>
        <CardDescription className="tracking-[0.5px] text-[14px] text-center sm:text-left">
          {readOnly
            ? "Porcentaje y plazo de cada cuota acordados en la cotización."
            : "Define el porcentaje y plazo de cada cuota. Si el primer pago cubre el 100%, no se requiere una segunda cuota. De lo contrario, el segundo porcentaje se calcula automáticamente."}
        </CardDescription>
      </CardHeader>
      <CardContent>{formContent}</CardContent>
    </Card>
  );
};
